import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, Platform, Modal, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { StatInput } from '../../components/StatInput';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function Weight() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [weightLogs, setWeightLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputWeight, setInputWeight] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const [profileRes, logsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('weight_logs').select('*').eq('user_id', user.id).order('logged_date', { ascending: false }).limit(7)
            ]);
            setProfile(profileRes.data);
            setWeightLogs(logsRes.data || []);
        }
        setLoading(false);
    }

    const handleLogWeight = async () => {
        if (!inputWeight) return;
        setSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from('weight_logs').upsert({
                user_id: user.id,
                weight: parseFloat(inputWeight),
                logged_date: new Date().toISOString().split('T')[0]
            }, { onConflict: 'user_id, logged_date' });

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                const newWeight = parseFloat(inputWeight);
                if (profile && profile.goal_achieved_acknowledged === false && profile.target_weight) {
                    let goalReached = false;
                    if (profile.primary_goal === 'Build Muscle' && newWeight >= profile.target_weight) {
                        goalReached = true;
                    } else if (profile.primary_goal === 'Lose Body Fat' && newWeight <= profile.target_weight) {
                        goalReached = true;
                    }

                    if (goalReached) {
                        setShowGoalModal(true);
                        await supabase.from('profiles').update({ goal_achieved_acknowledged: true }).eq('id', user.id);
                    }
                }

                setInputWeight('');
                fetchData(); // Refresh list
            }
        }
        setSubmitting(false);
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
            <KeyboardFormWrapper className="flex-1 px-6 pt-6">

                {/* Log Today's Weight */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
                    <View className="flex-row items-center mb-6">
                        <FontAwesome5 name="balance-scale" size={18} color="#0ea5e9" className="mr-3" />
                        <Text className="text-xl font-bold text-white ml-2">Log Weight</Text>
                    </View>

                    <View className="flex-row items-end mb-2">
                        <View className="flex-1 mr-4">
                            <Text className="text-zinc-400 font-medium mb-2">Today's Weight</Text>
                            <StatInput
                                value={inputWeight}
                                onChangeText={setInputWeight}
                                placeholder="175.5"
                                suffix="lbs"
                                containerClassName="bg-zinc-950 border border-zinc-800 rounded-xl"
                            />
                        </View>

                        <HapticButton
                            hapticType="success"
                            onPress={handleLogWeight}
                            disabled={submitting}
                            className="bg-primary px-6 py-4 rounded-xl items-center justify-center flex-row"
                            style={{ height: 50 }}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text className="text-primary-foreground font-bold text-lg leading-none">Log</Text>
                            )}
                        </HapticButton>
                    </View>
                </View>

                {/* Target Progress */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6">
                    <View className="flex-row justify-between items-end mb-4">
                        <View>
                            <Text className="text-zinc-400 font-medium mb-1">Current</Text>
                            <Text className="text-3xl font-bold text-white">
                                {weightLogs[0]?.weight || '--'} <Text className="text-sm font-normal text-zinc-500">lbs</Text>
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-zinc-400 font-medium mb-1">Target</Text>
                            <Text className="text-3xl font-bold text-primary">
                                {profile?.target_weight || '--'} <Text className="text-sm font-normal text-primary/70">lbs</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* History List */}
                <View className="mb-12">
                    <Text className="text-xl font-bold text-white mb-4">Recent History</Text>
                    <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                        {weightLogs.length === 0 ? (
                            <View className="px-6 py-12 items-center justify-center">
                                <FontAwesome5 name="weight" size={32} color="#3f3f46" className="mb-4" />
                                <Text className="text-zinc-400 text-center font-medium">No weight logs yet</Text>
                                <Text className="text-zinc-500 text-center text-sm mt-1">Log your weight today to start tracking your progress.</Text>
                            </View>
                        ) : (
                            weightLogs.map((log, i) => (
                                <View
                                    key={log.id}
                                    className={`p-5 flex-row justify-between items-center ${i !== weightLogs.length - 1 ? 'border-b border-zinc-800' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-primary mr-4" />
                                        <Text className="text-white font-medium text-lg">
                                            {log.logged_date ? new Date(log.logged_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '--'}
                                        </Text>
                                    </View>
                                    <Text className="text-zinc-300 font-bold text-lg">{log.weight} lbs</Text>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Advanced Analytics Upsell */}
                    <HapticButton
                        hapticType="light"
                        onPress={() => {
                            if (profile?.subscription_status !== 'active') {
                                router.push('/(dashboard)/paywall');
                            } else {
                                Alert.alert('Premium Feature', 'Advanced weight trends and body comp predictions coming soon!');
                            }
                        }}
                        className="mt-6 bg-zinc-900 border border-amber-500/30 rounded-2xl py-4 px-6 flex-row justify-between items-center"
                    >
                        <View className="flex-1 mr-4">
                            <View className="flex-row items-center mb-1">
                                <FontAwesome5 name="chart-line" size={14} color="#f59e0b" className="mr-2" />
                                <Text className="text-amber-500 font-bold text-lg">Advanced Analytics</Text>
                            </View>
                            <Text className="text-zinc-400 text-sm">View weight trends, body comp predictions, and history insights.</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={14} color="#a1a1aa" />
                    </HapticButton>
                </View>
            </KeyboardFormWrapper>

            {/* Goal Reached Modal */}
            <Modal
                visible={showGoalModal}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center bg-black/80 px-6">
                    <View className="bg-zinc-900 border border-zinc-700 w-full rounded-3xl p-8 items-center shadow-2xl shadow-primary/20">
                        <Text className="text-5xl mb-4">🎉</Text>
                        <Text className="text-2xl font-bold text-white mb-2 text-center tracking-tight">Goal Reached</Text>
                        <Text className="text-zinc-400 font-medium text-center text-lg mb-8 leading-relaxed">
                            Incredible work! You hit your goal weight of <Text className="text-white font-bold">{profile?.target_weight} lbs</Text>. This is a huge milestone!
                        </Text>

                        <View className="w-full gap-y-3">
                            <HapticButton
                                hapticType="success"
                                onPress={() => {
                                    setShowGoalModal(false);
                                    router.push('/(dashboard)/settings');
                                }}
                                className="bg-primary py-4 rounded-xl items-center w-full"
                            >
                                <Text className="text-primary-foreground font-bold text-lg">Set New Goal</Text>
                            </HapticButton>

                            <HapticButton
                                hapticType="light"
                                onPress={() => {
                                    setShowGoalModal(false);
                                    router.push('/(dashboard)/settings');
                                }}
                                className="bg-zinc-800 border border-zinc-700 py-4 rounded-xl items-center w-full"
                            >
                                <Text className="text-white font-bold text-lg">Update Goal Weight</Text>
                            </HapticButton>

                            <HapticButton
                                hapticType="light"
                                onPress={() => setShowGoalModal(false)}
                                className="py-4 items-center w-full"
                            >
                                <Text className="text-zinc-500 font-bold text-lg">Keep Current Goal</Text>
                            </HapticButton>
                        </View>

                        {profile?.subscription_status !== 'active' && (
                            <TouchableOpacity
                                onPress={() => {
                                    setShowGoalModal(false);
                                    router.push('/(dashboard)/paywall');
                                }}
                                className="mt-6 border-t border-zinc-800 w-full pt-6 items-center"
                            >
                                <Text className="text-zinc-400 font-medium text-center">Want help setting your next goal?</Text>
                                <Text className="text-primary font-bold text-center mt-1">Premium adapts your plan automatically</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal >
        </View >
    );
}
