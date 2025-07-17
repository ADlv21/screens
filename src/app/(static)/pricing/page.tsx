"use server"
import { Instrument_Serif } from 'next/font/google';
import { cn } from '@/lib/utils';
import { getPolarPricingPlans } from '@/lib/actions/get-polar-pricing';
import Link from 'next/link';

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
});

const PricingPage = async () => {

    const polarResponse = await getPolarPricingPlans();

    const plans = polarResponse.result.items.map((plan) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const price = plan.prices[0] as any;
        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: price?.priceAmount || 0,
            currency: price?.priceCurrency || 'usd',
            recurringInterval: plan.recurringInterval
        }
    });

    // Sort plans by price (Free, Standard, Pro)
    const sortedPlans = plans.sort((a, b) => a.price - b.price);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPlanConfig = (plan: any) => {
        const priceDisplay = plan.price === 0 ? '$0' : `$${plan.price / 100}`;

        if (plan.price === 0) {
            // Free Plan
            return {
                displayName: 'Free',
                title: 'Explore & Learn',
                subtitle: 'Perfect for trying out our AI screen generation',
                badge: { text: 'Get Started', color: 'green' },
                features: [
                    { text: '<strong>Limited Access</strong> - Basic features to explore' },
                    { text: '<strong>Community Support</strong> - Help docs and forums' },
                    { text: '<strong>Basic Templates</strong> - Standard UI components' }
                ],
                buttons: { primary: 'Start Free', secondary: 'Learn More' },
                pricing: { amount: priceDisplay, period: '/month', note: 'Free forever • No credit card required' },
                style: 'default'
            };
        } else if (plan.price === 2900) {
            // Standard Plan  
            return {
                displayName: 'Standard',
                title: 'Perfect for Most Users',
                subtitle: 'Generate beautiful screens with plenty of credits',
                badge: null,
                features: [
                    { text: '<strong>200 Credits</strong> - Generate 200 screens monthly' },
                    { text: '<strong>All Templates</strong> - Access to premium designs' },
                    { text: '<strong>Export Options</strong> - HTML, React, Vue components' },
                    { text: '<strong>Email Support</strong> - Response within 24 hours' }
                ],
                buttons: { primary: 'Get Standard', secondary: 'Try Free First' },
                pricing: { amount: priceDisplay, period: '/month', note: '200 credits monthly • Cancel anytime' },
                style: 'featured'
            };
        } else {
            // Pro Plan
            return {
                displayName: 'Pro',
                title: 'For Heavy Usage',
                subtitle: 'Maximum credits for teams and power users',
                badge: { text: 'Power User', color: 'purple' },
                features: [
                    { text: '<strong>500 Credits</strong> - Generate 500 screens monthly' },
                    { text: '<strong>Priority Generation</strong> - Faster processing' },
                    { text: '<strong>Advanced Features</strong> - Custom styling options' },
                    { text: '<strong>Priority Support</strong> - Direct chat support' }
                ],
                buttons: { primary: 'Get Pro', secondary: 'Start with Standard' },
                pricing: { amount: priceDisplay, period: '/month', note: '500 credits monthly • Best value' },
                style: 'default'
            };
        }
    };

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
                    {sortedPlans.map((plan, index) => {
                        const config = getPlanConfig(plan);
                        const isFeatured = config.style === 'featured';

                        return (
                            <article
                                key={plan.id}
                                className={cn(
                                    "relative transition-all duration-300 flex flex-col border-2 rounded-3xl pt-8 pr-8 pb-8 pl-8",
                                    isFeatured
                                        ? "bg-black text-white border-black scale-105 lg:scale-110 z-10 lg:p-10"
                                        : "bg-white border-neutral-200 hover:border-red-500 lg:p-10"
                                )}
                            >
                                {isFeatured && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-red-500 text-white text-xs font-bold uppercase px-4 py-2 rounded-full">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className={cn("flex justify-between items-start mb-8", isFeatured && "mt-4")}>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500">
                                            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"></path>
                                        </svg>
                                        <span className={cn(
                                            "text-sm font-semibold uppercase tracking-wide",
                                            isFeatured ? "text-neutral-400" : "text-neutral-500"
                                        )}>
                                            {config.displayName}
                                        </span>
                                    </div>
                                    {config.badge && (
                                        <span className={cn(
                                            "text-xs font-medium uppercase border rounded-full px-3 py-1",
                                            config.badge.color === 'green'
                                                ? "bg-green-50 border-green-200 text-green-600"
                                                : "bg-purple-50 border-purple-200 text-purple-600"
                                        )}>
                                            {config.badge.text}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <h2 className="lg:text-2xl leading-tight text-2xl font-medium mb-3">{config.title}</h2>
                                    <p className={cn(
                                        "text-sm",
                                        isFeatured ? "text-neutral-300" : "text-neutral-600"
                                    )}>
                                        {config.subtitle}
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl lg:text-5xl font-bold tracking-tight">{config.pricing.amount}</span>
                                        <span className={cn(
                                            "mb-1",
                                            isFeatured ? "text-neutral-400" : "text-neutral-500"
                                        )}>
                                            {config.pricing.period}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-xs",
                                        isFeatured ? "text-neutral-400" : "text-neutral-500"
                                    )}>
                                        {config.pricing.note}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 mb-8">
                                    <Link
                                        className={cn(
                                            "w-full rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200",
                                            isFeatured
                                                ? "bg-white text-black hover:bg-neutral-100"
                                                : config.displayName === 'Free'
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-black text-white hover:bg-neutral-800"
                                        )}

                                        href={`/api/checkout?product_id=${plan.id}`}
                                    >
                                        {config.buttons.primary}
                                    </Link>
                                </div>

                                <hr className={cn(
                                    "mb-8",
                                    isFeatured ? "border-neutral-700" : "border-neutral-200"
                                )} />

                                <ul className="space-y-4 text-sm">
                                    {config.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0">
                                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                                <path d="m9 11 3 3L22 4"></path>
                                            </svg>
                                            <span dangerouslySetInnerHTML={{ __html: feature.text }} />
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
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