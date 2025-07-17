"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch by not rendering until mounted
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button
                size="icon"
                aria-label="Toggle theme"
                className="hover:text-foreground"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            </Button>
        )
    }

    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <Button
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={cn(isDark ? "bg-black hover:bg-gray-950 text-white" : "bg-gray-100 hover:bg-gray-200 text-black")}
        >
            {isDark ? (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
        </Button>
    )
}
