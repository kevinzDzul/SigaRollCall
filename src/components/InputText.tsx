import Icon from '@react-native-vector-icons/fontawesome6';
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
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

type Props = TextInputProps & {
    label?: string;
    error?: string;
    loading?: boolean;
    onClear?: () => void;
};

export const InputText = ({ label, error, loading, onClear, value, ...props }: Props) => {
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

    const showRightIcon = !!value;

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surfaceContainerLow,
                        borderColor: borderColor,
                    },
                ]}
            >
                <TextInput
                    {...props}
                    value={value}
                    placeholderTextColor={colors.onSurfaceVariant}
                    style={[
                        styles.input,
                        {
                            color: colors.onSurface,
                        },
                    ]}
                    onFocus={handleFocused}
                    onBlur={handleBlur}
                />
                {showRightIcon && (
                    <View style={styles.iconContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.outline} />
                        ) : (
                            <TouchableOpacity onPress={onClear}>
                                <Icon name="xmark" iconStyle="solid" size={20} color={colors.outline} />;
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
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
    inputContainer: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    iconContainer: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
});
