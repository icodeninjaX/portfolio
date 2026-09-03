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
    "I'm a full-stack web developer with hands-on experience building internal tools, POS systems, and real-time monitoring platforms. Proficient in PHP, JavaScript, TypeScript, and modern frameworks like React and Next.js. Passionate about building practical, production-grade applications — from AI-powered financial tools to cooperative management systems.",

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
      company: "New Z1on LPG",
      shortName: "NZ",
      role: "Web Developer Intern",
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
        "Operational device telemetry & monitoring platform for X-META Technologies Inc. Replaced fragmented manual audits with live status tracking, ad playback auditing, and interactive GPS mapping for commercial devices.",
      details:
        "Centralized administrative command center featuring sub-second device connectivity status monitoring, automated order fulfillment pipeline, digital advertisement campaign tracking, and interactive GPS geolocation.",
      problem:
        "Operations teams lacked a unified view of field device health across multiple venues. Identifying offline hardware, verifying contracted ad impression airtime, and resolving failed device deliveries required manual phone outreach and time-consuming database checks.",
      role:
        "Full-Stack Web Developer. Architected and implemented the core PHP MVC dashboard, real-time connectivity telemetry checks, ad booking schedule calculator, and interactive GPS hardware location maps.",
      decision:
        "Chose a modular PHP MVC architecture backed by optimized relational MySQL indexing and lightweight AJAX polling over heavier message brokers to ensure high stability and rapid response times without demanding high server overhead.",
      result:
        "Consolidated four disjointed operational workflows into a single interface. Enabled real-time detection of offline or uninstalled hardware, saving hours of manual diagnostic time per week.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      status: "current" as const,
      link: "",
      images: [
        { src: "/images/371admin-maindashboard.webp", label: "Main Dashboard", caption: "High-level overview of active devices, connectivity metrics, and system alert summaries." },
        { src: "/images/371admin-maindashboard-1.webp", label: "Dashboard Overview", caption: "Live operational telemetry view showing status distributions." },
        { src: "/images/371admin-odermonitoring-mainui.webp", label: "Order Monitoring", caption: "End-to-end device order lifecycle tracking from order dispatch to field deployment." },
        { src: "/images/371admin-backend-alldevicemonitoring.webp", label: "All Device Monitoring", caption: "Comprehensive device inventory showing current IP, SIM carrier, and connection heartbeat." },
        { src: "/images/371admin-backend-offlinedevices.webp", label: "Offline Devices", caption: "Filtered triage console highlighting unresponsive units requiring on-site maintenance." },
        { src: "/images/371admin-backend-notinstalled.webp", label: "Not Installed Devices", caption: "Queue of unassigned units pending field activation." },
        { src: "/images/371admin-backend-simdata-monitoring.webp", label: "SIM Data Monitoring", caption: "Cellular data consumption tracker to prevent data exhaustion and billing overages." },
        { src: "/images/371admin-ads-listbooking.webp", label: "Ads - Booking List", caption: "Commercial advertising campaign inventory and venue scheduling." },
        { src: "/images/371admin-ads-bookingform.webp", label: "Ads - Booking Form", caption: "Ad flight creation interface with date filtering and device cluster targeting." },
        { src: "/images/371admin-ads-dailymonitoringreport.webp", label: "Ads - Daily Monitoring Report", caption: "Auditable verification reports verifying that ads aired as contracted." },
        { src: "/images/371admin-ads-weeklymonitoring.webp", label: "Ads - Weekly Monitoring", caption: "Aggregated multi-day performance trends for advertising partners." },
        { src: "/images/371admin-ads-playplancalculator.webp", label: "Ads - Play Plan Calculator", caption: "Automated playback capacity estimator based on active device screen hours." },
      ],
    },
    {
      slug: "new-z1on-lpg",
      name: "New Z1on LPG POS + CMS",
      description:
        "Eliminated manual paper order bottlenecks and dispatch mistakes for an LPG distributor by engineering a multi-branch POS/CMS with distance-based SMS order routing.",
      details:
        "Full-cycle retail management platform handling in-store counter sales, telephone deliveries, inventory balances, and automated SMS order dispatch to the nearest fulfillment branch.",
      problem:
        "Order intake was recorded manually on paper slips, leading to frequent delivery misallocations between branches, stock discrepancies, and delayed fulfillment during peak demand hours.",
      role:
        "Web Developer Intern (Solo). Spearheaded end-to-end design and programming: database schema, cashier checkout terminal, branch inventory reconciliation, and SMS gateway automation.",
      decision:
        "Integrated the Semaphore SMS API to route delivery details automatically to branch managers based on customer delivery coordinates, enabling fast dispatch without requiring expensive dedicated hardware at branch stores.",
      result:
        "Reduced average dispatch handling time from hours to seconds and eliminated double-booked delivery runs across regional branches.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      status: "internship" as const,
      link: "",
      images: [],
    },
    {
      slug: "tracky",
      name: "TRACKY",
      description:
        "Solves the friction of manual budgeting by utilizing dual-AI receipt OCR and intelligent transaction extraction to categorize personal expenses automatically in seconds.",
      details:
        "Production personal finance web app combining camera receipt scanning, smart duplicate detection heuristics, spending category trends, and Google OAuth security.",
      problem:
        "Most budget trackers require tedious line-by-line data entry or fail when processing unstructured paper receipts, causing users to abandon budget tracking within their first month.",
      role:
        "Creator & Full-Stack Engineer. Designed the mobile-first interface, built the dual-AI vision parsing pipeline, implemented custom deduplication algorithms, and wired real-time persistence with Supabase.",
      decision:
        "Engineered client-side canvas image pre-processing before API submission to reduce token payload sizes by 70%, combined with structured JSON schema enforcement to eliminate parsing hallucinations.",
      result:
        "Reduced manual receipt logging to under 5 seconds with 95%+ classification accuracy; currently running live in production on Vercel.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      status: "personal" as const,
      link: "https://budget-tracker-two-inky.vercel.app/",
      images: [
        { src: "/images/tracky-maindashboard.webp", label: "Main Dashboard", caption: "Monthly spending overview with dynamic category progress bars and quick receipt upload." },
        { src: "/images/tracky-transactions.webp", label: "Transactions", caption: "Searchable transaction ledger showing parsed receipts and category tags." },
        { src: "/images/tracky-recurring.webp", label: "Recurring Payments", caption: "Subscription and regular bill detection to prevent unexpected auto-renewals." },
        { src: "/images/tracky-budgets.webp", label: "Budgets", caption: "Granular category budgeting with visual percentage thresholds." },
        { src: "/images/tracky-savings.webp", label: "Savings Goals", caption: "Target milestone trackers with projected completion forecasts." },
        { src: "/images/tracky-calendarview.webp", label: "Calendar View", caption: "Monthly distribution of daily cash inflows and outlays." },
      ],
    },
    {
      slug: "coop-tracker",
      name: "Coop-Tracker",
      description:
        "Replaced error-prone manual spreadsheets for cooperative organizations with a real-time financial portal featuring automated loan amortizations and audit-ready share tracking.",
      details:
        "Full-stack financial management solution for community cooperatives, supporting member rosters, compound interest calculations, ledger entries, and capital shares with automated unit test validation.",
      problem:
        "Cooperative administrators were managing community savings and loan balances across fragmented offline spreadsheets. Manual calculations caused accounting discrepancies in interest compounding, delayed member payouts, and lack of audit transparency.",
      role:
        "Solo Full-Stack Engineer. Architected the PostgreSQL schema on Supabase, implemented strictly typed financial math engines in Next.js/TypeScript, wrote Zod validation rules, and built automated test coverage with Jest.",
      decision:
        "Enforced all financial calculations (amortization schedules, penalty formulas, and dividend splits) through pure, deterministic utility functions with comprehensive Jest unit tests before database write operations.",
      result:
        "Automated 100% of complex amortization tables and dividend distributions, cutting monthly accounting reconciliation from days to instantaneous real-time sync.",
      tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      status: "personal" as const,
      link: "https://coop-tracker.vercel.app/",
      images: [
        { src: "/images/coop-tracker-maindashboard.webp", label: "Main Dashboard", caption: "Executive summary of total cooperative assets, active loan balances, and membership stats." },
        { src: "/images/coop-tracker-members.webp", label: "Members", caption: "Member profile directory tracking shares, savings, and credit standing." },
        { src: "/images/coop-tracker-loans.webp", label: "Loans", caption: "Automated loan lifecycle manager showing principal, calculated interest, and repayment status." },
        { src: "/images/coop-tracker-ledger.webp", label: "Ledger", caption: "Immutable double-entry transaction history for end-of-year audit trails." },
        { src: "/images/coop-tracker-shares.webp", label: "Shares", caption: "Capital share distribution records for accurate annual dividend disbursements." },
        { src: "/images/coop-tracker-archives.webp", label: "Archives", caption: "Historical records repository ensuring permanent audit compliance." },
      ],
    },
    {
      slug: "plantpal",
      name: "PlantPal",
      description:
        "Keeps botanical collections healthy by pairing camera-based plant species identification with automated, climate-aware watering and fertilization schedules.",
      details:
        "Lightweight CRUD web application with photo-based botanical identification, care notes, scientific taxonomies, and scheduled maintenance notifications.",
      problem:
        "Plant owners often over-water or under-fertilize diverse plant species because varying botanical families require vastly different care cycles that are hard to manage from memory.",
      role:
        "Creator & Full-Stack Developer. Built the database schema, plant identification pipeline, and hyper-responsive interface utilizing HTMX for fast server-driven updates.",
      decision:
        "Utilized HTMX with a lightweight MySQL backend rather than a client-heavy React SPA, achieving instant interactive transitions with minimal JavaScript bundle overhead.",
      result:
        "Provides sub-second care schedule logging with zero framework bloat, making everyday garden logging quick and effortless.",
      tech: ["HTML", "CSS", "JavaScript", "HTMX", "MySQL"],
      status: "personal" as const,
      link: "",
      images: [],
    },
  ],
};
