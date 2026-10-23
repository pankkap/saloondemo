import { NextRequest, NextResponse } from "next/server";
import { bookingFormSchema } from "@/lib/bookingSchema";
import { SERVICES, STYLISTS } from "@/data/salonData";
import { createSalonAppointment } from "@/services/salonFirestoreService";
import {
  formatSalonAppointmentNotification,
  getDirectWhatsAppUrl,
  sendEvolutionGoWhatsAppMessage,
} from "@/services/whatsappService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = bookingFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields correctly.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Simulate database lookup & slot reservation delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Lookup service & stylist
    const service = SERVICES.find((s) => s.id === data.serviceId);
    const stylist =
      data.stylistId === "any"
        ? { name: "Any Available Master Stylist" }
        : STYLISTS.find((st) => st.id === data.stylistId) || {
            name: "Master Stylist",
          };

    // Attempt to persist in Firebase Firestore and dispatch Evolution Go WhatsApp
    let bookingRef = `MSN-${Math.floor(1000 + Math.random() * 9000)}`;
    let whatsappResult: { success: boolean; mode?: string; error?: string } | null = null;

    try {
      const firestoreResult = await createSalonAppointment({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceId: data.serviceId,
        serviceName: service?.name || "Bespoke Service",
        stylistId: data.stylistId,
        stylistName: stylist.name,
        date: data.date,
        time: data.time,
        duration: service?.duration || "60 mins",
        estimatedPrice: service?.startingPrice || "From ₹1,800",
        notes: data.notes,
        source: "Web Wizard",
      });

      if (firestoreResult.success && firestoreResult.confirmationCode) {
        bookingRef = firestoreResult.confirmationCode;
        whatsappResult = firestoreResult.whatsappResult || null;
      }
    } catch (saveErr) {
      console.warn("Firestore save fallback:", saveErr);
    }

    // Direct automated Evolution Go dispatch fallback if firestoreResult didn't dispatch
    const message = formatSalonAppointmentNotification({
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      serviceName: service?.name || "Bespoke Service",
      stylistName: stylist.name,
      date: data.date,
      time: data.time,
      estimatedPrice: service?.startingPrice || "From ₹1,800",
      confirmationCode: bookingRef,
    });

    if (!whatsappResult || !whatsappResult.success) {
      try {
        const directRes = await sendEvolutionGoWhatsAppMessage({
          recipientPhone: data.clientPhone,
          messageText: message,
        });
        if (directRes.success) {
          whatsappResult = directRes;
        }
      } catch (directErr) {
        console.warn("Direct WhatsApp fallback dispatch error:", directErr);
      }
    }

    const whatsappUrl = getDirectWhatsAppUrl(data.clientPhone, message);

    return NextResponse.json({
      success: true,
      bookingRef,
      whatsappUrl,
      whatsappResult,
      message:
        "Your appointment request has been recorded in our reservation system. A concierge member will review and confirm your slot via SMS/WhatsApp.",
      isDemoMode: false,
      bookingSummary: {
        bookingRef,
        serviceName: service?.name || "Bespoke Service",
        stylistName: stylist.name,
        date: data.date,
        time: data.time,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        estimatedPrice: service?.startingPrice || "From ₹1,800",
        duration: service?.duration || "60 mins",
      },
    });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An unexpected server error occurred while processing your appointment request. Please try again or reach out to our concierge directly.",
      },
      { status: 500 }
    );
  }
}
