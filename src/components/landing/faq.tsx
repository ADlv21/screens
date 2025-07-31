import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "How accurate is the AI in generating mobile UIs?",
        answer:
            "Our AI has been trained on thousands of high-quality mobile interfaces and follows industry best practices. It generates production-ready designs with proper spacing, typography, and mobile-optimized layouts. The accuracy rate is over 95% for common UI patterns.",
    },
    {
        question: "What export formats are available?",
        answer:
            "We support multiple export formats including PNG, SVG, PDF for images, Figma files for design handoff, and CSS/React code snippets for developers. Pro and Team plans include all formats, while the Free plan includes PNG exports.",
    },
    {
        question: "Can I customize the generated designs?",
        answer:
            "After generation, you can customize colors, fonts, spacing, and layouts. You can also regenerate specific sections with new prompts or make manual adjustments using our built-in editor.",
    },
    {
        question: "How does the AI understand my app requirements?",
        answer:
            "Our AI uses natural language processing to understand your app description, identifying key features, user flows, and UI components needed. The more detailed your description, the more accurate the generated design will be.",
    },
    {
        question: "Is there a limit to how many screens I can generate?",
        answer:
            "The Free plan includes 5 screens per month. Pro and Team plans offer unlimited screen generation. All plans reset monthly, and unused screens don't roll over.",
    },
    {
        question: "Can I use the generated designs commercially?",
        answer:
            "Yes! All designs generated with AppDraft AI can be used commercially without any restrictions. You own the rights to your generated designs and can use them in any project.",
    },
    {
        question: "Do you offer refunds?",
        answer:
            "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with AppDraft AI, contact our support team for a full refund within 30 days of purchase.",
    }
]

export function FAQ() {
    return (
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                    <p className="text-xl text-slate-300">Everything you need to know about AppDraft AI</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-slate-700/50">
                                <AccordionTrigger className="text-left text-white hover:text-slate-200 text-lg font-semibold">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 leading-relaxed pt-4">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="text-center mt-12">
                    <p className="text-slate-400 mb-4">Still have questions?</p>
                    <Button
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </section>
    )
}
