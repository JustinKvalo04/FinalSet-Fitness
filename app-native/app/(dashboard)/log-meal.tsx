import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import * as Haptics from 'expo-haptics';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogMeal() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('Breakfast');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [calories, setCalories] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const insets = useSafeAreaInsets();

    const inputRefs = useRef<Record<string, TextInput | null>>({});

    const handleNextInput = (current: string) => {
        if (current === 'protein') inputRefs.current['carbs']?.focus();
        else if (current === 'carbs') inputRefs.current['fats']?.focus();
        else if (current === 'fats') inputRefs.current['calories']?.focus();
    };

    const handleSaveMeal = async () => {
        const p = parseInt(protein) || 0;
        const c = parseInt(carbs) || 0;
        const f = parseInt(fats) || 0;

        // Auto-calculate calories if user left it blank
        let cal = parseInt(calories);
        if (isNaN(cal)) {
            cal = (p * 4) + (c * 4) + (f * 9);
        }

        if (p === 0 && c === 0 && f === 0 && cal === 0) {
            Alert.alert("Empty Meal", "Please enter at least some macros or calories for this meal.");
            return;
        }

        setSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Get local date string 'YYYY-MM-DD'
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;

            const { error } = await supabase.from('meal_logs').insert({
                user_id: user.id,
                date: localDateStr,
                meal_type: selectedType,
                protein: p,
                carbs: c,
                fat: f,
                calories: cal
            });

            if (error) {
                Alert.alert("Error logging meal", error.message);
                setSubmitting(false);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setSubmitting(false);
                    // Dismiss modal/screen back to dashboard
                    router.back();
                }, 1000);
            }
        } else {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-zinc-950">
            <View className="flex-row items-center justify-between px-6 pb-4 pt-4 border-b border-zinc-900">
                <HapticButton
                    hapticType="light"
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border border-zinc-800"
                >
                    <FontAwesome5 name="times" size={16} color="#a1a1aa" />
                </HapticButton>
                <Text className="text-white font-bold text-xl">Log Meal</Text>
                <View className="w-10" />
            </View>

            <KeyboardFormWrapper
                className="flex-1 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}
            >
                {/* Meal Type Selection */}
                <Text className="text-zinc-400 font-bold mb-3 uppercase text-xs tracking-wider">Meal Type</Text>
                <View className="flex-row flex-wrap justify-between mb-8">
                    {MEAL_TYPES.map(type => (
                        <HapticButton
                            key={type}
                            hapticType="light"
                            onPress={() => setSelectedType(type)}
                            className={`w-[48%] py-4 rounded-xl items-center justify-center mb-3 border ${selectedType === type ? 'bg-orange-500/20 border-orange-500/50' : 'bg-zinc-900 border-zinc-800'}`}
                        >
                            <Text className={`font-bold ${selectedType === type ? 'text-orange-500' : 'text-zinc-400'}`}>
                                {type}
                            </Text>
                        </HapticButton>
                    ))}
                </View>

                {/* Macros Input */}
                <Text className="text-zinc-400 font-bold mb-3 uppercase text-xs tracking-wider">Macros (grams)</Text>

                <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 items-center">
                        <Text className="text-blue-400 font-bold mb-2">Protein</Text>
                        <KeyboardAwareInput
                            ref={(el: any) => { inputRefs.current['protein'] = el; }}
                            value={protein}
                            onChangeText={setProtein}
                            onNext={() => handleNextInput('protein')}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#52525b"
                            className="text-white text-3xl font-black text-center w-full"
                        />
                    </View>
                    <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 items-center">
                        <Text className="text-emerald-400 font-bold mb-2">Carbs</Text>
                        <KeyboardAwareInput
                            ref={(el: any) => { inputRefs.current['carbs'] = el; }}
                            value={carbs}
                            onChangeText={setCarbs}
                            onNext={() => handleNextInput('carbs')}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#52525b"
                            className="text-white text-3xl font-black text-center w-full"
                        />
                    </View>
                </View>

                <View className="flex-row space-x-4 mb-8">
                    <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 items-center">
                        <Text className="text-amber-400 font-bold mb-2">Fat</Text>
                        <KeyboardAwareInput
                            ref={(el: any) => { inputRefs.current['fats'] = el; }}
                            value={fats}
                            onChangeText={setFats}
                            onNext={() => handleNextInput('fats')}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#52525b"
                            className="text-white text-3xl font-black text-center w-full"
                        />
                    </View>
                    <View className="flex-1" />
                </View>

                {/* Calories Override */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-8 flex-row items-center justify-between">
                    <View>
                        <Text className="text-white font-bold text-lg">Total Calories</Text>
                        <Text className="text-zinc-500 text-xs mt-1 w-48">Leave blank to auto-calculate based on entered macros.</Text>
                    </View>
                    <KeyboardAwareInput
                        ref={(el: any) => { inputRefs.current['calories'] = el; }}
                        value={calories}
                        onChangeText={setCalories}
                        keyboardType="numeric"
                        placeholder="Auto"
                        placeholderTextColor="#52525b"
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-bold w-24 text-center text-lg"
                    />
                </View>

                {/* Save Button */}
                <HapticButton
                    hapticType={showSuccess ? "none" : "success"}
                    onPress={handleSaveMeal}
                    disabled={submitting || showSuccess}
                    className={`w-full py-4 rounded-xl items-center flex-row justify-center ${showSuccess ? 'bg-emerald-500' : 'bg-primary'}`}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : showSuccess ? (
                        <>
                            <FontAwesome5 name="check-circle" size={18} color="#fff" className="mr-2" />
                            <Text className="text-white font-bold text-lg">Meal Saved!</Text>
                        </>
                    ) : (
                        <Text className="text-black font-bold text-lg">Save Meal</Text>
                    )}
                </HapticButton>

            </KeyboardFormWrapper>
        </View>
    );
}
