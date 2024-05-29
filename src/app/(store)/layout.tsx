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
    default: "iFast Store",
    template: "iFast Store | %s"
  },
  description: "Trasforma la tua esperienza digitale su iFast Store. Acquista iPhone, Notebook, AirPods e accessori originali. Scopri qualità e innovazione in ogni click!",
  keywords: ["iPhone", "AirPods", "comprare l'iphone", "Notebook"],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://ifaststore.it/',
    siteName: "iFast Store",
    title: {
      default: "iFast Store",
      template: "iFast Store | %s"
    },
    images: 'https://firebasestorage.googleapis.com/v0/b/upload-hub-fdabc.appspot.com/o/files%2Fbanner%20(2).png?alt=media&token=110cfd28-966f-45ee-96d6-1ceed7933459'
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
