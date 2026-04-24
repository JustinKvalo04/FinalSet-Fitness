import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Privacy Policy</h1>
                    <p className="text-zinc-500 font-medium">Last Updated: October 2026</p>
                </div>

                <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-500">
                    <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                        At FinalSet Fitness, we take your privacy seriously. This Policy describes how we collect, use, and protect your data when you track your training with our application natively.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">1. Information We Collect</h2>
                    <ul className="text-zinc-400 space-y-2 list-disc list-inside mb-8">
                        <li><strong>Account Data:</strong> Email address strongly encrypted upon creation natively.</li>
                        <li><strong>Training Data:</strong> Your logged workout instances, weights, repetitions, custom exercises, and progression stats securely transmitted directly.</li>
                        <li><strong>Device Information:</strong> Diagnostics bridging App version strings mapped generically for crash resolution.</li>
                    </ul>

                    <h2 className="text-2xl text-white mt-10 mb-4">2. How We Use Information</h2>
                    <p className="text-zinc-400 mb-8">
                        We strictly limit processing bounds accurately mapping your profile metrics explicitly into your Analytics Dashboard natively. We do not sell your structural logging histories to generic ad brokers. Data is processed solely to operate, securely parse, and dynamically improve your app experience structurally.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">3. Data Security & Storage</h2>
                    <p className="text-zinc-400 mb-8">
                        Your session payloads are authenticated utilizing industry-standard Supabase identity hooks securely establishing explicit limits protecting API limits organically. All structural backups encrypt explicitly safely off-device natively preventing structural drops seamlessly.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">4. Your Data Rights</h2>
                    <p className="text-zinc-400 mb-8">
                        You preserve absolute control parsing your limits. If you choose to terminate your explicit subscription or securely delete your root profile natively, your complete database object mappings are erased explicitly matching generic deletion endpoints flawlessly.
                    </p>

                    <h2 className="text-2xl text-white mt-10 mb-4">5. Contact Us</h2>
                    <p className="text-zinc-400 mb-8">
                        If you have questions about your privacy bounds mapping natively accurately, you can securely contact our explicit Help Center natively:
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
