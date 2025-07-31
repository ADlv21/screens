"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AD</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                            AppDraft AI
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
                            How It Works
                        </a>
                        <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                            Pricing
                        </a>
                        <a href="#faq" className="text-slate-300 hover:text-white transition-colors">
                            FAQ
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" className="text-slate-300 hover:text-white">
                            Sign In
                        </Button>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white">
                            Start Creating - Free
                        </Button>
                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-800/50">
                        <nav className="flex flex-col space-y-4">
                            <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
                                How It Works
                            </a>
                            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                                Pricing
                            </a>
                            <a href="#faq" className="text-slate-300 hover:text-white transition-colors">
                                FAQ
                            </a>
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button variant="ghost" className="text-slate-300 hover:text-white justify-start">
                                    Sign In
                                </Button>
                                <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white">
                                    Start Creating - Free
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
