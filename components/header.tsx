"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Link2, Menu, X, LayoutDashboard, BarChart3, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const pathname = usePathname()
    const { user, loading, signOut } = useAuth()

    const navLinks = user
        ? [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/analytics", label: "Analytics", icon: BarChart3 },
        ]
        : []

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8 max-w-7xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 font-bold text-xl transition-opacity hover:opacity-90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-lg shadow-primary/20">
                        <Link2 className="h-6 w-6" />
                    </div>
                    <span className="sm:inline text-xl tracking-tight">
                        Short<span className="text-primary">URL</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "text-muted-foreground"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {!loading && (
                        <>
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-border/50 hover:bg-accent/50 hover:border-border transition-all duration-200">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-sm font-bold">
                                                {user.email?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/60 shadow-xl shadow-primary/5">
                                        <div className="flex items-center gap-3 p-2 mb-2 bg-accent/30 rounded-lg">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">
                                                {user.email?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-semibold truncate">
                                                    My Account
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate w-full">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator className="my-1 opacity-50" />
                                        <DropdownMenuItem asChild className="rounded-lg focus:bg-accent cursor-pointer my-1 py-2.5">
                                            <Link href="/dashboard">
                                                <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-lg focus:bg-accent cursor-pointer my-1 py-2.5">
                                            <Link href="/analytics">
                                                <BarChart3 className="mr-2 h-4 w-4 text-primary" />
                                                Analytics
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-lg focus:bg-accent cursor-pointer my-1 py-2.5">
                                            <Link href="/settings">
                                                <User className="mr-2 h-4 w-4 text-primary" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1 opacity-50" />
                                        <DropdownMenuItem onClick={signOut} className="rounded-lg focus:bg-destructive/10 focus:text-destructive cursor-pointer my-1 py-2.5 text-destructive/80 font-medium">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden sm:flex items-center gap-3">
                                    <Button variant="ghost" asChild className="rounded-full px-6 hover:bg-accent/50">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                                        <Link href="/register">Get Started</Link>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2">
                    <div className="container mx-auto px-4 py-6 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium transition-colors active:scale-95",
                                    pathname === link.href
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-accent"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                href="/settings"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium hover:bg-accent transition-colors active:scale-95"
                            >
                                <User className="h-5 w-5" />
                                Settings
                            </Link>
                        )}
                        {!user && (
                            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                                <Button variant="outline" asChild className="w-full rounded-xl py-6 text-base">
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild className="w-full rounded-xl py-6 text-base shadow-lg shadow-primary/20">
                                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                        Get Started
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
