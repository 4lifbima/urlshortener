import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ShortURL - Fast & Simple URL Shortener",
  description: "Transform long URLs into short, shareable links instantly. Free URL shortener with QR codes, analytics, and custom slugs.",
  keywords: ["url shortener", "link shortener", "qr code", "short link", "url tracker"],
  openGraph: {
    title: "ShortURL - Fast & Simple URL Shortener",
    description: "Transform long URLs into short, shareable links instantly.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: "!bg-card !text-card-foreground !border !shadow-lg",
                duration: 3000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
