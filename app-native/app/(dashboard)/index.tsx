import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { WORKOUT_SPLITS } from '../../lib/workoutTemplates';
import { HapticButton } from '../../components/HapticButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardHome() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState<any>(null);
    const [currentWeight, setCurrentWeight] = useState<number>(0);
    const [recentWeightLogs, setRecentWeightLogs] = useState<any[]>([]);
    const [recentWeights, setRecentWeights] = useState<number[]>([]);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [mealLogs, setMealLogs] = useState<any[]>([]);
    const [customSchedule, setCustomSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Fetch profile
                    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    setProfile(profileData);
                    if (profileData) {
                        setIsPremium(profileData.subscription_status === 'active');
                    }

                    // Fetch latest weight and trend
                    const { data: weightData } = await supabase.from('weight_logs').select('weight, logged_date').eq('user_id', user.id).order('logged_date', { ascending: false }).limit(4);
                    if (weightData && weightData.length > 0) {
                        setCurrentWeight(weightData[0].weight);
                        setRecentWeightLogs(weightData);
                        setRecentWeights([...weightData].reverse().map(w => w.weight));
                    }

                    // Fetch workout history
                    const { data: history } = await supabase.from('workout_logs').select('*').eq('user_id', user.id).order('logged_date', { ascending: false });
                    setWorkouts(history || []);

                    // Fetch today's meals
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const localDateStr = `${year}-${month}-${day}`;

                    const { data: meals } = await supabase.from('meal_logs')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('date', localDateStr);
                    setMealLogs(meals || []);

                    const { data: scheduleData } = await supabase.from('program_schedule')
                        .select('*')
                        .eq('user_id', user.id);
                    setCustomSchedule(scheduleData || []);
                }
                setLoading(false);
            }
            fetchData();
        }, []));

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator color="#fff" size="large" />
            </View>
        );
    }

    // Goal Progress Calculations
    const hasTarget = profile?.target_weight && currentWeight > 0;
    const goalType = profile?.primary_goal || 'build_muscle'; // fallback

    let goalPercent = 0;
    let goalMessageNode: React.ReactNode = null;

    if (hasTarget) {
        const target = profile.target_weight;
        const current = currentWeight;
        const totalJourney = 20; // Default mockup journey range

        if (goalType === 'lose_fat') {
            const difference = current - target;
            if (difference > 0) {
                goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">{difference.toFixed(1)} lbs</Text> until goal weight</Text>;
                goalPercent = Math.max(0, Math.min(100, ((totalJourney - difference) / totalJourney) * 100));
            } else {
                goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">Goal reached</Text></Text>;
                goalPercent = 100;
            }
        } else if (goalType === 'build_muscle') {
            const difference = target - current;
            if (difference > 0) {
                goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">{difference.toFixed(1)} lbs</Text> until goal weight</Text>;
                goalPercent = Math.max(0, Math.min(100, ((totalJourney - difference) / totalJourney) * 100));
            } else {
                const absDiff = Math.abs(difference);
                if (absDiff > 0) {
                    goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">+{absDiff.toFixed(1)} lbs</Text> above goal</Text>;
                } else {
                    goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">Goal reached</Text></Text>;
                }
                goalPercent = 100;
            }
        } else if (goalType === 'recomp') {
            const diff = current - target;
            const sign = diff > 0 ? '+' : (diff < 0 ? '-' : '');
            goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">{sign}{Math.abs(diff).toFixed(1)} lbs</Text> from target weight</Text>;
            const absDiff = Math.abs(diff);
            goalPercent = Math.max(0, Math.min(100, ((totalJourney - absDiff) / totalJourney) * 100));
        } else {
            // Maintain Weight
            const diff = current - target;
            const sign = diff > 0 ? '+' : (diff < 0 ? '-' : '');
            goalMessageNode = <Text className="text-zinc-400 font-medium text-sm"><Text className="text-white font-bold">{sign}{Math.abs(diff).toFixed(1)} lbs</Text> from maintenance weight</Text>;
            const absDiff = Math.abs(diff);
            goalPercent = Math.max(0, Math.min(100, ((totalJourney - absDiff) / totalJourney) * 100));
        }
    }

    // Macro Progress Calculations (Actual data from meal_logs)
    const targetCalories = profile?.calories_target || 2450;
    const targetProtein = profile?.protein_target || 180;
    const targetCarbs = profile?.carbs_target || 250;
    const targetFats = profile?.fat_target || 80;

    const consumedCalories = mealLogs.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const consumedProtein = mealLogs.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const consumedCarbs = mealLogs.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const consumedFats = mealLogs.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    const percentCalories = Math.min(100, (consumedCalories / targetCalories) * 100);
    const percentProtein = Math.min(100, (consumedProtein / targetProtein) * 100);
    const percentCarbs = Math.min(100, (consumedCarbs / targetCarbs) * 100);
    const percentFats = Math.min(100, (consumedFats / targetFats) * 100);

    const caloriesRemaining = Math.max(0, targetCalories - consumedCalories);

    // Streak Calculation
    let streak = 0;
    let lastWorkoutText = "No recent workouts";
    if (workouts.length > 0) {
        streak = Math.min(workouts.length, 5); // Mocked continuous streak up to 5 for now
        const lastDate = new Date(workouts[0].logged_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) lastWorkoutText = "Today";
        else if (diffDays === 2) lastWorkoutText = "Yesterday";
        else lastWorkoutText = `${diffDays} days ago`;
    }

    // Today's Workout & Smart Rest Parsing
    let todaysCompletedWorkout: any = null;
    let nextWorkoutDay: any = null;

    if (workouts.length > 0) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const localDateStr = `${year}-${month}-${day}`;
        todaysCompletedWorkout = workouts.find((w: any) => w.logged_date.startsWith(localDateStr));
    }

    const activeSplitId = profile?.selected_program_split;
    const activeSplit = WORKOUT_SPLITS.find((s: any) => s.id === activeSplitId);

    if (activeSplit) {
        const lastLoggedName = workouts.length > 0 ? workouts[0].name : null;
        let nextIdx = 0;

        if (lastLoggedName) {
            const lastIdx = activeSplit.days.findIndex((d: any) => d.name === lastLoggedName);
            if (lastIdx !== -1 && lastIdx < activeSplit.days.length - 1) {
                nextIdx = lastIdx + 1; // Increment sequentially to the next day
            } else if (lastIdx === activeSplit.days.length - 1) {
                nextIdx = 0; // Successfully loop back to split start
            }
        }
        nextWorkoutDay = activeSplit.days[nextIdx];
    }

    // Daily Motivational Quotes
    const quotes = [
        "Discipline beats motivation.",
        "One more day of consistency.",
        "Today's work builds tomorrow's physique.",
        "Stay on target.",
        "Progress is earned.",
        "Excuses don't burn calories.",
        "You vs. You."
    ];
    // Use the current day of the year to select a daily quote consistently
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const dailyQuote = quotes[dayOfYear % quotes.length];

    // Recent Activity Feed
    const combinedActivity = [
        ...workouts.map(w => ({
            id: `w-${w.id}`,
            type: 'workout' as const,
            title: w.name,
            exercise_count: w.exercise_count || 0,
            duration_minutes: w.duration_minutes || 0,
            prs_broken: w.prs_broken || 0,
            detail: null,
            date: new Date(w.logged_date)
        })),
        ...recentWeightLogs.map(w => ({
            id: `wt-${w.logged_date}`,
            type: 'weight' as const,
            title: 'Bodyweight logged',
            exercise_count: 0,
            duration_minutes: 0,
            prs_broken: 0,
            detail: w.weight,
            date: new Date(w.logged_date)
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

    return (
        <View className="flex-1 bg-zinc-950">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                stickyHeaderIndices={!isPremium ? [1] : []}
            >
                {/* 0. Scrollable App Title */}
                <View className="bg-[#09090b] pt-4">
                    <View className="flex-row items-center justify-between px-6 pb-5 relative">
                        <HapticButton
                            hapticType="light"
                            onPress={() => router.push('/(dashboard)/profile')}
                            className="w-11 h-11 rounded-full bg-zinc-800 border-[1.5px] border-zinc-700 items-center justify-center overflow-hidden shadow-sm z-10"
                        >
                            {profile?.avatar_url ? (
                                <Image source={{ uri: profile.avatar_url }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <Text className="text-zinc-400 font-bold text-lg">
                                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'A'}
                                </Text>
                            )}
                        </HapticButton>

                        <View className="absolute inset-x-0 items-center justify-center pointer-events-none pt-2 z-0">
                            <Text className="text-white font-black text-2xl tracking-tighter leading-tight mt-1">FinalSet Fitness</Text>
                        </View>

                        <View className="w-11 h-11" />
                    </View>
                </View>

                {/* 1. Sticky Premium Banner */}
                {!isPremium && (
                    <View className="bg-[#09090b] px-6 pb-4 border-b border-zinc-900 mb-6 z-10">
                        <HapticButton
                            activeOpacity={0.8}
                            hapticType="light"
                            onPress={() => router.push('/(dashboard)/paywall')}
                            className="w-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-2xl pb-4 pt-3 px-5 shadow-sm"
                        >
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="star" size={14} color="#0ea5e9" className="mr-2" solid />
                                    <Text className="text-white font-black text-lg tracking-tight uppercase">Train Smarter.</Text>
                                </View>
                                <Text className="text-[#0ea5e9] font-bold text-xs uppercase">Unlock Premium</Text>
                            </View>
                            <View className="flex-row flex-wrap">
                                <Text className="text-zinc-300 text-xs w-1/2 mb-1">• Auto-adjusting macros</Text>
                                <Text className="text-zinc-300 text-xs w-1/2 mb-1">• Advanced analytics</Text>
                                <Text className="text-zinc-300 text-xs w-1/2 mb-1">• Custom programs</Text>
                                <Text className="text-zinc-300 text-xs w-1/2 mb-1">• Body insights & charts</Text>
                            </View>
                        </HapticButton>
                    </View>
                )}

                <View className="px-6">
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-white mb-1 tracking-tight">
                            Hello, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                        </Text>
                        <Text className="text-zinc-400">Ready to crush your goals today?</Text>
                    </View>

                    {/* Goal Progress Widget */}
                    <HapticButton
                        hapticType="light"
                        onPress={() => router.push('/(dashboard)/goals')}
                        activeOpacity={0.8}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-4 shadow-sm"
                    >
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-3">
                                <FontAwesome5 name="bullseye" size={14} color="#0ea5e9" />
                            </View>
                            <Text className="text-lg font-bold text-white">Goal Progress</Text>
                        </View>

                        {hasTarget ? (
                            <View>
                                <View className="flex-row justify-between mb-3">
                                    <View>
                                        <Text className="text-white font-bold text-2xl tracking-tighter">{currentWeight}</Text>
                                        <Text className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Current</Text>
                                    </View>
                                    <FontAwesome5 name="long-arrow-alt-right" size={18} color="#52525b" style={{ marginTop: 8 }} />
                                    <View className="items-end">
                                        <Text className="text-primary font-bold text-2xl tracking-tighter">{profile.target_weight}</Text>
                                        <Text className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Target</Text>
                                    </View>
                                </View>

                                <View className="h-4 bg-zinc-950 rounded-full overflow-hidden mb-3 border border-zinc-800">
                                    <View className="h-full bg-primary rounded-full" style={{ width: `${goalPercent}%` }} />
                                </View>

                                <View className="flex-row justify-between">
                                    {goalMessageNode}
                                    <Text className="text-primary font-bold">{Math.round(goalPercent)}%</Text>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center py-4">
                                <Text className="text-zinc-400 mb-2">No weight goal set.</Text>
                                <Text className="text-primary font-bold">Set Goal</Text>
                            </View>
                        )}
                    </HapticButton>

                    {/* Motivational Widget */}
                    <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-5 shadow-sm">
                        <View className="flex-row items-start mb-2">
                            <FontAwesome5 name="quote-left" size={14} color="#0ea5e9" className="mr-3 mt-1" />
                            <Text className="text-white font-bold text-lg tracking-tight italic flex-1 leading-6">"{dailyQuote}"</Text>
                        </View>
                        <Text className="text-zinc-500 font-medium text-xs text-right">— Daily Motivation</Text>
                    </View>

                    {/* Streak & Trend Row */}
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                            <Text className="text-white font-bold text-lg mb-1">🔥 {streak} Day Streak</Text>
                            <Text className="text-zinc-500 text-xs text-balance">Last: {lastWorkoutText}</Text>
                        </View>
                        <HapticButton hapticType="light" onPress={() => router.push('/(dashboard)/weight')} activeOpacity={0.8} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm justify-center">
                            <Text className="text-zinc-400 font-medium text-xs mb-1">Weight Trend</Text>
                            <Text className="text-white font-bold text-[15px] tracking-tighter">
                                {recentWeights.length > 0 ? recentWeights.join(' → ') : '--'}
                            </Text>
                        </HapticButton>
                    </View>

                    {/* Progress & Analytics Button */}
                    <HapticButton
                        hapticType="light"
                        onPress={() => {
                            if (!isPremium) {
                                router.push('/(dashboard)/paywall');
                            } else {
                                router.push('/(dashboard)/progress');
                            }
                        }}
                        activeOpacity={0.8}
                        className="bg-primary/10 border border-primary/20 rounded-3xl p-5 mb-5 flex-row items-center justify-between shadow-sm"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-4">
                                <FontAwesome5 name="chart-line" size={16} color="#0ea5e9" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">View Insights</Text>
                                <Text className="text-primary/80 font-medium text-xs uppercase tracking-wider mt-0.5">Progress & Analytics</Text>
                            </View>
                        </View>
                        <FontAwesome5 name="chevron-right" size={14} color="#0ea5e9" />
                    </HapticButton>

                    {/* Contextual Premium Prompt */}
                    {!isPremium && workouts.length >= 2 && (
                        <HapticButton
                            hapticType="light"
                            onPress={() => router.push('/(dashboard)/paywall')}
                            activeOpacity={0.8}
                            className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-4 mb-5 shadow-sm flex-row items-center justify-between"
                        >
                            <View className="flex-1 mr-4">
                                <Text className="text-white font-bold text-sm mb-1">Train Smarter</Text>
                                <Text className="text-zinc-400 text-xs">Unlock adaptive macros & advanced analytics</Text>
                            </View>
                            <View className="bg-amber-500 px-4 py-2 rounded-xl">
                                <Text className="text-black font-bold text-xs uppercase">Upgrade</Text>
                            </View>
                        </HapticButton>
                    )}

                    {/* Today's Workout or Rest */}
                    {todaysCompletedWorkout ? (
                        <View className="bg-zinc-900 border border-emerald-500/20 rounded-3xl p-6 mb-4 shadow-sm relative overflow-hidden">
                            <View className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                            <View className="flex-row items-center justify-between mb-4 relative z-10">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
                                        <FontAwesome5 name="check" size={14} color="#10b981" />
                                    </View>
                                    <Text className="text-lg font-bold text-white">Workout Complete</Text>
                                </View>
                            </View>
                            <Text className="text-2xl font-black text-white mb-1 relative z-10">{todaysCompletedWorkout.name} completed</Text>
                            <Text className="text-emerald-400/80 font-medium text-sm relative z-10 mb-2 mt-0.5">Great job crushing your goals today.</Text>

                            <View className="flex-row items-center mt-4 pt-4 border-t border-zinc-800/80 relative z-10 gap-x-4">
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="list-ul" size={12} color="#a1a1aa" className="mr-2" />
                                    <Text className="text-zinc-300 font-medium text-xs">{todaysCompletedWorkout.exercise_count || 0} exercises</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="clock" size={12} color="#a1a1aa" className="mr-2" />
                                    <Text className="text-zinc-300 font-medium text-xs">{todaysCompletedWorkout.duration_minutes || 0} min</Text>
                                </View>
                                {todaysCompletedWorkout.prs_broken > 0 && (
                                    <View className="flex-row items-center bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                        <FontAwesome5 name="trophy" size={10} color="#f59e0b" className="mr-1.5" />
                                        <Text className="text-amber-500 font-bold text-xs">{todaysCompletedWorkout.prs_broken} PRs</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-4 shadow-sm relative overflow-hidden">
                            <View className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

                            <View className="flex-row items-center justify-between mb-4 relative z-10">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-indigo-500/10 items-center justify-center mr-3 border border-indigo-500/20">
                                        <FontAwesome5 name="bed" size={12} color="#818cf8" />
                                    </View>
                                    <Text className="text-lg font-bold text-white tracking-tight">Rest Day</Text>
                                </View>
                            </View>

                            <Text className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Recovery matters.</Text>
                            <Text className="text-zinc-400 mb-6 relative z-10">
                                {nextWorkoutDay ? `Next up: ${nextWorkoutDay.name}` : 'Take time to recover before your next session.'}
                            </Text>

                            <HapticButton
                                hapticType="success"
                                onPress={() => router.push('/(dashboard)/workouts')}
                                className="w-full bg-primary py-3 rounded-xl items-center relative z-10"
                            >
                                <Text className="text-black font-bold">Start Workout</Text>
                            </HapticButton>
                        </View>
                    )}

                    {/* Today's Macros Widget */}
                    <HapticButton
                        hapticType="light"
                        onPress={() => router.push('/(dashboard)/daily-macros')}
                        activeOpacity={0.8}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-sm"
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-orange-500/20 items-center justify-center mr-3">
                                    <FontAwesome5 name="fire-alt" size={14} color="#f97316" />
                                </View>
                                <Text className="text-lg font-bold text-white">Today's Macros</Text>
                            </View>
                            <View className="items-end bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                <Text className="text-orange-500 font-bold text-base leading-tight">{caloriesRemaining}</Text>
                                <Text className="text-orange-500/70 text-[9px] uppercase font-bold tracking-wider">Kcal Left</Text>
                            </View>
                        </View>

                        {/* Calories Progress */}
                        <View className="mb-5">
                            <View className="flex-row justify-between mb-1.5">
                                <Text className="text-white font-bold">Calories</Text>
                                <Text className="text-zinc-400 font-medium text-xs"><Text className="text-white">{consumedCalories}</Text> / {targetCalories} kcal</Text>
                            </View>
                            <View className="h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                                <View className="h-full bg-orange-500 rounded-full" style={{ width: `${percentCalories}%` }} />
                            </View>
                        </View>

                        {/* Protein Progress */}
                        <View className="mb-5">
                            <View className="flex-row justify-between mb-1.5">
                                <Text className="text-white font-bold">Protein</Text>
                                <Text className="text-zinc-400 font-medium text-xs"><Text className="text-white">{consumedProtein}</Text> / {targetProtein} g</Text>
                            </View>
                            <View className="h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                                <View className="h-full bg-blue-500 rounded-full" style={{ width: `${percentProtein}%` }} />
                            </View>
                        </View>

                        {/* Carbs Progress */}
                        <View className="mb-5">
                            <View className="flex-row justify-between mb-1.5">
                                <Text className="text-white font-bold">Carbs</Text>
                                <Text className="text-zinc-400 font-medium text-xs"><Text className="text-white">{consumedCarbs}</Text> / {targetCarbs} g</Text>
                            </View>
                            <View className="h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                                <View className="h-full bg-purple-500 rounded-full" style={{ width: `${percentCarbs}%` }} />
                            </View>
                        </View>

                        {/* Fats Progress */}
                        <View>
                            <View className="flex-row justify-between mb-1.5">
                                <Text className="text-white font-bold">Fats</Text>
                                <Text className="text-zinc-400 font-medium text-xs"><Text className="text-white">{consumedFats}</Text> / {targetFats} g</Text>
                            </View>
                            <View className="h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                                <View className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentFats}%` }} />
                            </View>
                        </View>
                    </HapticButton>



                    {/* Recent Activity Widget */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-white mb-4 px-1">Recent Activity</Text>
                        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden p-2">
                            {combinedActivity.length > 0 ? (
                                combinedActivity.map((activity, index) => (
                                    <View
                                        key={activity.id}
                                        className={`flex-row items-center justify-between p-4 ${index !== combinedActivity.length - 1 ? 'border-b border-zinc-800/50' : ''}`}
                                    >
                                        <View className="flex-row items-center flex-1 pr-4">
                                            <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${activity.type === 'workout' ? 'bg-primary/10' : 'bg-emerald-500/10'}`}>
                                                <FontAwesome5 name={activity.type === 'workout' ? 'dumbbell' : 'weight'} size={12} color={activity.type === 'workout' ? '#0ea5e9' : '#10b981'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-base mb-0.5">{activity.title}</Text>
                                                {activity.type === 'workout' ? (
                                                    <View>
                                                        <Text className="text-zinc-500 text-xs">
                                                            {activity.exercise_count} exercises • {activity.duration_minutes} min
                                                        </Text>
                                                        {(activity.prs_broken || 0) > 0 && (
                                                            <Text className="text-amber-500 font-medium text-xs mt-0.5">
                                                                {activity.prs_broken} PR{activity.prs_broken === 1 ? '' : 's'} achieved
                                                            </Text>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <Text className="text-zinc-500 text-xs">
                                                        {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            {activity.type === 'workout' ? (
                                                <Text className="text-zinc-500 font-medium text-xs">
                                                    {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </Text>
                                            ) : (
                                                <Text className="text-zinc-300 font-medium font-mono text-sm">{activity.detail}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View className="p-8 items-center justify-center">
                                    <Text className="text-zinc-500 font-medium">No recent activity found.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView >
        </View >
    );
}
