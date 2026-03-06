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

  about: {
    bio: "I'm Keith Vergara, a full-stack web developer based in Las Piñas City, Philippines. I got into programming during college while pursuing my BS in Information Systems, and quickly realized that building things for the web was what I wanted to do. Since then, I've been constantly learning and shipping — from internal business tools to personal projects that solve real problems.",
    background: "My journey started with the basics — HTML, CSS, JavaScript, and PHP. During my internship, I built a complete POS and CMS system for an LPG company, which gave me hands-on experience with real business requirements. Now I'm working at X-META Technologies Inc., where I build and maintain a real-time device monitoring platform. Outside of work, I build personal projects like TRACKY (an AI-powered budget tracker) and Coop-Tracker (a cooperative management system).",
    interests: "When I'm not coding, I enjoy exploring new technologies, tinkering with AI tools, and finding ways to automate everyday tasks. I'm also into gaming and enjoy a good cup of coffee while debugging.",
    motivation: "What drives me as a developer is the ability to turn ideas into working software that people actually use. I love the problem-solving aspect of development — breaking down complex requirements into clean, maintainable code. There's something deeply satisfying about shipping a feature and seeing it work in production.",
    goals: "My career goal is to continue growing as a full-stack developer and eventually take on more senior and leadership roles. I want to work on products that make a real impact, whether that's in fintech, developer tools, or enterprise software. I'm also passionate about staying on the cutting edge — exploring AI integration, modern frameworks, and best practices in software engineering.",
  },

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

  journey: [
    {
      year: "College",
      title: "First Steps into Programming",
      description: "Started learning the fundamentals of programming during my BS in Information Systems. Got introduced to HTML, CSS, and basic JavaScript — and immediately got hooked on building things for the web.",
    },
    {
      year: "2023",
      title: "Internship — Real-World Experience",
      description: "Landed an internship where I built a full POS and CMS system for an LPG company from scratch. This was my first taste of working with real business requirements — handling customer data, order processing, and integrating SMS APIs for branch routing.",
    },
    {
      year: "2023–2024",
      title: "Self-Learning & Personal Projects",
      description: "After my internship, I doubled down on learning modern tools — React, Next.js, TypeScript, Tailwind CSS, and Supabase. Built personal projects like TRACKY (AI-powered budget tracker) and Coop-Tracker (cooperative management platform) to sharpen my skills and explore new technologies.",
    },
    {
      year: "2024",
      title: "Exploring AI & Modern Dev Tools",
      description: "Started integrating AI into my workflow and projects — using Claude Code, Gemini, and OpenAI Codex for development. Built features like AI transaction parsing, receipt OCR, and intelligent financial insights into TRACKY.",
    },
    {
      year: "Dec 2024",
      title: "Joined X-META Technologies Inc.",
      description: "Started my role as a Full-Stack Web Developer, building a real-time device monitoring platform with dashboard interfaces, order tracking, ads management, and GPS-based device location mapping.",
    },
    {
      year: "Present",
      title: "Continuing to Grow",
      description: "Actively building, learning, and shipping. Focused on deepening my expertise in full-stack development, exploring new frameworks, and contributing to production-grade applications that solve real problems.",
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
        { src: "/images/371admin-maindashboard.webp", label: "Main Dashboard" },
        { src: "/images/371admin-maindashboard-1.webp", label: "Dashboard Overview" },
        { src: "/images/371admin-odermonitoring-mainui.webp", label: "Order Monitoring" },
        { src: "/images/371admin-backend-alldevicemonitoring.webp", label: "All Device Monitoring" },
        { src: "/images/371admin-backend-offlinedevices.webp", label: "Offline Devices" },
        { src: "/images/371admin-backend-notinstalled.webp", label: "Not Installed Devices" },
        { src: "/images/371admin-backend-simdata-monitoring.webp", label: "SIM Data Monitoring" },
        { src: "/images/371admin-ads-listbooking.webp", label: "Ads - Booking List" },
        { src: "/images/371admin-ads-bookingform.webp", label: "Ads - Booking Form" },
        { src: "/images/371admin-ads-dailymonitoringreport.webp", label: "Ads - Daily Monitoring Report" },
        { src: "/images/371admin-ads-weeklymonitoring.webp", label: "Ads - Weekly Monitoring" },
        { src: "/images/371admin-ads-playplancalculator.webp", label: "Ads - Play Plan Calculator" },
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
        { src: "/images/tracky-maindashboard.webp", label: "Main Dashboard" },
        { src: "/images/tracky-transactions.webp", label: "Transactions" },
        { src: "/images/tracky-recurring.webp", label: "Recurring Payments" },
        { src: "/images/tracky-budgets.webp", label: "Budgets" },
        { src: "/images/tracky-savings.webp", label: "Savings Goals" },
        { src: "/images/tracky-calendarview.webp", label: "Calendar View" },
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
        { src: "/images/coop-tracker-maindashboard.webp", label: "Main Dashboard" },
        { src: "/images/coop-tracker-members.webp", label: "Members" },
        { src: "/images/coop-tracker-loans.webp", label: "Loans" },
        { src: "/images/coop-tracker-ledger.webp", label: "Ledger" },
        { src: "/images/coop-tracker-shares.webp", label: "Shares" },
        { src: "/images/coop-tracker-archives.webp", label: "Archives" },
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
