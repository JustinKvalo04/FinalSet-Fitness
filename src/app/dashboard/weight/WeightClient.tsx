"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Scale, Target, Plus, Calendar } from "lucide-react";
import { Profile } from "@/lib/actions/profile";
import { WeightLog } from "@/lib/actions/weight";

export default function WeightClient({ profile, initialWeights }: { profile: Profile | null, initialWeights: WeightLog[] }) {
    const [weight, setWeight] = useState("");

    // Calculate trend for recent weights based on the previous entry
    const recentWeights = initialWeights.map((log, i, arr) => {
        const prev = arr[i + 1]; // The entries are ordered descending by date
        const trend = !prev ? 'none' : (log.weight > prev.weight ? 'up' : log.weight < prev.weight ? 'down' : 'none');

        return {
            date: new Date(log.logged_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            value: log.weight,
            trend: trend
        };
    }).slice(0, 5); // Just show top 5 for the recent list

    const targetWeight = profile?.target_weight || 170;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Weekly Outline Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-blue-500" /> Progression Chart
                    </h3>
                    <div className="flex gap-2">
                        {['1W', '1M', '3M', '1Y'].map(t => (
                            <button key={t} className={`text-xs px-2.5 py-1 rounded-md font-medium ${t === '1M' ? 'bg-background shadow-sm border border-border text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Premium CSS Mock Chart */}
                <div className="h-64 mt-4 relative w-full border-b border-l border-border/50 pb-2 pl-2 flex items-end justify-between px-4 pt-10">
                    {/* Target Line */}
                    <div className="absolute w-full top-32 border-t-2 border-dashed border-accent/40 z-0">
                        <span className="absolute -top-6 right-0 text-xs text-accent font-medium bg-background px-2 rounded-full border border-accent/20">Target: {targetWeight} lbs</span>
                    </div>

                    {/* Bars */}
                    {[65, 62, 58, 60, 54, 52, 48, 45, 42, 44, 40].map((h, i) => (
                        <div key={i} className="relative w-8 group z-10 flex flex-col justify-end h-full">
                            <div
                                className="w-full bg-gradient-to-t from-primary/80 to-blue-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all cursor-pointer relative"
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-2 py-1 rounded-md text-xs whitespace-nowrap shadow-xl font-medium">
                                    {(178 - Number(i * 0.1)).toFixed(1)} lbs
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground mt-4 px-6">
                    <span>Oct 14</span>
                    <span>Oct 20</span>
                    <span>Today</span>
                </div>

            </motion.div>

            {/* Current Stats & Input */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden h-40 flex flex-col justify-center"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                    <h3 className="text-primary-foreground/80 font-medium mb-1 flex items-center gap-2">
                        <Scale className="w-4 h-4" /> Current Trend
                    </h3>
                    <div className="text-5xl font-bold flex items-end gap-2 text-white">
                        178.4 <span className="text-xl font-normal opacity-80 mb-1">lbs</span>
                    </div>
                    <p className="text-sm text-emerald-300 font-medium mt-2">↓ 0.8 lbs from last week</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm"
                >
                    <h3 className="font-semibold mb-4">Recent Logs</h3>
                    <div className="space-y-3">
                        {recentWeights.map((log, i) => (
                            <div key={i} className="flex justify-between items-center bg-background/50 border border-border/50 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">{log.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{log.value}</span>
                                    <span className={`text-xs ${log.trend === 'down' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {log.trend === 'down' ? '↓' : '↑'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-primary font-medium hover:underline">
                        View All History
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
