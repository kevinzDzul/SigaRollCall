import { useTheme } from '@siga/context/themeProvider';
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    type?: 'primary' | 'outline',
    title?: string;
    isLoading?: boolean;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ type, title, isLoading, onPress, style, textStyle }) => {
    const { colors } = useTheme();
    const isOutline = type === 'outline';
    const backgroundColor = isOutline ? 'transparent' : colors.primary;
    const textColor = isOutline ? colors.onSurface : colors.onPrimary;
    const borderColor = isOutline ? colors.primary : 'transparent';

    return (
        <TouchableOpacity
            style={[styles.button, isLoading && styles.disabled, {
                backgroundColor: backgroundColor, borderColor,
                borderWidth: isOutline ? 1.5 : 0,
            }, style]}
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
            ) : (
                <Text style={[styles.text, textStyle, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontWeight: 'bold',
    },
});

export default Button;
