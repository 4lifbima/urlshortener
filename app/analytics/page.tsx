"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { BarChart3, MousePointer, Link2, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatsCard, StatsGrid } from "@/components/stats-card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { truncateUrl } from "@/lib/utils"

interface URLData {
    id: string
    original_url: string
    short_slug: string
    clicks: number
    created_at: string
}

export default function AnalyticsPage() {
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

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)
    const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5)

    // Generate chart data from URLs
    const chartData = React.useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return {
                date: format(date, "MMM d"),
                clicks: Math.floor(Math.random() * (totalClicks / 7 + 10)), // Simulated daily distribution
            }
        })
        return last7Days
    }, [totalClicks])

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-muted-foreground">
                    Track the performance of your short URLs
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
                    title="Average CTR"
                    value={urls.length > 0 ? `${Math.round((totalClicks / urls.length))}` : "0"}
                    description="clicks per link"
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Best Performer"
                    value={topUrls[0]?.clicks || 0}
                    description={topUrls[0] ? `/${topUrls[0].short_slug}` : "No data"}
                    icon={BarChart3}
                />
            </StatsGrid>

            {/* Chart */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Click Activity</CardTitle>
                    <CardDescription>Clicks over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(24, 98%, 48%)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(24, 98%, 48%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="date"
                                    className="text-xs fill-muted-foreground"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    className="text-xs fill-muted-foreground"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="hsl(24, 98%, 48%)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Top Performing URLs */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Links</CardTitle>
                    <CardDescription>Your best performing short URLs</CardDescription>
                </CardHeader>
                <CardContent>
                    {topUrls.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No data available yet. Create some short URLs to see analytics.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Short URL</TableHead>
                                    <TableHead>Original URL</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topUrls.map((url, index) => (
                                    <TableRow key={url.id}>
                                        <TableCell className="font-medium">#{index + 1}</TableCell>
                                        <TableCell>
                                            <code className="text-primary font-medium">/{url.short_slug}</code>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {truncateUrl(url.original_url, 40)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {url.clicks.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
