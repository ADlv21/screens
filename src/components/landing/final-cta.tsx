import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function FinalCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 text-center">
                        <div className="mb-8">
                            <Sparkles className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to transform your app ideas?</h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of developers who are shipping beautiful mobile apps faster than ever before. Start
                                creating stunning UIs in seconds, not days.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-12 py-4 text-xl font-semibold group"
                            >
                                Start Creating For Free
                                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">
                            <span>✓ No credit card required</span>
                            <span>✓ Generate your first screen in 60 seconds</span>
                            <span>✓ 20 free screens every month</span>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <p className="text-slate-500 text-sm">
                                Trusted by 10,000+ developers • 50,000+ screens generated • 4.9/5 rating
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
