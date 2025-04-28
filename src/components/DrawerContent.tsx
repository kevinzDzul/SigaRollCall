import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import DrawerHeader from './DrawerHeader';
import DrawerSwitch from './DrawerSwitch';

export default function DrawerContent(props: DrawerContentComponentProps) {

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerHeader />

            <DrawerItemList {...props} />

            <DrawerSwitch />

        </DrawerContentScrollView>
    );
}
