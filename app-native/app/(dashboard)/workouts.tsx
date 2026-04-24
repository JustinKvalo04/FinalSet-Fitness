import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, Image, Modal, Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { WORKOUT_SPLITS, WorkoutSplit, WorkoutDayTemplate, resolveWorkoutDay, CustomWorkoutOverrides } from '../../lib/workoutTemplates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import * as Haptics from 'expo-haptics';
import { getExerciseImage } from '../../lib/exerciseImages';
import { resolveCanonicalExercise } from '../../lib/exercises';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';
import { useUpsellFrequency } from '../../hooks/useUpsellFrequency';

const ExerciseIcon = ({ name, target }: { name: string, target?: string }) => {
    const imageSource = getExerciseImage(name, target);

    return (
        <View className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 items-center justify-center mr-5 overflow-hidden relative">
            <View className="w-full h-full bg-zinc-700/30 absolute top-0 left-0 z-10" />
            {imageSource ? (
                <Image source={imageSource} className="w-full h-full absolute top-0 left-0" resizeMode="cover" />
            ) : (
                <FontAwesome5 name="dumbbell" size={20} color="#52525b" />
            )}
        </View>
    );
};

export default function Workouts() {
    const router = useRouter();
    const { canShowPostWorkoutCard, incrementPostWorkoutCount } = useUpsellFrequency();
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('splits'); // 'splits', 'history'
    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Navigation State
    const [persistedSplitId, setPersistedSplitId] = useState<string | null>(null);
    const [selectedSplit, setSelectedSplit] = useState<WorkoutSplit | null>(null);
    const [selectedDay, setSelectedDay] = useState<WorkoutDayTemplate | null>(null);
    const [customOverrides, setCustomOverrides] = useState<CustomWorkoutOverrides | null>(null);
    const [isLogging, setIsLogging] = useState(false);
    const [showDaySelectModal, setShowDaySelectModal] = useState(false);

    // Logging State
    const [exerciseLogs, setExerciseLogs] = useState<Record<string, { weight: string, reps: string }[]>>({});
    const [prs, setPrs] = useState('0');
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const insets = useSafeAreaInsets();

    const inputRefs = useRef<Record<string, TextInput | null>>({});

    useFocusEffect(
        React.useCallback(() => {
            fetchWorkouts();
        }, [])
    );

    async function fetchWorkouts() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('selected_program_split, subscription_status, custom_workout_overrides').eq('id', user.id).single();
            if (profile) {
                setIsPremium(profile.subscription_status === 'active');
                if (profile.custom_workout_overrides) {
                    setCustomOverrides(profile.custom_workout_overrides as CustomWorkoutOverrides);
                }
                if (profile.selected_program_split) {
                    setPersistedSplitId(profile.selected_program_split);
                    const matchingSplit = WORKOUT_SPLITS.find(s => s.id === profile.selected_program_split);
                    if (matchingSplit) {
                        setSelectedSplit(matchingSplit);
                    }
                }
            }

            // Fetch history
            const { data: history } = await supabase.from('workout_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('logged_date', { ascending: false })
                .limit(10);
            setWorkouts(history || []);
        }
        setLoading(false);
    }

    const selectAndPersistSplit = async (split: WorkoutSplit) => {
        setPersistedSplitId(split.id);
        setSelectedSplit(split);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('profiles').update({ selected_program_split: split.id }).eq('id', user.id);
        }
    };

    const handleChangeProgram = async () => {
        Alert.alert(
            "Change Program",
            "Are you sure you want to switch your workout program?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Change",
                    onPress: async () => {
                        setPersistedSplitId(null);
                        setSelectedSplit(null);
                        setSelectedDay(null);
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                            await supabase.from('profiles').update({ selected_program_split: null }).eq('id', user.id);
                            // Purge existing custom schedule to enforce a fresh start for the new split
                            await supabase.from('program_schedule').delete().eq('user_id', user.id);
                        }
                    }
                }
            ]
        );
    };

    const handlePremiumAction = (actionName: string) => {
        if (!isPremium) {
            if (actionName === 'Edit Exercises' || actionName === 'Create Custom Program' || actionName === 'Edit Program') {
                setShowPremiumModal(true);
            } else {
                router.push('/(dashboard)/paywall');
            }
        } else {
            if (actionName === 'Edit Program' || actionName === 'Create Custom Program') {
                setShowDaySelectModal(true);
            }
        }
    };

    const startWorkout = (day: WorkoutDayTemplate) => {
        setSelectedDay(day);
        setIsLogging(true);
        setSessionStartTime(new Date());
        const initial: Record<string, { weight: string, reps: string }[]> = {};
        day.exercises.forEach(ex => {
            initial[ex.id] = Array.from({ length: ex.sets }).map(() => ({ weight: '', reps: '' }));
        });
        setExerciseLogs(initial);
        setPrs('0');
    };

    const updateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
        setExerciseLogs(prev => {
            const next = { ...prev };
            next[exerciseId][setIndex] = { ...next[exerciseId][setIndex], [field]: value };
            return next;
        });
    };

    const handleNextInput = (exIdx: number, setIdx: number, field: 'weight' | 'reps') => {
        if (!selectedDay) return;
        const currentEx = selectedDay.exercises[exIdx];

        if (field === 'weight') {
            // Jump to reps in the same set
            inputRefs.current[`${exIdx}-${setIdx}-reps`]?.focus();
        } else if (field === 'reps') {
            // Jump to next set weight if it exists
            if (setIdx + 1 < currentEx.sets) {
                inputRefs.current[`${exIdx}-${setIdx + 1}-weight`]?.focus();
            } else {
                // Next exercise first set
                if (exIdx + 1 < selectedDay.exercises.length) {
                    inputRefs.current[`${exIdx + 1}-0-weight`]?.focus();
                } else {
                    // Last input of workout, jump to PRs or dismiss
                    inputRefs.current['prs']?.focus();
                }
            }
        }
    };

    const handleLogWorkout = async () => {
        setSubmitting(true);

        let durationMinutes = 0;
        if (sessionStartTime) {
            durationMinutes = Math.max(1, Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000));
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !selectedDay) {
            setSubmitting(false);
            return;
        }

        // Process each exercise
        const exercisesToLog: any[] = [];
        let prsDetected = 0;

        for (const ex of selectedDay.exercises) {
            const logs = exerciseLogs[ex.id] || [];
            let maxWeight = 0;
            let bestReps = 0;
            let completedSets = 0;

            logs.forEach(s => {
                const w = parseFloat(s.weight) || 0;
                const r = parseInt(s.reps) || 0;
                if (w > 0 || r > 0) completedSets++;

                if (w > maxWeight) {
                    maxWeight = w;
                    bestReps = r;
                } else if (w === maxWeight && maxWeight > 0) {
                    if (r > bestReps) bestReps = r;
                }
            });

            if (completedSets > 0) {
                const matchedCanonical = resolveCanonicalExercise(ex.name);
                let muscleGroup = matchedCanonical ? matchedCanonical.muscle_group : 'Other';

                // Fallback fuzzy inference exclusively for unmatched custom text
                if (!matchedCanonical) {
                    const nameLow = ex.name.toLowerCase();
                    if (nameLow.includes('bench') || nameLow.includes('pec') || nameLow.includes('chest')) muscleGroup = 'Chest';
                    else if (nameLow.includes('squat') || nameLow.includes('leg') || nameLow.includes('calf') || nameLow.includes('deadlift')) muscleGroup = 'Legs';
                    else if (nameLow.includes('row') || nameLow.includes('pull') || nameLow.includes('lat')) muscleGroup = 'Back';
                    else if (nameLow.includes('press') && (nameLow.includes('overhead') || nameLow.includes('shoulder')) || nameLow.includes('raise')) muscleGroup = 'Shoulders';
                    else if (nameLow.includes('curl') || nameLow.includes('tricep') || nameLow.includes('skull')) muscleGroup = 'Arms';
                }

                exercisesToLog.push({
                    exercise_name: ex.name,
                    muscle_group: muscleGroup,
                    sets_completed: completedSets,
                    max_weight: maxWeight,
                    best_reps: bestReps
                });
            }
        }

        // Detect PRs against historical data
        for (const exData of exercisesToLog) {
            const { data: pastEx } = await supabase.from('exercise_logs')
                .select('max_weight, best_reps')
                .eq('user_id', user.id)
                .eq('exercise_name', exData.exercise_name)
                .order('max_weight', { ascending: false })
                .order('best_reps', { ascending: false })
                .limit(1)
                .single();

            if (pastEx) {
                if (exData.max_weight > pastEx.max_weight || (exData.max_weight === pastEx.max_weight && exData.best_reps > pastEx.best_reps)) {
                    prsDetected++;
                }
            } else if (exData.max_weight > 0) {
                prsDetected++; // First time logging is a PR
            }
        }

        // Insert Workout Summary
        const { data: workoutData, error: workoutError } = await supabase.from('workout_logs').insert({
            user_id: user.id,
            name: `${selectedDay.name}`,
            duration_minutes: durationMinutes,
            exercise_count: exercisesToLog.length,
            prs_broken: prsDetected,
            logged_date: new Date().toISOString()
        }).select().single();

        if (workoutError || !workoutData) {
            Alert.alert("Error logging workout", workoutError?.message || 'Unknown error');
            setSubmitting(false);
            return;
        }

        // Insert Exercise Logs mapped to this workout_log_id
        if (exercisesToLog.length > 0) {
            const exerciseInserts = exercisesToLog.map(ex => ({
                user_id: user.id,
                workout_log_id: workoutData.id,
                ...ex,
                created_at: new Date().toISOString()
            }));
            await supabase.from('exercise_logs').insert(exerciseInserts);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setIsLogging(false);
            setSelectedDay(null);
            setSelectedSplit(null);
            setActiveTab('history');
            fetchWorkouts();
            setSubmitting(false);
            if (!isPremium) incrementPostWorkoutCount();
        }, 1500);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator color="#fff" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950">
            <KeyboardFormWrapper
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                {/* Header & Tabs only show when not actively logging */}
                {!isLogging && (
                    <View className="flex-row bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6">
                        <HapticButton
                            hapticType="light"
                            onPress={() => setActiveTab('splits')}
                            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'splits' ? 'bg-zinc-800' : ''}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'splits' ? 'text-white' : 'text-zinc-500'}`}>Program</Text>
                        </HapticButton>
                        <HapticButton
                            hapticType="light"
                            onPress={() => setActiveTab('history')}
                            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'history' ? 'bg-zinc-800' : ''}`}
                        >
                            <Text className={`font-semibold ${activeTab === 'history' ? 'text-white' : 'text-zinc-500'}`}>History</Text>
                        </HapticButton>
                    </View>
                )}

                {/* --- History Tab --- */}
                {activeTab === 'history' && !isLogging && (
                    <View className="mb-12">
                        {!isPremium && canShowPostWorkoutCard && workouts.length > 0 && (
                            <HapticButton
                                hapticType="success"
                                onPress={() => router.push('/(dashboard)/paywall')}
                                className="bg-[#0A84FF] border border-[#0A84FF]/80 rounded-3xl p-5 mb-6 shadow-lg shadow-[#0A84FF]/20 flex-row items-center"
                            >
                                <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center mr-4">
                                    <FontAwesome5 name="lightbulb" size={20} color="#FFFFFF" solid />
                                </View>
                                <View className="flex-1 mr-2">
                                    <Text className="text-white font-bold text-lg mb-1">Want deeper insights?</Text>
                                    <Text className="text-white/80 font-medium text-sm leading-tight">See strength trends, PR tracking, and progression data</Text>
                                </View>
                                <FontAwesome5 name="chevron-right" size={14} color="#FFFFFF" />
                            </HapticButton>
                        )}
                        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                            {workouts.length === 0 ? (
                                <View className="px-6 py-12 items-center justify-center">
                                    <FontAwesome5 name="dumbbell" size={32} color="#3f3f46" className="mb-4" />
                                    <Text className="text-zinc-400 text-center font-medium">No workout logs yet</Text>
                                    <Text className="text-zinc-500 text-center text-sm mt-1">Start a program to see your history here.</Text>
                                </View>
                            ) : (
                                workouts.map((w, i) => (
                                    <View
                                        key={w.id}
                                        className={`p-6 ${i !== workouts.length - 1 ? 'border-b border-zinc-800' : ''}`}
                                    >
                                        <View className="flex-row justify-between items-start mb-3">
                                            <View>
                                                <Text className="text-white font-bold text-lg">{w.name}</Text>
                                                <Text className="text-zinc-500 text-sm">
                                                    {w.logged_date ? new Date(w.logged_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '--'}
                                                </Text>
                                            </View>
                                            {w.prs_broken > 0 && (
                                                <View className="bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                                                    <Text className="text-amber-500 text-xs font-black tracking-wide uppercase">{w.prs_broken} PRs</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="flex-row items-center mt-1 space-x-4">
                                            <View className="flex-row items-center mr-4">
                                                <FontAwesome5 name="clock" size={12} color="#a1a1aa" className="mr-1.5" />
                                                <Text className="text-zinc-300 font-medium text-sm">{w.duration_minutes || '--'} min</Text>
                                            </View>
                                            <View className="flex-row items-center border-l border-zinc-700 pl-4">
                                                <FontAwesome5 name="dumbbell" size={12} color="#a1a1aa" className="mr-1.5" />
                                                <Text className="text-zinc-300 font-medium text-sm">{w.exercise_count || '--'} exercises</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                )}

                {/* --- Programs / Splits Tab --- */}
                {activeTab === 'splits' && !isLogging && !persistedSplitId && (
                    <View className="space-y-4 mb-8">
                        <Text className="text-2xl font-bold text-white mb-2">Choose a Program</Text>
                        {WORKOUT_SPLITS.map((split) => (
                            <HapticButton
                                hapticType="light"
                                key={split.id}
                                onPress={() => selectAndPersistSplit(split)}
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-4"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-white font-bold text-xl flex-1 mr-4">{split.name}</Text>
                                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                                        <Text className="text-[#0ea5e9] text-xs font-bold">{split.days.length} Days</Text>
                                    </View>
                                </View>
                                <Text className="text-zinc-400 text-sm leading-5">{split.description}</Text>
                            </HapticButton>
                        ))}

                        <HapticButton
                            hapticType="light"
                            onPress={() => handlePremiumAction('Create Custom Program')}
                            className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 mb-4 border-dashed"
                        >
                            <View className="flex-row items-center justify-center">
                                <FontAwesome5 name="plus" size={16} color="#f59e0b" className="mr-3" />
                                <Text className="text-amber-500 font-bold text-lg">Create Custom Program</Text>
                            </View>
                            {!isPremium && <Text className="text-zinc-500 text-xs text-center mt-2">Premium Feature</Text>}
                        </HapticButton>
                    </View>
                )}

                {/* --- Split Details (Days List) --- */}
                {activeTab === 'splits' && persistedSplitId && selectedSplit && !selectedDay && !isLogging && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-3xl font-bold text-white flex-1">{selectedSplit.name}</Text>
                            <View className="flex-row">
                                <HapticButton hapticType="light" onPress={() => handlePremiumAction('Edit Program')} className="bg-zinc-800 px-3 py-1.5 rounded-lg ml-2 border border-amber-500/20">
                                    <Text className="text-amber-500 font-semibold text-xs">Edit</Text>
                                </HapticButton>
                                <HapticButton hapticType="light" onPress={handleChangeProgram} className="bg-zinc-800 px-3 py-1.5 rounded-lg ml-2">
                                    <Text className="text-zinc-300 font-semibold text-xs">Change</Text>
                                </HapticButton>
                            </View>
                        </View>
                        <Text className="text-zinc-400 mb-6">{selectedSplit.description}</Text>

                        {selectedSplit.days.map((day) => {
                            const resolvedDay = resolveWorkoutDay(day.id, day, customOverrides);
                            return (
                                <HapticButton
                                    hapticType="light"
                                    key={resolvedDay.id}
                                    onPress={() => setSelectedDay(resolvedDay)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-4 flex-row items-center justify-between"
                                >
                                    <View className="flex-1 mr-4">
                                        <Text className="text-white font-bold text-xl mb-1">{resolvedDay.name}</Text>
                                        <Text className="text-zinc-500 text-sm">{resolvedDay.target}</Text>
                                    </View>
                                    <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center">
                                        <FontAwesome5 name="chevron-right" size={14} color="#a1a1aa" />
                                    </View>
                                </HapticButton>
                            );
                        })}

                        <HapticButton
                            hapticType="light"
                            onPress={() => {
                                if (!isPremium) {
                                    router.push('/(dashboard)/paywall');
                                } else {
                                    router.push('/(dashboard)/schedule');
                                }
                            }}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mt-4 flex-row items-center justify-center border-dashed"
                        >
                            {!isPremium && <FontAwesome5 name="lock" size={14} color="#f59e0b" className="mr-3" />}
                            <Text className={!isPremium ? "text-amber-500 font-bold text-lg" : "text-primary font-bold text-lg"}>Customize Weekly Schedule</Text>
                        </HapticButton>
                    </View>
                )}

                {/* --- Day Details (Exercises Overview) --- */}
                {activeTab === 'splits' && selectedSplit && selectedDay && !isLogging && (
                    <View className="mb-8">
                        <HapticButton hapticType="light" onPress={() => setSelectedDay(null)} className="flex-row items-center mb-6">
                            <FontAwesome5 name="arrow-left" size={16} color="#0ea5e9" />
                            <Text className="text-[#0ea5e9] font-semibold ml-2 text-lg">{selectedSplit.name}</Text>
                        </HapticButton>

                        <View className="flex-row justify-between items-start mb-1">
                            <Text className="text-3xl font-bold text-white max-w-[70%]">{selectedDay.name}</Text>
                            <HapticButton
                                hapticType="light"
                                onPress={() => {
                                    if (!isPremium) {
                                        setShowPremiumModal(true);
                                    } else {
                                        router.push({
                                            pathname: '/(dashboard)/edit-workout',
                                            params: { splitId: selectedSplit.id, dayId: selectedDay.id }
                                        });
                                    }
                                }}
                                className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-amber-500/20"
                            >
                                <Text className="text-amber-500 font-semibold text-xs">Edit Exercises</Text>
                            </HapticButton>
                        </View>

                        <Text className="text-zinc-400 mb-8 font-medium">Focus: {selectedDay.target}</Text>

                        <View className="space-y-4 mb-8">
                            {selectedDay.exercises.map((ex, idx) => (
                                <View key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-4 flex-row items-center shadow-sm">
                                    <ExerciseIcon name={ex.name} target={selectedDay.target} />
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-xl">{ex.name}</Text>
                                        <Text className="text-zinc-400 text-sm mt-1">{ex.sets} sets x {ex.reps} reps</Text>
                                        {ex.notes && <Text className="text-amber-500/80 text-xs mt-1 italic">{ex.notes}</Text>}
                                    </View>
                                </View>
                            ))}
                        </View>

                        <HapticButton
                            hapticType="success"
                            onPress={() => startWorkout(selectedDay)}
                            className="w-full bg-primary py-4 rounded-xl items-center flex-row justify-center mt-4"
                        >
                            <FontAwesome5 name="play" size={16} color="#000" className="mr-2" />
                            <Text className="text-black font-bold text-lg">Start Workout</Text>
                        </HapticButton>
                    </View>
                )}

                {/* --- Active Logging Session --- */}
                {isLogging && selectedDay && (
                    <View className="mb-12 pt-4">
                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-2xl font-bold text-white flex-1 mr-4">{selectedDay.name}</Text>
                            <HapticButton hapticType="error" onPress={() => setIsLogging(false)} className="bg-zinc-800 px-4 py-2 rounded-lg">
                                <Text className="text-red-400 font-bold">Quit</Text>
                            </HapticButton>
                        </View>

                        {selectedDay.exercises.map((ex, exIdx) => (
                            <View key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-6">
                                <View className="flex-row items-center mb-4">
                                    <ExerciseIcon name={ex.name} target={selectedDay.target} />
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg leading-tight mb-1">{exIdx + 1}. {ex.name}</Text>
                                        <Text className="text-zinc-400 text-sm">Target: {ex.sets} sets x {ex.reps} reps</Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between mb-2 px-2">
                                    <Text className="text-zinc-500 text-xs font-medium w-12 text-center">SET</Text>
                                    <Text className="text-zinc-500 text-xs font-medium flex-1 text-center">LBS</Text>
                                    <Text className="text-zinc-500 text-xs font-medium flex-1 text-center">REPS</Text>
                                </View>

                                {exerciseLogs[ex.id]?.map((log, setIdx) => (
                                    <View key={setIdx} className="flex-row justify-between items-center bg-zinc-950 rounded-xl p-2 mb-2 border border-zinc-800">
                                        <View className="w-12 items-center">
                                            <Text className="text-zinc-400 font-bold">{setIdx + 1}</Text>
                                        </View>
                                        <View className="flex-1 px-2">
                                            <KeyboardAwareInput
                                                ref={(el: any) => { inputRefs.current[`${exIdx}-${setIdx}-weight`] = el; }}
                                                value={log.weight}
                                                onChangeText={(val) => updateSet(ex.id, setIdx, 'weight', val)}
                                                onNext={() => handleNextInput(exIdx, setIdx, 'weight')}
                                                keyboardType="numeric"
                                                placeholder="--"
                                                placeholderTextColor="#52525b"
                                                className="w-full bg-zinc-900 rounded-lg px-2 py-3 text-white text-center font-bold"
                                            />
                                        </View>
                                        <View className="flex-1 px-2">
                                            <KeyboardAwareInput
                                                ref={(el: any) => { inputRefs.current[`${exIdx}-${setIdx}-reps`] = el; }}
                                                value={log.reps}
                                                onChangeText={(val) => updateSet(ex.id, setIdx, 'reps', val)}
                                                onNext={() => handleNextInput(exIdx, setIdx, 'reps')}
                                                keyboardType="numeric"
                                                placeholder="--"
                                                placeholderTextColor="#52525b"
                                                className="w-full bg-zinc-900 rounded-lg px-2 py-3 text-white text-center font-bold"
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}

                        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
                            <Text className="text-white font-bold text-lg mb-2">Workout Summary</Text>
                            <Text className="text-zinc-500 text-sm">
                                Duration, completed exercises, and Personal Records are automatically tracked for you upon finishing!
                            </Text>
                        </View>

                        <HapticButton
                            hapticType={showSuccess ? "none" : "success"}
                            onPress={handleLogWorkout}
                            disabled={submitting || showSuccess}
                            className={`w-full py-4 rounded-xl items-center flex-row justify-center mt-4 ${showSuccess ? 'bg-emerald-500' : 'bg-primary'}`}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#000" />
                            ) : showSuccess ? (
                                <>
                                    <FontAwesome5 name="check-circle" size={18} color="#fff" className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Workout Saved!</Text>
                                </>
                            ) : (
                                <Text className="text-black font-bold text-lg">Finish Workout</Text>
                            )}
                        </HapticButton>
                    </View>
                )}

            </KeyboardFormWrapper>

            {/* Custom Edit Exercises Premium Paywall Modal */}
            <Modal
                visible={showPremiumModal}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center bg-black/80 px-6">
                    <View className="bg-zinc-900 border border-zinc-700 w-full rounded-3xl p-6 items-center shadow-2xl shadow-primary/20">
                        <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-4">
                            <FontAwesome5 name="star" size={24} color="#0ea5e9" solid />
                        </View>
                        <Text className="text-2xl font-bold text-white mb-2 text-center tracking-tight">Customize Your Training</Text>
                        <Text className="text-zinc-400 font-medium text-center text-sm mb-6 leading-relaxed">
                            Build workouts exactly how you want.
                        </Text>

                        <View className="w-full space-y-4 mb-8 px-2">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                                <Text className="text-zinc-300">Swap exercises</Text>
                            </View>
                            <View className="flex-row items-center">
                                <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                                <Text className="text-zinc-300">Create custom workouts</Text>
                            </View>
                            <View className="flex-row items-center">
                                <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                                <Text className="text-zinc-300">Build your own split</Text>
                            </View>
                            <View className="flex-row items-center">
                                <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                                <Text className="text-zinc-300">Track advanced progression</Text>
                            </View>
                        </View>

                        <View className="w-full space-y-3">
                            <HapticButton
                                hapticType="success"
                                onPress={() => {
                                    setShowPremiumModal(false);
                                    router.push('/(dashboard)/paywall');
                                }}
                                className="bg-[#0A84FF] py-4 rounded-xl items-center w-full"
                            >
                                <Text className="text-white font-bold text-lg">Upgrade to Premium</Text>
                            </HapticButton>

                            <HapticButton
                                hapticType="light"
                                onPress={() => setShowPremiumModal(false)}
                                className="py-4 items-center w-full"
                            >
                                <Text className="text-zinc-500 font-bold text-lg">Not now</Text>
                            </HapticButton>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Day Selection Modal for Editing */}
            <Modal
                visible={showDaySelectModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDaySelectModal(false)}
            >
                <Pressable onPress={() => setShowDaySelectModal(false)} className="flex-1 justify-end bg-black/80">
                    <Pressable className="bg-zinc-900 rounded-t-3xl p-6 pb-12 w-full shadow-2xl">
                        <View className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                        <Text className="text-2xl font-bold text-white mb-2 text-center">Edit Workout</Text>
                        <Text className="text-zinc-400 font-medium text-center text-sm mb-6">Which day would you like to edit?</Text>

                        {selectedSplit?.days.map((day) => (
                            <HapticButton
                                key={day.id}
                                hapticType="light"
                                onPress={() => {
                                    setShowDaySelectModal(false);
                                    router.push({
                                        pathname: '/(dashboard)/edit-workout',
                                        params: { splitId: selectedSplit.id, dayId: day.id }
                                    });
                                }}
                                className="bg-zinc-800 py-4 px-5 rounded-xl flex-row items-center justify-between mb-3"
                            >
                                <Text className="text-white font-bold text-lg">{day.name}</Text>
                                <FontAwesome5 name="pencil-alt" size={14} color="#a1a1aa" />
                            </HapticButton>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
