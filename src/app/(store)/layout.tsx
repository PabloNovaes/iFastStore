import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { itIT } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import LocalFont from "next/font/local";
import React from "react";
import "../globals.css";

const telegraf = LocalFont({
  src: [
    { path: "../../fonts/PPTelegraf-UltraLight.otf", weight: "200" },
    { path: "../../fonts/PPTelegraf-Regular.otf", weight: "400" },
  ],
  variable: "--font-telegraf",
});

// 1. MELHORIA DOS METADADOS PARA INDEXAÇÃO
export const metadata: Metadata = {
  metadataBase: new URL("https://ifaststore.it"),
  title: {
    default: "iFast Store | iPhone, Notebook e Accessori Originali",
    template: "%s | iFast Store",
  },
  description:
    "Trasforma la tua esperienza digitale su iFast Store. Acquista iPhone, Notebook, AirPods e accessori originali con garanzia e spedizione rapida.",
  keywords: ["iPhone", "AirPods", "Apple Italia", "Notebook", "Smartphone"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true, // GARANTE QUE O GOOGLE POSSA INDEXAR
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://ifaststore.it/",
    siteName: "iFast Store",
    images: [
      {
        url: "/assets/banner.png",
        width: 1200,
        height: 630,
        alt: "iFast Store Banner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionClaims } = auth();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "iFast Store",
        url: "https://ifaststore.it/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://ifaststore.it/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "iFast Store",
        url: "https://ifaststore.it/",
        logo: "https://ifaststore.it/fast-store-icon.svg",
        sameAs: [
          "https://instagram.com/ifaststoreit",
          "https://facebook.com/ifaststoreit",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@ifaststore.it",
        },
      },
    ],
  };

  return (
    //@ts-ignore
    <ClerkProvider localization={itIT}>
      {/* 2. CORREÇÃO: lang="it" em vez de "en" */}
      <html lang="it" className={telegraf.variable} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/assets/icons/fast-store-icon.svg" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`${telegraf.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header isAdmin={sessionClaims?.metadata.role === "admin"} />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
