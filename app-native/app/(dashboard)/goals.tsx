import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { StatInput } from '../../components/StatInput';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function GoalsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [currentWeight, setCurrentWeight] = useState(0);

    // Wizard State
    const [step, setStep] = useState(0); // 0 = view, 1 = intent, 2 = goal, 3 = weight
    const [updateIntent, setUpdateIntent] = useState<'goal' | 'weight' | 'both' | null>(null);
    const [targetWeight, setTargetWeight] = useState('');
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

    const handleIntentSelection = (intent: 'goal' | 'weight' | 'both') => {
        setUpdateIntent(intent);
        if (intent === 'goal' || intent === 'both') {
            setStep(2); // Go to goal selection
        } else if (intent === 'weight') {
            setStep(3); // Go directly to weight input
        }
    };

    const validateGoalConsistency = (evalGoal: string, evalWeightStr: string): string | null => {
        if (!currentWeight || currentWeight <= 0) return null; // Can't block if we have no baseline

        const evalWeight = parseFloat(evalWeightStr);
        if (isNaN(evalWeight)) return "Please enter a valid target weight.";

        const diff = evalWeight - currentWeight;

        if (evalGoal === 'build_muscle' && evalWeight <= currentWeight) {
            return "For a muscle-building goal, your target weight should be above your current weight.";
        }
        if (evalGoal === 'lose_fat' && evalWeight >= currentWeight) {
            return "For a fat-loss goal, your target weight should be below your current weight.";
        }
        if (evalGoal === 'maintain' && Math.abs(diff) > 3) {
            return "For maintaining, your target weight should be very close to your current weight.";
        }
        if (evalGoal === 'recomp' && Math.abs(diff) > 7) {
            return "For body recomposition, your target weight should remain relatively near your current weight.";
        }

        return null;
    };

    const handleGoalSelection = (selectedGoal: typeof goal) => {
        setGoal(selectedGoal);

        // Smart Validation/Prefill
        const validationError = validateGoalConsistency(selectedGoal, targetWeight);
        if (validationError || updateIntent === 'both') {
            // Pre-fill sensible target if invalid or intent is 'both'
            if (currentWeight > 0) {
                if (selectedGoal === 'build_muscle' && parseFloat(targetWeight) <= currentWeight) {
                    setTargetWeight((currentWeight + 10).toString());
                } else if (selectedGoal === 'lose_fat' && parseFloat(targetWeight) >= currentWeight) {
                    setTargetWeight((currentWeight - 10).toString());
                } else if ((selectedGoal === 'maintain' || selectedGoal === 'recomp') && Math.abs(parseFloat(targetWeight) - currentWeight) > 5) {
                    setTargetWeight(currentWeight.toString());
                }
            }
            // Route explicitly to Step 3 because trajectory adjustments require verification
            setStep(3);
        } else {
            handleSave(selectedGoal, targetWeight); // Finalize safely
        }
    };

    const handleWeightSubmission = () => {
        const validationError = validateGoalConsistency(goal, targetWeight);
        if (validationError) {
            Alert.alert("Goal Consistency", validationError);
            return;
        }
        handleSave(goal, targetWeight);
    };

    const handleSave = async (finalGoal: string, finalWeightStr: string) => {
        console.log('[Goal Update] Save start...');
        setSaving(true);

        try {
            console.log('[Goal Update] Fetching user session...');
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error('[Goal Update] User fetch failed:', userError);
                Alert.alert("Authentication Error", "Could not verify user session.");
                setSaving(false);
                return;
            }

            const finalWeightFloat = finalWeightStr ? parseFloat(finalWeightStr) : null;
            const updates = {
                target_weight: finalWeightFloat,
                primary_goal: finalGoal,
                goal_achieved_acknowledged: false // reset goal_achieved_acknowledged
            };

            console.log('[Goal Update] Profile update start:', updates);
            const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', user.id);

            if (updateError) {
                console.error('[Goal Update] Profile update failed:', updateError.message);
                Alert.alert("Error updating goals", updateError.message);
                setSaving(false);
            } else {
                console.log('[Goal Update] Profile update success.');
                setProfile({ ...profile, ...updates });

                console.log('[Goal Update] Save end / loading reset. Initiating macro flow handoff.');
                // Critical: Explicitly reset saving BEFORE routing to avoid visual hangs
                setSaving(false);

                console.log('[Goal Update] Navigation triggering router.replace.');
                router.replace('/(dashboard)/macros?reset=true');
            }
        } catch (e: any) {
            console.error('[Goal Update] Unexpected error caught:', e);
            Alert.alert("Unexpected Error", "Please check your connection and try again.");
            setSaving(false);
        }
    };

    const hasTarget = profile?.target_weight && currentWeight > 0;
    const poundsRemaining = hasTarget ? Math.abs(currentWeight - profile.target_weight).toFixed(1) : 0;
    let percentComplete = 0;

    if (hasTarget && profile?.primary_goal) {
        const totalJourney = 20; // Arbitrary 20lb visual window clamp
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
                    onPress={() => {
                        if (step > 0) setStep(0);
                        else router.back();
                    }}
                    className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border border-zinc-800"
                >
                    <FontAwesome5 name="chevron-left" size={16} color="#a1a1aa" />
                </HapticButton>
                <Text className="text-white font-bold text-lg">{step === 0 ? 'Goals' : 'Edit Goal'}</Text>
                <View className="w-10" />
            </View>

            <KeyboardFormWrapper
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}
            >
                {/* --- Read Only State (Step 0) --- */}
                {step === 0 && (
                    <View className="flex-1 animation-fade-in">
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
                                <Text className="text-zinc-400 text-center py-4">No active target data found.</Text>
                            )}
                        </View>

                        <HapticButton
                            hapticType="medium"
                            onPress={() => setStep(1)}
                            className="w-full bg-primary py-4 rounded-xl items-center flex-row justify-center shadow-lg shadow-primary/20"
                        >
                            <Text className="text-zinc-950 font-bold text-xl">Edit Goal</Text>
                        </HapticButton>
                    </View>
                )}

                {/* --- Wizard Step 1: Intent Declaration --- */}
                {step === 1 && (
                    <View className="flex-1 animation-fade-in pt-4">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">What would you like to update?</Text>
                        <Text className="text-zinc-400 mb-8">Select which aspect of your progression phase is changing.</Text>

                        <View className="space-y-4">
                            <HapticButton onPress={() => handleIntentSelection('goal')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex-row items-center justify-between">
                                <View>
                                    <Text className="text-white font-bold text-lg">Change my goal</Text>
                                    <Text className="text-zinc-500 text-sm">e.g., Switch from Building to Cutting</Text>
                                </View>
                                <FontAwesome5 name="long-arrow-alt-right" size={16} color="#a1a1aa" />
                            </HapticButton>

                            <HapticButton onPress={() => handleIntentSelection('weight')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex-row items-center justify-between">
                                <View>
                                    <Text className="text-white font-bold text-lg">Change my goal weight</Text>
                                    <Text className="text-zinc-500 text-sm">Update the numerical target</Text>
                                </View>
                                <FontAwesome5 name="long-arrow-alt-right" size={16} color="#a1a1aa" />
                            </HapticButton>

                            <HapticButton onPress={() => handleIntentSelection('both')} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex-row items-center justify-between">
                                <View>
                                    <Text className="text-white font-bold text-lg">Update both</Text>
                                    <Text className="text-zinc-500 text-sm">Change phase and destination</Text>
                                </View>
                                <FontAwesome5 name="long-arrow-alt-right" size={16} color="#a1a1aa" />
                            </HapticButton>
                        </View>
                    </View>
                )}

                {/* --- Wizard Step 2: Goal Selection --- */}
                {step === 2 && (
                    <View className="flex-1 animation-fade-in pt-4">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">What's your goal?</Text>
                        <Text className="text-zinc-400 mb-8">Select your primary biological focus.</Text>

                        <View className="space-y-3">
                            {[
                                { id: 'lose_fat', title: 'Lose Body Fat', desc: 'Optimize for caloric bounds and preservation' },
                                { id: 'build_muscle', title: 'Build Muscle', desc: 'Optimize for progressive hypertrophy' },
                                { id: 'recomp', title: 'Body Recomposition', desc: 'Train symmetrically near maintenance' },
                                { id: 'maintain', title: 'Maintain Weight', desc: 'Stabilize current metrics efficiently' }
                            ].map(g => (
                                <HapticButton
                                    key={g.id}
                                    onPress={() => handleGoalSelection(g.id as any)}
                                    className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl"
                                >
                                    <Text className="text-white font-bold text-lg mb-1">{g.title}</Text>
                                    <Text className="text-zinc-500 text-sm">{g.desc}</Text>
                                </HapticButton>
                            ))}
                        </View>

                        {saving && (
                            <View className="items-center justify-center mt-8">
                                <ActivityIndicator color="#0ea5e9" />
                                <Text className="text-zinc-500 mt-2">Saving context...</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* --- Wizard Step 3: Weight Target --- */}
                {step === 3 && (
                    <View className="flex-1 animation-fade-in pt-4">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">What's your new target weight?</Text>
                        <Text className="text-zinc-400 mb-8">Enter your numerical progression destination in pounds (lbs).</Text>

                        <View className="mb-8">
                            <StatInput
                                value={targetWeight}
                                onChangeText={setTargetWeight}
                                placeholder="e.g. 175"
                                containerClassName="bg-zinc-900 border border-zinc-800 rounded-2xl"
                                autoFocus={true}
                                height={64}
                                fontSize={24}
                            />
                        </View>

                        <HapticButton
                            hapticType="success"
                            onPress={handleWeightSubmission}
                            disabled={saving}
                            className={`w-full py-4 rounded-xl items-center flex-row justify-center ${saving ? 'bg-zinc-800' : 'bg-primary shadow-lg shadow-primary/20'}`}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-zinc-950 font-bold text-xl">{updateIntent === 'weight' ? 'Save Target' : 'Finalize Strategy'}</Text>
                            )}
                        </HapticButton>
                    </View>
                )}
            </KeyboardFormWrapper>
        </View>
    );
}
