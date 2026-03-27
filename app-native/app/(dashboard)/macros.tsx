import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function MacrosWizard() {
    const router = useRouter();
    const params = useLocalSearchParams<{ reset?: string }>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    // Wizard State
    const [step, setStep] = useState(1);

    // Reset listener for recalculation entry points
    useEffect(() => {
        if (params.reset === 'true') {
            setStep(1);
        }
    }, [params.reset]);

    // Step 1: Body Data
    const [weight, setWeight] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [sex, setSex] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState(''); // calculated from DOB or manually entered

    // Step 2: Goal
    const [goal, setGoal] = useState<'lose_fat' | 'build_muscle' | 'recomp' | 'maintain'>('lose_fat');

    // Step 3: Activity Level
    const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('light');

    // Step 4: Diet Preference
    const [diet, setDiet] = useState<'balanced' | 'high_protein' | 'low_carb' | 'keto' | 'mediterranean' | 'whole_food' | 'pescatarian' | 'vegetarian'>('balanced');

    // Step 5: Results
    const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

    useEffect(() => {
        async function fetchProfileData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profile) {
                    setIsPremium(profile.subscription_status === 'active');

                    // Pre-fill Step 1 Data
                    if (profile.target_weight) setWeight(profile.target_weight.toString());
                    if (profile.height) {
                        const totalInches = profile.height;
                        setHeightFt(Math.floor(totalInches / 12).toString());
                        setHeightIn(Math.round(totalInches % 12).toString());
                    }
                    if (profile.sex) setSex(profile.sex as 'male' | 'female');

                    if (profile.dob) {
                        const birthYear = new Date(profile.dob).getFullYear();
                        const currentYear = new Date().getFullYear();
                        setAge((currentYear - birthYear).toString());
                    }

                    // Pre-fill existing config if available (mapping old DB structures to new wizard options)
                    if (profile.activity_level) {
                        setActivityLevel(profile.activity_level as 'sedentary' | 'light' | 'moderate' | 'active');
                    }
                    if (profile.primary_goal) {
                        setGoal(profile.primary_goal as 'lose_fat' | 'build_muscle' | 'recomp' | 'maintain');
                    }
                }
            }
            setLoading(false);
        }
        fetchProfileData();
    }, []);

    // Simulated Macro Math Engine
    const calculateMacros = () => {
        // Basic BMR calculation (Mifflin-St Jeor) - Simplified for demonstration
        const totalHeightInches = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0);

        const wKg = parseFloat(weight) * 0.453592 || 80;
        const hCm = totalHeightInches * 2.54 || 175;
        const aYrs = parseInt(age) || 30;

        let bmr = (10 * wKg) + (6.25 * hCm) - (5 * aYrs);
        bmr = sex === 'male' ? bmr + 5 : bmr - 161;

        // Activity Multiplier
        const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
        const tdee = bmr * multipliers[activityLevel];

        // Goal Adjustment
        let targetCals = tdee;
        if (goal === 'lose_fat') targetCals -= 500;
        if (goal === 'build_muscle') targetCals += 300;
        if (goal === 'recomp') targetCals -= 200;

        // Diet Ratios (Protein / Carbs / Fats)
        let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
        if (diet === 'high_protein') { pRatio = 0.4; cRatio = 0.3; fRatio = 0.3; }
        if (diet === 'low_carb') { pRatio = 0.35; cRatio = 0.25; fRatio = 0.4; }
        if (diet === 'keto') { pRatio = 0.2; cRatio = 0.05; fRatio = 0.75; }

        const pCals = targetCals * pRatio;
        const cCals = targetCals * cRatio;
        const fCals = targetCals * fRatio;

        setMacros({
            calories: Math.round(targetCals),
            protein: Math.round(pCals / 4), // 4 cals per g
            carbs: Math.round(cCals / 4), // 4 cals per g
            fats: Math.round(fCals / 9) // 9 cals per g
        });

        setStep(5); // Proceed to results
    };

    const handleSaveMacros = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Calculate final height scalar for saving back to profiles
            const totalHeightInches = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0);

            // Update profile with the confirmation data and macro targets
            const { error: profileError } = await supabase.from('profiles').update({
                target_weight: parseFloat(weight) || null,
                height: totalHeightInches || null,
                sex: sex,
                activity_level: activityLevel,
                primary_goal: goal,
                protein_target: macros.protein,
                carbs_target: macros.carbs,
                fat_target: macros.fats,
                calories_target: macros.calories
                // Note: Not writing 'age' back to DOB since it's a derived approximation
            }).eq('id', user.id);

            if (profileError) {
                console.error("Supabase Save Error (Profiles):", profileError);
                Alert.alert("Save Failed", "There was an error saving your macro targets. Please try again.");
            } else {
                Alert.alert("Success", "Your new macro targets have been activated!", [
                    { text: "View Dashboard", onPress: () => router.push('/(dashboard)') }
                ]);
            }
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator color="#fff" size="large" />
            </View>
        );
    }

    const renderProgressBar = () => (
        <View className="flex-row gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((idx) => (
                <View
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full ${idx <= step ? 'bg-primary' : 'bg-zinc-800'}`}
                />
            ))}
        </View>
    );

    return (
        <View className="flex-1 bg-zinc-950 pt-6">
            <KeyboardFormWrapper className="flex-1 px-6">

                {renderProgressBar()}

                {/* --- Step 1: Confirm Body Data --- */}
                {step === 1 && (
                    <View className="flex-1 animation-fade-in">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Confirm Your Stats</Text>
                        <Text className="text-zinc-400 mb-8">We use these core metrics to calculate your Base Metabolic Rate (BMR).</Text>

                        <View className="space-y-4 mb-8">
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-sm mb-1 ml-1">Weight (lbs)</Text>
                                    <KeyboardAwareInput
                                        value={weight}
                                        onChangeText={setWeight}
                                        keyboardType="numeric"
                                        placeholder="175"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium text-lg"
                                    />
                                </View>
                                <View className="flex-[1.5] flex-row gap-2">
                                    <View className="flex-1">
                                        <Text className="text-zinc-500 text-sm mb-1 ml-1">Feet</Text>
                                        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4">
                                            <KeyboardAwareInput
                                                value={heightFt}
                                                onChangeText={setHeightFt}
                                                keyboardType="numeric"
                                                placeholder="5"
                                                placeholderTextColor="#52525b"
                                                className="flex-1 text-white font-medium text-lg"
                                            />
                                            <Text className="text-zinc-500 font-bold ml-1">ft</Text>
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-zinc-500 text-sm mb-1 ml-1">Inches</Text>
                                        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4">
                                            <KeyboardAwareInput
                                                value={heightIn}
                                                onChangeText={setHeightIn}
                                                keyboardType="numeric"
                                                placeholder="10"
                                                placeholderTextColor="#52525b"
                                                className="flex-1 text-white font-medium text-lg"
                                            />
                                            <Text className="text-zinc-500 font-bold ml-1">in</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-sm mb-1 ml-1">Sex</Text>
                                    <View className="flex-row bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-1">
                                        <HapticButton onPress={() => setSex('male')} className={`flex-1 py-3 items-center rounded-lg ${sex === 'male' ? 'bg-zinc-800' : ''}`}>
                                            <Text className={`font-semibold ${sex === 'male' ? 'text-white' : 'text-zinc-500'}`}>Male</Text>
                                        </HapticButton>
                                        <HapticButton onPress={() => setSex('female')} className={`flex-1 py-3 items-center rounded-lg ${sex === 'female' ? 'bg-zinc-800' : ''}`}>
                                            <Text className={`font-semibold ${sex === 'female' ? 'text-white' : 'text-zinc-500'}`}>Female</Text>
                                        </HapticButton>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-sm mb-1 ml-1">Age</Text>
                                    <KeyboardAwareInput
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="numeric"
                                        placeholder="30"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium text-lg"
                                    />
                                </View>
                            </View>
                        </View>

                        <HapticButton onPress={() => setStep(2)} className="w-full bg-white py-4 rounded-xl items-center flex-row justify-center mt-auto">
                            <Text className="text-black font-bold text-lg mr-2">Continue</Text>
                            <FontAwesome5 name="arrow-right" size={14} color="#000" />
                        </HapticButton>
                    </View>
                )}

                {/* --- Step 2: Goal Selection --- */}
                {step === 2 && (
                    <View className="flex-1 animation-fade-in">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">What's your goal?</Text>
                        <Text className="text-zinc-400 mb-8">This determines your primary daily calorie target.</Text>

                        <View className="space-y-3 mb-8">
                            {[
                                { id: 'lose_fat', title: 'Lose body fat', desc: 'Caloric deficit to burn stubborn fat.' },
                                { id: 'build_muscle', title: 'Build muscle', desc: 'Caloric surplus to fuel hypertrophy.' },
                                { id: 'recomp', title: 'Body recomposition', desc: 'Slight deficit. Build muscle while losing fat.' },
                                { id: 'maintain', title: 'Maintain weight', desc: 'Eat at maintenance. Perfect for athletes.' }
                            ].map((g) => (
                                <HapticButton
                                    key={g.id}
                                    onPress={() => setGoal(g.id as any)}
                                    className={`p-5 rounded-2xl border ${goal === g.id ? 'bg-primary/10 border-primary' : 'bg-zinc-900 border-zinc-800'}`}
                                >
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className={`font-bold text-lg ${goal === g.id ? 'text-primary' : 'text-white'}`}>{g.title}</Text>
                                        {goal === g.id && <FontAwesome5 name="check-circle" size={18} color="#0ea5e9" solid />}
                                    </View>
                                    <Text className={`text-sm ${goal === g.id ? 'text-primary/80' : 'text-zinc-500'}`}>{g.desc}</Text>
                                </HapticButton>
                            ))}
                        </View>

                        <View className="flex-row gap-3">
                            <HapticButton onPress={() => setStep(1)} className="bg-zinc-900 px-6 py-4 rounded-xl items-center justify-center">
                                <FontAwesome5 name="arrow-left" size={16} color="#fff" />
                            </HapticButton>
                            <HapticButton onPress={() => setStep(3)} className="flex-1 bg-white py-4 rounded-xl items-center justify-center">
                                <Text className="text-black font-bold text-lg">Continue</Text>
                            </HapticButton>
                        </View>
                    </View>
                )}

                {/* --- Step 3: Activity Level --- */}
                {step === 3 && (
                    <View className="flex-1 animation-fade-in">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Your Activity Level</Text>
                        <Text className="text-zinc-400 mb-8">How active are you outside of the gym?</Text>

                        <View className="space-y-3 mb-8">
                            {[
                                { id: 'sedentary', title: 'Sedentary', desc: 'Desk job, little to no movement.' },
                                { id: 'light', title: 'Lightly Active', desc: 'Light walking, 1-3 days of exercise.' },
                                { id: 'moderate', title: 'Moderately Active', desc: 'Active job or 3-5 days of exercise.' },
                                { id: 'active', title: 'Very Active', desc: 'Physical job and heavy exercise.' }
                            ].map((a) => (
                                <HapticButton
                                    key={a.id}
                                    onPress={() => setActivityLevel(a.id as any)}
                                    className={`p-5 rounded-2xl border ${activityLevel === a.id ? 'bg-primary/10 border-primary' : 'bg-zinc-900 border-zinc-800'}`}
                                >
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className={`font-bold text-lg ${activityLevel === a.id ? 'text-primary' : 'text-white'}`}>{a.title}</Text>
                                        {activityLevel === a.id && <FontAwesome5 name="check-circle" size={18} color="#0ea5e9" solid />}
                                    </View>
                                    <Text className={`text-sm ${activityLevel === a.id ? 'text-primary/80' : 'text-zinc-500'}`}>{a.desc}</Text>
                                </HapticButton>
                            ))}
                        </View>

                        <View className="flex-row gap-3">
                            <HapticButton onPress={() => setStep(2)} className="bg-zinc-900 px-6 py-4 rounded-xl items-center justify-center">
                                <FontAwesome5 name="arrow-left" size={16} color="#fff" />
                            </HapticButton>
                            <HapticButton onPress={() => setStep(4)} className="flex-1 bg-white py-4 rounded-xl items-center justify-center">
                                <Text className="text-black font-bold text-lg">Continue</Text>
                            </HapticButton>
                        </View>
                    </View>
                )}

                {/* --- Step 4: Diet Preference --- */}
                {step === 4 && (
                    <View className="flex-1 animation-fade-in">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Diet Preference</Text>
                        <Text className="text-zinc-400 mb-8">This determines your protein, carb, and fat ratios.</Text>

                        <View className="space-y-3 mb-10">
                            {[
                                { id: 'balanced', title: 'Balanced', desc: 'A moderate split of protein, carbs, and fats for general health and performance.' },
                                { id: 'high_protein', title: 'High Protein', desc: 'Higher protein intake to support muscle retention and growth.' },
                                { id: 'low_carb', title: 'Low Carb', desc: 'Lower carbohydrate intake with higher fats and protein.' },
                                { id: 'keto', title: 'Ketogenic', desc: 'Very low carb, high fat approach for users preferring keto-style eating.' },
                                { id: 'mediterranean', title: 'Mediterranean', desc: 'Balanced whole-food approach emphasizing healthy fats, fish, grains, fruits, and vegetables.' },
                                { id: 'whole_food', title: 'Whole Food Focus', desc: 'Prioritizes minimally processed foods and simple ingredient choices.' },
                                { id: 'pescatarian', title: 'Pescatarian', desc: 'Includes fish but excludes other meats.' },
                                { id: 'vegetarian', title: 'Vegetarian', desc: 'Plant-based approach that excludes meat and fish.' }
                            ].map((d) => (
                                <HapticButton
                                    key={d.id}
                                    onPress={() => setDiet(d.id as any)}
                                    className={`p-5 rounded-2xl border ${diet === d.id ? 'bg-primary/10 border-primary' : 'bg-zinc-900 border-zinc-800'}`}
                                >
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className={`font-bold text-lg ${diet === d.id ? 'text-primary' : 'text-white'}`}>{d.title}</Text>
                                        {diet === d.id && <FontAwesome5 name="check-circle" size={18} color="#0ea5e9" solid />}
                                    </View>
                                    <Text className={`text-sm tracking-tight ${diet === d.id ? 'text-primary/80' : 'text-zinc-500'}`}>{d.desc}</Text>
                                </HapticButton>
                            ))}
                        </View>

                        <View className="flex-row gap-3 mt-auto">
                            <HapticButton onPress={() => setStep(3)} className="bg-zinc-900 px-6 py-4 rounded-xl items-center justify-center">
                                <FontAwesome5 name="arrow-left" size={16} color="#fff" />
                            </HapticButton>
                            <HapticButton onPress={calculateMacros} className="flex-1 bg-primary py-4 rounded-xl items-center justify-center flex-row">
                                <FontAwesome5 name="calculator" size={16} color="#000" className="mr-2" />
                                <Text className="text-black font-bold text-lg">Calculate Macros</Text>
                            </HapticButton>
                        </View>
                    </View>
                )}

                {/* --- Step 5: Macros Results --- */}
                {step === 5 && (
                    <View className="flex-1 pb-10 animation-fade-in">
                        <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Your Target</Text>
                        <Text className="text-zinc-400 mb-8">Based on your {goal.replace('_', ' ')} goal and {diet.replace('_', ' ')} diet.</Text>

                        {/* Large Result Card */}
                        <View className="bg-primary rounded-3xl p-6 mb-8 overflow-hidden relative shadow-lg shadow-primary/20">
                            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full opacity-30 -mr-10 -mt-10 pointer-events-none" />

                            <Text className="text-white/80 font-medium mb-1">Daily Calories</Text>
                            <View className="flex-row items-end mb-8">
                                <Text className="text-6xl font-black text-white tracking-tighter">{macros.calories}</Text>
                                <Text className="text-xl text-white/80 mb-2 ml-1 font-bold">kcal</Text>
                            </View>

                            <View className="flex-row justify-between border-t border-white/20 pt-6">
                                <View>
                                    <Text className="text-white/80 text-xs uppercase font-bold tracking-widest mb-1">Protein</Text>
                                    <Text className="text-white font-black text-3xl">{macros.protein}<Text className="text-lg">g</Text></Text>
                                </View>
                                <View>
                                    <Text className="text-white/80 text-xs uppercase font-bold tracking-widest mb-1">Carbs</Text>
                                    <Text className="text-white font-black text-3xl">{macros.carbs}<Text className="text-lg">g</Text></Text>
                                </View>
                                <View>
                                    <Text className="text-white/80 text-xs uppercase font-bold tracking-widest mb-1">Fats</Text>
                                    <Text className="text-white font-black text-3xl">{macros.fats}<Text className="text-lg">g</Text></Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row gap-3">
                            <HapticButton onPress={() => setStep(4)} disabled={saving} className="bg-zinc-900 px-6 py-4 rounded-xl items-center justify-center">
                                <FontAwesome5 name="redo" size={16} color="#fff" />
                            </HapticButton>
                            <HapticButton hapticType="success" onPress={handleSaveMacros} disabled={saving} className="flex-1 bg-white py-4 rounded-xl items-center justify-center flex-row">
                                {saving ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <>
                                        <FontAwesome5 name="check" size={16} color="#000" className="mr-2" />
                                        <Text className="text-black font-black text-lg">Save Targets</Text>
                                    </>
                                )}
                            </HapticButton>
                        </View>

                        {/* Freemium Upsell Re-added */}
                        {!isPremium && (
                            <HapticButton
                                onPress={() => router.push('/(dashboard)/paywall')}
                                activeOpacity={0.8}
                                className="mt-8 bg-zinc-900 border border-amber-500/30 rounded-3xl p-5 border-dashed flex-row items-center"
                            >
                                <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center mr-4">
                                    <FontAwesome5 name="magic" size={14} color="#f59e0b" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-0.5">Enable Adaptive Macros</Text>
                                    <Text className="text-zinc-400 text-xs leading-4">Upgrade to Premium to have your macros auto-adjust based on weekly weight trends.</Text>
                                </View>
                            </HapticButton>
                        )}
                    </View>
                )}
            </KeyboardFormWrapper>
        </View>
    );
}
