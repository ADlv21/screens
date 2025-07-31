import { AppNavbar } from "../navbar"
import { FeatureGrid } from "../feature-grid"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion"
import { Spotlight } from "../ui/spotlight"
import { GlowingEffect } from "../ui/glowing-effect"
import { Sparkles, Smartphone, Zap, Quote, User } from "lucide-react"
import Link from "next/link"
import OneTapComponent from "../auth/google-one-tap"

const TESTIMONIAL = {
    quote: "AppDraft AI is a game-changer. I generated beautiful mobile screens for my startup in minutes!",
    name: "Alex Kim",
    title: "Founder, UIverse",
}

const FAQS = [
    {
        q: "Is there a free plan?",
        a: "Yes! You can get started for free and generate screens with limited credits. Upgrade anytime for more features.",
    },
    {
        q: "Can I use the generated code in my projects?",
        a: "Absolutely. All generated HTML & Tailwind CSS is production-ready and yours to use.",
    },
    {
        q: "How does the AI work?",
        a: "Our AI is trained on thousands of mobile UI patterns and generates unique, responsive screens from your text prompts.",
    },
]

const LandingPage = () => {
    return (
        <AppNavbar>
            <OneTapComponent />
            <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
                <Spotlight />
                {/* Hero Section */}
                <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
                    <Badge className="mb-6 px-4 py-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-0">
                        <Sparkles className="h-4 w-4 mr-2" /> AI-powered Mobile UI Generator
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent mb-6 drop-shadow-xl">
                        Instantly Turn Ideas Into Stunning Mobile Screens
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                        Describe your app, and our AI will generate beautiful, production-ready mobile UI screens in seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <Link href="/auth/login">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
                                <Sparkles className="h-5 w-5 mr-2" /> Get Started Free
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" size="lg">View Pricing</Button>
                        </Link>
                    </div>
                    {/* Illustration */}
                    <div className="relative flex justify-center mt-8">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-blue-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-2">
                            <Smartphone className="h-32 w-32 text-blue-500 mx-auto" />
                        </div>
                        <GlowingEffect className="absolute inset-0" glow={true} spread={60} disabled={false} />
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative z-10 container mx-auto px-4 py-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                        Why Choose AppDraft AI?
                    </h2>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                        Everything you need to go from idea to beautiful mobile UI, instantly.
                    </p>
                    <FeatureGrid />
                </section>

                {/* Stats Section */}
                <section className="relative z-10 container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-blue-600">10k+</CardTitle>
                                <CardDescription>Screens Generated</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-purple-600">50+</CardTitle>
                                <CardDescription>Design Patterns</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold text-green-600">99.9%</CardTitle>
                                <CardDescription>Uptime</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
                    <Card className="max-w-2xl w-full mx-auto text-center shadow-xl border-0 bg-gradient-to-br from-white/90 to-blue-50 dark:from-gray-900/90 dark:to-gray-800">
                        <CardContent>
                            <Quote className="mx-auto mb-4 h-8 w-8 text-blue-400" />
                            <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                                &ldquo;{TESTIMONIAL.quote}&rdquo;
                            </p>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <User className="h-6 w-6 text-blue-500" />
                                    <span className="font-semibold text-gray-900 dark:text-white">{TESTIMONIAL.name}</span>
                                </div>
                                <span className="text-gray-500 text-sm">{TESTIMONIAL.title}</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* FAQ Section */}
                <section className="relative z-10 container mx-auto px-4 py-12">
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                    <div className="max-w-2xl mx-auto">
                        <Accordion type="single" collapsible>
                            {FAQS.map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent>{faq.a}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="relative z-10 flex flex-col items-center justify-center py-16 px-4 mt-8">
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-10 text-center border border-blue-100 dark:border-gray-800 overflow-hidden">
                        <GlowingEffect className="absolute inset-0" glow={true} spread={80} disabled={false} />
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Ready to Create Amazing Mobile UIs?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Join thousands of developers already using AppDraft AI to build beautiful mobile interfaces.
                        </p>
                        <Link href="/auth/login">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
                                <Zap className="h-5 w-5 mr-2" /> Start Building Now
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </AppNavbar>
    )
}

export default LandingPage