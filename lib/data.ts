export const resumeData = {
  name: "Keith Vergara",
  title: "Full-Stack Web Developer",
  location: "Las Piñas City, Philippines",
  email: "kdv062997@gmail.com",
  phone: "0955-558-3927",
  website: "",
  github: "github.com/icodeninjaX",
  linkedin: "https://www.linkedin.com/in/keithvergara-dev/",

  summary:
    "Im a full-stack web developer with hands-on experience building internal tools, POS systems, and real-time monitoring platforms. Proficient in PHP, JavaScript, TypeScript, and modern frameworks like React and Next.js. Passionate about building practical, production-grade applications — from AI-powered financial tools to cooperative management systems.",

  quote: {
    text: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg",
  },

  experience: [
    {
      company: "X-META Technologies Inc.",
      shortName: "XM",
      role: "Full-Stack Web Developer",
      location: "",
      startDate: "Dec 2024",
      endDate: "Present",
      description: "Building a real-time device monitoring platform with dashboard interfaces for order tracking, ads management, and GPS-based device location mapping.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
    {
      company: "Internship",
      shortName: "IN",
      role: "Junior Web Developer",
      location: "",
      startDate: "Apr 2023",
      endDate: "Jul 2023",
      description: "Built a POS and CMS system for an LPG company with customer management, order processing, and SMS-based order routing to the nearest branch.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
  ],

  education: [
    {
      institution: "Dr. Filemon C. Aguilar Memorial College of Las Piñas - IT Campus",
      degree: "BS in Information Systems",
      location: "Las Piñas City",
      graduationDate: "",
      details: [],
    },
  ],

  skills: [
    { name: "JavaScript", level: 5 },
    { name: "PHP", level: 5 },
    { name: "HTML", level: 5 },
    { name: "CSS", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "MySQL", level: 4 },
    { name: "React", level: 4 },
    { name: "Next.js", level: 4 },
    { name: "Tailwind CSS", level: 4 },
    { name: "Git", level: 4 },
    { name: "GitHub", level: 4 },
    { name: "Node.JS", level: 3 },
    { name: "NPM", level: 3 },
    { name: "Vercel", level: 3 },
    { name: "WSL", level: 3 },
    { name: "Vite", level: 3 },
    { name: "Bun", level: 3 },
    { name: "Claude Code", level: 3 },
    { name: "Gemini", level: 3 },
    { name: "Codex", level: 3 },
    { name: "Supabase", level: 3 },
    { name: "PostgreSQL", level: 3 },
  ],

  projects: [
    {
      slug: "371admin",
      name: "371admin",
      description:
        "Web-based internal tool for X-META Technologies Inc. Real-time monitoring of online/offline devices, order tracking, and ads monitoring via a dashboard with GPS mapping for live device location.",
      details:
        "Dashboard-style interface featuring real-time device status monitoring (online/offline), order lifecycle tracking, advertisement management, and interactive GPS mapping for locating devices. Built with MVC architecture for clean separation of concerns.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      status: "current" as const,
      link: "",
      images: [
        "/images/371admin-maindashboard.png",
        "/images/371admin-maindashboard-1.png",
        "/images/371admin-odermonitoring-mainui.png",
        "/images/371admin-backend-alldevicemonitoring.png",
        "/images/371admin-backend-offlinedevices.png",
        "/images/371admin-backend-notinstalled.png",
        "/images/371admin-backend-simdata-monitoring.png",
        "/images/371admin-ads-listbooking.png",
        "/images/371admin-ads-bookingform.png",
        "/images/371admin-ads-dailymonitoringreport.png",
        "/images/371admin-ads-weeklymonitoring.png",
        "/images/371admin-ads-playplancalculator.png",
      ],
    },
    {
      slug: "new-z1on-lpg",
      name: "New Z1on LPG POS + CMS",
      description:
        "Point-of-sale and content management system for an LPG company. Handles customers, orders, and branch operations. Integrated with Semaphore SMS API to auto-route orders to the nearest branch.",
      details:
        "Complete business management solution with customer registration, order processing pipeline, inventory tracking, and multi-branch support. The SMS integration automatically determines the nearest branch using location data and sends order details for fulfillment.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      status: "internship" as const,
      link: "",
      images: [],
    },
    {
      slug: "tracky",
      name: "TRACKY",
      description:
        "AI-powered budget tracker for personal financial management. Features AI transaction parsing, receipt OCR, intelligent financial insights, dual AI integration, duplicate detection algorithms, and Google Auth.",
      details:
        "Production-grade architecture with dual AI integration for transaction parsing and receipt OCR. Implements sophisticated duplicate detection algorithms to prevent double-counting. Comprehensive financial tracking with category breakdown, spending trends, and AI-generated insights. Secured with Google OAuth authentication.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      status: "personal" as const,
      link: "https://budget-tracker-two-inky.vercel.app/",
      images: [
        "/images/tracky-maindashboard.png",
        "/images/tracky-transactions.png",
        "/images/tracky-recurring.png",
        "/images/tracky-budgets.png",
        "/images/tracky-savings.png",
        "/images/tracky-calendarview.png",
      ],
    },
    {
      slug: "coop-tracker",
      name: "Coop-Tracker",
      description:
        "Full-stack financial management platform for cooperative organizations with real-time sync, automated calculations, and mobile-first design.",
      details:
        "Handles member management, loan processing, savings tracking, and financial reporting for cooperatives. Features automated interest calculations, real-time data synchronization across devices, comprehensive validation with Zod schemas, and full test coverage with Jest.",
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      status: "personal" as const,
      link: "https://coop-tracker.vercel.app/",
      images: [
        "/images/coop-tracker-maindashboard.png",
        "/images/coop-tracker-members.png",
        "/images/coop-tracker-loans.png",
        "/images/coop-tracker-ledger.png",
        "/images/coop-tracker-shares.png",
        "/images/coop-tracker-archives.png",
      ],
    },
    {
      slug: "plantpal",
      name: "PlantPal",
      description:
        "Gardening hobby tracker for logging watering, fertilizer schedules, and plant details including scientific names. Features plant identification by photo. Currently available locally.",
      details:
        "Full CRUD application for managing your plant collection with watering and fertilizer scheduling. Includes an AI-powered plant identification feature — snap a photo and the system identifies the plant species, common name, and scientific name automatically.",
      tech: ["HTML", "CSS", "JavaScript", "HTMX", "MySQL"],
      status: "personal" as const,
      link: "",
      images: [],
    },
  ],
};
