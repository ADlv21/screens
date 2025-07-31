import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out AppDraft AI",
        features: ["20 screens per month", "Basic templates", "PNG exports", "Community support", "Basic customization"],
        cta: "Start Free",
        popular: false,
    },
    {
        name: "Standard",
        price: "$29",
        period: "per month",
        description: "For serious developers and designers",
        features: [
            "200 screens per month",
            "Advanced templates",
            "All export formats (PNG, SVG, Figma)",
            "Priority support",
            "Advanced customization",
            "Code generation",
            "Version history",
        ],
        cta: "Start with free later upgrade",
        popular: true,
    },
    {
        name: "Pro",
        price: "$39",
        period: "per month",
        description: "For teams and organizations",
        features: [
            "500 screens per month",
            "Custom templates",
            "Version history",
            "Dedicated support",
        ],
        cta: "Start with most advanced models",
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Start free, upgrade when you need more. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300 ${plan.popular ? "border-indigo-500/50 ring-1 ring-indigo-500/20 scale-105" : "border-slate-700/50"
                                }`}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                                    <Star className="w-4 h-4 mr-1" />
                                    Most Popular
                                </Badge>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-400 ml-2">/{plan.period}</span>
                                </div>
                                <p className="text-slate-300">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start space-x-3">
                                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full py-3 font-semibold ${plan.popular
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                                    }`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    {/* <p className="text-slate-400 mb-4">All paid plans include a 14-day free trial • No credit card required</p> */}
                    <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
                        <span>✓ Cancel anytime</span>
                        <span>✓ 30-day money-back guarantee</span>
                        <span>✓ Secure payments</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
