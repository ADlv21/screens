import { Instrument_Serif } from 'next/font/google';
import { cn } from '@/lib/utils';

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
});

const PricingPage = () => {
    return (
        <div className="w-full relative min-h-full bg-white text-black font-sans antialiased">
            <section className="relative max-w-7xl sm:px-6 lg:px-8 sm:py-12 mr-auto ml-auto pt-16 pr-4 pb-16 pl-4">
                <div className="text-center mb-16 sm:mb-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                        <span className={cn("text-7xl font-normal text-red-500 tracking-tight", serif.className)}>AI Screen</span><br />
                        <span className={cn("text-8xl font-normal text-black tracking-tight", serif.className)}>Generation</span>
                    </h1>
                    <p className="sm:text-lg max-w-3xl text-base text-neutral-600 mr-auto ml-auto">
                        Transform your ideas into beautiful mobile UI screens with AI. Choose the plan that fits your creative needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Free Plan */}
                    <article className="relative hover:border-red-500 transition-all duration-300 lg:p-10 flex flex-col bg-white border-neutral-200 border-2 rounded-3xl pt-8 pr-8 pb-8 pl-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"></path></svg>
                                <span className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Free</span>
                            </div>
                            <span className="text-xs font-medium uppercase bg-green-50 border border-green-200 rounded-full px-3 py-1 text-green-600">
                                Get Started
                            </span>
                        </div>

                        <div className="mb-8">
                            <h2 className="lg:text-2xl leading-tight text-2xl font-medium mb-3">Explore & Learn</h2>
                            <p className="text-neutral-600 text-sm">
                                Perfect for trying out our AI screen generation
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl lg:text-5xl font-bold tracking-tight">$0</span>
                                <span className="text-neutral-500 mb-1">/month</span>
                            </div>
                            <p className="text-xs text-neutral-500">Free forever • No credit card required</p>
                        </div>

                        <div className="flex flex-col gap-3 mb-8">
                            <button className="w-full rounded-full bg-red-500 text-white px-6 py-3 text-sm font-semibold hover:bg-red-600 transition-all duration-200">
                                Start Free
                            </button>
                            <button className="w-full rounded-full border-2 border-neutral-300 text-neutral-700 px-6 py-3 text-sm font-medium hover:bg-neutral-50 transition-all duration-200">
                                Learn More
                            </button>
                        </div>

                        <hr className="border-neutral-200 mb-8" />

                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Limited Access</strong> - Basic features to explore</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Community Support</strong> - Help docs and forums</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Basic Templates</strong> - Standard UI components</span>
                            </li>
                        </ul>
                    </article>

                    {/* Standard Plan */}
                    <article className="relative rounded-3xl bg-black text-white border-2 border-black transition-all duration-300 p-8 lg:p-10 flex flex-col scale-105 lg:scale-110 z-10">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-red-500 text-white text-xs font-bold uppercase px-4 py-2 rounded-full">
                                Most Popular
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-8 mt-4">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"></path></svg>
                                <span className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Standard</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="lg:text-2xl leading-tight text-2xl font-medium mb-3">Perfect for Most Users</h2>
                            <p className="text-neutral-300 text-sm">
                                Generate beautiful screens with plenty of credits
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl lg:text-5xl font-bold tracking-tight">$29</span>
                                <span className="text-neutral-400 mb-1">/month</span>
                            </div>
                            <p className="text-xs text-neutral-400">200 credits monthly • Cancel anytime</p>
                        </div>

                        <div className="flex flex-col gap-3 mb-8">
                            <button className="w-full rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-neutral-100 transition-all duration-200">
                                Get Standard
                            </button>
                            <button className="w-full rounded-full border-2 border-white text-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-black transition-all duration-200">
                                Try Free First
                            </button>
                        </div>

                        <hr className="border-neutral-700 mb-8" />

                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>200 Credits</strong> - Generate 200 screens monthly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>All Templates</strong> - Access to premium designs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Export Options</strong> - HTML, React, Vue components</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Email Support</strong> - Response within 24 hours</span>
                            </li>
                        </ul>
                    </article>

                    {/* Pro Plan */}
                    <article className="relative hover:border-red-500 transition-all duration-300 lg:p-10 flex flex-col bg-white border-neutral-200 border-2 rounded-3xl pt-8 pr-8 pb-8 pl-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"></path></svg>
                                <span className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Pro</span>
                            </div>
                            <span className="text-xs font-medium uppercase bg-purple-50 border border-purple-200 rounded-full px-3 py-1 text-purple-600">
                                Power User
                            </span>
                        </div>

                        <div className="mb-8">
                            <h2 className="lg:text-2xl leading-tight text-2xl font-medium mb-3">For Heavy Usage</h2>
                            <p className="text-neutral-600 text-sm">
                                Maximum credits for teams and power users
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl lg:text-5xl font-bold tracking-tight">$39</span>
                                <span className="text-neutral-500 mb-1">/month</span>
                            </div>
                            <p className="text-xs text-neutral-500">500 credits monthly • Best value</p>
                        </div>

                        <div className="flex flex-col gap-3 mb-8">
                            <button className="w-full rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-all duration-200">
                                Get Pro
                            </button>
                            <button className="w-full rounded-full border-2 border-black text-black px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all duration-200">
                                Start with Standard
                            </button>
                        </div>

                        <hr className="border-neutral-200 mb-8" />

                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>500 Credits</strong> - Generate 500 screens monthly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Priority Generation</strong> - Faster processing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Advanced Features</strong> - Custom styling options</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                                <span><strong>Priority Support</strong> - Direct chat support</span>
                            </li>
                        </ul>
                    </article>
                </div>

                <div className="mt-16 sm:mt-20 text-center">
                    <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
                    <div className="max-w-3xl mx-auto grid gap-6">
                        <div className="text-left">
                            <h4 className="font-semibold mb-2">How do credits work?</h4>
                            <p className="text-sm text-neutral-600">Each screen generation uses 1 credit. Credits refresh monthly and don&apos;t roll over to the next month.</p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                            <p className="text-sm text-neutral-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold mb-2">What formats can I export?</h4>
                            <p className="text-sm text-neutral-600">All paid plans include HTML export. We&apos;re working on React and Vue component exports coming soon.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-20 text-center">
                    <p className="text-sm text-neutral-500 mb-8">Trusted by developers and designers worldwide</p>
                    <div className="flex items-center justify-center gap-8 opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        <span className="text-sm">SSL Secured</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span className="text-sm">24/7 Support</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                        <span className="text-sm">Cancel Anytime</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default PricingPage