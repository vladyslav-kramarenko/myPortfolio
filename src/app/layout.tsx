import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ChatAgent from "./components/ChatAgent";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vladyslav Kramarenko | IT Systems & Automation Engineer",
  description: "Portfolio of Vladyslav Kramarenko, IT Systems & Automation Engineer specializing in workflow automation, cloud infrastructure, and data pipelines.",
  openGraph: {
    title: "Vladyslav Kramarenko | IT Systems & Automation Engineer",
    description: "IT Systems & Automation Engineer with 8+ years of experience. AWS Certified. Based in BC, Canada.",
    type: "website",
    locale: "en_CA",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vladyslav Kramarenko — IT Systems & Automation Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vladyslav Kramarenko | IT Systems & Automation Engineer",
    description: "IT Systems & Automation Engineer with 8+ years of experience. AWS Certified. Based in BC, Canada.",
    images: ["/og-image.png"],
  },
  authors: [{ name: "Vladyslav Kramarenko" }],
  keywords: ["IT Systems Engineer", "IT Automation", "AWS", "Vancouver", "BC", "Google Workspace", "Node.js", "TypeScript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme — runs before CSS */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||(!t&&!window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}}catch(e){}})();` }} />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <ChatAgent />
      </body>
    </html>
  );
}
