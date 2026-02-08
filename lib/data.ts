export const resumeData = {
  name: "Keith Vergara",
  title: "Full-Stack Web Developer",
  location: "Las Piñas City, Philippines",
  email: "kdv062997@gmail.com",
  phone: "0955-558-3927",
  website: "",
  github: "github.com/icodeninjaX",
  linkedin: "",

  summary:
    "Full-stack web developer with hands-on experience building internal tools, POS systems, and real-time monitoring platforms. Proficient in PHP, JavaScript, TypeScript, and modern frameworks like React and Next.js. Passionate about building practical, production-grade applications — from AI-powered financial tools to cooperative management systems.",

  experience: [
    {
      company: "X-META Technologies Inc.",
      shortName: "XM",
      role: "Full-Stack Web Developer",
      location: "Philippines",
      startDate: "Dec 2024",
      endDate: "Present",
      highlights: [
        "Building a web-based backend management system for monitoring online/offline devices in real-time",
        "Developed a dashboard-style interface with order monitoring, ads monitoring, and GPS mapping for device location tracking",
        "Implemented real-time updates using Ajax and HTMX with an MVC architecture",
        "Tech stack: HTML, CSS, JavaScript, PHP, MySQL, Ajax, HTMX",
      ],
    },
    {
      company: "Internship",
      shortName: "IN",
      role: "Junior Web Developer",
      location: "Philippines",
      startDate: "Apr 2023",
      endDate: "Jul 2023",
      highlights: [
        "Built a POS + CMS system for New Z1on LPG, handling customer management, order processing, and branch operations",
        "Integrated Semaphore SMS API to automatically route orders to the nearest branch via SMS",
        "Developed a full local system using HTML, CSS, JavaScript, PHP, and MySQL",
      ],
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
    { name: "HTML/CSS", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "MySQL", level: 4 },
    { name: "React", level: 4 },
    { name: "Next.js", level: 4 },
    { name: "Tailwind CSS", level: 4 },
    { name: "HTMX", level: 4 },
    { name: "Git", level: 4 },
    { name: "Node.js", level: 3 },
    { name: "Supabase", level: 3 },
    { name: "PostgreSQL", level: 3 },
    { name: "Ajax", level: 4 },
    { name: "Jest", level: 3 },
    { name: "Zod", level: 3 },
    { name: "SQL", level: 4 },
  ],

  projects: [
    {
      name: "Backend Management System",
      description:
        "Web-based internal tool for X-META Technologies Inc. Real-time monitoring of online/offline devices, order tracking, and ads monitoring via a dashboard with GPS mapping for live device location.",
      details:
        "Dashboard-style interface featuring real-time device status monitoring (online/offline), order lifecycle tracking, advertisement management, and interactive GPS mapping for locating devices. Built with MVC architecture for clean separation of concerns.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Ajax", "HTMX"],
      status: "live" as const,
      link: "",
    },
    {
      name: "New Z1on LPG POS + CMS",
      description:
        "Point-of-sale and content management system for an LPG company. Handles customers, orders, and branch operations. Integrated with Semaphore SMS API to auto-route orders to the nearest branch.",
      details:
        "Complete business management solution with customer registration, order processing pipeline, inventory tracking, and multi-branch support. The SMS integration automatically determines the nearest branch using location data and sends order details for fulfillment.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      status: "live" as const,
      link: "",
    },
    {
      name: "TRACKY",
      description:
        "AI-powered budget tracker for personal financial management. Features AI transaction parsing, receipt OCR, intelligent financial insights, dual AI integration, duplicate detection algorithms, and Google Auth.",
      details:
        "Production-grade architecture with dual AI integration for transaction parsing and receipt OCR. Implements sophisticated duplicate detection algorithms to prevent double-counting. Comprehensive financial tracking with category breakdown, spending trends, and AI-generated insights. Secured with Google OAuth authentication.",
      tech: ["React", "TypeScript", "Supabase"],
      status: "development" as const,
      link: "https://github.com/icodeninjaX",
    },
    {
      name: "Cooperative Management System",
      description:
        "Full-stack financial management platform for cooperative organizations with real-time sync, automated calculations, and mobile-first design.",
      details:
        "Handles member management, loan processing, savings tracking, and financial reporting for cooperatives. Features automated interest calculations, real-time data synchronization across devices, comprehensive validation with Zod schemas, and full test coverage with Jest.",
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "PostgreSQL", "Jest", "Zod"],
      status: "development" as const,
      link: "https://github.com/icodeninjaX",
    },
    {
      name: "Garden App",
      description:
        "Gardening hobby tracker for logging watering, fertilizer schedules, and plant details including scientific names. Features plant identification by photo. Currently available locally.",
      details:
        "Full CRUD application for managing your plant collection with watering and fertilizer scheduling. Includes an AI-powered plant identification feature — snap a photo and the system identifies the plant species, common name, and scientific name automatically.",
      tech: ["HTML", "CSS", "JavaScript", "HTMX", "MySQL"],
      status: "local" as const,
      link: "",
    },
  ],
};
