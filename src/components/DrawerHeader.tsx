import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@siga/context/themeProvider';
import { useAuth } from '@siga/context/authProvider';



export default function DrawerHeader() {
    const { colors } = useTheme();
    const { username, role } = useAuth();
    const initial = (username?.trim()?.[0] || '🥷').toUpperCase();

    return (
        <View style={[styles.container, { borderColor: colors.onBackground }]}>
            <View style={styles.avatar}>
                <CustomText style={styles.initial}>{initial}</CustomText>
            </View>
            <View style={styles.textBlock}>
                <CustomText numberOfLines={1} style={[styles.name, { color: colors.onPrimary }]}>{`Usuario: ${username}`}</CustomText>
                <CustomText style={[styles.role, { color: colors.onPrimary }]}>{`Perfil: ${role?.toUpperCase()} 👤`}</CustomText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#A78BFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initial: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    textBlock: { flexShrink: 1 },
    name: { fontSize: 14, fontWeight: '600' },
    role: { fontSize: 12, marginTop: 2 },
});
