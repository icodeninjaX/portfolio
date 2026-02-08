import type { Metadata } from "next";
import { Poppins, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
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
      addressLocality: "Las Piñas City",
      addressCountry: "PH",
    },
    sameAs: ["https://github.com/icodeninjaX"],
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
        className={`${poppins.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
