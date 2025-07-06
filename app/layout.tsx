import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Federal Budget Analysis Tool | Fiscal Clarity",
    template: "%s | Fiscal Clarity",
  },
  description:
    "Interactive tools for analyzing the federal budget, exploring policy scenarios, and understanding fiscal impacts in the post-'One Big Beautiful Bill Act' era.",
  keywords: [
    "federal budget",
    "fiscal policy",
    "deficit reduction",
    "tax policy",
    "government spending",
    "economic analysis",
    "budget simulator",
  ],
  authors: [
    {
      name: "Fiscal Clarity Team",
    },
  ],
  creator: "Fiscal Clarity",
  publisher: "Fiscal Clarity",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fiscalclarity.info"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Federal Budget Analysis Tool | Fiscal Clarity",
    description:
      "Interactive tools for analyzing the federal budget, exploring policy scenarios, and understanding fiscal impacts.",
    url: "https://fiscalclarity.info",
    siteName: "Fiscal Clarity",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Federal Budget Analysis Tool | Fiscal Clarity",
    description:
      "Interactive tools for analyzing the federal budget, exploring policy scenarios, and understanding fiscal impacts.",
    creator: "@fiscalclarity",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
