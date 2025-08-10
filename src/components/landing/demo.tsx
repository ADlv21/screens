import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import fitnessApp from "@/../public/images/fitness.png"
import weatherApp from "@/../public/images/weather-app.png"

const demoCategories = [
    {
        name: "E-commerce",
        description: "Product listings, shopping carts, checkout flows",
        image: "/placeholder.svg",
    },
    {
        name: "Social",
        description: "Feeds, profiles, messaging, social interactions",
        image: "/placeholder.svg",
    },
    {
        name: "Weather App",
        description: "App with current weather, forecast, and location search",
        image: weatherApp,
    },
    {
        name: "Finance",
        description: "Banking, budgeting, investment tracking",
        image: "/placeholder.svg",
    },
    {
        name: "Health & Fitness",
        description: "Workout tracking, nutrition, wellness apps",
        image: "/placeholder.svg",
    },
]

export function Demo() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Interactive Preview</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">See the magic in action</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Explore examples of AI-generated mobile interfaces across different app categories
                    </p>
                </div>

                <div className="mb-16">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Before & After</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-2">Input Description:</div>
                                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                            <p className="text-slate-200">
                                                &ldquo;Create a fitness app with a dashboard showing today&apos;s workout, progress charts, and a social
                                                feed where users can share their achievements&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                                        <div className="text-slate-400 text-sm">30 seconds later</div>
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-2">Generated Result:</div>
                                        <div className="text-slate-200">
                                            ✅ Complete dashboard with workout stats
                                            <br />✅ Interactive progress charts
                                            <br />✅ Social feed with user posts
                                            <br />✅ Navigation and proper spacing
                                            <br />✅ Mobile-optimized touch targets
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-2xl rounded-full" />
                                    <Image
                                        src={fitnessApp}
                                        alt="Generated fitness app UI"
                                        className="relative w-60 h-96 rounded-2xl shadow-2xl border border-slate-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-center mb-8">Popular App Categories</h3>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {demoCategories.map((category, index) => (
                            <div
                                key={index}
                                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                            >
                                <div className="mb-4">
                                    <Image
                                        src={category.image || "/placeholder.svg"}
                                        width={100}
                                        height={100}
                                        alt={`${category.name} app example`}
                                        className="w-20 h-40 mx-auto rounded-lg bg-slate-800 border border-slate-700"
                                    />
                                </div>
                                <h4 className="font-semibold text-white mb-2 group-hover:text-slate-100">{category.name}</h4>
                                <p className="text-sm text-slate-400 group-hover:text-slate-300">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold group"
                    >
                        Try It Yourself - Free
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
