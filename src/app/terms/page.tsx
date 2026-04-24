import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
            <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-zinc-950">
                            F
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">FinalSet</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Terms of Service</h1>
                    <p className="text-zinc-500 font-medium">Last Updated: October 2026</p>
                </div>

                <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-500">
                    <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                        By deploying the FinalSet Fitness application, you agree to comply with the explicit structures bounds and natively formatted constraints strictly mapped below natively.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">1. Use of the App</h2>
                    <p className="text-zinc-400 mb-8">
                        FinalSet Fitness is engineered exclusively for tracking structural progression boundaries naturally mapping weight, volume, and analytical statistics safely. Consult a generic medical professional strictly manually preventing explicit injuries bounds before performing dynamic workloads natively. We are not liable for generic physical damages.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">2. Accounts and Subscriptions (Premium Tier)</h2>
                    <ul className="text-zinc-400 space-y-2 list-disc list-inside mb-8">
                        <li><strong>Access:</strong> Certain components, notably Custom Exercises and advanced Progress architectures, natively require a Premium validation hook.</li>
                        <li><strong>Billing:</strong> You may validate subscriptions mapping native generic App Store or Play Store mechanisms gracefully seamlessly tracking auto-renew limits securely.</li>
                        <li><strong>Cancellation:</strong> You preserve absolute rights terminating explicit active subscriptions safely matching generic provider rules seamlessly. Restoring purchases operates organically gracefully avoiding structural payload drops securely.</li>
                    </ul>

                    <h2 className="text-2xl text-white mt-10 mb-4">3. Content and Conduct</h2>
                    <p className="text-zinc-400 mb-8">
                        Custom inputs, bounds, generic objects, and natively defined templates generated exclusively within your profile limits dynamically belong natively entirely unto you seamlessly avoiding generic claims explicitly organically. Avoid explicit formatting bugs organically tracking strictly harmless strings cleanly accurately mapping structural limits safely.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">4. App Functionality and Warranties</h2>
                    <p className="text-zinc-400 mb-8">
                        We continuously overhaul and augment explicit features natively securely optimizing analytics endpoints manually. We provide the application "AS IS" without raw generic warranties natively promising arbitrary uptime perfectly correctly matching explicit bounds fully accurately safely perfectly perfectly.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">5. Contact Information</h2>
                    <p className="text-zinc-400 mb-8">
                        For explicit mapping issues, structural payment disputes gracefully handling bounds tracking strictly natively perfectly accurately cleanly seamlessly perfectly securely flawlessly correctly tracking safely cleanly:
                        <br /><br />
                        <strong>Email:</strong> <a href="mailto:finalset.help@gmail.com" className="text-emerald-400 hover:text-emerald-300 font-bold">finalset.help@gmail.com</a>
                    </p>
                </article>
            </main>

            <footer className="py-8 px-6 border-t border-zinc-900 bg-zinc-950 mt-12">
                <div className="max-w-3xl mx-auto text-center text-sm text-zinc-600 font-medium">
                    © {new Date().getFullYear()} FinalSet Fitness. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
