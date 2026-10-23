import { z } from "zod";

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  stylistId: z.string().min(1, "Please choose a stylist preference"),
  date: z.string().min(1, "Please choose an appointment date"),
  time: z.string().min(1, "Please select an available time slot"),
  clientName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Name is too long"),
  clientEmail: z
    .string()
    .email("Please provide a valid email address for appointment confirmation"),
  clientPhone: z
    .string()
    .min(8, "Please enter a valid phone or WhatsApp number")
    .max(20, "Phone number is too long"),
  notes: z.string().max(400, "Notes cannot exceed 400 characters").optional(),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "Please accept the appointment terms to continue"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export interface BookingSubmissionResult {
  success: boolean;
  bookingRef?: string;
  message: string;
  bookingSummary?: {
    serviceName: string;
    stylistName: string;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    estimatedPrice: string;
    duration: string;
  };
}
