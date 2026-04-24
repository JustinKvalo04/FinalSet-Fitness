import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView, Modal, TextInput, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { WORKOUT_SPLITS, ExerciseTemplate, resolveWorkoutDay, CustomWorkoutOverrides } from '../../lib/workoutTemplates';
import { CANONICAL_EXERCISES } from '../../lib/exercises';
import { getExerciseImage } from '../../lib/exerciseImages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { HapticButton } from '../../components/HapticButton';

export default function EditWorkout() {
    const router = useRouter();
    const params = useLocalSearchParams<{ splitId: string, dayId: string }>();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profileOverrides, setProfileOverrides] = useState<CustomWorkoutOverrides>({});
    const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
    const [dayName, setDayName] = useState('');

    // Exercise Library Modal State
    const [showLibModal, setShowLibModal] = useState(false);
    const [libSearch, setLibSearch] = useState('');
    const [actionTargetIndex, setActionTargetIndex] = useState<number | null>(null); // if null, we are appending. if number, we are replacing

    const [customExercises, setCustomExercises] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Add effect to strictly track modal open state changes
    useEffect(() => {
        console.log(`[Diagnostic] Modal state changed -> showCreateModal: ${showCreateModal}`);
    }, [showCreateModal]);

    const [newExName, setNewExName] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [params.splitId, params.dayId])
    );

    async function fetchData() {
        try {
            setLoading(true);
            if (!params.splitId || !params.dayId) {
                Alert.alert("Error", "Invalid workout parameters.");
                router.back();
                return;
            }

            const split = WORKOUT_SPLITS.find(s => s.id === params.splitId);
            if (!split) { router.back(); return; }

            const day = split.days.find(d => d.id === params.dayId);
            if (!day) { router.back(); return; }

            setDayName(day.name);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('custom_workout_overrides, custom_exercises').eq('id', user.id).single();
                const overrides = profile?.custom_workout_overrides as CustomWorkoutOverrides || {};
                setProfileOverrides(overrides);
                setCustomExercises(profile?.custom_exercises || []);

                // Resolve the current state of the day (either base or previously overridden)
                const resolvedDay = resolveWorkoutDay(day.id, day, overrides);
                // Deep clone so we don't accidentally mutate static objects
                setExercises(JSON.parse(JSON.stringify(resolvedDay.exercises)));
            }
        } catch (e: any) {
            console.error("Edit workout error", e);
            Alert.alert("Error", "Failed to load workout editor");
            router.back();
        } finally {
            setLoading(false);
        }
    }

    const updateExerciseField = (index: number, field: keyof ExerciseTemplate, value: any) => {
        setExercises(prev => {
            const arr = [...prev];
            arr[index] = { ...arr[index], [field]: value };
            return arr;
        });
    };

    const moveEx = (index: number, dir: -1 | 1) => {
        if (index + dir < 0 || index + dir >= exercises.length) return;
        setExercises(prev => {
            const arr = [...prev];
            const temp = arr[index];
            arr[index] = arr[index + dir];
            arr[index + dir] = temp;
            return arr;
        });
    };

    const removeEx = (index: number) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const openLibrary = (targetIndex: number | null) => {
        setActionTargetIndex(targetIndex);
        setLibSearch('');
        setShowLibModal(true);
    };

    const handleCreateCustomExercise = async () => {
        if (!newExName.trim()) return;
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const newEx = {
                id: 'custom-' + Date.now().toString(),
                name: newExName.trim(),
                is_custom: true
            };
            const updatedCustoms = [...customExercises, newEx];

            await supabase.from('profiles').update({
                custom_exercises: updatedCustoms
            }).eq('id', user.id);

            setCustomExercises(updatedCustoms);
            setShowCreateModal(false);
            setNewExName('');
            setLibSearch('');
        }
        setSaving(false);
    };

    const selectExercise = (selectedEx: any) => {
        const newEx: ExerciseTemplate = {
            id: selectedEx.id || selectedEx.canonical_name,
            name: selectedEx.canonical_name,
            sets: 3,
            reps: '10-12',
        };

        if (actionTargetIndex !== null) {
            // Replace
            setExercises(prev => {
                const arr = [...prev];
                newEx.sets = arr[actionTargetIndex].sets;
                newEx.reps = arr[actionTargetIndex].reps;
                arr[actionTargetIndex] = newEx;
                return arr;
            });
        } else {
            // Append
            setExercises(prev => [...prev, newEx]);
        }
        setShowLibModal(false);
    };

    const combinedLib = [
        ...customExercises.map(cx => ({ canonical_name: cx.name, muscle_group: "Custom", id: cx.id, is_custom: cx.is_custom })),
        ...CANONICAL_EXERCISES.map(cx => ({ ...cx, id: cx.canonical_name }))
    ];

    const filteredLib = combinedLib.filter(ex => ex.canonical_name.toLowerCase().includes(libSearch.toLowerCase()));

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user && params.dayId) {

            // Map our UI state (ExerciseTemplate) down to the storage format (ExerciseOverride)
            const storageArray = exercises.map(ex => ({
                exercise_id: ex.name, // The user selects the canonical name 
                sets: ex.sets,
                reps: ex.reps
            }));

            // Construct the updated payload without splitId nesting
            const payload: CustomWorkoutOverrides = {
                ...profileOverrides,
                [params.dayId]: storageArray
            };

            const { error } = await supabase.from('profiles').update({
                custom_workout_overrides: payload
            }).eq('id', user.id);

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                router.back();
            }
        }
        setSaving(false);
    };

    const restoreDefaults = async () => {
        Alert.alert(
            "Restore Defaults",
            "Are you sure you want to revert this workout to the original template? This will delete your custom overrides for this day.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Restore",
                    style: "destructive",
                    onPress: async () => {
                        setSaving(true);
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user && params.dayId) {
                            const newOverrides = { ...profileOverrides };

                            if (newOverrides[params.dayId]) {
                                delete newOverrides[params.dayId];
                            }

                            await supabase.from('profiles').update({
                                custom_workout_overrides: newOverrides
                            }).eq('id', user.id);

                            // Immediately route back or refresh
                            router.back();
                        }
                        setSaving(false);
                    }
                }
            ]
        );
    };



    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator color="#0ea5e9" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between px-6 py-4">
                <HapticButton hapticType="light" onPress={() => router.back()} className="p-2 -ml-2">
                    <FontAwesome5 name="arrow-left" size={20} color="#0ea5e9" />
                </HapticButton>
                <Text className="text-white font-bold text-xl">{dayName} Editor</Text>
                <HapticButton hapticType="light" onPress={restoreDefaults} className="p-2 -mr-2">
                    <FontAwesome5 name="undo-alt" size={16} color="#a1a1aa" />
                </HapticButton>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {exercises.map((ex, idx) => (
                    <View key={ex.id + '-' + idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4 flex-row items-center relative overflow-hidden">
                        <View className="flex-col justify-between items-center mr-3 space-y-2">
                            <HapticButton
                                hapticType="medium"
                                onPress={() => moveEx(idx, -1)}
                                disabled={idx === 0}
                                className={`w-8 h-8 items-center justify-center rounded-full ${idx === 0 ? 'bg-zinc-800/50' : 'bg-zinc-800'}`}
                            >
                                <FontAwesome5 name="chevron-up" size={12} color={idx === 0 ? "#52525b" : "#fff"} />
                            </HapticButton>
                            <HapticButton
                                hapticType="medium"
                                onPress={() => moveEx(idx, 1)}
                                disabled={idx === exercises.length - 1}
                                className={`w-8 h-8 items-center justify-center rounded-full ${idx === exercises.length - 1 ? 'bg-zinc-800/50' : 'bg-zinc-800'}`}
                            >
                                <FontAwesome5 name="chevron-down" size={12} color={idx === exercises.length - 1 ? "#52525b" : "#fff"} />
                            </HapticButton>
                        </View>

                        <View className="w-16 h-16 bg-zinc-950 rounded-xl mr-4 overflow-hidden justify-center items-center">
                            {getExerciseImage(ex.name, '') ? (
                                <Image source={getExerciseImage(ex.name, '') || undefined} className="w-16 h-16" resizeMode="contain" />
                            ) : (
                                <FontAwesome5 name="dumbbell" size={24} color="#3f3f46" />
                            )}
                        </View>

                        <View className="flex-1 border-l border-zinc-800 pl-4">
                            <Text className="text-white font-bold text-lg mb-2">{ex.name}</Text>

                            <View className="flex-row items-center mb-3">
                                <TextInput
                                    value={String(ex.sets)}
                                    onChangeText={(val) => updateExerciseField(idx, 'sets', parseInt(val.replace(/[^0-9]/g, '')) || 0)}
                                    keyboardType="number-pad"
                                    className="text-white font-bold bg-zinc-800 px-3 py-1.5 rounded-lg w-12 text-center mr-2 border border-zinc-700"
                                />
                                <Text className="text-zinc-500 font-medium text-xs mr-2">sets</Text>

                                <TextInput
                                    value={ex.reps}
                                    onChangeText={(val) => updateExerciseField(idx, 'reps', val.replace(/[^0-9-]/g, ''))}
                                    keyboardType="numbers-and-punctuation"
                                    className="text-white font-bold bg-zinc-800 px-3 py-1.5 rounded-lg w-20 text-center mx-2 border border-zinc-700"
                                />
                                <Text className="text-zinc-500 font-medium text-xs">reps</Text>
                            </View>

                            <View className="flex-row items-center gap-2">
                                <HapticButton
                                    hapticType="light"
                                    onPress={() => openLibrary(idx)}
                                    className="px-3 py-1.5 bg-zinc-800 rounded-md border border-zinc-700"
                                >
                                    <Text className="text-white text-xs font-semibold">Replace</Text>
                                </HapticButton>
                                <HapticButton
                                    hapticType="light"
                                    onPress={() => removeEx(idx)}
                                    className="px-3 py-1.5 bg-zinc-800 rounded-md border border-red-500/20"
                                >
                                    <Text className="text-red-500 text-xs font-semibold">Remove</Text>
                                </HapticButton>
                            </View>
                        </View>
                    </View>
                ))}

                <HapticButton
                    hapticType="success"
                    onPress={() => openLibrary(null)}
                    className="border border-dashed border-zinc-700 rounded-2xl p-6 mt-4 items-center flex-row justify-center"
                >
                    <FontAwesome5 name="plus" size={14} color="#0ea5e9" />
                    <Text className="text-[#0ea5e9] font-bold text-lg ml-3">Add Exercise</Text>
                </HapticButton>
            </ScrollView>

            <View className="bg-zinc-950 border-t border-zinc-900 px-6 py-6 pb-10 shadow-2xl">
                <HapticButton
                    hapticType="success"
                    onPress={handleSave}
                    disabled={saving}
                    className="w-full bg-primary py-4 rounded-xl items-center flex-row justify-center"
                >
                    {saving ? <ActivityIndicator color="#000" /> : <Text className="text-black font-bold text-lg">Save Custom Routine</Text>}
                </HapticButton>
            </View>

            {/* Exercise Library Modal */}
            <Modal visible={showLibModal} animationType="slide" presentationStyle="pageSheet">
                <View className="flex-1 bg-zinc-900 pt-6 px-4">
                    <View className="flex-row justify-between items-center mb-6 mt-2">
                        <Text className="text-white font-bold text-2xl">Library</Text>
                        <HapticButton onPress={() => setShowLibModal(false)} className="bg-zinc-800 rounded-full w-8 h-8 items-center justify-center">
                            <FontAwesome5 name="times" size={14} color="#a1a1aa" />
                        </HapticButton>
                    </View>

                    <View className="bg-zinc-950 border border-zinc-800 rounded-xl flex-row items-center px-4 h-12 mb-6">
                        <FontAwesome5 name="search" size={14} color="#71717a" />
                        <TextInput
                            value={libSearch}
                            onChangeText={setLibSearch}
                            placeholder="Search exercises..."
                            placeholderTextColor="#71717a"
                            className="flex-1 ml-3 text-white font-medium h-full"
                            style={{ padding: 0 }}
                        />
                    </View>

                    <HapticButton
                        hapticType="success"
                        onPress={() => {
                            console.log("[Diagnostic] 'Create Custom Exercise' button pressed natively in UI.");
                            setShowCreateModal(true);
                        }}
                        className="bg-zinc-800/80 border border-zinc-700 py-3 rounded-xl flex-row justify-center items-center mb-6"
                    >
                        <FontAwesome5 name="plus" size={14} color="#0ea5e9" />
                        <Text className="text-[#0ea5e9] font-bold text-base ml-2">Create Custom Exercise</Text>
                    </HapticButton>

                    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                        {filteredLib.map((ex, i) => (
                            <HapticButton
                                key={i}
                                hapticType="light"
                                onPress={() => selectExercise(ex)}
                                className="bg-zinc-800 rounded-xl p-4 mb-2 flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="text-white font-bold text-base">{ex.canonical_name}</Text>
                                    <Text className="text-zinc-500 text-sm mt-0.5">{ex.muscle_group}</Text>
                                </View>
                                <FontAwesome5 name="plus-circle" size={18} color="#0ea5e9" />
                            </HapticButton>
                        ))}
                    </ScrollView>
                </View>

                {/* Absolute Overlay for Custom Exercise Creation */}
                {showCreateModal && (
                    <View className="absolute top-0 bottom-0 left-0 right-0 z-50 bg-black/90 px-6 justify-center items-center">
                        <View className="bg-zinc-900 border border-zinc-800 w-full rounded-3xl p-8 shadow-2xl">
                            <Text className="text-white font-bold text-2xl mb-2">Custom Exercise</Text>
                            <Text className="text-zinc-400 text-sm mb-6">Create a personalized tracking name.</Text>
                            <TextInput
                                value={newExName}
                                onChangeText={setNewExName}
                                placeholder="e.g. Deficit Reverse Lunge"
                                placeholderTextColor="#52525b"
                                className="bg-zinc-950 text-white font-medium px-4 py-4 rounded-xl border border-zinc-800 mb-8 w-full"
                            />
                            <View className="flex-row gap-3">
                                <HapticButton
                                    hapticType="light"
                                    onPress={() => setShowCreateModal(false)}
                                    disabled={saving}
                                    className="flex-1 bg-zinc-800 py-4 rounded-xl items-center"
                                >
                                    <Text className="text-white font-bold">Cancel</Text>
                                </HapticButton>
                                <HapticButton
                                    hapticType="success"
                                    onPress={handleCreateCustomExercise}
                                    disabled={saving || !newExName.trim()}
                                    className="flex-1 bg-primary py-4 rounded-xl items-center"
                                >
                                    {saving ? <ActivityIndicator color="#000" size="small" /> : <Text className="text-black font-bold">Create</Text>}
                                </HapticButton>
                            </View>
                        </View>
                    </View>
                )}

            </Modal>
        </View>
    );
}
