import { useTheme } from '@siga/context/themeProvider';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ContainerType = {
    style?: StyleProp<ViewStyle>,
    children: React.ReactNode | undefined
}

const Container = ({ children, style }: ContainerType) => {
    const { colors } = useTheme();
    return (<View style={[styles.container, { backgroundColor: colors.background }, style]}>{children}</View>);
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default Container;
