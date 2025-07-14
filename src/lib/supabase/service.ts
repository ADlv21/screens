import { createClient } from '@supabase/supabase-js'

// Service role client for admin operations (bypasses RLS)
export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

// For operations that need to bypass RLS
export async function uploadWithServiceRole(
    bucketName: string,
    filePath: string,
    content: string | Buffer,
    contentType: string = 'text/html'
) {
    try {
        const { data, error } = await supabaseServiceRole.storage
            .from(bucketName)
            .upload(filePath, content, {
                contentType,
                upsert: true,
            })

        if (error) {
            console.error('Service role upload error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Service role upload exception:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
} 