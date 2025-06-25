import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '@siga/context/themeProvider';
import React, { useState } from 'react';
import {
    TextInput,
    View,
    StyleSheet,
    TextInputProps,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { CustomText } from './CustomText';

type Props = TextInputProps & {
    label?: string;
    error?: string;
    loading?: boolean;
    onClear?: () => void;
};

export const InputText = React.forwardRef<TextInput, Props>(
  (
    {
      label,
      error,
      loading,
      onClear,
      value,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleFocused = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props.onFocus?.(e);
        setFocused(true);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props.onBlur?.(e);
        setFocused(false);
    };

    const togglePassword = () => setPasswordVisible(prev => !prev);

    const borderColor = error
        ? colors.error
        : focused
            ? colors.primary
            : colors.outline;

    const showClearIcon = !!value;

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <CustomText style={[styles.label, { color: colors.onSurfaceVariant }]}>
                    {label}
                </CustomText>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surfaceContainerLow,
                        borderColor,
                    },
                ]}
            >
                <TextInput
                    {...props}
                    ref={ref}
                    value={value}
                    secureTextEntry={secureTextEntry && !passwordVisible}
                    placeholderTextColor={colors.onSurfaceVariant}
                    style={[styles.input, { color: colors.onSurface }]}
                    onFocus={handleFocused}
                    onBlur={handleBlur}
                />

                <View style={styles.iconRow}>
                    {/* 🙊 / 🙈  para ocultar/mostrar contraseña */}
                    {secureTextEntry && (
                        <TouchableOpacity onPress={togglePassword} style={styles.iconTouch}>
                            <CustomText style={{ fontSize: 18 }}>
                                {passwordVisible ? '🙈' : '🙊'}
                            </CustomText>
                        </TouchableOpacity>
                    )}

                    {/* ❌ borrar texto o spinner de carga */}
                    {showClearIcon && (
                        <View style={styles.iconTouch}>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.outline} />
                            ) : (
                                <TouchableOpacity onPress={onClear}>
                                    <Icon
                                        name="xmark"
                                        iconStyle="solid"
                                        size={20}
                                        color={colors.outline}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {!!error && (
                <CustomText style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </CustomText>
            )}
        </View>
    );
  }
);


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
    /* Agrupa íconos a la derecha */
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    /* Margen uniforme para cada botón */
    iconTouch: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
});
