import React, { useRef } from 'react';
import { ViewStyle, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface KeyboardFormWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    bounces?: boolean;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
    className?: string;
}

/**
 * A global higher-order component seamlessly executing native text tracking.
 * On modern iOS, `automaticallyAdjustKeyboardInsets` explicitly forces the ScrollView
 * to strictly measure and natively auto-scroll directly to focused inputs.
 * On Android, `windowSoftInputMode="adjustResize"` triggers the native equivalent instantly.
 */
export function KeyboardFormWrapper({
    children,
    style,
    contentContainerStyle,
    bounces = false,
    keyboardShouldPersistTaps = 'handled',
    className
}: KeyboardFormWrapperProps) {
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            ref={scrollViewRef}
            automaticallyAdjustKeyboardInsets={true}
            style={[styles.container, style]}
            className={className}
            contentContainerStyle={[
                {
                    paddingBottom: Math.max(insets.bottom, 24),
                    flexGrow: 1
                },
                contentContainerStyle
            ]}
            bounces={bounces}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
        >
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
