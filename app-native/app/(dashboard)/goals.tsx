import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function GoalsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [targetWeight, setTargetWeight] = useState('');
    const [currentWeight, setCurrentWeight] = useState(0);
    const [goal, setGoal] = useState<'lose_fat' | 'build_muscle' | 'recomp' | 'maintain'>('maintain');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profileData) {
                setProfile(profileData);
                setTargetWeight(profileData.target_weight ? profileData.target_weight.toString() : '');
                if (profileData.primary_goal) setGoal(profileData.primary_goal as any);
            }

            const { data: weightData } = await supabase.from('weight_logs')
                .select('weight')
                .eq('user_id', user.id)
                .order('logged_date', { ascending: false })
                .limit(1);

            if (weightData && weightData.length > 0) {
                setCurrentWeight(weightData[0].weight);
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const targetWeightFloat = targetWeight ? parseFloat(targetWeight) : null;
            const updates = {
                target_weight: targetWeightFloat,
                primary_goal: goal,
            };

            const executeProfileSave = async () => {
                const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
                if (error) {
                    Alert.alert("Error updating goals", error.message);
                } else {
                    const previousGoal = profile.primary_goal;
                    const previousTarget = profile.target_weight;

                    setProfile({ ...profile, ...updates });

                    if (previousGoal !== goal || previousTarget !== updates.target_weight) {
                        Alert.alert(
                            "Goal Updated",
                            "Your goal has changed. Would you like to recalculate your macro targets?",
                            [
                                { text: "Keep Current Targets", style: "cancel", onPress: () => router.back() },
                                {
                                    text: "Recalculate Macros",
                                    onPress: () => router.replace('/(dashboard)/macros?reset=true')
                                }
                            ]
                        );
                    } else {
                        router.back();
                    }
                }
                setSaving(false);
            };

            if (profile?.primary_goal && goal !== profile.primary_goal && targetWeightFloat === profile?.target_weight) {
                Alert.alert(
                    "Your goal has changed",
                    "Your current target weight may no longer match your new goal. Would you like to update your goal weight?",
                    [
                        {
                            text: "Keep Current Goal Weight",
                            style: "cancel",
                            onPress: executeProfileSave
                        },
                        {
                            text: "Update Goal Weight",
                            onPress: () => {
                                setSaving(false);
                            }
                        }
                    ]
                );
                return;
            }

            await executeProfileSave();
        } else {
            setSaving(false);
        }
    };

    // Calculate progression widget data
    const hasTarget = profile?.target_weight && currentWeight > 0;
    const poundsRemaining = hasTarget ? Math.abs(currentWeight - profile.target_weight).toFixed(1) : 0;
    let percentComplete = 0;

    if (hasTarget && profile?.primary_goal) {
        const totalJourney = 20;
        const remaining = parseFloat(poundsRemaining as string);
        percentComplete = Math.max(0, Math.min(100, ((totalJourney - remaining) / totalJourney) * 100));
    }

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-950 justify-center items-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950">
            <View className="flex-row items-center justify-between px-6 pb-4 pt-4 border-b border-zinc-900">
                <HapticButton
                    hapticType="light"
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border border-zinc-800"
                >
                    <FontAwesome5 name="chevron-left" size={16} color="#a1a1aa" />
                </HapticButton>
                <Text className="text-white font-bold text-lg">Goals</Text>
                <View className="w-10" />
            </View>

            <KeyboardFormWrapper
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 120) }}
            >
                {/* Goal Progress Widget */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-sm">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-white">Goal Progress</Text>
                    </View>

                    {hasTarget ? (
                        <>
                            <View className="flex-row justify-between mb-4">
                                <View>
                                    <Text className="text-zinc-500 text-sm mb-1">Current</Text>
                                    <Text className="text-2xl font-bold text-white">{currentWeight} <Text className="text-sm font-normal text-zinc-500">lbs</Text></Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-zinc-500 text-sm mb-1">Target</Text>
                                    <Text className="text-2xl font-bold text-primary">{profile.target_weight} <Text className="text-sm font-normal text-primary/70">lbs</Text></Text>
                                </View>
                            </View>

                            <View className="h-3 bg-zinc-950 rounded-full overflow-hidden mb-2">
                                <View className="h-full bg-primary rounded-full" style={{ width: `${percentComplete}%` }} />
                            </View>

                            <Text className="text-zinc-400 text-sm text-center">
                                <Text className="font-bold text-white">{poundsRemaining} lbs</Text> difference
                            </Text>
                        </>
                    ) : (
                        <Text className="text-zinc-400 text-center">Set a target weight to track your progress.</Text>
                    )}
                </View>

                {/* Settings Form */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8 p-6 space-y-6">
                    <View>
                        <Text className="text-zinc-500 text-sm mb-1">Target Weight (lbs)</Text>
                        <KeyboardAwareInput
                            value={targetWeight}
                            onChangeText={setTargetWeight}
                            keyboardType="numeric"
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-medium text-lg"
                        />
                    </View>

                    <View>
                        <Text className="text-zinc-500 text-sm mb-3">Primary Goal</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {[
                                { id: 'lose_fat', title: 'Lose Body Fat' },
                                { id: 'build_muscle', title: 'Build Muscle' },
                                { id: 'recomp', title: 'Body Recomposition' },
                                { id: 'maintain', title: 'Maintain Weight' }
                            ].map(g => (
                                <TouchableOpacity
                                    key={g.id}
                                    activeOpacity={0.8}
                                    onPress={() => setGoal(g.id as any)}
                                    className={`px-4 py-3 rounded-xl border ${goal === g.id ? 'bg-primary/20 border-primary' : 'bg-zinc-950 border-zinc-800'}`}
                                >
                                    <Text className={`font-bold text-sm ${goal === g.id ? 'text-primary' : 'text-zinc-400'}`}>{g.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </KeyboardFormWrapper>

            <View className="absolute bottom-0 left-0 right-0 p-6 bg-zinc-950/90 border-t border-zinc-900" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
                <HapticButton
                    hapticType="medium"
                    onPress={handleSave}
                    disabled={saving}
                    className={`w-full py-4 rounded-xl items-center flex-row justify-center ${saving ? 'bg-zinc-800' : 'bg-primary'}`}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-zinc-950 font-bold text-lg">Save Goals</Text>
                    )}
                </HapticButton>
            </View>
        </View>
    );
}
