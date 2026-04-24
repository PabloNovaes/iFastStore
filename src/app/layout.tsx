import LocalFont from "next/font/local";
import React from "react";
import "./globals.css";

const telegraf = LocalFont({
  src: [
    {
      path: "../fonts/PPTelegraf-UltraLight.otf",
    },
    {
      path: "../fonts/PPTelegraf-Regular.otf",
    },
  ],
  variable: "--font-telegraf",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={telegraf.className}>
      <link rel="icon" href="/assets/icons/fast-store-icon.svg" sizes="any" />
      <body className="bg-black">{children}</body>
    </html>
  );
}
