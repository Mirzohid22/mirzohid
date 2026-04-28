import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://mirzohid.dev"; // update to your actual domain when deployed

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mirzohid Salimov — Frontend Developer",
    template: "%s · Mirzohid Salimov",
  },
  description:
    "Frontend Developer from Tashkent, Uzbekistan with 4+ years of experience building B2B ERP systems and production web applications with React.js, Next.js, and TypeScript.",
  keywords: [
    "Mirzohid Salimov",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Tashkent",
    "Uzbekistan",
    "Web Developer",
    "Software Engineer",
  ],
  authors: [{ name: "Mirzohid Salimov", url: "https://github.com/Mirzohid22" }],
  creator: "Mirzohid Salimov",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mirzohid Salimov",
    title: "Mirzohid Salimov — Frontend Developer",
    description:
      "Frontend Developer from Tashkent, Uzbekistan with 4+ years of experience building B2B ERP systems and production web applications.",
    images: [
      {
        url: "/mirzohid.jpg",
        width: 400,
        height: 400,
        alt: "Mirzohid Salimov",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mirzohid Salimov — Frontend Developer",
    description:
      "Frontend Developer from Tashkent, Uzbekistan. React · Next.js · TypeScript.",
    images: ["/mirzohid.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-50/60 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
