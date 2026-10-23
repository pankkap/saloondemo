export interface ServiceItem {
  id: string;
  name: string;
  category: 'Cuts' | 'Colour' | 'Balayage' | 'Treatments' | 'Styling' | 'Occasion';
  tagline: string;
  description: string;
  startingPrice: string;
  numericPrice: number;
  duration: string;
  durationMinutes: number;
  image: string;
  featured?: boolean;
}

export interface StylistItem {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
  image: string;
  instagram: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Cuts' | 'Colour' | 'Balayage' | 'Styling';
  stylist: string;
  technique: string;
  image: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  service: string;
  location: string;
  stylist: string;
}

export interface MembershipOffer {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  perks: string[];
  ctaText: string;
  code?: string;
  active: boolean;
}

export const SALON_INFO = {
  brandName: "MAISON",
  brandSubtitle: "HAIR ATELIER",
  tagline: "Good Hair Changes Everything.",
  heroSupportingText: "Thoughtful cuts. Exceptional colour. A little time for yourself.",
  introHeadline: "A salon experience, considered.",
  address: "DLF Mall of India, Level 2, Sector 18, Noida, Uttar Pradesh 201301",
  city: "Noida",
  postalCode: "201301",
  country: "India",
  phone: "+91 97292 80731",
  whatsapp: "+91 97292 80731",
  email: "concierge@maison-atelier.com",
  openingHoursDisplay: "Open Today · 10:30 — 21:30",
  schedule: [
    { days: "Monday – Friday", hours: "10:30 – 21:30" },
    { days: "Saturday – Sunday", hours: "10:00 – 22:00" },
  ],
  announcement: {
    enabled: false,
    text: "Complimentary bespoke scalp diagnostic ritual with all first-visit colour services",
    linkText: "Reserve Consultation",
    linkUrl: "#booking",
  },
  socials: {
    instagram: "https://instagram.com/maisonhairatelier",
    pinterest: "https://pinterest.com/maisonhairatelier",
    tiktok: "https://tiktok.com/@maisonhairatelier",
  },
};

export const SERVICES: ServiceItem[] = [
  {
    id: "precision-cut",
    name: "Precision Haircut & Finish",
    category: "Cuts",
    tagline: "Architectural proportions tailored to natural movement.",
    description: "In-depth facial architecture consultation, sensory botanical hair cleanse, sculptural precision scissor or razor cut, followed by our signature tailored blowout.",
    startingPrice: "From ₹1,800",
    numericPrice: 1800,
    duration: "60 mins",
    durationMinutes: 60,
    image: "/images/indian-precision-cut.jpg",
    featured: true,
  },
  {
    id: "signature-colour",
    name: "Signature Gloss & Tone",
    category: "Colour",
    tagline: "Multi-dimensional depth honoring strand health.",
    description: "Bespoke chromatic formulation matched to your skin undertones, ammonia-free luminous glaze infusion, and restorative post-treatment cuticle sealing ritual.",
    startingPrice: "From ₹3,500",
    numericPrice: 3500,
    duration: "105 mins",
    durationMinutes: 105,
    image: "/images/indian-colour-espresso.jpg",
    featured: true,
  },
  {
    id: "balayage-highlights",
    name: "Maison Balayage & Foilayage",
    category: "Balayage",
    tagline: "Artisan freehand sun-kissed illumination.",
    description: "Hand-painted dimensional transitions using gentle clay lighteners, seamless root shadow melt, customized tonal gloss, and bond-building infusion.",
    startingPrice: "From ₹6,500",
    numericPrice: 6500,
    duration: "150 mins",
    durationMinutes: 150,
    image: "/images/indian-balayage.jpg",
    featured: true,
  },
  {
    id: "botanical-scalp-treatment",
    name: "Botanical Scalp & Hair Ritual",
    category: "Treatments",
    tagline: "Therapeutic restoration in our quiet sanctuary.",
    description: "Micro-camera scalp diagnostic, cold-pressed botanical oil acupressure massage, warm aromatic herb steam infusion, and deep biomimetic lipid hair mask.",
    startingPrice: "From ₹2,800",
    numericPrice: 2800,
    duration: "45 mins",
    durationMinutes: 45,
    image: "/images/indian-treatment.jpg",
    featured: true,
  },
  {
    id: "editorial-blowout",
    name: "Signature Editorial Blowout",
    category: "Styling",
    tagline: "High-shine sculpted volume engineered to last.",
    description: "Clarifying wash, botanical thermal shield, and bespoke round-brush sculpting technique delivering bouncy movement and mirror-finish gloss.",
    startingPrice: "From ₹1,200",
    numericPrice: 1200,
    duration: "45 mins",
    durationMinutes: 45,
    image: "/images/indian-blowout.jpg",
  },
  {
    id: "mens-luxury-grooming",
    name: "Men's Precision Cut & Beard Architecture",
    category: "Cuts",
    tagline: "Sharp proportions tailored to facial contours and density.",
    description: "Comprehensive aesthetic consultation, scalp-cleansing wash, bespoke scissor-over-comb and razor graduation cut, hot-towel botanical beard conditioning ritual, and matte texture finish.",
    startingPrice: "From ₹1,500",
    numericPrice: 1500,
    duration: "45 mins",
    durationMinutes: 45,
    image: "/images/indian-mens-grooming.jpg",
    featured: true,
  },
  {
    id: "bridal-occasion",
    name: "Bridal & Occasion Atelier",
    category: "Occasion",
    tagline: "Bespoke couture hair architecture.",
    description: "Private aesthetic consultation, customized texture design, architectural chignon or romantic waves, and accessory placement for memorable occasions.",
    startingPrice: "From ₹8,500",
    numericPrice: 8500,
    duration: "90 mins",
    durationMinutes: 90,
    image: "/images/indian-bridal.jpg",
  },
];

