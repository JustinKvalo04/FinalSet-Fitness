import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { HapticButton } from '../../components/HapticButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DailyMacros() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [profile, setProfile] = useState<any>(null);
    const [mealLogs, setMealLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    setProfile(profileData);

                    // Fetch today's meals
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const localDateStr = `${year}-${month}-${day}`;

                    const { data: meals } = await supabase.from('meal_logs')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('date', localDateStr)
                        .order('created_at', { ascending: false });
                    setMealLogs(meals || []);
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

    const targetCalories = profile?.calories_target || 2450;
    const targetProtein = profile?.protein_target || 180;
    const targetCarbs = profile?.carbs_target || 250;
    const targetFats = profile?.fat_target || 80;

    const consumedCalories = mealLogs.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const consumedProtein = mealLogs.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const consumedCarbs = mealLogs.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const consumedFats = mealLogs.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    const percentCalories = Math.min(100, (consumedCalories / targetCalories) * 100) || 0;
    const percentProtein = Math.min(100, (consumedProtein / targetProtein) * 100) || 0;
    const percentCarbs = Math.min(100, (consumedCarbs / targetCarbs) * 100) || 0;
    const percentFats = Math.min(100, (consumedFats / targetFats) * 100) || 0;

    const caloriesRemaining = Math.max(0, targetCalories - consumedCalories);

    return (
        <ScrollView className="flex-1 bg-zinc-950 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-3xl font-bold text-white tracking-tight">Daily Macros</Text>
                    <Text className="text-zinc-400">Track your nutrition</Text>
                </View>
                <HapticButton
                    hapticType="light"
                    onPress={() => router.push('/(dashboard)/macros')}
                    className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 flex-row items-center"
                >
                    <FontAwesome5 name="cog" size={12} color="#a1a1aa" className="mr-2" />
                    <Text className="text-zinc-300 font-bold text-xs uppercase">Edit Targets</Text>
                </HapticButton>
            </View>

            {/* Summary Widget */}
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 shadow-sm">
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-orange-500/20 items-center justify-center mr-3">
                            <FontAwesome5 name="fire-alt" size={14} color="#f97316" />
                        </View>
                        <Text className="text-lg font-bold text-white">Calories</Text>
                    </View>
                    <View className="items-end bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                        <Text className="text-orange-500 font-bold text-base leading-tight">{caloriesRemaining}</Text>
                        <Text className="text-orange-500/70 text-[9px] uppercase font-bold tracking-wider">Kcal Left</Text>
                    </View>
                </View>

                {/* Calories Progress */}
                <View className="mb-2">
                    <View className="flex-row justify-between mb-1.5">
                        <Text className="text-white font-bold">Consumed</Text>
                        <Text className="text-zinc-400 font-medium text-xs"><Text className="text-white">{consumedCalories}</Text> / {targetCalories} kcal</Text>
                    </View>
                    <View className="h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <View className="h-full bg-orange-500 rounded-full" style={{ width: `${percentCalories}%` }} />
                    </View>
                </View>
            </View>

            {/* Macros Breakdown grid */}
            <View className="flex-row gap-4 mb-4">
                <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                    <Text className="text-zinc-400 font-bold mb-1">Protein</Text>
                    <Text className="text-white font-black text-xl mb-3">{consumedProtein} <Text className="text-sm font-medium text-zinc-500">/ {targetProtein}g</Text></Text>
                    <View className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                        <View className="h-full bg-blue-500 rounded-full" style={{ width: `${percentProtein}%` }} />
                    </View>
                </View>
                <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                    <Text className="text-zinc-400 font-bold mb-1">Carbs</Text>
                    <Text className="text-white font-black text-xl mb-3">{consumedCarbs} <Text className="text-sm font-medium text-zinc-500">/ {targetCarbs}g</Text></Text>
                    <View className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                        <View className="h-full bg-purple-500 rounded-full" style={{ width: `${percentCarbs}%` }} />
                    </View>
                </View>
            </View>

            <View className="flex-row gap-4 mb-8">
                <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                    <Text className="text-zinc-400 font-bold mb-1">Fat</Text>
                    <Text className="text-white font-black text-xl mb-3">{consumedFats} <Text className="text-sm font-medium text-zinc-500">/ {targetFats}g</Text></Text>
                    <View className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                        <View className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentFats}%` }} />
                    </View>
                </View>
                <View className="flex-1" />
            </View>

            <HapticButton
                hapticType="medium"
                onPress={() => router.push('/(dashboard)/log-meal')}
                className="w-full bg-primary/10 border border-primary/20 py-4 rounded-xl items-center flex-row justify-center mb-8 shadow-sm"
            >
                <FontAwesome5 name="plus" size={16} color="#0ea5e9" className="mr-3" />
                <Text className="text-primary font-bold text-lg">Log Meal</Text>
            </HapticButton>

            {/* Today's Meals */}
            <Text className="text-xl font-bold text-white mb-4 px-1">Today's Meals</Text>
            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
                {mealLogs.length > 0 ? (
                    mealLogs.map((meal, index) => {
                        let iconName = 'utensils';
                        const type = meal.meal_type.toLowerCase();
                        if (type === 'breakfast') iconName = 'coffee';
                        if (type === 'lunch') iconName = 'hamburger';
                        if (type === 'dinner') iconName = 'drumstick-bite';
                        if (type === 'snack') iconName = 'cookie-bite';

                        return (
                            <View key={meal.id} className={`p-5 flex-row justify-between items-center ${index !== mealLogs.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 rounded-full bg-orange-500/10 items-center justify-center mr-4">
                                        <FontAwesome5 name={iconName} size={14} color="#f97316" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-base mb-1">{meal.meal_type}</Text>
                                        <Text className="text-zinc-500 text-xs font-mono">{meal.calories} kcal • {meal.protein}P • {meal.carbs}C • {meal.fat}F</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View className="p-8 items-center justify-center">
                        <Text className="text-zinc-500 font-medium">No meals logged today.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
