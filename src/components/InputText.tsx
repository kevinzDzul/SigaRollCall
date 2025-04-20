import { useTheme } from '@siga/context/themeProvider';
import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    NativeSyntheticEvent,
    TextInputFocusEventData,
} from 'react-native';

type Props = TextInputProps & {
    label?: string;
    error?: string;
};

export const InputText = ({ label, error, ...props }: Props) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);

    const handleFocused = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props.onFocus?.(e);
        setFocused(true);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props.onBlur?.(e);
        setFocused(false);
    };

    const borderColor = error
        ? colors.error
        : focused
            ? colors.primary
            : colors.outline;

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
                    {label}
                </Text>
            )}
            <TextInput
                {...props}
                placeholderTextColor={colors.onSurfaceVariant}
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surfaceContainerLow,
                        color: colors.onSurface,
                        borderColor: borderColor,
                    },
                ]}
                onFocus={handleFocused}
                onBlur={handleBlur}
            />
            {!!error && (
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
});
