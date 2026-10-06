// Qualitative summaries of the existing case studies. Original numerical
// claims remain below for the owner's evidence review.
export const selectedWork = [
  { slug: "tracky", category: "Personal finance / AI", summary: "A clearer picture of everyday spending.", problem: "Make receipt capture and everyday budgeting easier to manage in one place.", contribution: "Designed the interface, receipt parsing pipeline, duplicate detection, and real-time persistence.", decision: "Pre-process receipt images before API submission and validate structured responses before saving transactions." },
  { slug: "coop-tracker", category: "Financial operations", summary: "Connected records for a cooperative.", problem: "Bring member records, loans, and capital shares together instead of managing separate spreadsheets.", contribution: "Built the PostgreSQL schema, typed financial calculations, validation, and member-facing workflows.", decision: "Keep financial calculations in deterministic functions, tested before database writes." },
  { slug: "371admin", category: "Internal business systems", summary: "One view of devices in the field.", problem: "Give operations teams a shared view of device health, deliveries, and advertisement schedules.", contribution: "Built the PHP MVC dashboard, connectivity checks, booking calculator, and GPS location maps.", decision: "Use a modular PHP and MySQL foundation with lightweight AJAX polling for operational updates." },
] as const;

export const buildLayers = [
  { name: "Interface", description: "Turn complex workflows into interfaces people can use.", evidence: "TRACKY’s receipt capture and budgeting views.", tech: ["React", "TypeScript", "Tailwind CSS"], slug: "tracky" },
  { name: "Application", description: "Give each workflow clear rules and reliable integrations.", evidence: "371admin’s booking logic; TRACKY’s AI receipt parsing.", tech: ["PHP", "JavaScript", "Next.js"], slug: "371admin" },
  { name: "Data", description: "Model the relationships behind the product.", evidence: "Coop-Tracker’s members, loans, shares, and financial calculations.", tech: ["PostgreSQL", "Supabase", "MySQL"], slug: "coop-tracker" },
];

