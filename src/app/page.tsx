'use client'

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { AppNavbar } from '@/components/navbar'

function LandingPage() {
  return (
    <AppNavbar>
      <div className="w-screen h-screen">
        <div className="container mx-auto p-8 pt-24">
          <h1 className="mb-4 text-center text-3xl font-bold">
            Check the navbar at the top of the container
          </h1>
          <p className="mb-10 text-center text-sm text-zinc-500">
            For demo purpose we have kept the position as{" "}
            <span className="font-medium">Sticky</span>. Keep in mind that this
            component is <span className="font-medium">fixed</span> and will not
            move when scrolling.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              {
                id: 1,
                title: "The",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 2,
                title: "First",
                width: "md:col-span-2",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 3,
                title: "Rule",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 4,
                title: "Of",
                width: "md:col-span-3",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 5,
                title: "F",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 6,
                title: "Club",
                width: "md:col-span-2",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 7,
                title: "Is",
                width: "md:col-span-2",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 8,
                title: "You",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 9,
                title: "Do NOT TALK about",
                width: "md:col-span-2",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
              {
                id: 10,
                title: "F Club",
                width: "md:col-span-1",
                height: "h-60",
                bg: "bg-neutral-100 dark:bg-neutral-800",
              },
            ].map((box) => (
              <div
                key={box.id}
                className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
              >
                <h2 className="text-xl font-medium">{box.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppNavbar>

  )
}

function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to AI Screens
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Generate beautiful mobile UI screens with AI
              </p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-2">Your Account</h2>
                  <p className="text-gray-600">Email: {user?.email}</p>
                  <p className="text-gray-600">User ID: {user?.id}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="space-x-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Create New Project
                    </Button>
                    <Button variant="outline">
                      View Projects
                    </Button>
                    <Button
                      variant="outline"
                      onClick={signOut}
                      className="text-red-600 hover:text-red-700"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
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