import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SALON_INFO } from "@/data/salonData";
import AIChatbotWidget from "@/components/chatbot/AIChatbotWidget";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maison-hair-atelier.com"),
  title: {
    default: "MAISON Hair Atelier | Luxury Hair & Beauty Studio Noida | DLF Mall of India",
    template: "%s | MAISON Hair Atelier",
  },
  description:
    "Thoughtful cuts. Exceptional colour. A little time for yourself. An architectural luxury hair salon & beauty sanctuary in DLF Mall of India, Sector 18, Noida.",
  keywords: [
    "luxury hair salon Noida",
    "DLF Mall of India salon",
    "precision haircuts Noida",
    "balayage specialists Noida",
    "editorial hair styling",
    "botanical scalp treatment",
  ],
  authors: [{ name: "MAISON Hair Atelier" }],
  creator: "MAISON Hair Atelier",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://maison-hair-atelier.com",
    title: "MAISON Hair Atelier — Luxury Hair & Beauty Sanctuary Noida",
    description:
      "A salon experience, considered. Precision cutting, bespoke balayage, and restorative scalp rituals at DLF Mall of India, Noida.",
    siteName: "MAISON Hair Atelier",
    images: [
      {
        url: "/images/indian-hero-salon.jpg",
        width: 1920,
        height: 1080,
        alt: "MAISON Hair Atelier DLF Mall of India Interior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAISON Hair Atelier | Luxury Hair & Beauty Studio Noida",
    description: "Thoughtful cuts. Exceptional colour. A little time for yourself.",
    images: ["/images/indian-hero-salon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: `${SALON_INFO.brandName} ${SALON_INFO.brandSubtitle}`,
    image: "https://maison-hair-atelier.com/images/indian-hero-salon.jpg",
    telephone: SALON_INFO.phone,
    email: SALON_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "DLF Mall of India, Level 2, Sector 18",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: SALON_INFO.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.5677,
      longitude: 77.3211,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:30",
        closes: "21:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, Debit Card, UPI, Cash",
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F4F4F5] selection:bg-white selection:text-black">
        {children}
        <FloatingWhatsApp />
        <AIChatbotWidget />
      </body>
    </html>
  );
}
