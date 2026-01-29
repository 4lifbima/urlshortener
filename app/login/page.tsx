"use client"

import * as React from "react"
import { Suspense, useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Link2, Loader2, Mail, Lock, Github, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
    const supabase = useMemo(() => createClient(), [])

    // Show error from URL params (OAuth callback errors)
    useEffect(() => {
        const error = searchParams.get("error")
        if (error) {
            toast.error(decodeURIComponent(error))
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            if (data.user) {
                toast.success("Welcome back!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to sign in"
            toast.error(message)
            console.error("Login error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuthLogin = async (provider: "google" | "github") => {
        setIsOAuthLoading(provider)

        try {
            // Get the base URL - use NEXT_PUBLIC_BASE_URL for production, or current origin
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
            const redirectTo = `${baseUrl}/auth/callback`

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo,
                },
            })

            if (error) {
                throw error
            }

            // The user will be redirected to the OAuth provider
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to sign in"
            toast.error(message)
            console.error("OAuth error:", error)
            setIsOAuthLoading(null)
        }
    }

    const errorMessage = searchParams.get("error")

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                        <Link2 className="h-6 w-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{decodeURIComponent(errorMessage)}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                disabled={isLoading || isOAuthLoading !== null}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                disabled={isLoading || isOAuthLoading !== null}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || isOAuthLoading !== null}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleOAuthLogin("google")}
                        disabled={isLoading || isOAuthLoading !== null}
                    >
                        {isOAuthLoading === "google" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleOAuthLogin("github")}
                        disabled={isLoading || isOAuthLoading !== null}
                    >
                        {isOAuthLoading === "github" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Github className="mr-2 h-4 w-4" />
                        )}
                        GitHub
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

function LoginLoading() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                        <Link2 className="h-6 w-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <Suspense fallback={<LoginLoading />}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
