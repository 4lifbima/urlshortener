import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatNumber } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: number | string
    description?: string
    icon?: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">
                            {typeof value === "number" ? formatNumber(value) : value}
                        </p>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                        {trend && (
                            <p
                                className={cn(
                                    "text-sm font-medium flex items-center gap-1",
                                    trend.isPositive ? "text-green-500" : "text-red-500"
                                )}
                            >
                                <span>{trend.isPositive ? "↑" : "↓"}</span>
                                {trend.value}% from last month
                            </p>
                        )}
                    </div>
                    {Icon && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

interface StatsGridProps {
    children: React.ReactNode
    className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                className
            )}
        >
            {children}
        </div>
    )
}
