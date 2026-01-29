"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Save, Shield, Mail, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function SettingsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [displayName, setDisplayName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
        // Initialize display name from user metadata
        if (user?.user_metadata?.display_name) {
            setDisplayName(user.user_metadata.display_name)
        } else if (user?.user_metadata?.full_name) {
            setDisplayName(user.user_metadata.full_name)
        }
    }, [user, loading, router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!displayName.trim()) {
            toast.error("Display name cannot be empty")
            return
        }

        setIsUpdatingProfile(true)

        try {
            const { error } = await supabase.auth.updateUser({
                data: { display_name: displayName.trim() }
            })

            if (error) throw error

            toast.success("Display name updated successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile")
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setIsUpdatingPassword(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            toast.success("Password updated successfully")
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update password")
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-12 max-w-4xl">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your account details and security preferences
                </p>
            </div>

            <div className="grid gap-8">
                {/* Profile Information */}
                <div className="luxury-card rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Profile Information</h2>
                            <p className="text-sm text-muted-foreground">Your account details</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                        {/* Display Name - Editable */}
                        <div className="space-y-2">
                            <Label htmlFor="display-name">Display Name</Label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="display-name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your display name"
                                    className="pl-10"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">This name will be visible to others.</p>
                        </div>

                        {/* Email - Read-only */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    value={user.email || ""}
                                    readOnly
                                    className="pl-10 bg-muted/50 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Email cannot be changed via settings.</p>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isUpdatingProfile}>
                                {isUpdatingProfile ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Password Update */}
                <div className="luxury-card rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Security</h2>
                            <p className="text-sm text-muted-foreground">Update your password</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Retype new password"
                            />
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isUpdatingPassword || !password}>
                                {isUpdatingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Password
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
