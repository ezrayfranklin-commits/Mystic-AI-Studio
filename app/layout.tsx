import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BRAND_NAME, SITE_URL } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | AI Tarot, Horoscope, Dreams`,
    template: `%s | ${BRAND_NAME}`
  },
  description:
    "A production-ready AI divination website template with tarot, horoscope, dream interpretation, compatibility readings, and mock mode.",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    siteName: BRAND_NAME,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
