import { useTheme } from '@siga/context/themeProvider';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerType = {
    style?: StyleProp<ViewStyle>,
    children: React.ReactNode | undefined
}

const Container = ({ children, style }: ContainerType) => {
    const { colors } = useTheme();
    return (<SafeAreaView style={[styles.container, { backgroundColor: colors.background }, style]}>{children}</SafeAreaView>);
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default Container;
