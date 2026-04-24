import React, { useId, forwardRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, InputAccessoryView, Keyboard, Platform, TextInput, TextInputProps } from 'react-native';

export interface KeyboardAwareInputProps extends TextInputProps {
    onNext?: () => void;
}

export const KeyboardAwareInput = forwardRef<TextInput, KeyboardAwareInputProps>((props, ref) => {
    const { onNext, onFocus, value, selection, ...textInputProps } = props;
    // useId() contains colons (e.g. :r0:), so we strip them avoiding native crash bugs
    const safeId = useId().replace(/[^a-zA-Z0-9]/g, '') + '-accessory';

    // Manage dynamic selection bounds to natively slide the cursor to the text bounds
    // while selectively releasing it so standard tapping mechanics still function.
    const [internalSelection, setInternalSelection] = useState<{ start: number, end?: number } | undefined>(selection);

    // Sync external props implicitly if forced from top level components
    useEffect(() => {
        if (selection !== undefined) {
            setInternalSelection(selection);
        }
    }, [selection]);

    const handleFocus = (e: any) => {
        if (onFocus) onFocus(e);

        if (value && value.length > 0) {
            setInternalSelection({ start: value.length, end: value.length });

            // Release the strict boundary override seamlessly so organic tapping resumes
            setTimeout(() => {
                setInternalSelection(undefined);
            }, 100);
        }
    };

    if (Platform.OS !== 'ios') {
        return <TextInput
            ref={ref}
            onSubmitEditing={onNext}
            onFocus={handleFocus}
            value={value}
            selection={internalSelection}
            {...textInputProps}
        />;
    }

    return (
        <>
            <TextInput
                ref={ref}
                onFocus={handleFocus}
                value={value}
                selection={internalSelection}
                {...textInputProps}
                inputAccessoryViewID={safeId}
            />
            <InputAccessoryView nativeID={safeId}>
                <View className="bg-zinc-800 border-t border-zinc-700 items-center justify-between flex-row px-4 py-3">
                    {onNext ? (
                        <TouchableOpacity onPress={onNext}>
                            <Text className="text-primary font-bold text-lg">Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}
                    <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                        <Text className="text-primary font-bold text-lg">Done</Text>
                    </TouchableOpacity>
                </View>
            </InputAccessoryView>
        </>
    );
});
