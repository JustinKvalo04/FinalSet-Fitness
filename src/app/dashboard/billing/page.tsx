"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Zap, Loader2 } from "lucide-react";

export default function SubscriptionPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            if (!res.ok) throw new Error("Failed to create checkout session");

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
                <p className="text-muted-foreground mt-2">Manage your billing and premium features.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                {/* Free Plan */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-border rounded-3xl p-8 bg-background relative"
                >
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-foreground">Basic</h3>
                        <div className="text-4xl font-bold mt-2">$0 <span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                        <p className="text-muted-foreground mt-2 text-sm">Essential tracking for your fitness journey.</p>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {["Manual Macro Calculator", "Basic Weight Tracking", "Standard Strength Logging", "Community Support"].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                <span className="text-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="absolute top-8 right-8 text-sm font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                        Current Plan
                    </div>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl p-8 bg-gradient-to-b from-primary/10 to-accent/5 border border-primary/20 relative overflow-hidden flex flex-col justify-between"
                >
                    {/* Abstract glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

                    <div className="mb-8 relative z-10">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-primary" /> Premium
                        </h3>
                        <div className="text-4xl font-bold mt-2">$9.99 <span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                        <p className="text-muted-foreground mt-2 text-sm">Automate your progress and reach goals faster.</p>
                    </div>

                    <ul className="space-y-4 mb-8 relative z-10">
                        {["Auto-Adjusting Macro Algorithm", "Advanced Weekly Trend Analysis", "Unlimited Strength Logs & PRs", "Priority Support"].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-base shadow-lg shadow-primary/30 relative z-10 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade Now"}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
