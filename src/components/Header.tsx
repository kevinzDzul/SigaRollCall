import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useThemeColor } from '@siga/hooks/useThemeColor';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '@siga/context/themeProvider';


type HeaderMode = 'back' | 'drawer' | 'none'

interface HeaderProps {
    title?: string
    mode?: HeaderMode,
}

const Header: React.FC<HeaderProps> = ({ title, mode = 'none' }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const bg = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'onPrimary');

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true,
        );

        return () => backHandler.remove();
    }, []);

    const handlePress = () => {
        if (mode === 'back' && navigation.canGoBack()) {
            navigation.goBack();
        } else if (mode === 'drawer') {
            navigation.dispatch(DrawerActions.toggleDrawer());
        }
    };

    const renderIcon = () => {
        if (mode === 'back') {
            return <Icon name="chevron-left" iconStyle="solid" size={30} color={colors.onPrimary} />;
        }
        if (mode === 'drawer') {
            return <Icon name="bars" iconStyle="solid" size={30} color={colors.onPrimary} />;
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {mode !== 'none' ? (
                <TouchableOpacity onPress={handlePress} style={styles.button}>
                    {renderIcon()}
                </TouchableOpacity>
            ) : (
                <View style={styles.button} />
            )}
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <View style={styles.button} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        elevation: 4,
    },
    button: {
        width: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Header;
