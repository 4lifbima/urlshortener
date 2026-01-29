import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

    if (error) {
        return NextResponse.json({ error: "URL not found" }, { status: 404 })
    }

    return NextResponse.json(data)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { original_url, short_slug } = body

        const updateData: Record<string, string> = {}
        if (original_url) updateData.original_url = original_url
        if (short_slug) updateData.short_slug = short_slug

        const { data, error } = await supabase
            .from("urls")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
        .from("urls")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
