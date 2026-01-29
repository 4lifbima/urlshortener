import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Return a mock client if credentials are not configured
    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('your-project-id') ||
        supabaseKey.includes('your-anon-key')) {
        // Return a mock client for demo purposes
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({
                    data: { user: null, session: null },
                    error: { message: 'Please configure Supabase credentials in .env.local' }
                }),
                signUp: async () => ({
                    data: { user: null, session: null },
                    error: { message: 'Please configure Supabase credentials in .env.local' }
                }),
                signInWithOAuth: async () => ({
                    data: { url: null, provider: null },
                    error: { message: 'Please configure Supabase credentials in .env.local' }
                }),
                signOut: async () => ({ error: null }),
                onAuthStateChange: () => ({
                    data: { subscription: { unsubscribe: () => { } } }
                }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve({ data: [], error: null }),
                        single: () => Promise.resolve({ data: null, error: null }),
                    }),
                }),
                insert: () => ({
                    select: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: 'Configure Supabase first' } }),
                    }),
                }),
                update: () => ({
                    eq: () => Promise.resolve({ data: null, error: null }),
                }),
                delete: () => ({
                    eq: () => Promise.resolve({ error: null }),
                }),
            }),
            rpc: () => Promise.resolve({ data: null, error: null }),
        } as unknown as ReturnType<typeof createBrowserClient>
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
