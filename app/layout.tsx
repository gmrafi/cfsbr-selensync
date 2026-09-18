import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import FloatingAIAssistant from "@/components/floating-ai-assistant"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "SelenSync - CLPS Lunar South Pole Mission & Communication Browser",
  description:
    "Intuitive 3D Lunar South Pole Mission & Communication Window Browser for CLPS Operations. NASA Space Apps Challenge 2026.",
  generator: "SelenSync",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <FloatingAIAssistant />
      </body>
    </html>
  )
}
