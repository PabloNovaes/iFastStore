import { Header } from "@/components/Header";
import { ClerkProvider } from '@clerk/nextjs';

import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { itIT } from '@clerk/localizations';
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
    images: 'https://ifaststore.it/assets/banner.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { sessionClaims } = auth();

  return (
    <ClerkProvider localization={itIT}>
      <html lang="en" className={telegraf.className}>
        <link rel="icon" href="/assets/icons/fast-store-icon.svg" sizes="any" />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header isAdmin={sessionClaims?.metadata.role === "admin"} />
            {children}
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
