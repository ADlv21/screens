import { AppNavbar } from "../navbar"
import { FeatureGrid } from "../feature-grid"
import { Button } from "../ui/button"
import { Sparkles, Smartphone, Zap } from "lucide-react"
import Link from "next/link"

const LandingPage = () => {
    return (
        <AppNavbar>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-16 pt-24">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                                <Smartphone className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Screen Generator
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            Transform your ideas into stunning mobile UI screens with AI.
                            Generate beautiful, responsive designs in seconds with just a text prompt.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/login">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="outline" size="lg">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                            Why Choose AI Screens?
                        </h2>
                        <FeatureGrid />
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
                            <div className="text-gray-600 dark:text-gray-300">Screens Generated</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                            <div className="text-gray-600 dark:text-gray-300">Design Patterns</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                            <div className="text-gray-600 dark:text-gray-300">Uptime</div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                            Ready to Create Amazing Mobile UIs?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Join thousands of developers already using AI Screens to build beautiful mobile interfaces.
                        </p>
                        <Link href="/auth/login">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Zap className="h-5 w-5 mr-2" />
                                Start Building Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppNavbar>
    )
}

export default LandingPage