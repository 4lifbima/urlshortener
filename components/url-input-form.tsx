"use client"

import * as React from "react"
import { useState } from "react"
import { Link2, Shuffle, Loader2, Check, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isValidUrl, generateSlug } from "@/lib/utils"
import toast from "react-hot-toast"

interface URLInputFormProps {
    onSuccess?: (url: { id: string; original_url: string; short_slug: string }) => void
}

export function URLInputForm({ onSuccess }: URLInputFormProps) {
    const [url, setUrl] = useState("")
    const [customSlug, setCustomSlug] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [createdUrl, setCreatedUrl] = useState<{ original_url: string; short_slug: string } | null>(null)
    const [copied, setCopied] = useState(false)

    const handleGenerateSlug = () => {
        setCustomSlug(generateSlug(6))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url) {
            toast.error("Please enter a URL")
            return
        }

        if (!isValidUrl(url)) {
            toast.error("Please enter a valid URL (include https://)")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/urls", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    original_url: url,
                    custom_slug: customSlug || undefined,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create short URL")
            }

            setCreatedUrl({
                original_url: data.original_url,
                short_slug: data.short_slug,
            })

            toast.success("Short URL created successfully!")
            onSuccess?.(data)

            // Reset form
            setUrl("")
            setCustomSlug("")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const getShortUrl = (slug: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        return `${baseUrl}/${slug}`
    }

    const handleCopy = async () => {
        if (!createdUrl) return

        try {
            await navigator.clipboard.writeText(getShortUrl(createdUrl.short_slug))
            setCopied(true)
            toast.success("Copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Failed to copy")
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    Shorten Your URL
                </CardTitle>
                <CardDescription>
                    Paste your long URL and get a short, shareable link instantly
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Long URL</Label>
                        <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com/very/long/url/that/needs/to/be/shortened"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="custom-slug">Custom Slug (optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="custom-slug"
                                placeholder="my-custom-slug"
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleGenerateSlug}
                                disabled={isLoading}
                            >
                                <Shuffle className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Leave empty for auto-generated slug. Only letters, numbers, hyphens, and underscores allowed.
                        </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Link2 className="mr-2 h-4 w-4" />
                                Shorten URL
                            </>
                        )}
                    </Button>
                </form>

                {/* Result */}
                {createdUrl && (
                    <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-accent">
                        <p className="text-sm text-muted-foreground mb-2">Your short URL:</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 p-3 bg-background rounded-lg border">
                                <Link2 className="h-4 w-4 text-primary shrink-0" />
                                <span className="font-medium text-primary truncate">
                                    {getShortUrl(createdUrl.short_slug)}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
