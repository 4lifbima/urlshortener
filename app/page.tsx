import Link from "next/link"
import { ArrowRight, Link2, QrCode, BarChart3, Zap, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-sm font-medium">
              <Zap className="h-4 w-4 text-primary" />
              Fast, Free & Secure URL Shortening
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Shorten Links,{" "}
              <span className="gradient-text">Amplify Reach</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform long, complex URLs into short, memorable links.
              Track clicks, generate QR codes, and manage all your links in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t mt-12">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Links Created</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Clicks Tracked</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you manage and track your links effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">URL Shortening</h3>
                <p className="text-muted-foreground">
                  Create short, memorable links instantly. Custom slugs available for branded URLs.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code Generator</h3>
                <p className="text-muted-foreground">
                  Generate QR codes automatically for every link. Download in PNG or SVG format.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Click Analytics</h3>
                <p className="text-muted-foreground">
                  Track clicks in real-time. See detailed analytics and performance metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Instant redirects with minimal latency. Your links work at the speed of light.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  SSL encryption and reliable infrastructure. Your links are safe with us.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global CDN</h3>
                <p className="text-muted-foreground">
                  Links served from edge locations worldwide for the fastest experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Paste Your URL</h3>
              <p className="text-muted-foreground">
                Enter the long URL you want to shorten in the input field
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize (Optional)</h3>
              <p className="text-muted-foreground">
                Add a custom slug to make your link memorable and branded
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Everywhere</h3>
              <p className="text-muted-foreground">
                Copy your short link or QR code and share it anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to work together?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
          <Button size="lg" asChild className="rounded-xl px-8 gap-2 shadow-lg shadow-primary/20">
            <Link href="mailto:alifbima@example.com">
              Get In Touch
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Link2 className="h-4 w-4" />
              </div>
              <span className="text-xl ml-2">Shortify</span><span className="text-primary text-xl">URL</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ShortURL. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
