import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Check if Supabase credentials are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If credentials are not set or are placeholder values, skip auth check
    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('your-project-id') ||
        supabaseKey.includes('your-anon-key')) {

        // Still redirect protected routes to login in demo mode
        if (
            request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/analytics')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('demo', 'true')
            return NextResponse.redirect(url)
        }

        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/analytics'))
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
