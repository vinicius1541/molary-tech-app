import type {Metadata} from "next";
import "../globals.css";
import React, {Suspense} from "react";
import {Sidebar} from "@/components/menu/sidebar";
import {Analytics} from "@vercel/analytics/next";
import {Geist, Geist_Mono} from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";


export const metadata: Metadata = {
    title: "Molary Tech - Gerenciador Odontológico",
    description: "Sistema de gerenciamento para clínica odontológica"
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
                <body className="font-sans antialiased private-layout">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-screen">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                    </div>
                }>
                    <div className="flex h-screen overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto ml-16 transition-all duration-300 bg-background">
                            <div className="container mx-auto p-6 md:p-8">{children}</div>
                        </main>
                    </div>
                </Suspense>
                <Toaster richColors position="top-right" />
                <Analytics />
                </body>
            </html>
        </ClerkProvider>
    )
}

