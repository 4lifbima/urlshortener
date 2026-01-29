import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface UrlData {
    id: string
    original_url: string
    clicks?: number
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const supabase = await createClient()
    const { slug } = await params

    // Ignore API routes and static files
    if (slug.startsWith("api") || slug.startsWith("_next") || slug.includes(".")) {
        return NextResponse.next()
    }

    // Get the URL from database
    const { data: urlData, error } = await supabase
        .from("urls")
        .select("id, original_url")
        .eq("short_slug", slug)
        .single() as { data: UrlData | null; error: unknown }

    if (error || !urlData) {
        // Redirect to 404 page
        return NextResponse.redirect(new URL("/not-found", request.url))
    }

    // Increment click count using RPC or direct update
    try {
        await supabase.rpc("increment_clicks", { url_id: urlData.id })
    } catch {
        // Fallback: direct update if RPC doesn't exist
        const { data: currentData } = await supabase
            .from("urls")
            .select("clicks")
            .eq("id", urlData.id)
            .single() as { data: { clicks: number } | null }

        if (currentData) {
            await supabase
                .from("urls")
                .update({ clicks: (currentData.clicks || 0) + 1 })
                .eq("id", urlData.id)
        }
    }

    // Log analytics (optional)
    const userAgent = request.headers.get("user-agent") || ""
    const referer = request.headers.get("referer") || ""

    try {
        await supabase.from("url_analytics").insert({
            url_id: urlData.id,
            user_agent: userAgent,
            referrer: referer,
        })
    } catch {
        // Silently fail if analytics table doesn't exist
    }

    // Redirect to the original URL
    return NextResponse.redirect(urlData.original_url)
}
