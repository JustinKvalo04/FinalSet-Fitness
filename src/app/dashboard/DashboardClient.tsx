"use client";

import { motion } from "framer-motion";
import { TrendingDown, Dumbbell, Activity, Target } from "lucide-react";
import { Profile } from "@/lib/actions/profile";
import { WeightLog } from "@/lib/actions/weight";
import { WorkoutLog } from "@/lib/actions/workout";

interface DashboardClientProps {
    profile: Profile | null;
    initialWeights: WeightLog[];
    initialWorkouts: WorkoutLog[];
}

export default function DashboardClient({ profile, initialWeights, initialWorkouts }: DashboardClientProps) {
    const currentWeight = initialWeights.length > 0 ? initialWeights[0].weight : (profile?.target_weight || 0);

    // Calculate trend from last week (if available)
    const today = new Date();
    const lastWeekDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekWeightLog = initialWeights.find(w => new Date(w.logged_date) <= lastWeekDate);
    const trendAmount = lastWeekWeightLog ? (currentWeight - lastWeekWeightLog.weight).toFixed(1) : "0.0";
    const trendDirection = Number(trendAmount) > 0 ? '↑' : Number(trendAmount) < 0 ? '↓' : '';

    const lastWorkout = initialWorkouts.length > 0 ? initialWorkouts[0] : null;

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Daily Macros Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm flex flex-col"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Today's Targets
                    </h3>
                </div>
                <div className="text-4xl font-bold mb-1">2,450 <span className="text-lg text-muted-foreground font-normal">kcal</span></div>

                <div className="mt-6 space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Protein (180g)</span>
                            <span className="font-medium">120g left</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/3 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Carbs (250g)</span>
                            <span className="font-medium">100g left</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-3/5 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Fats (80g)</span>
                            <span className="font-medium">30g left</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-2/3 rounded-full" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Weight Trend */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2 relative z-10">
                            <TrendingDown className="w-5 h-5 text-blue-400" /> Current Weight
                        </h3>
                    </div>
                    <div className="text-5xl font-bold mb-2 relative z-10">{currentWeight} <span className="text-xl text-muted-foreground font-normal">lbs</span></div>

                    {trendAmount !== "0.0" ? (
                        <p className={`text-sm font-medium relative z-10 flex items-center gap-1 ${Number(trendAmount) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {trendDirection} {Math.abs(Number(trendAmount))} lbs this week
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-muted-foreground relative z-10">No recent trend data</p>
                    )}
                </div>

                <div className="mt-8 relative z-10 border-t border-border pt-4 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Goal: <span className="text-foreground font-semibold">{profile?.target_weight || 'Not set'}</span> lbs</span>
                    <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold">
                        {profile?.primary_goal || 'Maintain'}
                    </div>
                </div>
            </motion.div>

            {/* Recent Workout */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-accent" /> Recent Workout
                        </h3>
                    </div>

                    {lastWorkout ? (
                        <>
                            <h4 className="text-xl font-bold">{lastWorkout.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(lastWorkout.logged_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="bg-background/50 p-4 rounded-2xl border border-border flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm">Total Volume</span>
                                    <span className="font-bold text-lg">{lastWorkout.total_volume.toLocaleString()} lbs</span>
                                </div>

                                {lastWorkout.prs_broken > 0 && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-amber-500 text-sm font-medium flex items-center gap-2"><Target className="w-4 h-4" /> New PRs!</span>
                                        <span className="font-bold text-amber-500 text-lg">{lastWorkout.prs_broken}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-muted-foreground opacity-50" />
                            </div>
                            <p className="text-sm text-muted-foreground">No workouts logged yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
