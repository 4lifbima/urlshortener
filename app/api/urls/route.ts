import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateSlug } from "@/lib/utils"

export async function GET() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { original_url, custom_slug } = body

        if (!original_url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 })
        }

        // Validate URL
        try {
            new URL(original_url)
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
        }

        // Generate or use custom slug
        let short_slug = custom_slug || generateSlug(6)

        // Check if slug already exists
        const { data: existing } = await supabase
            .from("urls")
            .select("id")
            .eq("short_slug", short_slug)
            .single()

        if (existing) {
            if (custom_slug) {
                return NextResponse.json({ error: "This slug is already taken" }, { status: 400 })
            }
            // Generate a new random slug if the auto-generated one exists
            short_slug = generateSlug(8)
        }

        const { data, error } = await supabase
            .from("urls")
            .insert({
                user_id: user.id,
                original_url,
                short_slug,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
}
