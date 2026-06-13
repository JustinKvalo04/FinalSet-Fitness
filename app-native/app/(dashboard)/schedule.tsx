import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { getSupabaseClient } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WORKOUT_SPLITS, WorkoutSplit, WorkoutDayTemplate } from '../../lib/workoutTemplates';
import { HapticButton } from '../../components/HapticButton';

const DAYS_OF_WEEK = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 0, name: 'Sunday' },
];

type ScheduleEntry = {
    id?: string;
    day_of_week: number;
    workout_template_id: string | null;
    is_rest_day: boolean;
};

export default function ScheduleEditor() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
    const [schedule, setSchedule] = useState<Record<number, ScheduleEntry>>({});

    // Modal Picker State
    const [pickerVisible, setPickerVisible] = useState(false);
    const [activeDayPicker, setActiveDayPicker] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await getSupabaseClient().auth.getUser();
        if (user) {
            // 1. Fetch Profile (Premium + Split)
            const { data: profile } = await getSupabaseClient().from('profiles').select('subscription_status, selected_program_split').eq('id', user.id).single();

            if (profile) {
                const premiumActive = profile.subscription_status === 'active';
                setIsPremium(premiumActive);

                if (profile.selected_program_split) {
                    const split = WORKOUT_SPLITS.find(s => s.id === profile.selected_program_split);
                    if (split) setActiveSplit(split);
                }
            }

            // 2. Fetch existing schedule from DB
            const { data: scheduleData } = await getSupabaseClient().from('program_schedule').select('*').eq('user_id', user.id);

            const scheduleMap: Record<number, ScheduleEntry> = {};

            // Initialize flat default
            DAYS_OF_WEEK.forEach(d => {
                scheduleMap[d.id] = { day_of_week: d.id, is_rest_day: true, workout_template_id: null };
            });

            if (scheduleData && scheduleData.length > 0) {
                scheduleData.forEach((row: any) => {
                    scheduleMap[row.day_of_week] = {
                        id: row.id,
                        day_of_week: row.day_of_week,
                        is_rest_day: row.is_rest_day,
                        workout_template_id: row.workout_template_id
                    };
                });
            }

            setSchedule(scheduleMap);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!isPremium) {
            Alert.alert("Premium Required", "Your session has expired or you are not premium. Please upgrade to save custom schedules.");
            return;
        }

        setSaving(true);
        const { data: { user } } = await getSupabaseClient().auth.getUser();

        if (user) {
            // Prepare upsert payload
            const payload = DAYS_OF_WEEK.map(d => {
                const entry = schedule[d.id];
                return {
                    user_id: user.id,
                    day_of_week: entry.day_of_week,
                    is_rest_day: entry.is_rest_day,
                    workout_template_id: entry.workout_template_id,
                    updated_at: new Date().toISOString()
                };
            });

            const { error } = await getSupabaseClient().from('program_schedule').upsert(payload, { onConflict: 'user_id,day_of_week' });

            if (error) {
                console.error("Schedule Save Error: ", error);
                Alert.alert("Error", "Could not save your schedule. Please try again.");
            } else {
                Alert.alert("Success", "Your premium weekly schedule has been updated!", [
                    { text: "Done", onPress: () => router.back() }
                ]);
            }
        }
        setSaving(false);
    };

    const openPickerForDay = (dayOfWeek: number) => {
        if (!isPremium) {
            Alert.alert("Premium Locked", "Your premium subscription has expired. You can view your schedule but cannot edit it.");
            return;
        }
        setActiveDayPicker(dayOfWeek);
        setPickerVisible(true);
    };

    const handleSelectOption = (isRest: boolean, templateId: string | null) => {
        if (activeDayPicker !== null) {
            setSchedule(prev => ({
                ...prev,
                [activeDayPicker]: {
                    ...prev[activeDayPicker],
                    is_rest_day: isRest,
                    workout_template_id: templateId
                }
            }));
        }
        setPickerVisible(false);
        setActiveDayPicker(null);
    };

    const renderDayValue = (dayOfWeek: number) => {
        const entry = schedule[dayOfWeek];
        if (!entry) return "Loading...";
        if (entry.is_rest_day) {
            return "Rest Day";
        }
        if (entry.workout_template_id && activeSplit) {
            const template = activeSplit.days.find(d => d.id === entry.workout_template_id);
            if (template) return template.name;
        }
        return "Not Assigned";
    };

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-950 justify-center items-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    if (!activeSplit) {
        return (
            <View className="flex-1 bg-zinc-950 items-center justify-center p-6">
                <FontAwesome5 name="exclamation-circle" size={48} color="#52525b" className="mb-4" />
                <Text className="text-white font-bold text-xl text-center mb-2">No Program Selected</Text>
                <Text className="text-zinc-400 text-center mb-6">You must select a workout program before you can customize your weekly schedule.</Text>
                <HapticButton hapticType="medium" onPress={() => router.back()} className="bg-primary px-6 py-3 rounded-xl">
                    <Text className="text-black font-bold">Go Back</Text>
                </HapticButton>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950">
            <View className="flex-row items-center justify-between px-6 pb-4 pt-4 border-b border-zinc-900 z-10 bg-zinc-950">
                <HapticButton
                    hapticType="light"
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border border-zinc-800"
                >
                    <FontAwesome5 name="chevron-left" size={16} color="#a1a1aa" />
                </HapticButton>
                <Text className="text-white font-bold text-lg">Weekly Schedule</Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 120) }}
            >
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-white mb-2">Plan Your Week</Text>
                    <Text className="text-zinc-400">Assign specific workouts from your <Text className="text-white font-bold">{activeSplit.name}</Text> program to your preferred weekdays.</Text>
                </View>

                {!isPremium && (
                    <View className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-6 flex-row items-center">
                        <FontAwesome5 name="lock" size={14} color="#ef4444" className="mr-3" />
                        <Text className="text-red-400 flex-1 text-sm">Your Premium subscription has expired. This schedule is locked.</Text>
                    </View>
                )}

                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
                    {DAYS_OF_WEEK.map((day, index) => {
                        const valString = renderDayValue(day.id);
                        const isRest = valString === 'Rest Day';

                        return (
                            <HapticButton
                                hapticType="light"
                                key={day.id}
                                onPress={() => openPickerForDay(day.id)}
                                activeOpacity={isPremium ? 0.7 : 1}
                                className={`flex-row items-center justify-between p-5 ${index !== DAYS_OF_WEEK.length - 1 ? 'border-b border-zinc-800/50' : ''}`}
                            >
                                <Text className="text-zinc-300 font-bold text-base w-28">{day.name}</Text>
                                <View className={`flex-row items-center flex-1 justify-end ${isRest ? 'opacity-50' : ''}`}>
                                    <Text className="text-white font-medium text-base mr-3 text-right" numberOfLines={1}>{valString}</Text>
                                    {isPremium && <FontAwesome5 name="chevron-down" size={12} color="#52525b" />}
                                </View>
                            </HapticButton>
                        )
                    })}
                </View>

            </ScrollView>

            {isPremium && (
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-zinc-950/90 border-t border-zinc-900" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
                    <HapticButton
                        hapticType="medium"
                        onPress={handleSave}
                        disabled={saving}
                        className={`w-full py-4 rounded-xl items-center flex-row justify-center ${saving ? 'bg-zinc-800' : 'bg-primary'}`}
                    >
                        {saving ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-black font-bold text-lg">Save Schedule</Text>
                        )}
                    </HapticButton>
                </View>
            )}

            {/* Picker Modal */}
            <Modal
                visible={pickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <TouchableOpacity
                        className="flex-1"
                        activeOpacity={1}
                        onPress={() => setPickerVisible(false)}
                    />
                    <View className="bg-zinc-900 rounded-t-3xl pt-6 pb-8 px-6 border-t border-zinc-800" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
                        <View className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                        <Text className="text-xl font-bold text-white mb-6 text-center">
                            Assign to {activeDayPicker !== null ? DAYS_OF_WEEK.find(d => d.id === activeDayPicker)?.name : 'Day'}
                        </Text>

                        <ScrollView className="max-h-96">
                            <HapticButton
                                hapticType="light"
                                onPress={() => handleSelectOption(true, null)}
                                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-3 flex-row items-center"
                            >
                                <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center mr-4">
                                    <FontAwesome5 name="bed" size={12} color="#a1a1aa" />
                                </View>
                                <Text className="text-white font-bold text-lg">Rest Day</Text>
                            </HapticButton>

                            <View className="h-px bg-zinc-800/50 my-2" />
                            <Text className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-3 mt-2 ml-1">Program Workouts</Text>

                            {activeSplit?.days.map(template => (
                                <HapticButton
                                    hapticType="light"
                                    key={template.id}
                                    onPress={() => handleSelectOption(false, template.id)}
                                    className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-3 flex-row items-center"
                                >
                                    <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-4">
                                        <FontAwesome5 name="dumbbell" size={12} color="#0ea5e9" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg mb-0.5">{template.name}</Text>
                                        <Text className="text-zinc-400 text-xs">{template.target}</Text>
                                    </View>
                                </HapticButton>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
