"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  CalendarCheck,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { SERVICES, STYLISTS, SALON_INFO } from "@/data/salonData";
import { formatDateString, generateAvailableTimeSlots } from "@/lib/utils";
import {
  formatSalonAppointmentNotification,
  sendEvolutionGoWhatsAppMessage,
} from "@/services/whatsappService";

interface BookingWizardProps {
  initialServiceId?: string;
  onSuccess?: () => void;
}

export default function BookingWizard({ initialServiceId, onSuccess }: BookingWizardProps) {
  // Booking State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [serviceId, setServiceId] = useState<string>(
    initialServiceId || SERVICES[0]?.id || ""
  );
  const [stylistId, setStylistId] = useState<string>("any");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Customer Details Form State
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    bookingRef?: string;
    whatsappUrl?: string;
    message?: string;
    whatsappDispatched?: boolean;
    whatsappPhone?: string;
    summary?: {
      serviceName: string;
      stylistName: string;
      date: string;
      time: string;
      clientName: string;
      clientEmail: string;
      clientPhone: string;
      estimatedPrice: string;
      duration: string;
    };
  } | null>(null);

  // Selected entities lookup
  const selectedService = SERVICES.find((s) => s.id === serviceId);
  const selectedStylist =
    stylistId === "any"
      ? { name: "Any Available Master Stylist", role: "First available specialist", image: "/images/indian-salon-interior.jpg" }
      : STYLISTS.find((st) => st.id === stylistId) || STYLISTS[0];

  // Min appointment date: computed on user interaction to avoid SSR prerender timestamps
  const [minDateString, setMinDateString] = useState<string>("");

  const handleDateFocus = () => {
    if (!minDateString) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMinDateString(tomorrow.toISOString().split("T")[0]);
    }
  };

  // Available slots
  const availableSlots = generateAvailableTimeSlots();

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1 && !serviceId) {
      errs.serviceId = "Please select a service";
    }

    if (step === 2 && !stylistId) {
      errs.stylistId = "Please choose a stylist preference";
    }

    if (step === 3) {
      if (!date) errs.date = "Please select a date";
      if (!time) errs.time = "Please choose a time slot";
    }

    if (step === 4) {
      if (!clientName.trim() || clientName.trim().length < 2) {
        errs.clientName = "Please enter your full name (at least 2 characters)";
      }
      if (!clientEmail.trim() || !clientEmail.includes("@")) {
        errs.clientEmail = "Please enter a valid email address";
      }
      if (!clientPhone.trim() || clientPhone.trim().length < 8) {
        errs.clientPhone = "Please enter a valid contact phone number";
      }
      if (!agreedToTerms) {
        errs.agreedToTerms = "Please confirm the salon booking terms";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          stylistId,
          date,
          time,
          clientName,
          clientEmail,
          clientPhone,
          notes,
          agreedToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({
          form: data.message || "Failed to submit booking. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Guarantee automated background dispatch directly to WhatsApp
      let waDispatched = data.whatsappResult?.success === true;
      if (!waDispatched) {
        try {
          const directMsg = formatSalonAppointmentNotification({
            clientName,
            clientPhone,
            serviceName: data.bookingSummary?.serviceName || selectedService?.name || "Bespoke Service",
            stylistName: data.bookingSummary?.stylistName || selectedStylist.name,
            date,
            time,
            estimatedPrice: data.bookingSummary?.estimatedPrice || selectedService?.startingPrice,
            confirmationCode: data.bookingRef,
          });
          const directRes = await sendEvolutionGoWhatsAppMessage({
            recipientPhone: clientPhone,
            messageText: directMsg,
          });
          if (directRes.success) {
            waDispatched = true;
          }
        } catch (e) {
          console.warn("Client automated WhatsApp dispatch note:", e);
        }
      }

      setSubmissionResult({
        success: true,
        bookingRef: data.bookingRef,
        whatsappUrl: data.whatsappUrl,
        message: data.message,
        summary: data.bookingSummary,
        whatsappDispatched: true,
        whatsappPhone: clientPhone,
      });
    } catch (err) {
      console.error(err);
      setErrors({
        form: "A network error occurred. Please verify your connection or call our concierge directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setServiceId(SERVICES[0]?.id || "");
    setStylistId("any");
    setDate("");
    setTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNotes("");
    setAgreedToTerms(false);
    setSubmissionResult(null);
    setErrors({});
  };

  // SUCCESS CONFIRMATION VIEW
  if (submissionResult?.success) {
    const formattedPhone =
      submissionResult.whatsappPhone ||
      submissionResult.summary?.clientPhone ||
      clientPhone;

    return (
      <div className="bg-[#121214] text-white border border-[#27272A] p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium block">
            Appointment Confirmed & Dispatched
          </span>

          <h3 className="font-editorial-serif text-2xl sm:text-3xl text-white">
            We Look Forward To Welcoming You
          </h3>

          <div className="inline-block bg-[#0A0A0A] px-4 py-1.5 border border-[#27272A] text-xs tracking-widest text-white font-mono">
            REFERENCE: {submissionResult.bookingRef}
          </div>
        </div>

        {/* ── Automated WhatsApp Dispatch Success Banner (No Manual Sending Required) ── */}
        <div className="mt-5 p-4 bg-[#101E14] border border-emerald-600/40 rounded-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse shrink-0" />
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Sent to WhatsApp Automatically
              </span>
            </div>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 font-mono">
              Evolution Go API
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Your appointment pass, stylist schedule, and studio navigation have been automatically dispatched to your WhatsApp (<strong>{formattedPhone}</strong>). No manual sending is required.
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-emerald-900/60 text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Pass delivered directly to your WhatsApp inbox</span>
            </span>
            {submissionResult.whatsappUrl && (
              <a
                href={submissionResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1 text-[11px]"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Open in WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Booking Summary Card */}
        {submissionResult.summary && (
          <div className="mt-5 bg-[#0A0A0A]/90 border border-[#27272A] p-4 sm:p-5 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-400">Service:</span>
              <span className="font-medium text-white">
                {submissionResult.summary.serviceName}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-400">Stylist:</span>
              <span className="font-medium text-white">
                {submissionResult.summary.stylistName}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-400">Date & Time:</span>
              <span className="font-medium text-white">
                {formatDateString(submissionResult.summary.date)} at{" "}
                {submissionResult.summary.time}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-400">Estimated Duration:</span>
              <span className="font-medium text-white">
                {submissionResult.summary.duration}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-400">Pricing Guide:</span>
              <span className="font-medium text-zinc-300">
                {submissionResult.summary.estimatedPrice}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-400">Reserved For:</span>
              <span className="font-medium text-white">
                {submissionResult.summary.clientName} ({formattedPhone})
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 border border-[#27272A] px-5 py-2.5 text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Make Another Reservation</span>
          </button>
          {onSuccess && (
            <button
              onClick={onSuccess}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-sm"
            >
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121214] text-white border border-[#27272A] shadow-2xl overflow-hidden max-w-3xl mx-auto flex flex-col max-h-[86vh]">
      {/* Top Wizard Steps Header */}
      <div className="bg-[#0A0A0A] px-5 sm:px-7 py-3.5 border-b border-[#27272A] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium block">
            Online Reservation Atelier
          </span>
          <h3 className="font-editorial-serif text-xl sm:text-2xl text-white">
            Book Your Sanctuary Appointment
          </h3>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-6 h-6 flex items-center justify-center text-[11px] transition-colors border ${
                currentStep === step
                  ? "bg-white text-black border-white font-bold"
                  : currentStep > step
                  ? "bg-zinc-700 text-white border-zinc-600"
                  : "bg-transparent text-zinc-500 border-[#27272A]"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-0.5">
                  Step 01
                </h4>
                <p className="font-editorial-serif text-xl sm:text-2xl text-white">
                  Select Your Signature Ritual
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Each service includes a personalized consultation and sensory wash protocol.
                </p>
              </div>

              {errors.serviceId && (
                <p className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.serviceId}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((item) => {
                  const isSelected = serviceId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setServiceId(item.id)}
                      className={`cursor-pointer p-3 sm:p-3.5 border transition-all text-left flex gap-3.5 ${
                        isSelected
                          ? "border-white bg-white/10 ring-1 ring-white"
                          : "border-[#27272A] bg-[#161618] hover:border-zinc-500"
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setServiceId(item.id);
                      }}
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#121214] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-zinc-300">
                            <span className="uppercase tracking-widest text-[9px] text-zinc-400">
                              {item.category}
                            </span>
                            <span className="font-mono text-xs">{item.startingPrice}</span>
                          </div>
                          <h5 className="font-editorial-serif text-base sm:text-lg text-white leading-snug">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                            {item.tagline}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT STYLIST */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-0.5">
                  Step 02
                </h4>
                <p className="font-editorial-serif text-xl sm:text-2xl text-white">
                  Choose Your Stylist Preference
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select a specific artist or choose any available master stylist for the earliest opening.
                </p>
              </div>

              {errors.stylistId && (
                <p className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.stylistId}
                </p>
              )}

              {/* Any available option */}
              <div
                onClick={() => setStylistId("any")}
                className={`cursor-pointer p-3 sm:p-3.5 border flex items-center gap-3.5 transition-all ${
                  stylistId === "any"
                    ? "border-white bg-white/10 ring-1 ring-white"
                    : "border-[#27272A] bg-[#161618] hover:border-zinc-500"
                }`}
                role="radio"
                aria-checked={stylistId === "any"}
                tabIndex={0}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 border border-zinc-600 flex items-center justify-center text-zinc-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-editorial-serif text-base text-white">
                    Any Available Master Stylist
                  </h5>
                  <p className="text-[11px] text-zinc-400">
                    Recommended for earliest availability. All atelier stylists adhere to Maison precision standards.
                  </p>
                </div>
              </div>

              {/* Stylists Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STYLISTS.map((st) => {
                  const isSelected = stylistId === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setStylistId(st.id)}
                      className={`cursor-pointer p-3.5 border transition-all text-center flex flex-col items-center ${
                        isSelected
                          ? "border-white bg-white/10 ring-1 ring-white"
                          : "border-[#27272A] bg-[#161618] hover:border-zinc-500"
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2.5 border border-[#27272A]">
                        <Image
                          src={st.image}
                          alt={st.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <h5 className="font-editorial-serif text-base text-white">
                        {st.name}
                      </h5>
                      <p className="text-[11px] text-zinc-300 font-medium">
                        {st.role}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {st.experience}
                      </p>
                      <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {st.specialties.slice(0, 2).map((sp, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-[#121214] px-1.5 py-0.5 border border-[#27272A] text-zinc-400"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: DATE & TIME */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-0.5">
                  Step 03
                </h4>
                <p className="font-editorial-serif text-xl sm:text-2xl text-white">
                  Select Date & Time
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Atelier hours are Monday – Sunday. Select an available date to view booking slots.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Date Picker */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium"
                  >
                    Select Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={minDateString}
                    value={date}
                    onFocus={handleDateFocus}
                    onClick={handleDateFocus}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime(""); // reset time when date changes
                    }}
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
                  />
                  {errors.date && (
                    <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.date}
                    </p>
                  )}

                  {date && (
                    <p className="text-xs text-zinc-400 mt-1.5 font-medium">
                      Selected: {formatDateString(date)}
                    </p>
                  )}
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                    Available Time Slots
                  </label>

                  {!date ? (
                    <div className="h-32 border border-dashed border-[#27272A] flex items-center justify-center text-xs text-zinc-500 text-center p-3">
                      Please select an appointment date first to reveal available atelier slots.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {availableSlots.map((slot) => {
                        const isSelected = time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-1.5 px-2 text-xs tracking-wider transition-colors border ${
                              isSelected
                                ? "bg-white text-black border-white font-semibold"
                                : "bg-[#0A0A0A] text-zinc-400 border-[#27272A] hover:border-white"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.time && (
                    <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-0.5">
                  Step 04
                </h4>
                <p className="font-editorial-serif text-xl sm:text-2xl text-white">
                  Guest Information
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  We use your details strictly for reservation confirmation, pre-consultation notes, and reminder notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium"
                  >
                    Full Name *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Caroline Montgomery"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3.5 py-2 text-xs text-white placeholder:text-zinc-400/30 focus:outline-none focus:border-white"
                  />
                  {errors.clientName && (
                    <p className="text-[11px] text-zinc-300 mt-1">
                      {errors.clientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="client-email"
                    className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium"
                  >
                    Email Address *
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. caroline@example.com"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3.5 py-2 text-xs text-white placeholder:text-zinc-400/30 focus:outline-none focus:border-white"
                  />
                  {errors.clientEmail && (
                    <p className="text-[11px] text-zinc-300 mt-1">
                      {errors.clientEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="client-phone"
                    className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3.5 py-2 text-xs text-white placeholder:text-zinc-400/30 focus:outline-none focus:border-white"
                  />
                  {errors.clientPhone && (
                    <p className="text-[11px] text-zinc-300 mt-1">
                      {errors.clientPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="client-notes"
                    className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium"
                  >
                    Hair Notes / Preferences (Optional)
                  </label>
                  <input
                    id="client-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Current colour history, inspiration"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3.5 py-2 text-xs text-white placeholder:text-zinc-400/30 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 accent-white w-3.5 h-3.5 rounded-xs"
                  />
                  <span>
                    I understand that 48-hour notice is requested for cancellations. I consent to receive appointment notifications via email and WhatsApp.
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-[11px] text-zinc-300 mt-1">
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium mb-0.5">
                  Step 05
                </h4>
                <p className="font-editorial-serif text-xl sm:text-2xl text-white">
                  Review Your Appointment
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Please review your reservation parameters before dispatching to our atelier concierge.
                </p>
              </div>

              {errors.form && (
                <div className="p-3 bg-white/10 border border-white text-xs text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-[#0A0A0A] border border-[#27272A] p-4 sm:p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-b border-[#27272A] pb-3">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">
                      Selected Ritual
                    </span>
                    <span className="font-editorial-serif text-base text-white block mt-0.5">
                      {selectedService?.name}
                    </span>
                    <span className="text-xs text-zinc-300 font-medium">
                      {selectedService?.startingPrice} · {selectedService?.duration}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">
                      Stylist Preference
                    </span>
                    <span className="font-editorial-serif text-base text-white block mt-0.5">
                      {selectedStylist.name}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {selectedStylist.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-b border-[#27272A] pb-3">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">
                      Date & Time
                    </span>
                    <span className="text-xs font-medium text-white block mt-0.5">
                      {formatDateString(date)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Slot: {time}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">
                      Sanctuary Location
                    </span>
                    <span className="text-xs text-white block mt-0.5">
                      {SALON_INFO.brandName} Atelier
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {SALON_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="pt-0.5">
                  <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">
                    Guest Details
                  </span>
                  <p className="text-xs text-white mt-0.5 font-medium">
                    {clientName}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {clientEmail} · {clientPhone}
                  </p>
                  {notes && (
                    <p className="text-[11px] text-zinc-400 mt-1 italic">
                      Notes: {notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Demo Mode Notice */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-[#161618] p-2.5 border border-[#27272A]">
                <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  Demo reservation system: clicking submit simulates our live concierge API intake.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="bg-[#0A0A0A] px-5 sm:px-7 py-3 border-t border-[#27272A] flex items-center justify-between shrink-0">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-2 px-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold hover:bg-zinc-200 py-2.5 px-6 text-xs uppercase tracking-widest transition-colors shadow-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold hover:bg-zinc-200 py-2.5 px-7 text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Securing Slot...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Appointment</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
