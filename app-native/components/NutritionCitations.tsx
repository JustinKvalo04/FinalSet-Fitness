import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Modal, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { HapticButton } from './HapticButton';

export function NutritionCitations() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View className="mt-4 mb-8">
            {/* Compact Footer */}
            <View className="items-center px-4">
                <Text className="text-zinc-500 text-xs text-center mb-3">
                    FinalSet Fitness provides educational nutrition estimates and is not medical advice.
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center">
                    <Text className="text-primary font-bold text-xs uppercase tracking-wider">
                        View Nutrition Sources & Disclaimer
                    </Text>
                    <FontAwesome5 name="arrow-right" size={10} color="#0ea5e9" className="ml-2" />
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/80 justify-end">
                    <SafeAreaView className="bg-zinc-950 rounded-t-3xl border-t border-zinc-800 mt-24 flex-1">
                        <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-900">
                            <Text className="text-white font-bold text-xl">Methodology & Sources</Text>
                            <HapticButton
                                hapticType="light"
                                onPress={() => setModalVisible(false)}
                                className="w-8 h-8 rounded-full bg-zinc-900 items-center justify-center"
                            >
                                <FontAwesome5 name="times" size={14} color="#a1a1aa" />
                            </HapticButton>
                        </View>
                        
                        <ScrollView className="px-6 pt-6 flex-1">
                            <View className="mb-6">
                                <Text className="text-zinc-300 font-bold mb-1 text-base">Calorie estimates:</Text>
                                <Text className="text-zinc-500 text-sm leading-5">
                                    Mifflin MD, St Jeor ST, et al. (1990){'\n'}
                                    A new predictive equation for resting energy expenditure in healthy individuals.
                                </Text>
                            </View>

                            <View className="mb-6">
                                <Text className="text-zinc-300 font-bold mb-1 text-base">Protein recommendations:</Text>
                                <Text className="text-zinc-500 text-sm leading-5 mb-2">
                                    Morton RW et al. (2018){'\n'}
                                    A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength.
                                </Text>
                                <TouchableOpacity onPress={() => Linking.openURL('https://pubmed.ncbi.nlm.nih.gov/28698222/')}>
                                    <Text className="text-primary text-sm underline">https://pubmed.ncbi.nlm.nih.gov/28698222/</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mb-8">
                                <Text className="text-zinc-300 font-bold mb-1 text-base">General nutrition guidance:</Text>
                                <Text className="text-zinc-500 text-sm leading-5 mb-2">Dietary Guidelines for Americans</Text>
                                <TouchableOpacity onPress={() => Linking.openURL('https://www.dietaryguidelines.gov')}>
                                    <Text className="text-primary text-sm underline">https://www.dietaryguidelines.gov</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-12">
                                <Text className="text-orange-500/90 text-sm leading-5">
                                    <Text className="font-bold">Disclaimer: </Text>
                                    FinalSet Fitness provides educational nutrition estimates and is not medical advice. Consult a qualified healthcare professional before making significant dietary changes.
                                </Text>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
