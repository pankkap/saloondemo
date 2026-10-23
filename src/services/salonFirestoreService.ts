import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { db, getActiveTenantId } from "./firebase";
import {
  sendEvolutionGoWhatsAppMessage,
  formatSalonAppointmentNotification,
  WhatsAppSettings,
  DEFAULT_WHATSAPP_SETTINGS,
} from "./whatsappService";
import { ServiceItem, StylistItem, SERVICES, STYLISTS } from "@/data/salonData";

export interface SalonAppointment {
  id?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  stylistId?: string;
  stylistName?: string;
  date: string;
  time: string;
  duration?: string;
  estimatedPrice?: string;
  numericPrice?: number;
  notes?: string;
  status: "Pending" | "Confirmed" | "In-Progress" | "Completed" | "Cancelled";
  confirmationCode: string;
  source?: "Web Wizard" | "AI Chatbot" | "Admin Desk";
  whatsappDispatched?: boolean;
  createdAt?: Timestamp | Date | string | FieldValue | null;
  updatedAt?: Timestamp | Date | string | FieldValue | null;
}

// Uses "DoctorApp" root hierarchy to match Doctor-App Firestore security rules
export const COLLECTION_ROOT = "DoctorApp";
export const SALON_DOC_ID = "salon001";

/**
 * Clean object for Firestore by removing undefined values (matches doctorFirebaseService)
 */
export const cleanForFirestore = <T extends Record<string, unknown>>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }
  return cleaned as T;
};

/**
 * Save new appointment to Firestore & dispatch WhatsApp notification
 */
export const createSalonAppointment = async (
  appointment: Omit<SalonAppointment, "id" | "status" | "confirmationCode">
): Promise<{
  success: boolean;
  appointmentId: string;
  confirmationCode: string;
  whatsappResult?: { success: boolean; mode: string };
  error?: string;
}> => {
  try {
    const tenantId = getActiveTenantId();
    const appointmentRef = doc(collection(db, COLLECTION_ROOT, tenantId, "appointments"));
    const confirmationCode = "MSN-" + Math.floor(1000 + Math.random() * 9000);

    const newAppointment: SalonAppointment = {
      ...appointment,
      id: appointmentRef.id,
      status: "Confirmed",
      confirmationCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save appointment into DoctorApp/{tenantId}/appointments/{id}
    await setDoc(appointmentRef, cleanForFirestore(newAppointment as unknown as Record<string, unknown>));

    // Touch parent DoctorApp/{tenantId} doc to guarantee presence in Firestore Console
    try {
      const parentRef = doc(db, COLLECTION_ROOT, tenantId);
      await setDoc(
        parentRef,
        cleanForFirestore({
          lastBookingAt: serverTimestamp(),
          lastBookingId: appointmentRef.id,
          lastClientName: appointment.clientName || "",
          brandName: "MAISON Hair Atelier",
          updatedAt: serverTimestamp(),
        }),
        { merge: true }
      );
    } catch (parentErr) {
      console.warn("Parent doc touch note:", parentErr);
    }

    // Retrieve active WhatsApp settings from salon profile or default
    const settings = await getSalonWhatsAppSettings();

    // Dispatch WhatsApp confirmation message
    const message = formatSalonAppointmentNotification({
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      serviceName: appointment.serviceName,
      stylistName: appointment.stylistName,
      date: appointment.date,
      time: appointment.time,
      estimatedPrice: appointment.estimatedPrice,
      confirmationCode,
    });

    const whatsappResult = await sendEvolutionGoWhatsAppMessage({
      recipientPhone: appointment.clientPhone,
      messageText: message,
      whatsappSettings: settings,
    });

    if (whatsappResult.success) {
      await updateDoc(appointmentRef, { whatsappDispatched: true }).catch(() => {});
    }

    return {
      success: true,
      appointmentId: appointmentRef.id,
      confirmationCode,
      whatsappResult,
    };
  } catch (err) {
    console.error("Firestore create appointment error:", err);
    return {
      success: false,
      appointmentId: "",
      confirmationCode: "",
      error: (err as Error).message,
    };
  }
};

/**
 * Real-time listener for salon appointments (for Admin Dashboard)
 * Matches subscribeAppointments from doctorFirebaseService
 */
export const subscribeSalonAppointments = (
  callback: (appointments: SalonAppointment[]) => void
) => {
  try {
    const tenantId = getActiveTenantId();
    const aptsRef = collection(db, COLLECTION_ROOT, tenantId, "appointments");
    const q = query(aptsRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const apts: SalonAppointment[] = [];
        snapshot.forEach((docSnap) => {
          apts.push({ id: docSnap.id, ...(docSnap.data() as SalonAppointment) });
        });
        callback(apts);
      },
      (error) => {
        console.warn("Ordered query subscription warning, falling back to direct collection:", error);
        // Fallback to un-ordered collection query if index is building or permissions query
        return onSnapshot(
          aptsRef,
          (fallbackSnap) => {
            const list: SalonAppointment[] = [];
            fallbackSnap.forEach((d) => list.push({ id: d.id, ...(d.data() as SalonAppointment) }));
            callback(list);
          },
          (err) => {
            console.error("Firestore fallback subscription error:", err);
            callback([]);
          }
        );
      }
    );
  } catch (err) {
    console.error("Error setting up appointment subscription:", err);
    return () => {};
  }
};

