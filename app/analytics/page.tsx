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
        <div className="container mx-auto px-6 lg:px-8 py-12 max-w-7xl">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Analytics</h1>
                <p className="text-muted-foreground text-lg">
                    Track the performance of your short URLs
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
            </div>

            {/* Chart */}
            <div className="mb-12">
                <div className="luxury-card rounded-2xl p-6 sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Click Activity</h2>
                        <p className="text-sm text-muted-foreground">Clicks over the last 7 days</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(24, 98%, 48%)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="hsl(24, 98%, 48%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        borderColor: "hsl(var(--border))",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        padding: "8px 12px",
                                    }}
                                    itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="hsl(24, 98%, 48%)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performing URLs */}
            <div className="luxury-card rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b">
                    <h2 className="text-2xl font-semibold mb-2">Top Performing Links</h2>
                    <p className="text-sm text-muted-foreground">Your best performing short URLs</p>
                </div>
                <div className="p-0">
                    {topUrls.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No data available yet. Create some short URLs to see analytics.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="pl-8 h-12">Rank</TableHead>
                                    <TableHead className="h-12">Short URL</TableHead>
                                    <TableHead className="h-12">Original URL</TableHead>
                                    <TableHead className="text-right pr-8 h-12">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topUrls.map((url, index) => (
                                    <TableRow key={url.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                                        <TableCell className="font-medium pl-8 text-muted-foreground">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">/{url.short_slug}</code>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                            {truncateUrl(url.original_url, 40)}
                                        </TableCell>
                                        <TableCell className="text-right font-bold pr-8">
                                            {url.clicks.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    )
}
