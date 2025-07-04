import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNetwork } from '@siga/context/networkProvider';
import { useTheme } from '@siga/context/themeProvider';
import { CustomText } from './CustomText';

export const ConnectionStatusModal = () => {
    const { isConnected } = useNetwork();
    const { colors } = useTheme();

    if (isConnected) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.modalView, { backgroundColor: colors.surfaceVariant }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <CustomText style={[styles.modalText, { color: colors.onSurfaceVariant }]}>
                    Sin internet...
                </CustomText>
                <CustomText style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    Asegurate de tener una conexión a internet activa.
                </CustomText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999, // Asegura que se muestre sobre todo
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
}); 