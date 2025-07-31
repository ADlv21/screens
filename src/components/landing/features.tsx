import { Zap, Palette, Settings, Smartphone, Target, RotateCcw } from "lucide-react"

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Generate complete mobile screens in under 30 seconds. No more waiting for designers or lengthy approval processes.",
        color: "text-yellow-400",
    },
    {
        icon: Palette,
        title: "Production Ready",
        description:
            "Export-ready designs with proper spacing, typography, and mobile-optimized layouts that developers love.",
        color: "text-purple-400",
    },
    {
        icon: Settings,
        title: "Fully Customizable",
        description: "Fine-tune colors, layouts, and components after generation. Make it perfectly match your brand.",
        color: "text-blue-400",
    },
    {
        icon: Smartphone,
        title: "Mobile Optimized",
        description: "Designs built specifically for iOS and Android standards with proper touch targets and navigation.",
        color: "text-green-400",
    },
    {
        icon: Target,
        title: "Smart Components",
        description:
            "AI understands common UI patterns and best practices, ensuring your designs follow industry standards.",
        color: "text-red-400",
    },
    {
        icon: RotateCcw,
        title: "Iterate Quickly",
        description: "Regenerate and refine with simple text prompts. Perfect your design in minutes, not days.",
        color: "text-indigo-400",
    },
]

export function Features() {
    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                        Everything you need to{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                            ship faster
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Powerful AI-driven features that transform how you create mobile interfaces
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105"
                        >
                            <div
                                className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feature.icon className="w-full h-full" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-slate-100">{feature.title}</h3>
                            <p className="text-slate-300 leading-relaxed group-hover:text-slate-200">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
