import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getSupabaseClient } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { HapticButton } from '../../components/HapticButton';
import { subDays, startOfWeek, startOfMonth, isAfter } from 'date-fns';

export default function ProgressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);

    // Weight
    const [weightLogs, setWeightLogs] = useState<any[]>([]);
    const [weightRange, setWeightRange] = useState<'7D' | '30D' | '90D'>('30D');

    // Workout
    const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);

    // Profile
    const [profile, setProfile] = useState<any>(null);

    // Exercise
    const [exerciseLogs, setExerciseLogs] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await getSupabaseClient().auth.getUser();
        if (!user) return;

        const [profileRes, weightRes, workoutRes, exerciseRes] = await Promise.all([
            getSupabaseClient().from('profiles').select('target_weight, weight, primary_goal').eq('id', user.id).single(),
            getSupabaseClient().from('weight_logs').select('weight, logged_date').eq('user_id', user.id).order('logged_date', { ascending: false }),
            getSupabaseClient().from('workout_logs').select('id, logged_date, prs_broken').eq('user_id', user.id).order('logged_date', { ascending: false }),
            getSupabaseClient().from('exercise_logs').select('id, exercise_id, max_weight, max_reps, is_pr, completed_at').eq('user_id', user.id).order('completed_at', { ascending: false })
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (weightRes.data) setWeightLogs(weightRes.data);
        if (workoutRes.data) setWorkoutLogs(workoutRes.data);
        if (exerciseRes.data) setExerciseLogs(exerciseRes.data);

        setLoading(false);
    };

    // Calculate Weight Summary
    const renderWeightSummary = () => {
        if (weightLogs.length < 2) return <Text className="text-zinc-500 text-sm mt-3">Log more weight data to see trends.</Text>;
        const latest = weightLogs[0].weight;
        const daysToSub = weightRange === '7D' ? 7 : weightRange === '30D' ? 30 : 90;
        const cutoff = subDays(new Date(), daysToSub);

        let oldestInRange = weightLogs[weightLogs.length - 1].weight;
        for (let i = weightLogs.length - 1; i >= 0; i--) {
            if (isAfter(new Date(weightLogs[i].logged_date), cutoff)) {
                oldestInRange = weightLogs[i].weight;
                break;
            }
        }

        const delta = latest - oldestInRange;
        if (delta === 0) return <Text className="text-zinc-400 text-sm font-medium mt-1">Weight maintained.</Text>;
        const prefix = delta > 0 ? "Up" : "Down";
        const color = delta > 0 ? "text-amber-500" : "text-emerald-500";
        return <Text className={`${color} text-sm font-bold mt-1`}>{prefix} {Math.abs(delta).toFixed(1)} lbs this period</Text>;
    };

    // 1. Goal Alignment Logic
    const renderGoalAlignment = () => {
        if (!profile || !profile.primary_goal || weightLogs.length < 2) return null;

        const latest = weightLogs[0].weight;
        const cutoff = subDays(new Date(), 21); // Analyze over last 3 weeks

        let oldestInRange = weightLogs[weightLogs.length - 1].weight;
        for (let i = weightLogs.length - 1; i >= 0; i--) {
            if (isAfter(new Date(weightLogs[i].logged_date), cutoff)) {
                oldestInRange = weightLogs[i].weight;
                break;
            }
        }

        const delta = latest - oldestInRange;
        const goal = profile.primary_goal;

        let message = "We need more weekly data to analyze your specific progress.";
        let color = "text-zinc-400";
        let icon = "minus";

        if (goal === 'lose_fat') {
            if (delta <= -0.5) { message = "You are beautifully on track for your fat loss goal."; color = "text-emerald-500"; icon = "check-circle"; }
            else if (delta > 0.5) { message = "Your weight trend is moving opposite to your target."; color = "text-rose-500"; icon = "exclamation-circle"; }
            else { message = "Your fat loss progress has stalled over the last 3 weeks."; color = "text-amber-500"; icon = "exclamation-triangle"; }
        } else if (goal === 'build_muscle') {
            if (delta >= 0.5) { message = "Your weight is trending upward, safely supporting muscle gain."; color = "text-emerald-500"; icon = "check-circle"; }
            else if (delta < -0.5) { message = "Your weight trajectory is dropping opposite to your target."; color = "text-rose-500"; icon = "exclamation-circle"; }
            else { message = "Your weight gain trajectory has stalled recently."; color = "text-amber-500"; icon = "exclamation-triangle"; }
        } else {
            if (Math.abs(delta) <= 1.5) { message = "You are successfully maintaining your current baseline."; color = "text-emerald-500"; icon = "check-circle"; }
            else { message = "Your baseline weight is drifting away from maintenance levels."; color = "text-amber-500"; icon = "exclamation-triangle"; }
        }

        return (
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 shadow-sm overflow-hidden relative">
                <View className="absolute top-0 left-0 right-0 h-1 bg-zinc-800/40" />
                <View className="flex-row items-center">
                    <FontAwesome5 name={icon} size={20} className={`${color} mr-4`} />
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg mb-1">Goal Alignment</Text>
                        <Text className={`${color} text-sm font-medium leading-5`}>{message}</Text>
                    </View>
                </View>
            </View>
        );
    };

    // 4. Strength / Progression Logic
    const renderStrengthProgression = () => {
        if (!exerciseLogs.length) return null;

        // Find most improved exercise explicitly traversing objects
        const groups: { [key: string]: { min: number, max: number } } = {};
        exerciseLogs.forEach(log => {
            if (log.max_weight > 0) {
                if (!groups[log.exercise_id]) groups[log.exercise_id] = { min: log.max_weight, max: log.max_weight };
                else {
                    groups[log.exercise_id].min = Math.min(groups[log.exercise_id].min, log.max_weight);
                    groups[log.exercise_id].max = Math.max(groups[log.exercise_id].max, log.max_weight);
                }
            }
        });

        let mostImprovedId = null;
        let maxDelta = 0;
        let maxPct = 0;
        for (const [eId, stats] of Object.entries(groups)) {
            const pct = stats.min > 0 ? (stats.max - stats.min) / stats.min : 0;
            if (pct > maxPct) {
                maxPct = pct;
                mostImprovedId = eId;
                maxDelta = stats.max - stats.min;
            }
        }

        const recentPRs = exerciseLogs.filter(log => log.is_pr).slice(0, 2);

        return (
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 shadow-sm">
                <View className="flex-row items-center mb-5">
                    <FontAwesome5 name="fire" size={16} color="#f97316" className="mr-3" />
                    <Text className="text-white font-bold text-lg">Strength Progress</Text>
                </View>

                {mostImprovedId && maxDelta > 0 ? (
                    <View className="mb-5 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/80">
                        <Text className="text-zinc-500 font-medium text-xs uppercase tracking-wider mb-1">Most Improved</Text>
                        <Text className="text-white font-bold text-base mb-1">{mostImprovedId}</Text>
                        <Text className="text-emerald-500 font-bold text-sm">+{maxDelta.toFixed(1)} lbs <Text className="text-emerald-500/70 font-medium">overall progression</Text></Text>
                    </View>
                ) : (
                    <Text className="text-zinc-500 text-sm mb-4">Keep logging sets to detect strength progression curves.</Text>
                )}

                {recentPRs.length > 0 && (
                    <View>
                        <Text className="text-zinc-500 font-medium text-xs uppercase tracking-wider mb-2">Recent PRs</Text>
                        {recentPRs.map((pr, i) => (
                            <View key={i} className="flex-row justify-between items-center bg-zinc-950 p-3 rounded-xl mb-2 border border-zinc-800/50">
                                <Text className="text-white font-medium flex-1">{pr.exercise_id}</Text>
                                <Text className="text-fuchsia-500 font-bold ml-2">{pr.max_weight} lbs</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    // 5. Next Step Summary
    const renderNextStep = () => {
        let stepMessage = "Keep logging your weight and workouts consistently to unlock deeper pattern insights.";

        if (workoutLogs.length > 3 && weightLogs.length > 3 && profile) {
            const recentWorkouts = workoutLogs.filter(w => isAfter(new Date(w.logged_date), subDays(new Date(), 14))).length;

            if (recentWorkouts < 3) {
                stepMessage = "You may need to focus heavily on training consistency this week to break through.";
            } else {
                if (profile.primary_goal === 'lose_fat') {
                    stepMessage = "Training pace is excellent! If scale progress stalls, consider a slight caloric intervention.";
                } else if (profile.primary_goal === 'build_muscle') {
                    stepMessage = "Training volume is solid! If mass stalls, consider increasing your surplus calories slightly.";
                } else {
                    stepMessage = "Keep up your current pace. You are accumulating highly valuable strength data consistently.";
                }
            }
        }

        return (
            <View className="bg-blue-900/10 border border-blue-500/30 rounded-3xl p-6 mb-8 shadow-sm">
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="lightbulb" size={16} color="#3b82f6" className="mr-3" />
                    <Text className="text-white font-bold text-lg">Next Step Insights</Text>
                </View>
                <Text className="text-blue-100/90 font-medium leading-6 text-sm">{stepMessage}</Text>
            </View>
        );
    };

    // Workout Consistency metrics
    const workoutsThisWeek = workoutLogs.filter(w => isAfter(new Date(w.logged_date), startOfWeek(new Date(), { weekStartsOn: 1 }))).length;
    const workoutsThisMonth = workoutLogs.filter(w => isAfter(new Date(w.logged_date), startOfMonth(new Date()))).length;

    let weekInsight = "You haven't logged any training sessions this week.";
    if (workoutsThisWeek >= 4) weekInsight = `You trained heavily this week (${workoutsThisWeek} sessions).`;
    else if (workoutsThisWeek >= 2) weekInsight = `Moderate consistency (${workoutsThisWeek} sessions).`;
    else if (workoutsThisWeek === 1) weekInsight = `Off to a slow start (${workoutsThisWeek} session).`;

    let monthInsight = "Training volume is low this period.";
    if (workoutsThisMonth >= 12) monthInsight = `You've been highly consistent for weeks.`;
    else if (workoutsThisMonth >= 6) monthInsight = `Building reliable month-over-month habits.`;
    else if (workoutsThisMonth > 0) monthInsight = `Inconsistent monthly execution.`;

    return (
        <View className="flex-1 bg-zinc-950" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-900">
                <HapticButton hapticType="light" onPress={() => router.back()} className="p-2 -ml-2">
                    <FontAwesome5 name="arrow-left" size={20} color="#0ea5e9" />
                </HapticButton>
                <Text className="text-white font-bold text-xl">Progress & Analytics</Text>
                <View className="w-9" />
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator color="#0ea5e9" size="large" />
                </View>
            ) : (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>

                    {/* Section 1: Goal Alignment */}
                    {renderGoalAlignment()}

                    {/* Section 2: Weight Trend */}
                    <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 shadow-sm">
                        <View className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center border-b border-0">
                                <FontAwesome5 name="chart-line" size={16} color="#0ea5e9" className="mr-3" />
                                <Text className="text-white font-bold text-lg">Weight Trend</Text>
                            </View>
                            <View className="flex-row bg-zinc-950 rounded-lg border border-zinc-800 p-1">
                                {['7D', '30D', '90D'].map(r => (
                                    <HapticButton
                                        key={r}
                                        hapticType="light"
                                        onPress={() => setWeightRange(r as any)}
                                        className={`px-3 py-1 rounded-md ${weightRange === r ? 'bg-zinc-800' : ''}`}
                                    >
                                        <Text className={`font-bold text-xs ${weightRange === r ? 'text-white' : 'text-zinc-500'}`}>{r}</Text>
                                    </HapticButton>
                                ))}
                            </View>
                        </View>
                        <View>
                            <Text className="text-4xl font-black text-white tracking-tighter">{weightLogs[0]?.weight || '--'} <Text className="text-zinc-500 text-xl font-medium tracking-normal">lbs</Text></Text>
                        </View>
                        {renderWeightSummary()}
                    </View>

                    {/* Section 3: Consistency Insights */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                            <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center mb-3">
                                <FontAwesome5 name="calendar-week" size={12} color="#a1a1aa" />
                            </View>
                            <Text className="text-white font-bold text-sm mb-1">Trailing Week</Text>
                            <Text className="text-zinc-400 font-medium text-xs leading-4">{weekInsight}</Text>
                        </View>
                        <View className="flex-1 bg-zinc-900 border border-primary/20 rounded-3xl p-5 shadow-sm">
                            <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mb-3">
                                <FontAwesome5 name="calendar-alt" size={12} color="#0ea5e9" />
                            </View>
                            <Text className="text-primary font-bold text-sm mb-1">Trailing Month</Text>
                            <Text className="text-primary/70 font-medium text-xs leading-4">{monthInsight}</Text>
                        </View>
                    </View>

                    {/* Section 4: Strength / Progression */}
                    {renderStrengthProgression()}

                    {/* Section 5: Summary / Next Step */}
                    {renderNextStep()}

                </ScrollView>
            )}
        </View>
    );
}
