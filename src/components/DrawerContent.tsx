import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import DrawerHeader from './DrawerHeader';
import DrawerSwitch from './DrawerSwitch';
import { CustomText } from './CustomText';
import { getVersion } from 'react-native-device-info';
import { useTheme } from '@siga/context/themeProvider';

export default function DrawerContent(props: DrawerContentComponentProps) {
    const [appVersion, setAppVersion] = useState('');
    const { colors } = useTheme();

    useEffect(() => {
        setAppVersion(getVersion());
    }, []);

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerHeader />
            <DrawerItemList {...props} />
            <DrawerSwitch />
            <CustomText style={{ color: colors.onPrimary }}>
                Versión {appVersion}
            </CustomText>
        </DrawerContentScrollView>
    );
}
