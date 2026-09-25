import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (latin subset, from Google Fonts). next/font/google fetches at
// build time and Turbopack fails when Google answers with `/l/font?kit=` URLs,
// which made Vercel builds flaky.
const inter = localFont({
  src: "./fonts/inter-var.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-var.woff2",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  variable: "--font-geist-mono",
  weight: "100 800",
  display: "swap",
});

const siteUrl = "https://keithvergara.dev";

export const metadata: Metadata = {
  title: "Keith Vergara | Full-Stack Web Developer",
  description:
    "Full-stack web developer specializing in PHP, JavaScript, TypeScript, React, and Next.js. Building real-time monitoring platforms, POS systems, and AI-powered applications.",
  keywords: [
    "Keith Vergara",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "PHP",
    "Portfolio",
  ],
  authors: [{ name: "Keith Vergara" }],
  creator: "Keith Vergara",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Keith Vergara | Full-Stack Web Developer",
    description:
      "Full-stack web developer specializing in PHP, JavaScript, TypeScript, React, and Next.js.",
    siteName: "Keith Vergara Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith Vergara | Full-Stack Web Developer",
    description:
      "Full-stack web developer specializing in PHP, JavaScript, TypeScript, React, and Next.js.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Keith Vergara",
    jobTitle: "Full-Stack Web Developer",
    url: siteUrl,
    email: "mailto:kdv062997@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Las Pinas City",
      addressCountry: "PH",
    },
    sameAs: [
      "https://github.com/icodeninjaX",
      "https://www.linkedin.com/in/keithvergara-dev/",
    ],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "PHP",
      "React",
      "Next.js",
      "MySQL",
      "PostgreSQL",
      "Tailwind CSS",
      "HTMX",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