export const STYLISTS: StylistItem[] = [
  {
    id: "ananya-roy",
    name: "Ananya Roy",
    role: "Founder & Master Stylist",
    experience: "14 Years Experience",
    bio: "Editorial fashion week lead stylist. Ananya specializes in architectural bobs, dry-cutting techniques, and creating effortless shapes that grow out gracefully.",
    specialties: ["Precision Bobs", "Dry Cutting", "Facial Architecture", "Quiet Luxury Styling"],
    image: "/images/indian-stylist-ananya.jpg",
    instagram: "@ananyaroy.atelier",
  },
  {
    id: "kabir-kapoor",
    name: "Kabir Kapoor",
    role: "Creative Director & Scissor Artist",
    experience: "12 Years Experience",
    bio: "Master trained with an editorial background in Milan and London. Kabir is revered for sculptural silhouettes, textured weightless cuts, and razor graduation for men and women.",
    specialties: ["Precision Geometry", "Razor Texturizing", "Men's Luxury Grooming", "Curly Sculpting"],
    image: "/images/indian-stylist-kabir.jpg",
    instagram: "@kabirkapoor.hair",
  },
  {
    id: "meera-sen",
    name: "Meera Sen",
    role: "Senior Balayage & Colour Master",
    experience: "9 Years Experience",
    bio: "Chromatic specialist skilled in tailored color formulas for dark lustrous hair. Meera crafts lived-in balayage, dimensional brunette micro-lights, and high-gloss corrective tonal transformations.",
    specialties: ["Sun-Kissed Balayage", "Dimensional Brunettes", "Lived-in Highlights", "Mirror Gloss Restorations"],
    image: "/images/indian-stylist-meera.jpg",
    instagram: "@meerasen.color",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Architectural Precision Bob",
    category: "Cuts",
    stylist: "Ananya Roy",
    technique: "Geometric blunt line with interior weight removal",
    image: "/images/indian-precision-cut.jpg",
    description: "A tailored chin-length silhouette cut dry to honor the hair's natural growth pattern and effortless movement.",
  },
  {
    id: "gal-2",
    title: "Golden Hour Honey Balayage",
    category: "Balayage",
    stylist: "Meera Sen",
    technique: "Clay lightener freehand ribbon placement",
    image: "/images/indian-balayage.jpg",
    description: "Multidimensional warm amber and caramel ribbons blending seamlessly from a soft natural shadow root.",
  },
  {
    id: "gal-3",
    title: "Deep Espresso Mirror Glaze",
    category: "Colour",
    stylist: "Meera Sen",
    technique: "Low-pH demi-permanent chromatic infusion",
    image: "/images/indian-colour-espresso.jpg",
    description: "Rich dark cacao with hazelnut micro-undertones that reflect ambient lighting with glass-like luster.",
  },
  {
    id: "gal-4",
    title: "Sculptural Contemporary Bridal Chignon",
    category: "Styling",
    stylist: "Ananya Roy",
    technique: "Textured architectural pin placement & pearl embellishment",
    image: "/images/indian-bridal.jpg",
    description: "Understated elegance for contemporary modern brides, balancing clean lines with delicate face-framing tendrils.",
  },
  {
    id: "gal-5",
    title: "Men's Taper & Beard Architecture",
    category: "Cuts",
    stylist: "Kabir Kapoor",
    technique: "Razor skin graduation & hot-towel conditioning",
    image: "/images/indian-mens-grooming.jpg",
    description: "Sculpted skin-fade graduation and contour-defined beard shaping tailored to masculine jawline structure.",
  },
  {
    id: "gal-6",
    title: "Editorial 90s Voluminous Blowout",
    category: "Styling",
    stylist: "Kabir Kapoor",
    technique: "Multi-barrel round brush tension set",
    image: "/images/indian-blowout.jpg",
    description: "Sensory layers with maximum root lift and cascading weightless movement.",
  },
  {
    id: "gal-7",
    title: "Botanical Sanctuary Scalp Protocol",
    category: "Cuts",
    stylist: "Atelier Team",
    technique: "Cold-pressed rosemary & cedarwood acupressure",
    image: "/images/indian-treatment.jpg",
    description: "A restorative head spa treatment focused on follicular health and nervous system calming.",
  },
  {
    id: "gal-8",
    title: "Dimensional Mocha & Chestnut Melt",
    category: "Colour",
    stylist: "Meera Sen",
    technique: "Low-ammonia chromatic gloss & fluid dimensional ribbons",
    image: "/images/indian-mocha-melt.jpg",
    description: "Multi-layered brunette tones with warm mocha undertones that catch ambient salon light with subtle brilliance.",
  },
  {
    id: "gal-9",
    title: "Signature Atelier Cut & Consultation",
    category: "Styling",
    stylist: "Kabir Kapoor",
    technique: "Bespoke facial geometry & customized dry-texturizing",
    image: "/images/indian-craft-consultation.jpg",
    description: "Unhurried consultative cut and blowout designed around natural facial contours and effortless movement.",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    quote: "Maison is everything a luxury salon should be: serene, architecturally stunning, and with stylists who truly understand bone structure. Ananya gave me the best bob of my life.",
    clientName: "Pooja Malhotra",
    service: "Precision Haircut",
    location: "Sector 15A, Noida",
    stylist: "Ananya Roy",
  },
  {
    id: "test-2",
    quote: "Finding Meera at DLF Mall of India was transformative. My caramel balayage looks effortless and luminous months after my appointment. The scalp ritual alone makes the visit worthwhile.",
    clientName: "Rhea Singhania",
    service: "Maison Balayage & Treatment",
    location: "Sector 50, Noida",
    stylist: "Meera Sen",
  },
  {
    id: "test-3",
    quote: "The quiet luxury ethos is real. No loud techno music, no hurried rush. Kabir took 15 minutes just exploring my hair texture before lifting a pair of shears. Perfection.",
    clientName: "Vikram Mehta",
    service: "Men's Luxury Grooming",
    location: "Sector 44, Noida",
    stylist: "Kabir Kapoor",
  },
];

