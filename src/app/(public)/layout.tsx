import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Molary Tech - Gerenciador Odontológico",
    description: "Sistema de gerenciamento para clínica odontológica",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="font-sans antialiased public-layout">{children}</body>
            </html>
        </ClerkProvider>
    )
}
