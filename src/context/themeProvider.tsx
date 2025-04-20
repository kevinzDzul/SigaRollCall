// src/context/theme.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@siga/constants/Colors';

type ThemeType = 'light' | 'dark'

type ThemeContextType = {
    theme: ThemeType
    colors: typeof Colors.light
    toggleTheme: () => void
}

const STORAGE_KEY = 'theme_preference';

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: Colors.light,
    toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = Appearance.getColorScheme() ?? 'light';
    const [theme, setTheme] = useState<ThemeType>('light');

    useEffect(() => {
        // cargar la preferencia guardada o usar el sistema
        const loadStoredTheme = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') {
                setTheme(stored);
            } else {
                setTheme(systemColorScheme);
            }
        };

        loadStoredTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    };

    const colors = Colors[theme];

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
