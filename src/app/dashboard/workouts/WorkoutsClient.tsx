"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Play, History, Trophy } from "lucide-react";
import { Profile } from "@/lib/actions/profile";
import { WorkoutLog } from "@/lib/actions/workout";

export default function WorkoutsClient({ profile, initialWorkouts }: { profile: Profile | null, initialWorkouts: WorkoutLog[] }) {
    const [activeTab, setActiveTab] = useState("templates");

    const templates = [
        { name: "Push Day (Hypertrophy)", exercises: 6, lastPerformed: "Yesterday" },
        { name: "Pull Day (Strength)", exercises: 5, lastPerformed: "3 days ago" },
        { name: "Legs & Core", exercises: 7, lastPerformed: "5 days ago" },
    ];

    const history = initialWorkouts.map(log => ({
        date: new Date(log.logged_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        name: log.name,
        volume: `${log.total_volume.toLocaleString()} lbs`,
        prs: log.prs_broken
    }));

    return (
        <>
            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
                {["templates", "history"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-2 text-sm font-medium capitalize transition-base relative ${activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="workout-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === "templates" ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {templates.map((template, i) => (
                            <div key={i} className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm hover:border-primary/50 transition-base group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <button className="bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-3 h-3" /> Start
                                    </button>
                                </div>
                                <h3 className="font-bold text-lg">{template.name}</h3>
                                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                                    <span>{template.exercises} Exercises</span>
                                    <span>•</span>
                                    <span>Last: {template.lastPerformed}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((session, i) => (
                            <div key={i} className="bg-secondary/30 border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between hover:bg-secondary/50 transition-base cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-background border border-border w-12 h-12 rounded-full flex flex-col items-center justify-center">
                                        <History className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{session.name}</h3>
                                        <p className="text-sm text-muted-foreground">{session.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-right">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Total Volume</p>
                                        <p className="font-medium text-foreground">{session.volume}</p>
                                    </div>
                                    {session.prs > 0 && (
                                        <div className="bg-amber-500/10 text-amber-500 px-3 py-2 rounded-xl flex items-center gap-2 border border-amber-500/20">
                                            <Trophy className="w-4 h-4" />
                                            <span className="font-bold">{session.prs} PRs</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </>
    );
}
