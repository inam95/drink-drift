import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Navbar } from "@/components/navbar";

import "./globals.css";

const modernNegra = localFont({
  src: "fonts/ModernNegra.ttf",
  display: "swap",
  variable: "--font-modern-negra"
});

const monaSans = localFont({
  src: "fonts/MonaSans.ttf",
  display: "swap",
  variable: "--font-sans"
});

const dmSerifText = localFont({
  src: "fonts/DMSerifText.ttf",
  display: "swap",
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Drink Drift",
  description: "Drink Drift"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monaSans.variable} ${modernNegra.variable} ${dmSerifText.variable} antialiased`}
      >
        <Navbar />
        <main className="container mx-auto">
          <NuqsAdapter>{children}</NuqsAdapter>
        </main>
      </body>
    </html>
  );
}
