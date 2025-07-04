import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import HomeScreen from './Home';
import CheckListScreen from './CheckList';
import SettingsScreen from './Setting';
import { useTheme } from '@siga/context/themeProvider';
import { UserRole } from '@siga/constants/Roles';
import DrawerContent from '@siga/components/DrawerContent';
import { usePermissions } from '@siga/hooks/usePermissions';

const Drawer = createDrawerNavigator();

const renderCustomDrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContent {...props} />
);

export default function HomeLayout() {
  const { colors } = useTheme();
  const { canAccess } = usePermissions();

  // Definimos las pantallas
  const screens = [
    { name: '🏠 Inicio', component: HomeScreen, permission: [UserRole.USER, UserRole.ADMIN, UserRole.MANAGER] },
    { name: '👱🏻‍♂️ Registro de Rostro', component: CheckListScreen, permission: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: '⚙️ Ajustes', component: SettingsScreen, permission: [UserRole.USER, UserRole.ADMIN, UserRole.MANAGER] },
  ];

  // Filtramos según permisos
  const filteredScreens = screens.filter(screen => canAccess(screen?.permission ?? []));

  return (
    <Drawer.Navigator
      drawerContent={renderCustomDrawerContent}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.primary,
        },
        drawerLabelStyle: {
          color: colors.onPrimary,
        },
        headerShown: false,
        drawerActiveTintColor: colors.surface,
        drawerInactiveTintColor: colors.onSurface,
      }}>
      {filteredScreens.map(screen => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Drawer.Navigator>
  );
}
