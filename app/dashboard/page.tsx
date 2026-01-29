"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link2, BarChart3, MousePointer } from "lucide-react"
import { URLInputForm } from "@/components/url-input-form"
import { URLTable } from "@/components/url-table"
import { StatsCard, StatsGrid } from "@/components/stats-card"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface URLData {
    id: string
    original_url: string
    short_slug: string
    clicks: number
    created_at: string
}

export default function DashboardPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [urls, setUrls] = useState<URLData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUrls = useCallback(async () => {
        try {
            const response = await fetch("/api/urls")
            if (response.ok) {
                const data = await response.json()
                setUrls(data)
            }
        } catch (error) {
            console.error("Failed to fetch URLs:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
            return
        }

        if (user) {
            fetchUrls()
        }
    }, [user, loading, router, fetchUrls])

    const handleUrlCreated = (newUrl: { id: string; original_url: string; short_slug: string }) => {
        setUrls(prev => [{
            ...newUrl,
            clicks: 0,
            created_at: new Date().toISOString(),
        }, ...prev])
    }

    const handleUrlDeleted = (id: string) => {
        setUrls(prev => prev.filter(url => url.id !== id))
    }

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                    Manage your short URLs and track their performance
                </p>
            </div>

            {/* Stats */}
            <div className="mb-12">
                <StatsGrid>
                    <StatsCard
                        title="Total Links"
                        value={urls.length}
                        icon={Link2}
                    />
                    <StatsCard
                        title="Total Clicks"
                        value={totalClicks}
                        icon={MousePointer}
                    />
                    <StatsCard
                        title="Average Clicks"
                        value={urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
                        icon={BarChart3}
                    />
                </StatsGrid>
            </div>

            {/* Create URL Form */}
            <div className="mb-12">
                <div className="luxury-card rounded-2xl p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold mb-6">Create New Link</h2>
                    <URLInputForm onSuccess={handleUrlCreated} />
                </div>
            </div>

            {/* URL Table */}
            <div className="luxury-card rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b">
                    <h2 className="text-2xl font-semibold">Your Links</h2>
                </div>
                <div className="p-0">
                    <URLTable
                        urls={urls}
                        onDelete={handleUrlDeleted}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}
