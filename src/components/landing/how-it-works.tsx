import { MessageSquare, Sparkles, Download } from "lucide-react"

const steps = [
    {
        icon: MessageSquare,
        title: "Describe Your App",
        description: "Tell us what your app does in plain English. Be as detailed or as simple as you want.",
        example: '"A fitness app with workout tracking, progress charts, and social sharing features"',
        color: "from-indigo-500 to-purple-600",
    },
    {
        icon: Sparkles,
        title: "AI Generates Screens",
        description: "Our AI creates beautiful, functional mobile UIs based on your description in seconds.",
        example: "Complete screens with navigation, forms, charts, and interactive elements",
        color: "from-purple-500 to-pink-600",
    },
    {
        icon: Download,
        title: "Export & Use",
        description: "Download designs ready for development with proper assets, spacing, and code snippets.",
        example: "Figma files, PNG exports, CSS code, and component specifications",
        color: "from-pink-500 to-red-600",
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        From idea to production-ready mobile UI in three simple steps
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-600 to-transparent transform translate-x-4" />
                            )}

                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center hover:border-slate-600/50 transition-all duration-300">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                                >
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>

                                <div className="mb-4">
                                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                        Step {index + 1}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>

                                <p className="text-slate-300 mb-6 leading-relaxed">{step.description}</p>

                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                                    <div className="text-sm text-slate-400 mb-2">Example:</div>
                                    <div className="text-slate-200 text-sm italic">{step.example}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                        <h3 className="text-2xl font-bold mb-4">Ready to see it in action?</h3>
                        <p className="text-slate-300 mb-6">
                            Watch how AppDraft AI transforms a simple description into a beautiful mobile interface
                        </p>
                        <button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                            Watch 2-Minute Demo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
