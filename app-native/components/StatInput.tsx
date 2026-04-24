import React from 'react';
import { View, Text } from 'react-native';
import { KeyboardAwareInput } from './KeyboardDoneView';

interface StatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    suffix?: string;
    containerClassName?: string;
    autoFocus?: boolean;
    fontSize?: number;
    height?: number;
}

export function StatInput({
    value,
    onChangeText,
    placeholder,
    suffix,
    containerClassName = "bg-zinc-900 border border-zinc-800 rounded-xl",
    autoFocus = false,
    fontSize = 18,
    height = 56, // h-14 is 56px
}: StatInputProps) {
    // CRITICAL iOS FIX:
    // Tailwind's text-* classes automatically set a larger lineHeight (e.g. text-lg = 28px lineHeight).
    // On iOS, setting lineHeight larger than fontSize pushes the text to the TOP of the line height box,
    // making the characters appear physically offset upwards even if the box itself is perfectly centered.
    // To solve this permanently, we completely strip all Tailwind text classes from the input,
    // explicitly forcing exact React Native system font parameters.

    return (
        <View
            className={`justify-center relative w-full ${containerClassName}`}
            style={{ height }}
        >
            <KeyboardAwareInput
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                placeholder={placeholder}
                placeholderTextColor="#52525b"
                autoFocus={autoFocus}
                style={{
                    color: 'white',
                    fontSize: fontSize,
                    fontWeight: '600',
                    textAlign: 'center',
                    paddingVertical: 0,
                    margin: 0,
                    // DO NOT use explicit lineHeight. Let iOS size the text naturally.
                }}
            />

            {suffix && (
                <View className="absolute right-4 top-0 bottom-0 justify-center pointer-events-none">
                    <Text className="text-zinc-500 font-bold" style={{ fontSize: 16 }}>{suffix}</Text>
                </View>
            )}
        </View>
    );
}
