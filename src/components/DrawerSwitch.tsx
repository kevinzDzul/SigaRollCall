import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '@siga/context/themeProvider';
import { CustomText } from './CustomText';

export default function DrawerSwitch(props: DrawerContentComponentProps) {
    const { toggleTheme, theme, colors } = useTheme();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />

            <View style={[styles.switchContainer, { borderColor: colors.onBackground }]}>
                <CustomText style={{ color: colors.onPrimary }}>{`Tema ${theme}`}</CustomText>
                <Switch
                    trackColor={{ false: colors.primaryContainer, true: colors.primaryContainer }}
                    thumbColor={colors.onTertiaryFixedVariant}
                    ios_backgroundColor={colors.primary}
                    onValueChange={toggleTheme}
                    value={theme === 'dark'}
                />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    switchContainer: {
        padding:5,
        flexDirection: 'row',
        marginTop: 'auto',
        borderTopWidth: 1,
    },
});
