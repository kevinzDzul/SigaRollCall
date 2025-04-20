import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import CaptureScreen from '@siga/screens/Capture';
import HomeLayout from '@siga/screens/Main/HomeNavigation';
import LoginScreen from '@siga/screens/Login';
import { useAuth } from '@siga/context/authProvider';
import { useTheme } from '@siga/context/themeProvider';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { isLoggedIn, isLoading } = useAuth();
    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <>
            <StatusBar animated backgroundColor={colors.primary} />
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {isLoggedIn ? (
                        <>
                            <Stack.Screen name="HomeScreen" component={HomeLayout} />
                            <Stack.Screen name="CaptureScreen" component={CaptureScreen} />
                        </>
                    ) : (
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default RootNavigator;
