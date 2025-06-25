import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomText } from './CustomText';
import { useTheme } from '@siga/context/themeProvider';

type UserCardProps = {
    disabled?: boolean;
    name: string;
    username?: string;
    isFaceCompleted?: boolean;
    onOptionsPress: () => void;
};

const UserCard: React.FC<UserCardProps> = ({ disabled, name, username, isFaceCompleted = false, onOptionsPress }) => {
    const { colors } = useTheme();
    const initial = (name?.trim()?.[0] || '?').toUpperCase();
    return (
        <View style={[{ backgroundColor: colors.surface }, styles.card]}>
            <View style={[{ backgroundColor: colors.primary }, styles.avatar]}>
                <CustomText style={styles.initial}>{initial}</CustomText>
            </View>
            <View style={styles.textContainer}>
                <Text style={[{ color: colors.onSurface }, styles.name]}>{name}</Text>
                {username ? <Text style={[{ color: colors.onSurface }, styles.username]}>{`Usuario: ${username}`}</Text> : null}
                <Text style={[{ color: colors.onSurface }, styles.status]}>{`Estatus: ${isFaceCompleted ? 'Registrado' : 'No registrado'}`}</Text>
            </View>
            <TouchableOpacity
                onPress={onOptionsPress}
                disabled={disabled || isFaceCompleted}
                style={styles.iconWrapper}
            >
                {isFaceCompleted ?
                    <View style={styles.tag}>
                        <Text style={styles.textTag}>{'Registrado'}</Text>
                    </View>
                    :
                    <View style={[
                        styles.button,
                        disabled && styles.disabledButton,
                    ]}>
                        <Text style={styles.textButton}>{'Registrar'}</Text>
                    </View>
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    disabledButton: {
        backgroundColor: '#E0E0E0', // Un gris claro para el fondo
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        opacity: 0.6,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 12,
    },
    username: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    iconWrapper: {
        padding: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initial: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    tag: {
        backgroundColor: '#d1f7c4', // verde claro
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    textTag: {
        color: '#256029', // verde oscuro
        fontSize: 10,
        fontWeight: '600',
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#E65100',
        alignItems: 'center',
    },
    textButton: {
        fontWeight: '600',
        fontSize: 10,
        color: '#FFF',
    },
});

export default UserCard;
