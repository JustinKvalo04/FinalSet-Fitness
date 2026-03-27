import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function Weight() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [weightLogs, setWeightLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputWeight, setInputWeight] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
                            <View className="flex-row items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                                <KeyboardAwareInput
                                    value={inputWeight}
                                    onChangeText={setInputWeight}
                                    keyboardType="numeric"
                                    placeholder="175.5"
                                    placeholderTextColor="#52525b"
                                    className="flex-1 text-white font-medium text-lg leading-tight"
                                    style={{ padding: 0 }}
                                />
                                <Text className="text-zinc-500 font-medium ml-2">lbs</Text>
                            </View>
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
        </View>
    );
}
