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
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Link2 className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:inline">
                        Short<span className="text-primary">URL</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent",
                                pathname === link.href && "bg-accent text-accent-foreground"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {!loading && (
                        <>
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {user.email?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center gap-2 p-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {user.email?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium truncate max-w-[180px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/analytics" className="cursor-pointer">
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                Analytics
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild>
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
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent",
                                    pathname === link.href && "bg-accent text-accent-foreground"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <div className="flex flex-col gap-2 pt-2 border-t">
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild>
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
