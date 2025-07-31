import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import fitnessApp from "@/../public/images/fitness.png"

export function Hero() {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <Badge className="mb-6 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Trusted by 10,000+ developers
                    </Badge>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Turn Ideas Into{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Beautiful Mobile UIs
                        </span>{" "}
                        in Seconds
                    </h1>

                    <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Describe your app, and our AI will generate beautiful, production-ready mobile UI screens in seconds. No
                        more wireframes, no more waiting.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold group"
                        >
                            Start Creating - Free
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg group bg-transparent"
                        >
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Demo
                        </Button>
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="text-center">
                                <div className="bg-slate-800 rounded-lg p-6 mb-4">
                                    <div className="text-sm text-slate-400 mb-2">Your Idea</div>
                                    <div className="text-slate-200 font-medium">
                                        &ldquo;A fitness app with workout tracking and social features&rdquo;
                                    </div>
                                </div>
                                <div className="text-slate-400 text-sm">Describe in plain English</div>
                            </div>

                            <div className="flex justify-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 mb-4 border border-slate-700">
                                    <Image
                                        src={fitnessApp}
                                        alt="Generated mobile UI"
                                        width={96}
                                        height={160}
                                        className="w-24 h-40 mx-auto rounded-lg bg-slate-700"
                                    />
                                </div>
                                <div className="text-slate-400 text-sm">Beautiful UI in 30 seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
