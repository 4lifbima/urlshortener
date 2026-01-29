"use client"

import * as React from "react"
import { useState } from "react"
import { Copy, Check, Trash2, ExternalLink, MoreHorizontal, QrCode } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QRCodeInline } from "@/components/qr-code-display"
import { truncateUrl, formatNumber } from "@/lib/utils"
import toast from "react-hot-toast"

interface URLData {
    id: string
    original_url: string
    short_slug: string
    clicks: number
    created_at: string
}

interface URLTableProps {
    urls: URLData[]
    onDelete?: (id: string) => void
    isLoading?: boolean
}

export function URLTable({ urls, onDelete, isLoading }: URLTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const getShortUrl = (slug: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")
        return `${baseUrl}/${slug}`
    }

    const handleCopy = async (slug: string, id: string) => {
        try {
            await navigator.clipboard.writeText(getShortUrl(slug))
            setCopiedId(id)
            toast.success("Copied to clipboard!")
            setTimeout(() => setCopiedId(null), 2000)
        } catch {
            toast.error("Failed to copy")
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            const response = await fetch(`/api/urls/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete URL")
            }

            toast.success("URL deleted successfully")
            onDelete?.(id)
        } catch {
            toast.error("Failed to delete URL")
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                ))}
            </div>
        )
    }

    if (urls.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No URLs yet</p>
                <p className="text-sm">Create your first short URL above</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[40%]">Original URL</TableHead>
                        <TableHead>Short URL</TableHead>
                        <TableHead className="w-[60px] text-center">QR</TableHead>
                        <TableHead className="w-[80px] text-center">Clicks</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {urls.map((url) => (
                        <TableRow key={url.id}>
                            <TableCell className="font-mono text-sm">
                                <a
                                    href={url.original_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline flex items-center gap-1 max-w-[300px]"
                                    title={url.original_url}
                                >
                                    <span className="truncate">{truncateUrl(url.original_url, 40)}</span>
                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                                </a>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm font-medium text-primary">
                                        /{url.short_slug}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleCopy(url.short_slug, url.id)}
                                    >
                                        {copiedId === url.id ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <QRCodeInline url={getShortUrl(url.short_slug)} />
                            </TableCell>
                            <TableCell className="text-center">
                                <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                                    {formatNumber(url.clicks)}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(url.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleCopy(url.short_slug, url.id)}
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy URL
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={getShortUrl(url.short_slug)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Open Short URL
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(url.id)}
                                            className="text-destructive focus:text-destructive"
                                            disabled={deletingId === url.id}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {deletingId === url.id ? "Deleting..." : "Delete"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
