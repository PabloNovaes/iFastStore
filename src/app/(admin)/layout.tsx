import { ClerkProvider } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import { GeistSans } from "geist/font/sans";
import { redirect } from "next/navigation";

import { Header } from '@/components/dashboard/Header';
import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from '@/components/theme-provider';

import { DashboardDock } from '@/components/dashboard/Dock';
import { Metadata } from 'next';
import React from 'react';
import "../globals.css";



export const metadata: Metadata = {
    title: {
        template: "Admin | %s",
        default: "Admin"
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { sessionClaims } = auth();

    if (sessionClaims?.metadata.role !== "admin") {
        redirect("not-found");
    }

    return (
        <>
            <ClerkProvider>
                <html lang='pt-BR' className={GeistSans.className}>
                    <head>
                        <link rel="icon" href="/assets/icons/fast-store-icon.svg" sizes="any" />
                    </head>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <body>
                            <div className="flex w-full flex-col">
                                <div className="flex flex-col sm:gap-4 sm:py-4 custom-height sm:mb-[70px] mb-[80px]">
                                    <Header />
                                    {children}
                                    <DashboardDock/>
                                </div>
                                <Toaster />
                            </div>
                        </body>
                    </ThemeProvider>
                </html>
            </ClerkProvider>
        </>

    );
}
