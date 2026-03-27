"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Calculator } from "lucide-react";
import { Profile } from "@/lib/actions/profile";
import Link from "next/link";

export default function MacroClient({ profile }: { profile: Profile | null }) {
    const [goal, setGoal] = useState(profile?.primary_goal || "maintenance");
    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">(profile?.target_weight || 178.4);
    const [height, setHeight] = useState<number | "">(70);
    const [activity, setActivity] = useState(profile?.activity_level || "Moderate Exercise (3-5 days/week)");

    // Derived state for results (mock calculation for now, would be replaced by actual algorithm or database fetch)
    const [macros, setMacros] = useState({
        calories: 2450,
        protein: 180,
        carbs: 250,
        fats: 80
    });

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, do BMR/TDEE calculation here based on the state. For now just a subtle change to prove interaction.
        setMacros(prev => ({
            ...prev,
            calories: prev.calories + (goal === "bulk" ? 300 : goal === "cut" ? -300 : 0)
        }));
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm"
            >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" /> Calculator Settings
                </h2>

                <form className="space-y-6" onSubmit={handleCalculate}>
                    <div>
                        <label className="block text-sm font-medium mb-2">Age</label>
                        <input
                            type="number"
                            value={age}
                            placeholder="28"
                            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Height (in)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Activity Level</label>
                        <select
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 appearance-none"
                        >
                            <option>Sedentary (office job)</option>
                            <option>Light Exercise (1-2 days/week)</option>
                            <option>Moderate Exercise (3-5 days/week)</option>
                            <option>Heavy Exercise (6-7 days/week)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Goal</label>
                        <div className="grid grid-cols-3 gap-2">
                            {["cut", "maintenance", "bulk"].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGoal(g)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-base capitalize ${goal === g
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:border-primary/50"
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-base">
                        Calculate Macros
                    </button>
                </form>
            </motion.div>

            {/* Results Output */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <h2 className="text-lg opacity-90 mb-1">Your Daily Target</h2>
                    <div className="text-5xl font-bold flex items-center gap-2 mb-6">
                        {macros.calories.toLocaleString()} <span className="text-xl font-normal opacity-80">kcal</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                        <div>
                            <div className="text-white/80 text-sm mb-1">Protein</div>
                            <div className="text-2xl font-semibold">{macros.protein}g</div>
                            <div className="text-xs text-white/60 mt-1">{Math.round((macros.protein * 4 / macros.calories) * 100)}%</div>
                        </div>
                        <div>
                            <div className="text-white/80 text-sm mb-1">Carbs</div>
                            <div className="text-2xl font-semibold">{macros.carbs}g</div>
                            <div className="text-xs text-white/60 mt-1">{Math.round((macros.carbs * 4 / macros.calories) * 100)}%</div>
                        </div>
                        <div>
                            <div className="text-white/80 text-sm mb-1">Fats</div>
                            <div className="text-2xl font-semibold">{macros.fats}g</div>
                            <div className="text-xs text-white/60 mt-1">{Math.round((macros.fats * 9 / macros.calories) * 100)}%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-accent" /> Auto-Adjust Premium
                    </h3>
                    {profile?.subscription_status === 'active' ? (
                        <>
                            <p className="text-sm text-emerald-500 font-medium mb-2">
                                ✓ Premium active
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Our algorithm is continuously analyzing your weekly weigh-ins and strength progression to automatically adjust your macros based on your goals.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our algorithm analyzes your weekly weigh-ins and strength progression to automatically adjust these macros. You're currently on the manual plan.
                            </p>
                            <Link href="/dashboard/billing" className="block text-center w-full py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-xl text-sm font-semibold hover:bg-accent hover:text-white transition-base">
                                Upgrade to Premium
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