export const EXPERIENCE_STEPS = [
  {
    step: "01",
    title: "The Dialogue & Diagnostic",
    subtitle: "We listen first",
    description: "Every appointment begins with unhurried conversation. We analyze facial geometry, personal routine, scalp health, and hair history over herbal infusion or espresso.",
  },
  {
    step: "02",
    title: "The Sensory Sanctuary",
    subtitle: "A mindful pause",
    description: "Move to our secluded acoustic wash suite with ambient lighting, ergonomic lie-flat chairs, and therapeutic acupressure scalp cleansing rituals.",
  },
  {
    step: "03",
    title: "The Tailored Craft",
    subtitle: "Precision meets artistry",
    description: "Whether sculptural dry cutting or hand-painted balayage illumination, each technique is executed with microscopic attention to strand integrity.",
  },
  {
    step: "04",
    title: "The Finishing Touch",
    subtitle: "Effortless confidence",
    description: "Sculpted finishing with custom thermal care, accompanied by transparent home maintenance advice so your hair looks salon-calibrated every single day.",
  },
];

export const MEMBERSHIP_OFFERS: MembershipOffer[] = [
  {
    id: "first-visit",
    badge: "First Visit Privilege",
    title: "The Welcome Atelier",
    subtitle: "20% privilege on your debut appointment",
    description: "Experience Maison with a bespoke consultation, precision cut or signature colour, and a complimentary botanical scalp diagnostic ritual.",
    perks: [
      "20% off your initial complete service",
      "Complimentary botanical scalp diagnostic & massage",
      "Take-home luxury mini travel elixir",
      "Personalized seasonal care roadmap",
    ],
    ctaText: "Claim First-Visit Privilege",
    code: "WELCOME20",
    active: true,
  },
  {
    id: "maison-prive",
    badge: "Limited Membership",
    title: "Maison Atelier Privé",
    subtitle: "Exclusive annual salon circle",
    description: "An intimate circle for dedicated clients seeking guaranteed peak-hour priority, quarterly complimentary treatment rituals, and bespoke seasonal gifting.",
    perks: [
      "Guaranteed priority booking with 48h notice",
      "Quarterly complimentary Scalp & Hair Rituals",
      "15% privilege across all take-home apothecary lines",
      "Invitations to private seasonal preview evenings",
    ],
    ctaText: "Inquire About Membership",
    active: true,
  },
];
