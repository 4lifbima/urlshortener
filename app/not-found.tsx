import Link from "next/link"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileQuestion className="h-12 w-12 text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold">404</h1>
                    <h2 className="text-xl font-semibold text-muted-foreground">
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist or the short URL has expired.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
