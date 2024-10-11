import { ClerkProvider } from '@clerk/nextjs';
import { auth } from "@clerk/nextjs/server";
import { GeistSans } from "geist/font/sans";
import { redirect } from "next/navigation";

import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Toaster } from "@/components/ui/sonner";

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
                    <body>
                        <div className="flex w-full flex-col">
                            <Sidebar />
                            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen">
                                <Header />
                                {children}
                            </div>
                            <Toaster />
                        </div>
                    </body>
                </html>
            </ClerkProvider>
        </>

    );
}
