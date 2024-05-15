import { Header } from "@/components/Header";
import { ClerkProvider } from '@clerk/nextjs';

import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import LocalFont from "next/font/local";
import React from 'react';
import "../globals.css";

const telegraf = LocalFont({
  src: [
    {
      path: "../../fonts/PPTelegraf-UltraLight.otf",
    },
    {
      path: "../../fonts/PPTelegraf-Regular.otf",
    },

  ], variable: "--font-telegraf"
})

export const metadata: Metadata = {
  title: {
    default: "Fast Store",
    template: "Fast Store | %s"
  },
  description: "Trasforma la tua esperienza digitale su Fast Store. Acquista iPhone, Notebook, AirPods e accessori originali. Scopri qualità e innovazione in ogni click!",
  keywords: ["iPhone", "AirPods", "comprare l'iphone", "Notebook"],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://fast-store-test.vercel.app/',
    siteName: "Fast Store",
    title: {
      default: "Fast Store",
      template: "Fast Store | %s"
    },
    images: [
      '/assets/banner.png'
    ]

  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { sessionClaims } = auth();

  return (
    <ClerkProvider>
      <html lang="en" className={telegraf.className}>
        <link rel="icon" href="/assets/icons/fast-store-icon.svg" sizes="any" />
        <body>
          <Header isAdmin={sessionClaims?.metadata.role === "admin"} />
          {children}
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
