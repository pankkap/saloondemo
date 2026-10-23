/**
 * WhatsApp Client Service for Maison Hair Atelier
 * Powered by Evolution Go API & Direct Web Fallback
 */

export interface WhatsAppSettings {
  serverUrl?: string;
  instanceName?: string;
  apiKey?: string;
  isLiveApiEnabled?: boolean;
}

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  serverUrl: process.env.NEXT_PUBLIC_EVOLUTION_SERVER_URL || "https://wa.beta-labs.in",
  instanceName: process.env.NEXT_PUBLIC_EVOLUTION_INSTANCE || "saloon_app",
  apiKey: process.env.NEXT_PUBLIC_EVOLUTION_API_KEY || "",
  isLiveApiEnabled: true,
};

/**
 * Format clean international phone number for Evolution Go (digits only)
 */
export const formatEvolutionPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("00")) {
    clean = clean.slice(2);
  }
  if (clean.length === 11 && clean.startsWith("0")) {
    clean = "91" + clean.slice(1);
  } else if (clean.length === 10) {
    clean = "91" + clean; // Default to India (+91) if 10 digits
  }
  return clean;
};

/**
 * Direct WhatsApp Web/App click-to-chat URL
 */
export const getDirectWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = formatEvolutionPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
};

/**
 * Format Salon Appointment Confirmation Message for WhatsApp
 */
export const formatSalonAppointmentNotification = (
  appointment: {
    clientName: string;
    clientPhone: string;
    serviceName: string;
    stylistName?: string;
    date: string;
    time: string;
    estimatedPrice?: string;
    confirmationCode?: string;
  },
  salonName: string = "MAISON Hair Atelier"
): string => {
  return `✨ *APPOINTMENT CONFIRMED — ${salonName.toUpperCase()}* ✨

Dear *${appointment.clientName}*,

Your bespoke appointment has been reserved at our DLF Mall of India, Noida Atelier.

✂️ *Service:* ${appointment.serviceName}
👤 *Stylist:* ${appointment.stylistName || "Master Stylist"}
📅 *Date:* ${appointment.date}
⏰ *Time:* ${appointment.time}
🏷️ *Reference:* ${appointment.confirmationCode || "MSN-" + Math.floor(1000 + Math.random() * 9000)}
${appointment.estimatedPrice ? `💳 *Estimated:* ${appointment.estimatedPrice}\n` : ""}
📍 *Sanctuary:* DLF Mall of India, Level 2, Sector 18, Noida 201301
📞 *Concierge:* +91 97292 80731

_Please arrive 10 minutes early to enjoy our sensory botanical herbal wash and unhurried consultation._

If you need to reschedule or have any questions, simply reply to this message.`;
};

// In-memory cache for resolved Evolution instance token
const cachedInstanceTokens: Record<string, string> = {};

export const resolveEvolutionInstanceToken = async ({
  serverUrl,
  instanceName = "saloon_app",
  apiKey,
}: {
  serverUrl?: string;
  instanceName?: string;
  apiKey?: string;
}): Promise<string | null> => {
  if (!apiKey) return cachedInstanceTokens[instanceName] || null;

  // If apiKey is already a direct instance token (UUID) and not a global secret key
  if (apiKey.includes("-") && apiKey.length >= 32 && !apiKey.startsWith("ev_sec_")) {
    return apiKey;
  }

  // Check cache for this instance
  if (cachedInstanceTokens[instanceName]) {
    return cachedInstanceTokens[instanceName];
  }

  try {
    const cleanServer = (serverUrl || DEFAULT_WHATSAPP_SETTINGS.serverUrl!).replace(/\/+$/, "");
    const response = await fetch(`${cleanServer}/instance/all`, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const instances = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const target =
        instances.find(
          (i: { name?: string; client_name?: string; id?: string }) =>
            (i.name && i.name.toLowerCase() === instanceName.toLowerCase()) ||
            (i.client_name && i.client_name.toLowerCase() === instanceName.toLowerCase()) ||
            i.id === instanceName
        ) || instances.find((i: { name?: string }) => i.name === "saloon_app") || instances[0];

      if (target?.token) {
        cachedInstanceTokens[instanceName] = target.token;
        return target.token;
      }
    }
  } catch (e) {
    console.warn("Evolution Go token auto-lookup fallback:", e);
  }

  return cachedInstanceTokens[instanceName] || apiKey;
};

