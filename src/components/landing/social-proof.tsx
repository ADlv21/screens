import { Star, Users, Zap, TrendingUp } from "lucide-react"
import Image from "next/image"

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Product Designer at TechCorp",
        avatar: "/placeholder.svg?height=60&width=60",
        content:
            "AppDraft AI has completely transformed our design workflow. What used to take weeks now takes minutes. The quality is incredible.",
        rating: 5,
    },
    {
        name: "Marcus Rodriguez",
        role: "Startup Founder",
        avatar: "/placeholder.svg?height=60&width=60",
        content:
            "As a non-designer, I was able to create professional-looking mobile UIs for my app. This tool is a game-changer for solo founders.",
        rating: 5,
    },
    {
        name: "Emily Watson",
        role: "Lead Developer at InnovateLab",
        avatar: "/placeholder.svg?height=60&width=60",
        content:
            "The generated code is clean and production-ready. Our development team loves working with AppDraft AI designs.",
        rating: 5,
    },
]

const stats = [
    {
        icon: Users,
        value: "50,000+",
        label: "Screens Generated",
        color: "text-blue-400",
    },
    {
        icon: TrendingUp,
        value: "500+",
        label: "Happy Developers",
        color: "text-emerald-400",
    },
    {
        icon: Zap,
        value: "30s",
        label: "Average Generation Time",
        color: "text-yellow-400",
    },
    {
        icon: Star,
        value: "4.9/5",
        label: "User Rating",
        color: "text-purple-400",
    },
]

const companies = ["TechCorp", "InnovateLab", "StartupHub", "DesignCo", "DevStudio"]

export function SocialProof() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Trusted by developers worldwide</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Join thousands of developers and designers who are shipping faster with AppDraft AI
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:border-slate-600/50 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 ${stat.color} mx-auto mb-4`}>
                                <stat.icon className="w-full h-full" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-slate-600/50 transition-all duration-300"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-slate-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                            <div className="flex items-center space-x-4">
                                <Image
                                    //src={testimonial.avatar || "/placeholder.svg"}
                                    src={"/../public/images/fitness.png"}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full bg-slate-700"
                                />
                                <div>
                                    <div className="font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="text-slate-400 mb-6">Trusted by teams at</div>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        {companies.map((company, index) => (
                            <div key={index} className="text-slate-500 font-semibold text-lg hover:text-slate-400 transition-colors">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
