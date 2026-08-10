import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, Pressable, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { getSupabaseClient } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';

const MEAL_TYPES = [
    { id: 'Breakfast', icon: '🍳' },
    { id: 'Lunch', icon: '🥪' },
    { id: 'Dinner', icon: '🍽' },
    { id: 'Snack', icon: '🍎' }
];

export default function LogMeal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [selectedType, setSelectedType] = useState('Breakfast');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fats, setFats] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const inputRefs = useRef<Record<string, TextInput | null>>({});
    
    // Animation for success state
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useFocusEffect(
        useCallback(() => {
            setProtein('');
            setCarbs('');
            setFats('');
            setSelectedType('Breakfast');
            setShowSuccess(false);
            setSubmitting(false);
            setFocusedInput(null);
            scaleAnim.setValue(1);
        }, [])
    );

    const p = parseInt(protein) || 0;
    const c = parseInt(carbs) || 0;
    const f = parseInt(fats) || 0;
    const calculatedCalories = (p * 4) + (c * 4) + (f * 9);

    const triggerHaptic = (type: 'selection' | 'success') => {
        if (type === 'selection') {
            Haptics.selectionAsync();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleMealTypeSelect = (type: string) => {
        if (selectedType !== type) {
            triggerHaptic('selection');
            setSelectedType(type);
        }
    };

    const handleInputFocus = (field: string) => {
        if (focusedInput !== field) {
            triggerHaptic('selection');
            setFocusedInput(field);
        }
    };

    const handleSaveMeal = async () => {
        if (p === 0 && c === 0 && f === 0) {
            Alert.alert("Empty Meal", "Please enter some macros for this meal.");
            return;
        }

        setSubmitting(true);
        const { data: { user } } = await getSupabaseClient().auth.getUser();

        if (user) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;

            const { error } = await getSupabaseClient().from('meal_logs').insert({
                user_id: user.id,
                date: localDateStr,
                meal_type: selectedType,
                protein: p,
                carbs: c,
                fat: f,
                calories: calculatedCalories
            });

            if (error) {
                Alert.alert("Error logging meal", error.message);
                setSubmitting(false);
            } else {
                triggerHaptic('success');
                setShowSuccess(true);
                
                // Success Animation
                Animated.sequence([
                    Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
                ]).start();

                setTimeout(() => {
                    setProtein('');
                    setCarbs('');
                    setFats('');
                    setSelectedType('Breakfast');
                    setShowSuccess(false);
                    setSubmitting(false);
                    router.back();
                }, 1000);
            }
        } else {
            setSubmitting(false);
        }
    };

    const renderInput = (label: string, field: string, value: string, setter: (val: string) => void, color: string, colorClass: string) => {
        const isFocused = focusedInput === field;
        
        return (
            <Pressable 
                onPress={() => inputRefs.current[field]?.focus()}
                className={`flex-1 bg-zinc-900/80 rounded-3xl p-5 border-2 transition-colors ${isFocused ? `border-${colorClass}-500/50 bg-zinc-900` : 'border-transparent'}`}
            >
                <Text className={`font-bold mb-1 ${isFocused ? `text-${colorClass}-400` : 'text-zinc-500'}`}>{label}</Text>
                <View className="flex-row items-end">
                    <TextInput
                        ref={(el: any) => { inputRefs.current[field] = el; }}
                        value={value}
                        onChangeText={setter}
                        onFocus={() => handleInputFocus(field)}
                        onBlur={() => setFocusedInput(null)}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#3f3f46"
                        selectionColor={color}
                        className={`text-5xl font-black text-white p-0 m-0 ${isFocused ? `text-${colorClass}-100` : ''}`}
                        style={{ lineHeight: 56, includeFontPadding: false }}
                    />
                    <Text className="text-zinc-500 font-bold text-xl ml-1 mb-2">g</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black"
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-4 border-b border-zinc-900" style={{ paddingTop: insets.top + 16 }}>
                <Pressable
                    onPress={() => {
                        triggerHaptic('selection');
                        router.back();
                    }}
                    className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border border-zinc-800 active:bg-zinc-800"
                >
                    <FontAwesome5 name="times" size={16} color="#a1a1aa" />
                </Pressable>
                <Text className="text-white font-black text-xl tracking-tight">Log Meal</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }} keyboardShouldPersistTaps="handled">
                
                {/* Live Summary Header */}
                <View className="items-center justify-center py-10 px-6">
                    <View className="bg-zinc-900/50 px-4 py-1.5 rounded-full flex-row items-center mb-6 border border-zinc-800/50">
                        <Text className="text-lg mr-2">{MEAL_TYPES.find(m => m.id === selectedType)?.icon}</Text>
                        <Text className="text-zinc-300 font-bold text-sm tracking-widest uppercase">{selectedType}</Text>
                    </View>
                    
                    <Text className="text-7xl font-black text-white tracking-tighter mb-4" style={{ includeFontPadding: false }}>
                        {calculatedCalories}
                    </Text>
                    <Text className="text-zinc-400 font-bold text-lg tracking-widest uppercase mb-6">
                        kcal
                    </Text>

                    <View className="flex-row items-center justify-center space-x-6 bg-zinc-900/30 px-6 py-3 rounded-2xl border border-zinc-800/30">
                        <Text className="text-blue-400 font-bold text-lg">{p} <Text className="text-zinc-500 text-sm">P</Text></Text>
                        <Text className="text-zinc-700 font-black">•</Text>
                        <Text className="text-emerald-400 font-bold text-lg">{c} <Text className="text-zinc-500 text-sm">C</Text></Text>
                        <Text className="text-zinc-700 font-black">•</Text>
                        <Text className="text-amber-400 font-bold text-lg">{f} <Text className="text-zinc-500 text-sm">F</Text></Text>
                    </View>
                </View>

                <View className="px-6">
                    {/* Meal Types Grid */}
                    <View className="flex-row justify-between mb-8">
                        {MEAL_TYPES.map(type => {
                            const isSelected = selectedType === type.id;
                            return (
                                <Pressable
                                    key={type.id}
                                    onPress={() => handleMealTypeSelect(type.id)}
                                    className={`flex-1 items-center justify-center py-4 rounded-2xl mx-1 border-2 transition-all ${isSelected ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-950 border-zinc-900'}`}
                                >
                                    <Text className="text-2xl mb-1">{type.icon}</Text>
                                    <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-zinc-500'}`}>{type.id}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Macro Inputs */}
                    <View className="space-y-4 mb-10">
                        <View className="flex-row space-x-4">
                            {renderInput('Protein', 'protein', protein, setProtein, '#60a5fa', 'blue')}
                            {renderInput('Carbs', 'carbs', carbs, setCarbs, '#34d399', 'emerald')}
                        </View>
                        <View className="flex-row space-x-4">
                            {renderInput('Fat', 'fats', fats, setFats, '#fbbf24', 'amber')}
                            <View className="flex-1 opacity-0 pointer-events-none" />
                        </View>
                    </View>

                    {/* Save Button */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPress={handleSaveMeal}
                            disabled={submitting || showSuccess || (p === 0 && c === 0 && f === 0)}
                            className={`w-full py-5 rounded-2xl items-center justify-center shadow-xl ${
                                showSuccess 
                                    ? 'bg-emerald-500' 
                                    : (p === 0 && c === 0 && f === 0) 
                                        ? 'bg-zinc-900 border border-zinc-800' 
                                        : 'bg-white'
                            }`}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#000" />
                            ) : showSuccess ? (
                                <View className="flex-row items-center">
                                    <FontAwesome5 name="check" size={18} color="#fff" className="mr-2" />
                                    <Text className="text-white font-black text-xl">Logged</Text>
                                </View>
                            ) : (
                                <Text className={`font-black text-xl ${(p === 0 && c === 0 && f === 0) ? 'text-zinc-600' : 'text-black'}`}>
                                    Save Meal
                                </Text>
                            )}
                        </Pressable>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
