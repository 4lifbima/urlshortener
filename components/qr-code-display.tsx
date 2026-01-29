"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import QRCode from "qrcode"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface QRCodeDisplayProps {
    url: string
    size?: number
    downloadName?: string
    trigger?: React.ReactNode
}

export function QRCodeDisplay({
    url,
    size = 200,
    downloadName = "qrcode",
    trigger,
}: QRCodeDisplayProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("")
    const [svgData, setSvgData] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const generateQR = async () => {
            setIsLoading(true)
            try {
                // Generate PNG data URL
                const dataUrl = await QRCode.toDataURL(url, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: "#f55b02",
                        light: "#ffffff",
                    },
                })
                setQrDataUrl(dataUrl)

                // Generate SVG string
                const svg = await QRCode.toString(url, {
                    type: "svg",
                    width: size,
                    margin: 2,
                    color: {
                        dark: "#f55b02",
                        light: "#ffffff",
                    },
                })
                setSvgData(svg)
            } catch (error) {
                console.error("Error generating QR code:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (url) {
            generateQR()
        }
    }, [url, size])

    const downloadPNG = () => {
        const link = document.createElement("a")
        link.download = `${downloadName}.png`
        link.href = qrDataUrl
        link.click()
    }

    const downloadSVG = () => {
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `${downloadName}.svg`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">View QR Code</span>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <img
                                src={qrDataUrl}
                                alt="QR Code"
                                className="h-6 w-6 rounded"
                            />
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code</DialogTitle>
                    <DialogDescription className="break-all">
                        {url}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                    {isLoading ? (
                        <div className="flex h-[200px] w-[200px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-xl bg-white p-4 shadow-lg">
                            <img
                                src={qrDataUrl}
                                alt="QR Code"
                                width={size}
                                height={size}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={downloadPNG} variant="outline" disabled={isLoading}>
                            <Download className="mr-2 h-4 w-4" />
                            PNG
                        </Button>
                        <Button onClick={downloadSVG} variant="outline" disabled={isLoading}>
                            <Download className="mr-2 h-4 w-4" />
                            SVG
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Inline QR code for table display
export function QRCodeInline({ url }: { url: string }) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("")

    useEffect(() => {
        const generateQR = async () => {
            try {
                const dataUrl = await QRCode.toDataURL(url, {
                    width: 40,
                    margin: 1,
                    color: {
                        dark: "#f55b02",
                        light: "#ffffff",
                    },
                })
                setQrDataUrl(dataUrl)
            } catch (error) {
                console.error("Error generating QR code:", error)
            }
        }

        if (url) {
            generateQR()
        }
    }, [url])

    if (!qrDataUrl) {
        return <div className="h-8 w-8 animate-pulse bg-muted rounded" />
    }

    return (
        <QRCodeDisplay
            url={url}
            downloadName={`qr-${url.split("/").pop()}`}
            trigger={
                <button className="h-8 w-8 rounded hover:ring-2 hover:ring-primary/50 transition-all">
                    <img src={qrDataUrl} alt="QR Code" className="h-8 w-8 rounded" />
                </button>
            }
        />
    )
}
