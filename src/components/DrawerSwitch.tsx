import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@siga/context/themeProvider';

const DrawerSwitch = () => {
    const { toggleTheme, theme, colors } = useTheme();
    return (
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
    );

};

const styles = StyleSheet.create({
    switchContainer: {
        padding: 5,
        flexDirection: 'row',
        marginTop: 'auto',
        borderTopWidth: 1,
    },
});

export default DrawerSwitch;
