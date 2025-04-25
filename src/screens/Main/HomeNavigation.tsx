import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Home';
import CheckListScreen from './CheckList';
import SettingsScreen from './Setting';
import { useTheme } from '@siga/context/themeProvider';

const Drawer = createDrawerNavigator();
export default function HomeLayout() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.primary, // fondo del drawer
        },
        drawerLabelStyle: {
          color: colors.onPrimary, // color del texto
        },
        headerShown: false, // si usas tu propio Header
        drawerActiveTintColor: colors.surface, // item seleccionado
        drawerInactiveTintColor: colors.onSurface, // items no seleccionados
      }}>
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Lista" component={CheckListScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
