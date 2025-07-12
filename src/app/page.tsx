'use client'

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import LandingPage from '@/components/pages/landing'
import Dashboard from '@/components/pages/dashboard'

const Page = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LandingPage />
}

export default Page