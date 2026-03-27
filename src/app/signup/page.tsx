"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess("Check your email to confirm your account!");
            setFullName("");
            setEmail("");
            setPassword("");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-accent/5 blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-secondary/30 border border-border backdrop-blur-md rounded-3xl p-8 shadow-2xl"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <Activity className="h-8 w-8 text-primary" />
                        <span>Macro<span className="text-primary">Track</span></span>
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
                <p className="text-muted-foreground text-center mb-8">Join MacroTrack to automate your fitness journey.</p>

                <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-base"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-base"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-base"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-rose-500 text-sm">{error}</p>}
                    {success && <p className="text-emerald-500 text-sm">{success}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 mt-4 transition-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Activity className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
}