/**
 * Send WhatsApp Message using Evolution Go REST API
 */
export const sendEvolutionGoWhatsAppMessage = async ({
  recipientPhone,
  messageText,
  whatsappSettings = DEFAULT_WHATSAPP_SETTINGS,
}: {
  recipientPhone: string;
  messageText: string;
  whatsappSettings?: WhatsAppSettings;
}): Promise<{
  success: boolean;
  mode: string;
  recipientPhone: string;
  data?: unknown;
  error?: string;
}> => {
  const serverUrl = (whatsappSettings.serverUrl || DEFAULT_WHATSAPP_SETTINGS.serverUrl!).replace(/\/+$/, "");
  const instanceName = whatsappSettings.instanceName || DEFAULT_WHATSAPP_SETTINGS.instanceName!;
  const apiKey = whatsappSettings.apiKey || DEFAULT_WHATSAPP_SETTINGS.apiKey!;
  const isLiveEnabled = whatsappSettings.isLiveApiEnabled !== false;

  const cleanNumber = formatEvolutionPhoneNumber(recipientPhone);

  if (!cleanNumber) {
    return {
      success: false,
      mode: "Invalid Phone Number",
      recipientPhone,
      error: "Recipient phone number is missing or invalid.",
    };
  }

  if (!isLiveEnabled) {
    return {
      success: true,
      mode: "Simulated (Live API Disabled in Settings)",
      recipientPhone: cleanNumber,
      data: { message: "Message logged in simulated mode" },
    };
  }

  const activeToken = await resolveEvolutionInstanceToken({
    serverUrl,
    instanceName,
    apiKey,
  });

  try {
    const endpoint = `${serverUrl}/send/text`;

    let response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: activeToken || apiKey,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: messageText,
      }),
    });

    if (response.status === 404) {
      const fallbackEndpoint = `${serverUrl}/message/sendText/${encodeURIComponent(instanceName)}`;
      response = await fetch(fallbackEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: activeToken || apiKey,
        },
        body: JSON.stringify({
          number: cleanNumber,
          text: messageText,
        }),
      });
    }

    const data = await response.json().catch(() => ({ status: response.status }));

    if (response.ok) {
      return {
        success: true,
        data,
        mode: "Evolution Go Live API Dispatched Direct to WhatsApp",
        recipientPhone: cleanNumber,
      };
    } else {
      return {
        success: false,
        data,
        mode: `Evolution Go Response (${response.status})`,
        recipientPhone: cleanNumber,
        error: (data as { message?: string })?.message || "HTTP Error " + response.status,
      };
    }
  } catch (error) {
    return {
      success: false,
      mode: "Evolution Go Direct Web Fallback Available",
      recipientPhone: cleanNumber,
      error: (error as Error).message || "Network error",
    };
  }
};

/**
 * Check Evolution Go Instance Connection Status
 */
export const checkEvolutionGoStatus = async (
  whatsappSettings: WhatsAppSettings = DEFAULT_WHATSAPP_SETTINGS
): Promise<{
  ok: boolean;
  status: number;
  connected?: boolean;
  instance?: unknown;
  error?: string;
}> => {
  const cleanServer = (whatsappSettings.serverUrl || DEFAULT_WHATSAPP_SETTINGS.serverUrl!).replace(/\/+$/, "");
  const cleanInstance = whatsappSettings.instanceName || DEFAULT_WHATSAPP_SETTINGS.instanceName!;
  const cleanApiKey = whatsappSettings.apiKey || DEFAULT_WHATSAPP_SETTINGS.apiKey!;

  try {
    const response = await fetch(`${cleanServer}/instance/all`, {
      method: "GET",
      headers: {
        apikey: cleanApiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const instances = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const target =
        instances.find(
          (i: { name?: string; client_name?: string; id?: string }) =>
            i.name === cleanInstance || i.client_name === cleanInstance || i.id === cleanInstance
        ) || instances[0];

      if (target) {
        if (target.token) cachedInstanceTokens[cleanInstance] = target.token;
        return {
          ok: true,
          status: 200,
          connected: target.connected || target.status === "open",
          instance: target,
        };
      }
      return {
        ok: true,
        status: 200,
        connected: false,
        instance: null,
      };
    }

    return {
      ok: false,
      status: response.status,
      error: `Server responded with status ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: (error as Error).message || "Failed to connect to Evolution Go server",
    };
  }
};
