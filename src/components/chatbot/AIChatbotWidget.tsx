"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Phone,
  User,
  Scissors,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { SERVICES, STYLISTS, SALON_INFO } from "@/data/salonData";
import { createSalonAppointment } from "@/services/salonFirestoreService";
import {
  formatSalonAppointmentNotification,
  getDirectWhatsAppUrl,
  formatEvolutionPhoneNumber,
} from "@/services/whatsappService";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  type?: "text" | "chips" | "service_picker" | "stylist_picker" | "date_picker" | "time_picker" | "summary_card" | "success";
  chips?: string[];
  data?: Record<string, unknown>;
}

interface BookingDraft {
  name: string;
  mobile: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
}

const AVAILABLE_TIMES = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
  "07:00 PM",
];

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [lastCreatedApt, setLastCreatedApt] = useState<{
    confirmationCode: string;
    mobile: string;
    messageText: string;
  } | null>(null);

  const [booking, setBooking] = useState<BookingDraft>({
    name: "",
    mobile: "",
    serviceId: "",
    serviceName: "",
    servicePrice: "",
    stylistId: "any",
    stylistName: "Any Available Master Stylist",
    date: "",
    time: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "bot",
      text: "Welcome to Maison Hair Atelier. I am your AI Salon Concierge. How may I assist your visit today?",
      type: "chips",
      chips: ["Book An Appointment", "Explore Services & Pricing", "Our Master Stylists", "Location & Hours"],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (
    text: string,
    type: ChatMessage["type"] = "text",
    extra?: Partial<ChatMessage>
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text,
          type,
          ...extra,
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleChipClick = (chip: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: chip },
    ]);

    if (chip === "Book An Appointment") {
      setCurrentStep(1);
      addBotMessage("Delighted to help you reserve time with us. May I please have your full name?", "text");
    } else if (chip === "Explore Services & Pricing") {
      addBotMessage(
        "Our signature services include:\n• Precision Cut & Finish (from ₹1,800)\n• Signature Gloss & Tone (from ₹3,500)\n• Maison Balayage (from ₹6,500)\n• Botanical Scalp Ritual (from ₹2,800)\n• Men's Precision Grooming (from ₹1,500)",
        "chips",
        { chips: ["Book An Appointment", "Our Master Stylists"] }
      );
    } else if (chip === "Our Master Stylists") {
      addBotMessage(
        "Our team of resident artisans:\n• Ananya Roy — Founder & Master Stylist (Precision Bobs)\n• Kabir Kapoor — Creative Director (Sculptural Cuts & Men's Grooming)\n• Meera Sen — Senior Balayage & Colour Master",
        "chips",
        { chips: ["Book An Appointment", "Location & Hours"] }
      );
    } else if (chip === "Location & Hours") {
      addBotMessage(
        `📍 ${SALON_INFO.address}\n🕒 ${SALON_INFO.openingHoursDisplay}\n📞 Concierge: ${SALON_INFO.phone}`,
        "chips",
        { chips: ["Book An Appointment", "Explore Services & Pricing"] }
      );
    }
  };

  const handleUserInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = userInput.trim();
    if (!clean) return;

    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: clean },
    ]);

    if (currentStep === 1) {
      setBooking((prev) => ({ ...prev, name: clean }));
      setCurrentStep(2);
      addBotMessage(
        `A pleasure, ${clean}. What is your WhatsApp mobile number? We will dispatch your confirmed appointment pass directly to your WhatsApp.`,
        "text"
      );
    } else if (currentStep === 2) {
      const formatted = formatEvolutionPhoneNumber(clean);
      if (formatted.length < 10) {
        addBotMessage("Please provide a valid 10-to-12 digit mobile number so we can deliver your WhatsApp pass.");
        return;
      }
      setBooking((prev) => ({ ...prev, mobile: formatted }));
      setCurrentStep(3);
      addBotMessage("Thank you. Which atelier service would you like to experience?", "service_picker");
    } else {
      // General conversational fallback
      addBotMessage(
        "I can help you arrange an unrushed appointment or answer any questions about our atelier craft.",
        "chips",
        { chips: ["Book An Appointment", "Explore Services & Pricing", "Location & Hours"] }
      );
    }
  };

  const handleSelectService = (serviceId: string) => {
    const s = SERVICES.find((item) => item.id === serviceId);
    if (!s) return;

    setBooking((prev) => ({
      ...prev,
      serviceId: s.id,
      serviceName: s.name,
      servicePrice: s.startingPrice,
    }));

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: s.name },
    ]);

    setCurrentStep(4);
    addBotMessage(
      `Selected: ${s.name} (${s.startingPrice}). Would you like to request a specific master stylist or our first available artist?`,
      "stylist_picker"
    );
  };

  const handleSelectStylist = (stylistId: string) => {
    const st = STYLISTS.find((item) => item.id === stylistId);
    const stylistName = st ? st.name : "Any Available Master Stylist";

    setBooking((prev) => ({
      ...prev,
      stylistId: stylistId,
      stylistName,
    }));

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: stylistName },
    ]);

    setCurrentStep(5);
    addBotMessage(
      `Splendid, with ${stylistName}. Which day works best for your visit?`,
      "date_picker"
    );
  };

  const handleSelectDate = (dateStr: string) => {
    setBooking((prev) => ({ ...prev, date: dateStr }));
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: dateStr },
    ]);

    setCurrentStep(6);
    addBotMessage("Select your preferred consultation time slot:", "time_picker");
  };

  const handleSelectTime = (timeStr: string) => {
    setBooking((prev) => ({ ...prev, time: timeStr }));
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: timeStr },
    ]);

    setCurrentStep(7);
    addBotMessage("Please review your reservation summary before we finalize your appointment:", "summary_card");
  };

  const handleConfirmBooking = async () => {
    setIsTyping(true);

    try {
      const res = await createSalonAppointment({
        clientName: booking.name,
        clientPhone: booking.mobile,
        serviceId: booking.serviceId,
        serviceName: booking.serviceName,
        stylistId: booking.stylistId,
        stylistName: booking.stylistName,
        date: booking.date,
        time: booking.time,
        estimatedPrice: booking.servicePrice,
        source: "AI Chatbot",
      });

      const messageText = formatSalonAppointmentNotification({
        clientName: booking.name,
        clientPhone: booking.mobile,
        serviceName: booking.serviceName,
        stylistName: booking.stylistName,
        date: booking.date,
        time: booking.time,
        estimatedPrice: booking.servicePrice,
        confirmationCode: res.confirmationCode,
      });

      setLastCreatedApt({
        confirmationCode: res.confirmationCode,
        mobile: booking.mobile,
        messageText,
      });

      setCurrentStep(8);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `✨ Reservation Confirmed! Your booking reference is ${res.confirmationCode}.\n\nWe have dispatched your appointment details to WhatsApp (${booking.mobile}). You can also tap below to open your pass.`,
          type: "success",
        },
      ]);
    } catch (err) {
      setIsTyping(false);
      addBotMessage("We recorded your request, and our desk concierge will follow up promptly via WhatsApp.");
    }
  };

  const handleResetChat = () => {
    setCurrentStep(0);
    setLastCreatedApt(null);
    setBooking({
      name: "",
      mobile: "",
      serviceId: "",
      serviceName: "",
      servicePrice: "",
      stylistId: "any",
      stylistName: "Any Available Master Stylist",
      date: "",
      time: "",
    });
    setMessages([
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Conversation reset. How may I assist you today?",
        type: "chips",
        chips: ["Book An Appointment", "Explore Services & Pricing", "Our Master Stylists", "Location & Hours"],
      },
    ]);
  };

  // Generate 4 upcoming dates
  const getUpcomingDates = () => {
    const list: string[] = [];
    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push(
        d.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    }
    return list;
  };

  return (
    <>
      {/* ── Floating Launcher Trigger (Lower Right Corner) ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label={isOpen ? "Close AI Concierge" : "Open AI Concierge"}
          className="group relative flex items-center gap-3 bg-[#121214]/95 hover:bg-[#18181B] text-white border border-[#27272A] hover:border-zinc-400 p-2 sm:pl-3.5 sm:pr-4 sm:py-2.5 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          {isOpen ? (
            <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <X className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="relative w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors">
              <Sparkles className="w-4 h-4 text-zinc-200 group-hover:text-white group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#121214]" />
              </span>
            </div>
          )}

          <div className="text-left hidden sm:block pr-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-mono">
                {isOpen ? "Atelier" : "AI Concierge"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-serif tracking-wide text-white font-medium block mt-1">
              {isOpen ? "Close Desk" : "Reserve & Inquire"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* ── Chat Window Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#121214] border border-[#27272A] shadow-2xl flex flex-col overflow-hidden text-[#F4F4F5] font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-[#0A0A0A] border-b border-[#27272A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-editorial-serif font-bold text-sm">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider text-white uppercase">
                      Maison Concierge
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                      AI Live
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Direct Booking & WhatsApp Dispatch
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Concierge"
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0E0E10]/90">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-white text-black font-medium"
                        : "bg-[#18181B] text-zinc-200 border border-[#27272A]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Quick Action Chips */}
                  {msg.type === "chips" && msg.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                      {msg.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChipClick(chip)}
                          className="px-3 py-1.5 text-[11px] bg-[#1F1F23] hover:bg-white hover:text-black border border-[#27272A] text-zinc-300 rounded-full transition-colors flex items-center gap-1.5"
                        >
                          <span>{chip}</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Service Picker */}
                  {msg.type === "service_picker" && currentStep === 3 && (
                    <div className="grid grid-cols-1 gap-1.5 mt-2.5 w-full">
                      {SERVICES.slice(0, 6).map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleSelectService(srv.id)}
                          className="text-left p-2.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded-xs text-xs transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-medium text-white block group-hover:text-zinc-100">
                              {srv.name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {srv.duration} · {srv.category}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-semibold text-white">
                            {srv.startingPrice}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Stylist Picker */}
                  {msg.type === "stylist_picker" && currentStep === 4 && (
                    <div className="grid grid-cols-1 gap-1.5 mt-2.5 w-full">
                      <button
                        onClick={() => handleSelectStylist("any")}
                        className="text-left p-2.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded-xs text-xs transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-white">
                          First Available Master Stylist
                        </span>
                        <span className="text-[10px] text-emerald-400">Fastest</span>
                      </button>

                      {STYLISTS.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleSelectStylist(st.id)}
                          className="text-left p-2.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] rounded-xs text-xs transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium text-white block">
                              {st.name}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {st.role}
                            </span>
                          </div>
                          <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Date Picker */}
                  {msg.type === "date_picker" && currentStep === 5 && (
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 w-full">
                      {getUpcomingDates().map((dStr, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectDate(dStr)}
                          className="p-2.5 text-center bg-[#18181B] hover:bg-white hover:text-black border border-[#27272A] text-xs font-medium rounded-xs transition-colors"
                        >
                          {dStr}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Time Picker */}
                  {msg.type === "time_picker" && currentStep === 6 && (
                    <div className="grid grid-cols-3 gap-1.5 mt-2.5 w-full">
                      {AVAILABLE_TIMES.map((time, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectTime(time)}
                          className="p-2 text-center bg-[#18181B] hover:bg-white hover:text-black border border-[#27272A] text-xs font-mono rounded-xs transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Summary Card */}
                  {msg.type === "summary_card" && currentStep === 7 && (
                    <div className="mt-2.5 p-3.5 bg-[#18181B] border border-[#27272A] rounded-xs w-full space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
                        <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                          Reservation Details
                        </span>
                        <span className="text-emerald-400 text-[10px] font-mono">
                          Live Hold
                        </span>
                      </div>

                      <div className="space-y-1 text-zinc-300">
                        <p>
                          <strong className="text-white">Client:</strong> {booking.name}
                        </p>
                        <p>
                          <strong className="text-white">WhatsApp:</strong> +{booking.mobile}
                        </p>
                        <p>
                          <strong className="text-white">Service:</strong> {booking.serviceName} ({booking.servicePrice})
                        </p>
                        <p>
                          <strong className="text-white">Stylist:</strong> {booking.stylistName}
                        </p>
                        <p>
                          <strong className="text-white">Slot:</strong> {booking.date} at {booking.time}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#27272A] flex gap-2">
                        <button
                          onClick={handleConfirmBooking}
                          className="flex-1 py-2.5 bg-white text-black font-semibold uppercase tracking-wider text-[11px] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm & Send WhatsApp</span>
                        </button>
                        <button
                          onClick={handleResetChat}
                          className="px-3 py-2 border border-zinc-700 text-zinc-400 hover:text-white text-[11px] transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success State */}
                  {msg.type === "success" && lastCreatedApt && (
                    <div className="mt-2.5 w-full space-y-2">
                      <a
                        href={getDirectWhatsAppUrl(lastCreatedApt.mobile, lastCreatedApt.messageText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-semibold text-xs tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>Open WhatsApp Pass</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={handleResetChat}
                        className="w-full py-2 border border-zinc-800 text-zinc-400 hover:text-white text-[11px] transition-colors"
                      >
                        Book Another Service
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs p-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-500 animate-ping" />
                  <span>Concierge is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            {currentStep < 7 && (
              <form
                onSubmit={handleUserInputSubmit}
                className="p-3 bg-[#0A0A0A] border-t border-[#27272A] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    currentStep === 1
                      ? "Enter your full name..."
                      : currentStep === 2
                      ? "Enter WhatsApp mobile number..."
                      : "Type message or inquiry..."
                  }
                  className="flex-1 bg-[#18181B] border border-[#27272A] rounded-xs px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="p-2 bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
