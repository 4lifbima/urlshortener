import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
        .single()

    if (error || !urlData) {
        // Redirect to 404 page
        return NextResponse.redirect(new URL("/not-found", request.url))
    }

    // Increment click count
    await supabase
        .from("urls")
        .update({ clicks: supabase.rpc ? 1 : 1 }) // Will be handled by RPC or trigger
        .eq("id", urlData.id)

    // Actually increment the click count
    await supabase.rpc("increment_clicks", { url_id: urlData.id }).catch(() => {
        // Fallback: direct update if RPC doesn't exist
        supabase
            .from("urls")
            .select("clicks")
            .eq("id", urlData.id)
            .single()
            .then(({ data }) => {
                if (data) {
                    supabase
                        .from("urls")
                        .update({ clicks: (data.clicks || 0) + 1 })
                        .eq("id", urlData.id)
                }
            })
    })

    // Log analytics (optional)
    const userAgent = request.headers.get("user-agent") || ""
    const referer = request.headers.get("referer") || ""

    await supabase.from("url_analytics").insert({
        url_id: urlData.id,
        user_agent: userAgent,
        referrer: referer,
    }).catch(() => {
        // Silently fail if analytics table doesn't exist
    })

    // Redirect to the original URL
    return NextResponse.redirect(urlData.original_url)
}
