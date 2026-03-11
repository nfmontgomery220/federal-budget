import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  title: "Wartime Budget Tracker | Real-Time U.S. Military Spending Analysis",
  description: "Track U.S. military spending across active global conflicts including Ukraine, Israel, Indo-Pacific, and CENTCOM operations. FY2026 defense budget analysis with real-time data from USAspending.gov.",
  generator: "v0.app",
  keywords: [
    "military spending",
    "defense budget",
    "Ukraine aid",
    "Israel aid",
    "federal budget",
    "conflict spending",
    "FY2026 budget",
    "USAspending",
    "Pentagon budget",
    "wartime spending",
    "Indo-Pacific",
    "NATO",
    "defense appropriations",
  ],
  authors: [{ name: "Budget Builder Project" }],
  creator: "Budget Builder Project",
  publisher: "Budget Builder Project",
  metadataBase: new URL("https://wartime.budgetbuilder.org"),
  alternates: {
    canonical: "https://wartime.budgetbuilder.org",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wartime.budgetbuilder.org",
    siteName: "Wartime Budget Tracker",
    title: "Wartime Budget Tracker | Real-Time U.S. Military Spending Analysis",
    description: "Track U.S. military spending across active global conflicts. FY2026 defense budget analysis with $995B total spending breakdown by operation, weapons systems, and aid packages.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wartime Budget Tracker - U.S. Military Spending Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wartime Budget Tracker | U.S. Military Spending Analysis",
    description: "Real-time tracking of $995B FY2026 defense spending across Ukraine, Israel, Indo-Pacific & global operations.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Government & Politics",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
