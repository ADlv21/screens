import { Clock, Zap, CheckCircle } from "lucide-react"

export function ProblemSolution() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-red-400 mb-4">
                            <Clock className="w-8 h-8 mb-4" />
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Stop wasting hours on wireframes and mockups</h2>
                        </div>
                        <div className="space-y-4 text-slate-300">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <p>Designers spend 60% of their time on repetitive wireframing</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <p>Development teams wait weeks for initial mockups</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <p>Ideas lose momentum during the design phase</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-emerald-400 mb-4">
                            <Zap className="w-8 h-8 mb-4" />
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                Describe your app idea in plain English, get pixel-perfect mobile screens instantly
                            </h2>
                        </div>
                        <div className="space-y-4 text-slate-300">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p>Generate complete mobile screens in under 30 seconds</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p>Production-ready designs with proper spacing and typography</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p>Start building immediately with export-ready assets</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-red-400">Traditional Design Process</h3>
                            <div className="space-y-3 text-slate-300">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm font-bold">
                                        1
                                    </div>
                                    <span>Brainstorm and sketch ideas (2-3 days)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm font-bold">
                                        2
                                    </div>
                                    <span>Create wireframes (3-5 days)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm font-bold">
                                        3
                                    </div>
                                    <span>Design high-fidelity mockups (5-7 days)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm font-bold">
                                        4
                                    </div>
                                    <span>Iterate based on feedback (2-4 days)</span>
                                </div>
                            </div>
                            <div className="mt-4 text-red-400 font-semibold">Total: 12-19 days</div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-emerald-400">AppDraft AI Process</h3>
                            <div className="space-y-3 text-slate-300">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold">
                                        1
                                    </div>
                                    <span>Describe your app idea (30 seconds)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold">
                                        2
                                    </div>
                                    <span>AI generates beautiful screens (30 seconds)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold">
                                        3
                                    </div>
                                    <span>Customize and export (5 minutes)</span>
                                </div>
                            </div>
                            <div className="mt-4 text-emerald-400 font-semibold">Total: 6 minutes</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