/**
 * Update appointment status (Confirmed, Completed, Cancelled, etc.)
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: SalonAppointment["status"]
) => {
  const tenantId = getActiveTenantId();
  const aptRef = doc(db, COLLECTION_ROOT, tenantId, "appointments", appointmentId);
  return await updateDoc(aptRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete an appointment
 */
export const deleteSalonAppointment = async (appointmentId: string) => {
  const tenantId = getActiveTenantId();
  const aptRef = doc(db, COLLECTION_ROOT, tenantId, "appointments", appointmentId);
  return await deleteDoc(aptRef);
};

/**
 * Store & fetch WhatsApp settings in Firestore
 */
export const getSalonWhatsAppSettings = async (): Promise<WhatsAppSettings> => {
  try {
    const tenantId = getActiveTenantId();
    const docRef = doc(db, COLLECTION_ROOT, tenantId, "settings", "whatsapp");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_WHATSAPP_SETTINGS, ...(snap.data() as WhatsAppSettings) };
    }
  } catch (err) {
    console.warn("Using default WhatsApp settings:", err);
  }
  return DEFAULT_WHATSAPP_SETTINGS;
};

export const saveSalonWhatsAppSettings = async (settings: WhatsAppSettings) => {
  const tenantId = getActiveTenantId();
  const docRef = doc(db, COLLECTION_ROOT, tenantId, "settings", "whatsapp");
  return await setDoc(
    docRef,
    cleanForFirestore(settings as unknown as Record<string, unknown>),
    { merge: true }
  );
};

// ==========================================
// SERVICES MANAGEMENT (CRUD in Firestore)
// ==========================================

export const subscribeSalonServices = (callback: (services: ServiceItem[]) => void) => {
  const tenantId = getActiveTenantId();
  const servicesRef = collection(db, COLLECTION_ROOT, tenantId, "services");

  return onSnapshot(
    servicesRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default services into Firestore so they can be edited/updated
        try {
          for (const s of SERVICES) {
            await setDoc(doc(db, COLLECTION_ROOT, tenantId, "services", s.id), cleanForFirestore(s as unknown as Record<string, unknown>));
          }
        } catch (e) {
          console.warn("Seeding default services note:", e);
        }
        callback(SERVICES);
        return;
      }

      const list: ServiceItem[] = [];
      snapshot.forEach((d) => {
        list.push({ ...(d.data() as ServiceItem), id: d.id });
      });
      callback(list);
    },
    (err) => {
      console.warn("Services subscription warning:", err);
      callback(SERVICES);
    }
  );
};

export const saveSalonService = async (service: ServiceItem): Promise<void> => {
  const tenantId = getActiveTenantId();
  const srvId = service.id || `srv-${Date.now()}`;
  const srvRef = doc(db, COLLECTION_ROOT, tenantId, "services", srvId);
  const data: ServiceItem = {
    ...service,
    id: srvId,
  };
  await setDoc(srvRef, cleanForFirestore(data as unknown as Record<string, unknown>), { merge: true });
};

export const deleteSalonService = async (serviceId: string): Promise<void> => {
  const tenantId = getActiveTenantId();
  const srvRef = doc(db, COLLECTION_ROOT, tenantId, "services", serviceId);
  await deleteDoc(srvRef);
};

// ==========================================
// STYLISTS MANAGEMENT (CRUD in Firestore)
// ==========================================

export const subscribeSalonStylists = (callback: (stylists: StylistItem[]) => void) => {
  const tenantId = getActiveTenantId();
  const stylistsRef = collection(db, COLLECTION_ROOT, tenantId, "stylists");

  return onSnapshot(
    stylistsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Initialize default stylists into Firestore so they can be edited/updated
        try {
          for (const st of STYLISTS) {
            await setDoc(doc(db, COLLECTION_ROOT, tenantId, "stylists", st.id), cleanForFirestore(st as unknown as Record<string, unknown>));
          }
        } catch (e) {
          console.warn("Seeding default stylists note:", e);
        }
        callback(STYLISTS);
        return;
      }

      const list: StylistItem[] = [];
      snapshot.forEach((d) => {
        list.push({ ...(d.data() as StylistItem), id: d.id });
      });
      callback(list);
    },
    (err) => {
      console.warn("Stylists subscription warning:", err);
      callback(STYLISTS);
    }
  );
};

export const saveSalonStylist = async (stylist: StylistItem): Promise<void> => {
  const tenantId = getActiveTenantId();
  const stylistId = stylist.id || `stylist-${Date.now()}`;
  const stRef = doc(db, COLLECTION_ROOT, tenantId, "stylists", stylistId);
  const data: StylistItem = {
    ...stylist,
    id: stylistId,
  };
  await setDoc(stRef, cleanForFirestore(data as unknown as Record<string, unknown>), { merge: true });
};

export const deleteSalonStylist = async (stylistId: string): Promise<void> => {
  const tenantId = getActiveTenantId();
  const stRef = doc(db, COLLECTION_ROOT, tenantId, "stylists", stylistId);
  await deleteDoc(stRef);
};
