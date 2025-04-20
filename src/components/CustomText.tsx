import { useTheme } from '@siga/context/themeProvider';
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

type Props = TextProps & {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'error';
};

export const CustomText = ({ children, style, variant = 'default', ...props }: Props) => {
  const { colors } = useTheme();
  const colorMap: Record<string, string> = {
    default: colors.onSurface,
    primary: colors.primary,
    error: colors.error,
  };

  const textColor = colorMap[variant] || colors.onSurface;

  return (
    <Text style={[styles.text, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
