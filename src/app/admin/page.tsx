"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Send,
  ExternalLink,
  MessageSquare,
  Shield,
  Key,
  LogOut,
  Sliders,
  Scissors,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Lock,
  Pencil,
} from "lucide-react";
import {
  SalonAppointment,
  subscribeSalonAppointments,
  updateAppointmentStatus,
  deleteSalonAppointment,
  createSalonAppointment,
  getSalonWhatsAppSettings,
  saveSalonWhatsAppSettings,
  subscribeSalonServices,
  saveSalonService,
  deleteSalonService,
  subscribeSalonStylists,
  saveSalonStylist,
  deleteSalonStylist,
} from "@/services/salonFirestoreService";
import {
  sendEvolutionGoWhatsAppMessage,
  checkEvolutionGoStatus,
  formatSalonAppointmentNotification,
  getDirectWhatsAppUrl,
  WhatsAppSettings,
  DEFAULT_WHATSAPP_SETTINGS,
} from "@/services/whatsappService";
import { SERVICES, STYLISTS, SALON_INFO, ServiceItem, StylistItem } from "@/data/salonData";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"appointments" | "whatsapp" | "services">("appointments");
  const [appointments, setAppointments] = useState<SalonAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // WhatsApp Settings state
  const [waSettings, setWaSettings] = useState<WhatsAppSettings>(DEFAULT_WHATSAPP_SETTINGS);
  const [waStatus, setWaStatus] = useState<{
    tested: boolean;
    connected: boolean;
    checking: boolean;
    message: string;
  }>({
    tested: false,
    connected: false,
    checking: false,
    message: "",
  });

  // Test WhatsApp message state
  const [testNumber, setTestNumber] = useState<string>("");
  const [testMessage, setTestMessage] = useState<string>(
    "Hello from Maison Hair Atelier! This is a test dispatch confirming Evolution Go integration."
  );
  const [testResult, setTestResult] = useState<string>("");
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // New appointment modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>("");
  const [newClientPhone, setNewClientPhone] = useState<string>("");
  const [newServiceId, setNewServiceId] = useState<string>(SERVICES[0].id);
  const [newStylistId, setNewStylistId] = useState<string>(STYLISTS[0].id);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("11:30 AM");

  // Services Management State
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  // Stylists Management State
  const [stylistsList, setStylistsList] = useState<StylistItem[]>(STYLISTS);
  const [editingStylist, setEditingStylist] = useState<StylistItem | null>(null);
  const [isStylistModalOpen, setIsStylistModalOpen] = useState<boolean>(false);

  // Load session or check password
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("maison_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setNewDate(d.toISOString().split("T")[0]);
  }, []);

  // Listen to Firestore real-time appointments, services & stylists
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const unsubscribeApts = subscribeSalonAppointments((list) => {
      setAppointments(list);
      setLoading(false);
    });

    const unsubscribeServices = subscribeSalonServices((list) => {
      if (list && list.length > 0) setServicesList(list);
    });

    const unsubscribeStylists = subscribeSalonStylists((list) => {
      if (list && list.length > 0) setStylistsList(list);
    });

    getSalonWhatsAppSettings().then((s) => {
      setWaSettings(s);
    });

    return () => {
      unsubscribeApts();
      unsubscribeServices();
      unsubscribeStylists();
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123" || passwordInput === "salon2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("maison_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid security key. Hint: admin123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("maison_admin_auth");
  };

  const handleStatusChange = async (aptId: string, newStatus: SalonAppointment["status"]) => {
    await updateAppointmentStatus(aptId, newStatus);
  };

  const handleDeleteApt = async (aptId: string) => {
    if (confirm("Are you sure you wish to delete this appointment?")) {
      await deleteSalonAppointment(aptId);
    }
  };

  const handleSendWhatsAppNotification = async (apt: SalonAppointment) => {
    const msg = formatSalonAppointmentNotification({
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      serviceName: apt.serviceName,
      stylistName: apt.stylistName,
      date: apt.date,
      time: apt.time,
      estimatedPrice: apt.estimatedPrice,
      confirmationCode: apt.confirmationCode,
    });

    const res = await sendEvolutionGoWhatsAppMessage({
      recipientPhone: apt.clientPhone,
      messageText: msg,
      whatsappSettings: waSettings,
    });

    if (res.success) {
      alert(`WhatsApp message dispatched to ${apt.clientPhone}!`);
    } else {
      alert(`Notice: ${res.mode}\nOpening direct WhatsApp link.`);
      window.open(getDirectWhatsAppUrl(apt.clientPhone, msg), "_blank");
    }
  };

  const handleTestWhatsApp = async () => {
    if (!testNumber) {
      alert("Please enter a test phone number.");
      return;
    }

    setIsSendingTest(true);
    setTestResult("Connecting to Evolution Go API...");

    const res = await sendEvolutionGoWhatsAppMessage({
      recipientPhone: testNumber,
      messageText: testMessage,
      whatsappSettings: waSettings,
    });

    setIsSendingTest(false);
    if (res.success) {
      setTestResult("✅ Dispatched successfully via Evolution Go!");
    } else {
      setTestResult(`⚠️ ${res.mode}: ${res.error || "Click Direct Link below"}`);
    }
  };

  const handleCheckConnection = async () => {
    setWaStatus({ tested: false, connected: false, checking: true, message: "Testing connection..." });

    const status = await checkEvolutionGoStatus(waSettings);
    setWaStatus({
      tested: true,
      connected: status.ok && !!status.connected,
      checking: false,
      message: status.ok
        ? status.connected
          ? "Evolution Go Instance Connected & Active (200 OK)"
          : "Instance found on server (Connecting)"
        : status.error || "Unable to reach Evolution Go",
    });
  };

  const handleSaveSettings = async () => {
    await saveSalonWhatsAppSettings(waSettings);
    alert("WhatsApp settings saved to Firebase Firestore.");
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = SERVICES.find((s) => s.id === newServiceId);
    const stylist = STYLISTS.find((st) => st.id === newStylistId);

    await createSalonAppointment({
      clientName: newClientName,
      clientPhone: newClientPhone,
      serviceId: newServiceId,
      serviceName: service?.name || "Bespoke Styling",
      stylistId: newStylistId,
      stylistName: stylist?.name || "Master Stylist",
      date: newDate,
      time: newTime,
      estimatedPrice: service?.startingPrice || "From ₹1,800",
      source: "Admin Desk",
    });

    setShowAddModal(false);
    setNewClientName("");
    setNewClientPhone("");
  };

  // Service Management Handlers
  const handleOpenAddService = () => {
    setEditingService({
      id: `srv-${Date.now()}`,
      name: "",
      category: "Cuts",
      tagline: "",
      description: "",
      startingPrice: "From ₹1,800",
      numericPrice: 1800,
      duration: "60 mins",
      durationMinutes: 60,
      image: "/images/indian-precision-cut.jpg",
      featured: false,
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingService({ ...srv });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name.trim()) return;
    await saveSalonService(editingService);
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service from the menu?")) {
      await deleteSalonService(serviceId);
    }
  };

  // Stylist Management Handlers
  const handleOpenAddStylist = () => {
    setEditingStylist({
      id: `stylist-${Date.now()}`,
      name: "",
      role: "Master Stylist",
      experience: "8 Years Experience",
      bio: "Master trained specialist with an editorial eye for geometry and facial proportions.",
      specialties: ["Precision Cutting", "Styling"],
      image: "/images/indian-stylist-ananya.jpg",
      instagram: "@maison.stylist",
    });
    setIsStylistModalOpen(true);
  };

  const handleOpenEditStylist = (st: StylistItem) => {
    setEditingStylist({ ...st });
    setIsStylistModalOpen(true);
  };

  const handleSaveStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStylist || !editingStylist.name.trim()) return;
    await saveSalonStylist(editingStylist);
    setIsStylistModalOpen(false);
    setEditingStylist(null);
  };

  const handleDeleteStylist = async (stylistId: string) => {
    if (confirm("Are you sure you want to delete this master stylist from the roster?")) {
      await deleteSalonStylist(stylistId);
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientPhone.includes(searchTerm) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 text-[#F4F4F5]">
        <div className="w-full max-w-md p-8 bg-[#121214] border border-[#27272A] shadow-2xl rounded-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-white text-black flex items-center justify-center font-editorial-serif font-bold text-xl mb-3">
              M
            </div>
            <h1 className="font-editorial-serif text-3xl text-white">Atelier Admin Gate</h1>
            <p className="text-xs text-zinc-400">
              Maison Hair Atelier · Concierge Management Desk
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                Admin Security Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter security passphrase..."
                  className="w-full bg-[#18181B] border border-[#27272A] px-4 py-3 text-sm text-white placeholder-zinc-500 rounded-xs focus:outline-none focus:border-white transition-colors"
                />
                <Key className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
              </div>
              {loginError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black text-xs uppercase font-semibold tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
            >
              Enter Desk Console
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setPasswordInput("admin123");
                }}
                className="text-[11px] text-zinc-500 hover:text-white transition-colors"
              >
                One-Click Quick Access (demo: admin123)
              </button>
            </div>
          </form>

          <div className="border-t border-[#27272A] pt-4 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Return to Main Salon Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F4F5] flex flex-col font-sans">
      {/* ── Top Header Navigation ── */}
      <header className="border-b border-[#27272A] bg-[#0E0E10] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-editorial-serif text-2xl tracking-widest text-white">
              MAISON
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              Admin Console · Firebase
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors hidden sm:inline"
            >
              View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#27272A] text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Admin Dashboard Container ── */}
      <main className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors border ${
                activeTab === "appointments"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Appointments ({appointments.length})
            </button>

            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors border ${
                activeTab === "whatsapp"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Evolution Go WhatsApp
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors border ${
                activeTab === "services"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              Services & Stylists
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-[#121214] border border-[#27272A]">
            <span className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1">
              Total Reservations
            </span>
            <span className="font-editorial-serif text-3xl text-white font-bold">
              {totalBookings}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">Real-time Firestore</p>
          </div>

          <div className="p-5 bg-[#121214] border border-[#27272A]">
            <span className="text-[10px] tracking-widest uppercase text-emerald-400 block mb-1">
              Confirmed
            </span>
            <span className="font-editorial-serif text-3xl text-emerald-400 font-bold">
              {confirmedCount}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">Active client seats</p>
          </div>

          <div className="p-5 bg-[#121214] border border-[#27272A]">
            <span className="text-[10px] tracking-widest uppercase text-amber-400 block mb-1">
              Pending Desk Review
            </span>
            <span className="font-editorial-serif text-3xl text-amber-400 font-bold">
              {pendingCount}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">Awaiting dispatch</p>
          </div>

          <div className="p-5 bg-[#121214] border border-[#27272A]">
            <span className="text-[10px] tracking-widest uppercase text-blue-400 block mb-1">
              Completed
            </span>
            <span className="font-editorial-serif text-3xl text-blue-400 font-bold">
              {completedCount}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">Concluded visits</p>
          </div>
        </div>

        {/* ── TAB 1: Appointments Table ── */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#121214] border border-[#27272A]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search client, phone, or code..."
                  className="w-full bg-[#18181B] border border-[#27272A] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-zinc-400 font-medium">Status:</span>
                {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 text-xs transition-colors rounded-xs border ${
                      statusFilter === st
                        ? "bg-white text-black border-white font-medium"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#121214] border border-[#27272A] overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0A0A] border-b border-[#27272A] text-zinc-400 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="p-4">Ref</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Stylist</th>
                    <th className="p-4">Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-zinc-500">
                        Loading reservations from Firebase...
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-zinc-500">
                        No appointments found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-semibold text-white">
                          {apt.confirmationCode || apt.id?.slice(0, 6)}
                        </td>
                        <td className="p-4 text-white font-medium">
                          {apt.clientName}
                          {apt.source && (
                            <span className="block text-[10px] text-zinc-500">
                              via {apt.source}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-zinc-300">
                          +{apt.clientPhone}
                        </td>
                        <td className="p-4">
                          <span className="text-white block">{apt.serviceName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {apt.estimatedPrice}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-300">
                          {apt.stylistName || "Any Specialist"}
                        </td>
                        <td className="p-4">
                          <span className="text-white block font-mono">{apt.date}</span>
                          <span className="text-[10px] text-zinc-400">{apt.time}</span>
                        </td>
                        <td className="p-4">
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              handleStatusChange(
                                apt.id!,
                                e.target.value as SalonAppointment["status"]
                              )
                            }
                            className={`px-2 py-1 text-[11px] font-medium border rounded-xs bg-[#18181B] focus:outline-none ${
                              apt.status === "Confirmed"
                                ? "text-emerald-400 border-emerald-900"
                                : apt.status === "Pending"
                                ? "text-amber-400 border-amber-900"
                                : apt.status === "Completed"
                                ? "text-blue-400 border-blue-900"
                                : "text-zinc-500 border-zinc-800"
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleSendWhatsAppNotification(apt)}
                            title="Dispatch WhatsApp Notification"
                            className="p-1.5 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors rounded-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={getDirectWhatsAppUrl(
                              apt.clientPhone,
                              formatSalonAppointmentNotification(apt)
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in WhatsApp Web"
                            className="p-1.5 bg-zinc-800 text-zinc-300 hover:text-white transition-colors rounded-xs inline-block"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteApt(apt.id!)}
                            title="Delete Appointment"
                            className="p-1.5 bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors rounded-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: Evolution Go WhatsApp Configuration ── */}
        {activeTab === "whatsapp" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Column (Span 7) */}
            <div className="lg:col-span-7 p-6 bg-[#121214] border border-[#27272A] space-y-6">
              <div>
                <h2 className="font-editorial-serif text-2xl text-white">
                  Evolution Go API Settings
                </h2>
                <p className="text-xs text-zinc-400">
                  Configure direct WhatsApp REST gateway instance for automatic client notifications.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                    Server URL
                  </label>
                  <input
                    type="text"
                    value={waSettings.serverUrl}
                    onChange={(e) =>
                      setWaSettings((prev) => ({ ...prev, serverUrl: e.target.value }))
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white transition-colors"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Default: https://wa.beta-labs.in
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                    Instance Identifier Name
                  </label>
                  <input
                    type="text"
                    value={waSettings.instanceName}
                    onChange={(e) =>
                      setWaSettings((prev) => ({ ...prev, instanceName: e.target.value }))
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                    API Secret Key / Token
                  </label>
                  <input
                    type="password"
                    value={waSettings.apiKey}
                    onChange={(e) =>
                      setWaSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleCheckConnection}
                    disabled={waStatus.checking}
                    className="px-4 py-2.5 border border-zinc-700 bg-zinc-900 text-xs font-semibold text-white uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                  >
                    {waStatus.checking ? "Checking..." : "Test Instance Connection"}
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    Save Settings to Firebase
                  </button>
                </div>

                {waStatus.tested && (
                  <div
                    className={`p-3.5 rounded-xs border text-xs ${
                      waStatus.connected
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                        : "bg-amber-950/40 border-amber-800 text-amber-300"
                    }`}
                  >
                    <p className="font-semibold">{waStatus.message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test Dispatch Column (Span 5) */}
            <div className="lg:col-span-5 p-6 bg-[#121214] border border-[#27272A] space-y-6">
              <div>
                <h3 className="font-editorial-serif text-2xl text-white">
                  Send Test WhatsApp Message
                </h3>
                <p className="text-xs text-zinc-400">
                  Verify real-time dispatch by delivering a live message to your mobile phone.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                    Recipient Mobile (with country code)
                  </label>
                  <input
                    type="text"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="e.g. 919876543210 or 9466585014"
                    className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white font-mono rounded-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] p-3 text-xs text-white rounded-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleTestWhatsApp}
                    disabled={isSendingTest}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingTest ? "Dispatching..." : "Send Live Test Message"}</span>
                  </button>

                  {testNumber && (
                    <a
                      href={getDirectWhatsAppUrl(testNumber, testMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open Direct in WhatsApp Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {testResult && (
                  <p className="text-xs p-3 bg-[#18181B] border border-[#27272A] text-zinc-300 rounded-xs font-mono">
                    {testResult}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Services & Stylists Roster ── */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services List */}
            <div className="p-6 bg-[#121214] border border-[#27272A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                <div>
                  <h2 className="font-editorial-serif text-2xl text-white">Active Services Menu</h2>
                  <p className="text-[11px] text-zinc-400">Manage salon rituals, pricing & categories</p>
                </div>
                <button
                  onClick={handleOpenAddService}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-xs shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-3">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3.5 bg-[#18181B] border border-[#27272A] hover:border-zinc-500 transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{srv.name}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-[#121214] text-zinc-400 border border-[#27272A] font-mono uppercase">
                          {srv.category}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[10px] mt-0.5">
                        {srv.duration} · {srv.tagline || srv.description?.slice(0, 50)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-sm font-semibold text-white">
                        {srv.startingPrice}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          title="Edit Service"
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xs transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          title="Delete Service"
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylists List */}
            <div className="p-6 bg-[#121214] border border-[#27272A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                <div>
                  <h2 className="font-editorial-serif text-2xl text-white">Master Stylist Roster</h2>
                  <p className="text-[11px] text-zinc-400">Manage resident artists, bios & specialties</p>
                </div>
                <button
                  onClick={handleOpenAddStylist}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-xs shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stylist</span>
                </button>
              </div>

              <div className="space-y-3">
                {stylistsList.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 bg-[#18181B] border border-[#27272A] hover:border-zinc-500 transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-white">{st.name}</p>
                      <p className="text-zinc-500 text-[10px] mt-0.5">
                        {st.role} · {st.experience}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {st.specialties?.slice(0, 3).map((sp, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-[#121214] px-1.5 py-0.5 text-zinc-400 border border-[#27272A]"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {st.instagram}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditStylist(st)}
                          title="Edit Stylist"
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xs transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStylist(st.id)}
                          title="Delete Stylist"
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Modal: Manual Add Appointment ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121214] border border-[#27272A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="font-editorial-serif text-2xl text-white">
                Create Desk Appointment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Client Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Service
                  </label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Stylist
                  </label>
                  <select
                    value={newStylistId}
                    onChange={(e) => setNewStylistId(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  >
                    {STYLISTS.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-semibold uppercase tracking-wider hover:bg-zinc-200"
                >
                  Create & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Service Add / Edit ── */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121214] border border-[#27272A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="font-editorial-serif text-2xl text-white">
                {editingService.id && servicesList.some((s) => s.id === editingService.id)
                  ? "Edit Atelier Service"
                  : "Add New Atelier Service"}
              </h3>
              <button
                onClick={() => {
                  setIsServiceModalOpen(false);
                  setEditingService(null);
                }}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  placeholder="e.g. Signature Precision Cut"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as ServiceItem["category"],
                      })
                    }
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  >
                    <option value="Cuts">Cuts</option>
                    <option value="Colour">Colour</option>
                    <option value="Balayage">Balayage</option>
                    <option value="Treatments">Treatments</option>
                    <option value="Styling">Styling</option>
                    <option value="Occasion">Occasion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Duration Display
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({ ...editingService, duration: e.target.value })
                    }
                    placeholder="e.g. 60 mins"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Starting Price Display
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.startingPrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        startingPrice: e.target.value,
                      })
                    }
                    placeholder="e.g. From ₹1,800"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Numeric Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingService.numericPrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        numericPrice: Number(e.target.value),
                      })
                    }
                    placeholder="1800"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Tagline / Essence
                </label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={(e) =>
                    setEditingService({ ...editingService, tagline: e.target.value })
                  }
                  placeholder="e.g. Architectural tailoring tailored to individual bone structure"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Image URL / Path
                </label>
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) =>
                    setEditingService({ ...editingService, image: e.target.value })
                  }
                  placeholder="/images/indian-precision-cut.jpg"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsServiceModalOpen(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-semibold uppercase tracking-wider hover:bg-zinc-200"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Stylist Add / Edit ── */}
      {isStylistModalOpen && editingStylist && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121214] border border-[#27272A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="font-editorial-serif text-2xl text-white">
                {editingStylist.id && stylistsList.some((s) => s.id === editingStylist.id)
                  ? "Edit Master Stylist"
                  : "Add Master Stylist"}
              </h3>
              <button
                onClick={() => {
                  setIsStylistModalOpen(false);
                  setEditingStylist(null);
                }}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStylist} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Stylist Name
                </label>
                <input
                  type="text"
                  required
                  value={editingStylist.name}
                  onChange={(e) =>
                    setEditingStylist({ ...editingStylist, name: e.target.value })
                  }
                  placeholder="e.g. Rohan Kapoor"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStylist.role}
                    onChange={(e) =>
                      setEditingStylist({ ...editingStylist, role: e.target.value })
                    }
                    placeholder="e.g. Creative Director & Balayage Master"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStylist.experience}
                    onChange={(e) =>
                      setEditingStylist({
                        ...editingStylist,
                        experience: e.target.value,
                      })
                    }
                    placeholder="e.g. 12 Years Experience"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={editingStylist.instagram}
                    onChange={(e) =>
                      setEditingStylist({
                        ...editingStylist,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="@maison.rohan"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                    Specialties (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingStylist.specialties?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingStylist({
                        ...editingStylist,
                        specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Balayage, Corrective Color"
                    className="w-full bg-[#18181B] border border-[#27272A] p-2.5 text-xs text-white rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Bio / Philosophy
                </label>
                <textarea
                  rows={2}
                  value={editingStylist.bio}
                  onChange={(e) =>
                    setEditingStylist({ ...editingStylist, bio: e.target.value })
                  }
                  placeholder="Master trained specialist with an editorial eye..."
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mb-1">
                  Photo URL / Path
                </label>
                <input
                  type="text"
                  value={editingStylist.image}
                  onChange={(e) =>
                    setEditingStylist({ ...editingStylist, image: e.target.value })
                  }
                  placeholder="/images/indian-stylist-rohan.jpg"
                  className="w-full bg-[#18181B] border border-[#27272A] px-3.5 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsStylistModalOpen(false);
                    setEditingStylist(null);
                  }}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-semibold uppercase tracking-wider hover:bg-zinc-200"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
