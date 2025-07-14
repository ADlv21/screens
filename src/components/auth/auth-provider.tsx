'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Function to subscribe new users to Free Plan
    const subscribeToFreePlan = async (user: User) => {
        try {
            const response = await fetch('/api/auth/signup-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to subscribe to Free Plan:', await response.text());
            } else {
                console.log('Successfully subscribed to Free Plan');
            }
        } catch (error) {
            console.error('Error subscribing to Free Plan:', error);
        }
    };

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                // Subscribe new users to Free Plan
                if (event === 'SIGNED_IN' && session?.user) {
                    // Check if this is a new user (created recently)
                    const userCreatedAt = new Date(session.user.created_at);
                    const now = new Date();
                    const timeDiff = now.getTime() - userCreatedAt.getTime();
                    const minutesDiff = timeDiff / (1000 * 60);

                    // If user was created less than 5 minutes ago, they're likely new
                    if (minutesDiff < 5) {
                        console.log('New user detected, subscribing to Free Plan...');
                        await subscribeToFreePlan(session.user);
                    }
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user,
        session,
        loading,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 