import type {Metadata} from "next";
import "./globals.css";
import React, {Suspense} from "react";
import {Sidebar} from "@/components/menu/sidebar";
import {Analytics} from "@vercel/analytics/next";
import {Geist, Geist_Mono} from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";


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
                <body className="font-sans antialiased">
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="flex h-screen overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 overflow-y-auto ml-16 transition-all duration-300">
                            <div className="container mx-auto p-6 md:p-8">{children}</div>
                        </main>
                    </div>
                </Suspense>
                <Analytics />
                </body>
            </html>
        </ClerkProvider>
    )
}

