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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your short URLs and track their performance
                </p>
            </div>

            {/* Stats */}
            <StatsGrid className="mb-8">
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

            {/* Create URL Form */}
            <div className="mb-8">
                <URLInputForm onSuccess={handleUrlCreated} />
            </div>

            {/* URL Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Links</h2>
                <URLTable
                    urls={urls}
                    onDelete={handleUrlDeleted}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
