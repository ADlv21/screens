'use client'

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { AppNavbar } from '@/components/navbar'
import { AuthenticatedNavbar } from '@/components/authenticated-navbar'
import {
  Plus,
  FolderOpen,
  Sparkles,
  BarChart3,
  Clock,
  Download,
  Settings,
  LogOut
} from 'lucide-react'

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
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />

      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Creations</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-chart-2/10">
                <FolderOpen className="h-4 w-4 text-chart-2" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-chart-3/10">
                <BarChart3 className="h-4 w-4 text-chart-3" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-chart-4/10">
                <Clock className="h-4 w-4 text-chart-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Created</p>
                <p className="text-2xl font-bold">2h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Project */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Create New Project</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new mobile UI project with AI-powered design generation.
            </p>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Recent Projects */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-chart-2/10">
                <FolderOpen className="h-5 w-5 text-chart-2" />
              </div>
              <h3 className="text-lg font-semibold">Recent Projects</h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="text-sm font-medium">E-commerce App</p>
                  <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Fitness Tracker</p>
                  <p className="text-xs text-muted-foreground">Updated 1 day ago</p>
                </div>
                <Button variant="ghost" size="sm">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View All Projects
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-chart-4/10">
                <Download className="h-5 w-5 text-chart-4" />
              </div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Generated new login screen</p>
                <p className="text-xs text-muted-foreground">E-commerce App • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="p-2 rounded-full bg-chart-2/10">
                <FolderOpen className="h-4 w-4 text-chart-2" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Created new project</p>
                <p className="text-xs text-muted-foreground">Fitness Tracker • 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="p-2 rounded-full bg-chart-3/10">
                <Download className="h-4 w-4 text-chart-3" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exported project templates</p>
                <p className="text-xs text-muted-foreground">Social Media App • 3 days ago</p>
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