export const resumeData = {
  name: "Keith Vergara",
  title: "Full-Stack Web Developer",
  introduction: "I build practical software, from business systems to AI-powered tools.",
  location: "Las Piñas City, Philippines",
  email: "kdv062997@gmail.com",
  phone: "0955-558-3927",
  website: "",
  github: "github.com/icodeninjaX",
  linkedin: "https://www.linkedin.com/in/keithvergara-dev/",

  summary:
    "I'm a full-stack web developer with hands-on experience building internal tools, POS systems, and real-time monitoring platforms. Proficient in PHP, JavaScript, TypeScript, and modern frameworks like React and Next.js. Passionate about building practical, production-grade applications, from AI-powered financial tools to cooperative management systems.",

  // Copy that only the resume page (/resume) uses.
  resume: {
    headline:
      "I build business software end to end, from the database to the interface, on a hardware and networking foundation I started in 2014.",
  },

  about: {
    bio: "I'm Keith Vergara, a full-stack web developer based in Las Piñas City, Philippines. My background in tech started from the ground up during a 2-year vocational program in hardware servicing and computer programming (earning NC II & NC IV qualifications), before pursuing my BS in Information Systems in college. Since then, I've been constantly learning and shipping, from internal business tools to personal projects that solve real problems.",
    background: "My journey started way before web development. I spent two years in a vocational program learning how computers actually work, from the hardware side, the networking side, and eventually the programming side with languages like Java, Turbo C, and VB6. That hands-on foundation carried me into college where I earned my BS in Information Systems, expanding into database design, systems analysis, IT security, and enterprise architectures while honing my focus on modern web applications. During my internship, I built a complete POS and CMS system for an LPG company, which gave me real-world experience. Now I'm at X-META Technologies Inc., building a real-time device monitoring platform, while shipping personal projects like TRACKY (AI-powered budget tracker) and Coop-Tracker on the side.",
    interests: "When I'm not coding, I enjoy exploring new technologies, tinkering with AI tools, and finding ways to automate everyday tasks. I'm also into gaming and enjoy a good cup of coffee while debugging.",
    motivation: "What drives me as a developer is the ability to turn ideas into working software that people actually use. I love the problem-solving aspect of development: breaking down complex requirements into clean, maintainable code. There's something deeply satisfying about shipping a feature and seeing it work in production.",
    interestList: ["AI tools", "Automation", "Gaming", "Coffee"],
    goals: "My career goal is to continue growing as a full-stack developer and eventually take on more senior and leadership roles. I want to work on products that make a real impact, whether that's in fintech, developer tools, or enterprise software. I'm also passionate about staying on the cutting edge, exploring AI integration, modern frameworks, and best practices in software engineering.",
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
      highlights: [
        "Built 371admin, the operations dashboard that brings device health, order fulfillment, ad campaigns, and GPS location into one interface.",
        "Implemented connectivity checks that flag offline and not-yet-installed field devices, replacing manual phone outreach and database lookups.",
        "Added SIM data monitoring so the team can spot cellular data exhaustion on deployed units before it becomes a billing or uptime problem.",
        "Wrote the ad booking and play-plan calculator, plus daily and weekly reports that show whether ads aired as contracted.",
      ],
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
      highlights: [
        "Designed and built a multi-branch POS and CMS on my own, from the database schema to the cashier checkout screen.",
        "Integrated the Semaphore SMS API to send each delivery order to the nearest branch automatically, replacing paper order slips.",
        "Added branch inventory reconciliation and customer records so stock and delivery history live in one system.",
      ],
    },
  ],

  // Grouped for the resume page (/resume). `core` marks the strongest skills.
  skillGroups: {
    software: [
      { label: "Languages", items: ["JavaScript", "TypeScript", "PHP", "HTML", "CSS", "SQL"], core: ["JavaScript", "PHP", "TypeScript"] },
      { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "HTMX", "Three.js"], core: ["React", "Next.js"] },
      { label: "Backend & data", items: ["PHP MVC", "Node.js", "MySQL", "PostgreSQL", "Supabase", "REST & SMS APIs"], core: ["MySQL"] },
      { label: "Tooling & delivery", items: ["Git", "GitHub", "Vercel", "Bun", "Vite", "NPM", "WSL", "Jest", "Zod"], core: ["Git"] },
      { label: "AI-assisted development", items: ["Claude Code", "Gemini", "OpenAI Codex", "Receipt OCR & structured output"], core: [] },
    ],
    hardware: [
      { label: "Computer hardware", items: ["PC assembly & disassembly", "Component diagnosis & repair", "Hardware troubleshooting", "OS & driver installation"], core: ["Hardware troubleshooting"] },
      { label: "Networking", items: ["LAN setup & cabling", "Network configuration", "Connectivity troubleshooting"], core: [] },
      { label: "Field devices & telemetry", items: ["Device health monitoring", "SIM & cellular data tracking", "GPS device mapping", "Install & deployment tracking"], core: ["Device health monitoring"] },
    ],
  },

  certifications: [
    { name: "NC II", detail: "Computer hardware servicing & networking", issuer: "TESDA · Vocational program", year: "2014–2016" },
    { name: "NC IV", detail: "Computer programming (Java, Turbo C, VB6)", issuer: "TESDA · Vocational program", year: "2014–2016" },
  ],

  journey: [
    {
      year: "2014–2016",
      title: "Vocational Foundation: Hardware to Code (NC II & NC IV)",
      description: "Where my path in tech truly began. Completed a 2-year vocational program that taught me computers from the ground up, starting with how the hardware works, how to fix it, and how networks connect everything together (NC II). From there, I moved into actual programming with languages like Java, Turbo C, and Visual Basic 6.0, learning how to think in logic before writing a single line of code (NC IV). It gave me the kind of foundation most developers skip, understanding the full picture from the physical machine all the way up to the software running on it.",
      kit: ["Hardware servicing", "Networking", "Java", "Turbo C", "VB6"],
    },
    {
      year: "College",
      title: "BS in Information Systems: Bridging Code & Business Systems",
      description: "Pursued my degree to connect technical software engineering with real-world business needs. On the software side, I deepened my knowledge in data structures, algorithms, database management, web design, and human-computer interaction. On the systems side, I explored systems analysis, enterprise architecture, IT security, and project management. Rather than just writing code in isolation, it taught me how software integrates into end-to-end business workflows, capped off with a two-part capstone project and a 500-hour industry practicum.",
      kit: ["Data structures", "Databases", "Systems analysis", "IT security", "Capstone"],
    },
    {
      year: "2023",
      title: "Internship: Real-World Experience",
      description: "Landed an internship where I built a full POS and CMS system for an LPG company from scratch. This was my first taste of working with real business requirements like handling customer data, order processing, and integrating SMS APIs for branch routing.",
      kit: ["PHP", "MySQL", "JavaScript", "SMS API"],
    },
    {
      year: "2023–2024",
      title: "Self-Learning & Personal Projects",
      description: "After my internship, I doubled down on learning modern tools like React, Next.js, TypeScript, Tailwind CSS, and Supabase. Built personal projects like TRACKY (AI-powered budget tracker) and Coop-Tracker (cooperative management platform) to sharpen my skills and explore new technologies.",
      kit: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    },
    {
      year: "2024",
      title: "Exploring AI & Modern Dev Tools",
      description: "Started integrating AI into my workflow and projects using Claude Code, Gemini, and OpenAI Codex for development. Built features like AI transaction parsing, receipt OCR, and intelligent financial insights into TRACKY.",
      kit: ["Claude Code", "Gemini", "Codex", "Receipt OCR"],
    },
    {
      year: "Dec 2024",
      title: "Joined X-META Technologies Inc.",
      description: "Started my role as a Full-Stack Web Developer, building a real-time device monitoring platform with dashboard interfaces, order tracking, ads management, and GPS-based device location mapping.",
      kit: ["PHP", "MySQL", "Realtime telemetry", "GPS mapping"],
    },
    {
      year: "Present",
      title: "Continuing to Grow",
      description: "Actively building, learning, and shipping. Focused on deepening my expertise in full-stack development, exploring new frameworks, and contributing to production-grade applications that solve real problems.",
      kit: ["Full stack", "AI integration", "Shipping"],
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
      slug: "atlas",
      name: "ATLAS",
      description:
        "A personal operating system connecting goals, tasks, knowledge, and finances with owner-scoped relationships and AI-assisted analysis.",
      details:
        "A Philippines-first life-management app bringing daily planning, money, debts, career applications, and weekly reflection into one workspace, with knowledge capture and a relationship graph.",
      problem:
        "Goals, daily tasks, financial records, and learning notes often live in separate tools. ATLAS connects those records so people can review priorities and follow their context across modules.",
      role:
        "Creator & Full-Stack Developer. Built the Next.js and Supabase application, responsive planning and finance workflows, knowledge workspace, owner-scoped graph, and evidence-backed analyst features.",
      decision:
        "Keep financial calculations deterministic and store pesos as integer centavos. Scope related records to the authenticated owner and ground AI-assisted analysis in retrieved evidence.",
      result:
        "Implemented a connected workspace for planning, finances, and reflection. The scoped MVP is in release-candidate validation, with authentication and database launch checks still pending.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
      status: "personal" as const,
      stage: "Release candidate",
      domain: "atlas.kdvwebsiteservices.com",
      link: "",
      source: "https://github.com/icodeninjaX/project-atlas",
      video: {
        mp4: "/videos/atlas-demo.mp4",
        webm: "/videos/atlas-demo.webm",
        poster: "/videos/atlas-demo-poster.webp",
        label: "ATLAS product demo: the emblem, the landing page, then the Today, Money, Tasks, Goals, Analyst, Capture, Career and Timeline screens on a phone.",
        caption: "A 34-second walkthrough of ATLAS, from the landing page to each of its eight views on a phone.",
      },
      mobileNote: "Captured on an Android phone, signed in to Keith's own ATLAS workspace.",
      mobileImages: [
        { src: "/images/atlas-mobile-app-today.webp", width: 780, height: 1628, label: "Today · phone", alt: "ATLAS Today screen on a phone: the Dayline card puts one task under Now, with a day-load ring showing 90 of 180 planned minutes.", caption: "The Today screen. The Dayline picks one thing to do now and explains why it comes first; Day load shows how much of the day is already planned." },
        { src: "/images/atlas-mobile-app-money.webp", width: 780, height: 1628, label: "Money · phone", alt: "ATLAS Accounts screen showing a total peso balance, how it is split, and stacked account cards for cash and an e-wallet.", caption: "Money. One total across accounts, how it is split by purpose, and a card per account with record, transfer and archive actions." },
        { src: "/images/atlas-mobile-app-tasks.webp", width: 780, height: 1628, label: "Tasks · phone", alt: "ATLAS Tasks screen with today's plan ring, time left, and scheduled tasks showing start time, duration and priority.", caption: "Tasks. Today's plan with time left and what's overdue, then scheduled tasks with their start time, duration and priority." },
        { src: "/images/atlas-mobile-app-goals.webp", width: 780, height: 1628, label: "Goals · phone", alt: "ATLAS Goals screen with active goals, milestone and progress stats, and a goal card showing 61% progress and the next milestone.", caption: "Goals. Progress updates itself from milestones, and each goal shows its target date, completion ring and what's up next." },
        { src: "/images/atlas-mobile-app-analyst.webp", width: 780, height: 1628, label: "Analyst · phone", alt: "ATLAS Analyst screen with a plain-language question box and a note that every figure is checked against its sources.", caption: "Analyst. Ask about your own records in plain words; ATLAS calculates the facts and checks every figure against its sources." },
        { src: "/images/atlas-mobile-app-capture.webp", width: 780, height: 1628, label: "Capture · phone", alt: "ATLAS Capture screen where up to five actions are described in plain text, then split into cards to review before saving.", caption: "Capture. Describe what happened in one message; ATLAS splits it into separate cards to review, correct, save or reject." },
        { src: "/images/atlas-mobile-app-career.webp", width: 780, height: 1628, label: "Career · phone", alt: "ATLAS Career screen showing an application pipeline with counts per stage and the next follow-up.", caption: "Career. Every job application tied to a stage, a date and one clear next action, as a list or a board." },
        { src: "/images/atlas-mobile-app-timeline.webp", width: 780, height: 1628, label: "Timeline · phone", alt: "ATLAS Life timeline screen counting recent moments and summarizing money in, money out and net for the period.", caption: "Timeline. A chronological record of choices, progress and money movement, with totals for the period in view." },
      ],
      images: [
        { src: "/images/atlas-landing-page.webp", width: 1440, height: 900, label: "Public landing page", caption: "ATLAS's public landing page at atlas.kdvwebsiteservices.com, featuring the System Core and introduction to the personal operating system." },
        { src: "/images/atlas-desktop-today.webp", width: 1440, height: 754, label: "Today", caption: "Today maps the day into a route: one task to do now, what comes next and later, and how much of the day is already planned." },
        { src: "/images/atlas-desktop-capture.webp", width: 1440, height: 754, label: "Capture", caption: "Universal Capture turns a plain-language note, photo, document or voice memo into separate cards to review. Nothing is saved until each card is confirmed." },
        { src: "/images/atlas-desktop-analyst.webp", width: 1440, height: 754, label: "Analyst", caption: "ATLAS Analyst answers questions about your own records, with every figure in an answer checked against its sources." },
        { src: "/images/atlas-desktop-tasks.webp", width: 1440, height: 754, label: "Tasks", caption: "Tasks keeps today small enough to finish, with time left, next up and overdue at a glance and tabs for upcoming, inbox and completed work." },
        { src: "/images/atlas-desktop-accounts.webp", width: 1440, height: 754, label: "Money · Accounts", caption: "Accounts shows where the money lives. Every total is an opening balance plus recorded movements, so it can always be explained." },
        { src: "/images/atlas-desktop-debts.webp", width: 1440, height: 752, label: "Money · Debts", caption: "Debt payoff: what is owed, what it costs each month and the order that clears it soonest, with avalanche, snowball and custom payoff plans compared side by side. Amounts and lender names are blurred." },
        { src: "/images/atlas-desktop-goals.webp", width: 1440, height: 752, label: "Goals", caption: "Goals track progress automatically from their milestones, with a completion ring, target date and what is up next for each goal." },
        { src: "/images/atlas-desktop-career.webp", width: 1440, height: 752, label: "Career", caption: "Career keeps every job application tied to a stage, a date and one clear next action, with how far applications get at each stage. Company names, roles and salaries are blurred." },
      ],
    },
    {
      slug: "kdv-website-services",
      name: "KDV Website Services",
      description:
        "A service website for Philippine businesses to explore websites, business dashboards, and custom web apps, review selected work, and start an inquiry.",
      details:
        "The public website for Keith's web development studio, with service pages, project case studies, a scroll-driven Three.js story, and a validated contact form.",
      problem:
        "Business owners need a clear way to understand the available services, see relevant work, and explain what their business needs before starting a project.",
      role:
        "Founder & Full-Stack Developer. Designed and built the service website, responsive layouts, project case studies, interactive homepage, and inquiry workflow.",
      decision:
        "Pair a scroll-driven Three.js story with accessible page content and reduced-motion support. Validate inquiries on the server with Zod and send contact emails through Resend.",
      result:
        "The public site brings service information, selected work, and project inquiries into one place at kdvwebsiteservices.com.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Resend"],
      status: "current" as const,
      kind: "Own studio",
      stage: "Live website",
      link: "https://kdvwebsiteservices.com/",
      source: "https://github.com/icodeninjaX/KDV-Website-Services",
      video: {
        mp4: "/videos/kdv-demo.mp4",
        webm: "/videos/kdv-demo.webm",
        poster: "/videos/kdv-demo-poster.webp",
        label: "KDV Website Services product film in 3D: a camera drifts through a storm of loose paperwork that snaps into a grid and becomes the KDV homepage, flies past floating screens for websites, dashboards and custom apps with their prices, and pulls back to a wall of client work before the call to start a project.",
        caption: "A 48-second film of KDV Website Services: from business chaos to a working system, then websites, dashboards and custom apps, with prices and timelines.",
      },
      mobileNote: "Captured on an Android phone from the live site at kdvwebsiteservices.com. Client dashboards appear blurred, as they do on the site itself.",
      mobileImages: [
        { src: "/images/kdv-mobile-home.webp", width: 780, height: 1568, label: "Homepage · phone", alt: "KDV Website Services homepage on a phone: papers flying above the headline Turn business chaos into a system that works, with Start a project and View selected work buttons.", caption: "The hero. Scattered paperwork flies above the promise, Turn business chaos into a system that works, with one clear call to start a project." },
        {"src": "/images/kdv-mobile-menu.webp", "width": 780, "height": 1688, "label": "Navigation · phone", "alt": "KDV Website Services expanded mobile navigation with links to services, work and contact.", "caption": "The homepage menu opened at phone width, showing the responsive navigation."},
        { src: "/images/kdv-mobile-problem.webp", width: 780, height: 1568, label: "Where it starts · phone", alt: "A grid of notebook pages and sticky notes snapping into order above the line Orders in a notebook. Payments in chat. A spreadsheet per branch.", caption: "Where it starts. As you scroll, the flying papers settle into a grid while the copy names the problem: orders in a notebook, payments in chat, a spreadsheet per branch." },
        { src: "/images/kdv-mobile-new-zion.webp", width: 780, height: 1568, label: "Paper to system · phone", alt: "The New Zion admin dashboard shown as proof under the heading New Zion ran on paper logs. Now its branches share one queue.", caption: "Paper to system. Real client work as proof: New Zion's branches moved from paper logs to one order queue, with the dashboard shown and its data blurred." },
        { src: "/images/kdv-mobile-websites.webp", width: 780, height: 1568, label: "Website creation · phone", alt: "The iPay International marketing site shown under the service heading The front door, with a starting price of 25,000 pesos and a 2 to 3 week timeline.", caption: "Website creation, The front door. Each service shows a real build (here iPay International), a starting price and a timeline, with links to the case study." },
        { src: "/images/kdv-mobile-dashboards.webp", width: 780, height: 1568, label: "Business dashboards · phone", alt: "The 371admin operations dashboard shown under the service heading The control room, with a starting price of 85,000 pesos and a 3 to 6 week timeline.", caption: "Business dashboards, The control room. Sales, orders and devices at a glance, shown with the 371admin operations dashboard, blurred, from X-META." },
      ],
      images: [
        { src: "/images/kdv-desktop-home.webp", width: 1440, height: 684, label: "Homepage", caption: "The hero on a desktop: a 3D storm of loose paperwork beside the promise, Turn business chaos into a system that works, with Start a project as the one clear action." },
        { src: "/images/kdv-desktop-problem.webp", width: 1440, height: 684, label: "Where it starts", caption: "As you scroll, the flying papers settle into an orderly grid while the copy names the problem: orders in a notebook, payments in chat, a spreadsheet per branch." },
        { src: "/images/kdv-desktop-new-zion.webp", width: 1440, height: 684, label: "Paper to system", caption: "Real client work as proof: New Zion's branches moved from paper logs to one shared order queue. Customer names on the dashboard are blurred." },
        { src: "/images/kdv-desktop-websites.webp", width: 1440, height: 684, label: "Website creation", caption: "Each service is shown with a real build, a starting price and a timeline. Website creation, The front door, is shown with the iPay International marketing site." },
        { src: "/images/kdv-desktop-dashboards.webp", width: 1440, height: 684, label: "Business dashboards", caption: "Business dashboards, The control room, shown with the 371admin operations dashboard built at X-META. Campaign details are blurred." },
      ],
    },
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
        { src: "/images/371admin-maindashboard.webp", width: 1423, height: 728, label: "Main Dashboard", caption: "High-level overview of active devices, connectivity metrics, and system alert summaries." },
        { src: "/images/371admin-maindashboard-1.webp", width: 1418, height: 729, label: "Dashboard Overview", caption: "Live operational telemetry view showing status distributions." },
        { src: "/images/371admin-odermonitoring-mainui.webp", width: 1419, height: 729, label: "Order Monitoring", caption: "End-to-end device order lifecycle tracking from order dispatch to field deployment." },
        { src: "/images/371admin-backend-alldevicemonitoring.webp", width: 1424, height: 729, label: "All Device Monitoring", caption: "Comprehensive device inventory showing current IP, SIM carrier, and connection heartbeat." },
        { src: "/images/371admin-backend-offlinedevices.webp", width: 1426, height: 727, label: "Offline Devices", caption: "Filtered triage console highlighting unresponsive units requiring on-site maintenance." },
        { src: "/images/371admin-backend-notinstalled.webp", width: 1426, height: 728, label: "Not Installed Devices", caption: "Queue of unassigned units pending field activation." },
        { src: "/images/371admin-backend-simdata-monitoring.webp", width: 1422, height: 725, label: "SIM Data Monitoring", caption: "Cellular data consumption tracker to prevent data exhaustion and billing overages." },
        { src: "/images/371admin-ads-listbooking.webp", width: 1428, height: 731, label: "Ads - Booking List", caption: "Commercial advertising campaign inventory and venue scheduling." },
        { src: "/images/371admin-ads-bookingform.webp", width: 1427, height: 730, label: "Ads - Booking Form", caption: "Ad flight creation interface with date filtering and device cluster targeting." },
        { src: "/images/371admin-ads-dailymonitoringreport.webp", width: 1422, height: 731, label: "Ads - Daily Monitoring Report", caption: "Auditable verification reports verifying that ads aired as contracted." },
        { src: "/images/371admin-ads-weeklymonitoring.webp", width: 1424, height: 728, label: "Ads - Weekly Monitoring", caption: "Aggregated multi-day performance trends for advertising partners." },
        { src: "/images/371admin-ads-playplancalculator.webp", width: 1425, height: 728, label: "Ads - Play Plan Calculator", caption: "Automated playback capacity estimator based on active device screen hours." },
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
      video: {
        mp4: "/videos/newzion-demo.mp4",
        webm: "/videos/newzion-demo.webm",
        poster: "/videos/newzion-demo-poster.webp",
        label: "New Zion LPG product film told as one business day: a running clock from 8 AM to 6 PM follows the first call, the old paper logs at five branches, orders from phone, walk-in and text landing in one queue, a receipt printing at the counter, LPG cylinders filling as stock counts, and the owner's sales report counting up to 2,325 pesos.",
        caption: "A 55-second film of New Zion's POS + CMS across one business day, from the first call to the owner's report. Shown with demo data.",
      },
      images: [
        { src: "/images/new-zion-dashboard.webp", width: 1440, height: 682, label: "Business overview", caption: "The admin dashboard: orders, customers, branches and products at a glance, today's new orders and customers, the top-selling cylinder, and the latest orders and registrations. Shown with demo data." },
        { src: "/images/new-zion-orders.webp", width: 1440, height: 682, label: "Order management", caption: "Every order from every branch in one directory, with pending, delivered and cancelled counts, search by customer, code, phone or product, and the branch and cashier behind each sale." },
        { src: "/images/new-zion-customers.webp", width: 1440, height: 682, label: "Customers", caption: "The customer directory keeps contact numbers, delivery addresses with landmarks and each household's tank size together, so phone-in orders can be dispatched without asking twice. Demo customers shown." },
        { src: "/images/new-zion-products.webp", width: 1440, height: 682, label: "Products", caption: "The catalog of cylinders, refills and accessories, with pricing, categories, linked LPG cylinder types and stock across branches." },
        { src: "/images/new-zion-inventory.webp", width: 1440, height: 682, label: "Inventory", caption: "Stock by product and branch: filled and empty cylinders, damaged and lost counts, and transfers between branches." },
        { src: "/images/new-zion-branches.webp", width: 1440, height: 682, label: "Branches", caption: "The branch network: each location with its address, contact number and operational records, so staff know where every order and cylinder sits. A customer's street address is blurred." },
        { src: "/images/new-zion-sales-report.webp", width: 1440, height: 682, label: "Sales report", caption: "The owner's report for any date range, branch, cashier or product: completed sales from delivered orders only, with every supporting transaction listed and export to CSV or PDF." },
        { src: "/images/new-zion-pos-dashboard.webp", width: 1440, height: 682, label: "Point of sale", caption: "The cashier's side is its own focused app: today's customers and orders at a glance, quick actions to add or find a customer and start an order, and recent customers." },
        { src: "/images/new-zion-pos-customers.webp", width: 1440, height: 682, label: "POS · customers", caption: "Cashiers find a customer by name, mobile number or code and start a new order in one tap. One real customer's details are blurred; the rest are demo records." },
        { src: "/images/new-zion-pos-order.webp", width: 1440, height: 682, label: "POS · new order", caption: "Building an order: pick the branch to see only its stock, browse by category, add products and place the order with the cashier recorded." },
      ],
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
      mobileImages: [
        { src: "/images/tracky-mobile-demo-dashboard.webp", width: 780, height: 1688, label: "Dashboard — phone demo", alt: "Tracky phone dashboard showing balances calculated from three synthetic demonstration transactions.", caption: "The real app running locally in a disposable offline workspace. All balances come from synthetic DEMO entries added through its manual-entry form; no personal finances or production services were used." },
        { src: "/images/tracky-mobile-demo-activity.webp", width: 780, height: 1688, label: "Activity — phone demo", alt: "Tracky phone transaction list containing DEMO-labeled earnings, groceries, and commute entries.", caption: "The actual Activity workflow with clearly labeled fictional transactions. Captured by scrolling the phone viewport, with no screenshot content or layout substituted." },
      ],
      images: [
        { src: "/images/tracky-maindashboard.webp", width: 1427, height: 728, label: "Main Dashboard", caption: "Monthly spending overview with dynamic category progress bars and quick receipt upload." },
        { src: "/images/tracky-transactions.webp", width: 1422, height: 736, label: "Transactions", caption: "Searchable transaction ledger showing parsed receipts and category tags." },
        { src: "/images/tracky-recurring.webp", width: 1435, height: 730, label: "Recurring Payments", caption: "Subscription and regular bill detection to prevent unexpected auto-renewals." },
        { src: "/images/tracky-budgets.webp", width: 1426, height: 729, label: "Budgets", caption: "Granular category budgeting with visual percentage thresholds." },
        { src: "/images/tracky-savings.webp", width: 1420, height: 728, label: "Savings Goals", caption: "Target milestone trackers with projected completion forecasts." },
        { src: "/images/tracky-calendarview.webp", width: 1423, height: 727, label: "Calendar View", caption: "Monthly distribution of daily cash inflows and outlays." },
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
      video: {
        mp4: "/videos/coop-demo.mp4",
        webm: "/videos/coop-demo.webm",
        poster: "/videos/coop-demo-poster.webp",
        label: "CoopTracker product demo in bold type and colour blocks: five scattered spreadsheets snap into a grid of live totals, six app screens cycle through a bento board, and the dividend of 53,640 pesos divided by 52 shares is set as headline type.",
        caption: "A 35-second walkthrough of CoopTracker: from five spreadsheets to one source of truth, six views of the app and the dividend math. Other members' names are blurred.",
      },
      mobileNote: "Captured on an Android phone from the live app, signed in as the cooperative's administrator. Other members' names are blurred.",
      mobileImages: [
        { src: "/images/coop-mobile-app-login.webp", width: 780, height: 1625, label: "Sign in · phone", alt: "CoopTracker sign-in screen on a phone with email and password fields, a Sign in button, and links to reset a password or create an account.", caption: "Sign in. Email and password with password reset and account creation." },
        { src: "/images/coop-mobile-app-dashboard.webp", width: 780, height: 1625, label: "Dashboard · phone", alt: "CoopTracker dashboard on a phone showing the cooperative's total peso balance, its growth chart for the cycle, and quick actions.", caption: "Dashboard. The cooperative's total balance and its trend through the cycle, with collections, disbursements and repayments, and quick actions to record, lend, open a period or export." },
        { src: "/images/coop-mobile-app-period.webp", width: 780, height: 1625, label: "Current period · phone", alt: "CoopTracker current-period card at 100 percent collected, with member, active-loan, pending and interest-pool counts.", caption: "Current period. How much of this period has been collected and who has paid, alongside member, active-loan, pending and interest-pool totals." },
        { src: "/images/coop-mobile-app-members.webp", width: 780, height: 1625, label: "Collections · phone", alt: "CoopTracker collection view on a phone with period chips, amount collected against expected, and paid, unpaid and forfeited filters.", caption: "Collections. Pick a period, compare collected against expected, then filter members by paid, unpaid or forfeited." },
        { src: "/images/coop-mobile-app-member-list.webp", width: 780, height: 1625, label: "Members · phone", alt: "CoopTracker member list on a phone showing each member's shares, capital and paid status, with other members' names blurred.", caption: "Members. Each member's shares and capital with this period's payment status and a one-tap undo." },
        { src: "/images/coop-mobile-app-loans.webp", width: 780, height: 1625, label: "Loans · phone", alt: "CoopTracker loans screen on a phone with outstanding balance, interest earned, status filters and cleared loans, with borrower names blurred.", caption: "Loans. Outstanding balance and interest earned, then every loan with its amount, monthly rate, term and repayment progress." },
        { src: "/images/coop-mobile-app-shares.webp", width: 780, height: 1625, label: "Shares · phone", alt: "CoopTracker shares screen on a phone dividing the interest pool by eligible shares into a per-share dividend, with an equity composition chart.", caption: "Shares. The interest pool divided across eligible shares into a per-share dividend, and equity split between paid-in capital and interest." },
        { src: "/images/coop-mobile-app-profile.webp", width: 780, height: 1625, label: "Profile · phone", alt: "CoopTracker profile settings on a phone with the profile picture, change and remove buttons, and the display name field.", caption: "Profile settings. Change the picture and the display name shown in the app." },
      ],
      images: [
        { src: "/images/coop-tracker-maindashboard.webp", width: 1425, height: 733, label: "Main Dashboard", caption: "Executive summary of total cooperative assets, active loan balances, and membership stats." },
        { src: "/images/coop-tracker-members.webp", width: 1424, height: 728, label: "Members", caption: "Member profile directory tracking shares, savings, and credit standing." },
        { src: "/images/coop-tracker-loans.webp", width: 1420, height: 729, label: "Loans", caption: "Automated loan lifecycle manager showing principal, calculated interest, and repayment status." },
        { src: "/images/coop-tracker-ledger.webp", width: 1423, height: 731, label: "Ledger", caption: "Immutable double-entry transaction history for end-of-year audit trails." },
        { src: "/images/coop-tracker-shares.webp", width: 1421, height: 730, label: "Shares", caption: "Capital share distribution records for accurate annual dividend disbursements." },
        { src: "/images/coop-tracker-archives.webp", width: 1423, height: 729, label: "Archives", caption: "Historical records repository ensuring permanent audit compliance." },
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
      domain: "kdv-garden.ct.ws",
      link: "",
      video: {
        mp4: "/videos/plantpal-demo.mp4",
        webm: "/videos/plantpal-demo.webm",
        poster: "/videos/plantpal-demo-poster.webp",
        label: "Garden product demo styled as a botanical field guide: a stem grows from a seed while each app screen is pressed onto the page like a specimen, ending with the whole plant in bloom.",
        caption: "A 36-second field guide to Garden: one continuous shot up a growing stem, with each screen pressed in like a specimen.",
      },
      mobileNote: "Captured in a phone browser on the live site at kdv-garden.ct.ws, signed in to Keith's own garden.",
      mobileImages: [
        { src: "/images/plantpal-mobile-app-login.webp", width: 780, height: 1519, label: "Log in · phone", alt: "Garden sign-in screen on a phone with the headline Welcome back, email and password fields, and a Log in button.", caption: "Sign in. A calm welcome-back screen with show/hide password, password reset and a link to start a new garden." },
        { src: "/images/plantpal-mobile-app-today.webp", width: 780, height: 1519, label: "Today · phone", alt: "Garden Today screen on a phone showing the garden's name and date, plants growing, and cards for plants to check for water or feed.", caption: "Today. The garden at a glance: how many plants are growing, which to check for water and which are ready for nourishment." },
        { src: "/images/plantpal-mobile-app-plants.webp", width: 780, height: 1519, label: "Plants · phone", alt: "Garden Plants screen on a phone with the plant count, an Add plant button, growing and retired tabs, and a plant search field.", caption: "Plants. The living collection, with growing and retired tabs and search by name, species or type." },
        { src: "/images/plantpal-mobile-app-calendar.webp", width: 780, height: 1519, label: "Calendar · phone", alt: "Garden Calendar screen on a phone showing October's care moments in an agenda view with month navigation.", caption: "Calendar. The month's care moments as an agenda or a month view, plus planting guidance for where you grow." },
        { src: "/images/plantpal-mobile-app-library.webp", width: 780, height: 1519, label: "Library · phone", alt: "Garden Plant library screen on a phone counting 87 care guides, with search and filters for plant type and experience.", caption: "Plant library. 87 care guides to search and filter by plant type and experience level." },
        { src: "/images/plantpal-mobile-app-activity.webp", width: 780, height: 1519, label: "Activity · phone", alt: "Garden activity log on a phone with filters for care type, plant and dates, listing two watering entries for okra.", caption: "Activity. Every bit of care logged per plant, filterable by care type, plant and date range." },
      ],
      images: [
        { src: "/images/plantpal-garden-landing.webp", width: 1440, height: 820, label: "Garden public landing page", caption: "PlantPal's current Garden branding, captured from the public landing page with reduced motion enabled." },
        { src: "/images/plantpal-desktop-water.webp", width: 1440, height: 700, label: "Landing · a little care", caption: "The scroll-driven landing story: water the seedling and it grows, with a chapter index and daylight and pause controls along the bottom." },
        { src: "/images/plantpal-desktop-grown.webp", width: 1440, height: 700, label: "Landing · your garden", caption: "The story's last chapter. The seedling has grown into a full plant, with a call to start your own garden or watch it again." },
        { src: "/images/plantpal-garden-library.webp", width: 1440, height: 820, label: "Garden plant library", caption: "The public care-guide library with plant search, experience, and light filters. No signed-in garden or personal records are shown." },
        { src: "/images/plantpal-desktop-today.webp", width: 1440, height: 700, label: "Today", caption: "Today greets you with the garden at a glance: how many plants, which need water or feeding, and a list of what needs checking with one-tap Watered, Remind tomorrow or Choose a date." },
        { src: "/images/plantpal-desktop-plants.webp", width: 1440, height: 700, label: "Plants", caption: "Plants is the living collection, searchable and filterable by recorded health and care, with retired plants kept separately." },
        { src: "/images/plantpal-desktop-calendar.webp", width: 1440, height: 700, label: "Calendar", caption: "Calendar lays out the care moments ahead as an agenda or month view, with planting guidance in its own tab." },
        { src: "/images/plantpal-desktop-library.webp", width: 1440, height: 700, label: "Library (signed in)", caption: "Inside the app, the plant library has 87 care guides, searchable by name and filtered by plant type, experience and light." },
        { src: "/images/plantpal-desktop-activity.webp", width: 1440, height: 700, label: "Activity", caption: "Activity is the garden's care log: every watering and feeding in one place, filterable by care type, plant and date range." },
        { src: "/images/plantpal-desktop-gardens.webp", width: 1440, height: 700, label: "Gardens", caption: "Gardens keeps separate growing spaces, each with its own plants, location and setting. The locations and the second garden's name are blurred." },
      ],
    },
  ],
};
