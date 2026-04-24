import { Header } from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { itIT } from "@clerk/localizations";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import LocalFont from "next/font/local";
import React from "react";
import "../globals.css";

const telegraf = LocalFont({
  src: [
    {
      path: "../../fonts/PPTelegraf-UltraLight.otf",
    },
    {
      path: "../../fonts/PPTelegraf-Regular.otf",
    },
  ],
  variable: "--font-telegraf",
});

export const metadata: Metadata = {
  title: {
    default: "iFast Store",
    template: "iFast Store | %s",
  },
  description:
    "Trasforma la tua esperienza digitale su iFast Store. Acquista iPhone, Notebook, AirPods e accessori originali. Scopri qualità e innovazione in ogni click!",
  keywords: ["iPhone", "AirPods", "comprare l'iphone", "Notebook"],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://ifaststore.it/",
    siteName: "iFast Store",
    title: {
      default: "iFast Store",
      template: "iFast Store | %s",
    },
    images: "https://ifaststore.it/assets/banner.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        logo: "https://ifaststore.it/logo.png", // Certifique-se de que este arquivo existe
        sameAs: [
          "https://instagram.com/ifaststoreit", // Adicione suas redes sociais aqui
          "https://facebook.com/ifaststoreit",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@ifaststore.it",
        },
      },
      {
        "@type": "ItemList",
        name: "Categorie Principali",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Tutti i Prodotti",
            url: "https://ifaststore.it/products",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "iPhone",
            description:
              "Scopri l'ultima gamma di iPhone con sconti esclusivi.",
            url: "https://ifaststore.it/products/category/iphone",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Notebooks",
            description: "Portatili potenti per il lavoro e lo studio.",
            url: "https://ifaststore.it/products/category/notebooks",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Cuffie e AirPods",
            url: "https://ifaststore.it/products/category/headphone",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Accessori",
            url: "https://ifaststore.it/products/category/accessories",
          },
        ],
      },
    ],
  };

  const { sessionClaims } = auth();

  return (
    //@ts-ignore
    <ClerkProvider localization={itIT}>
      <html lang="en" className={telegraf.className}>
        <link rel="icon" href="/assets/icons/fast-store-icon.svg" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
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
