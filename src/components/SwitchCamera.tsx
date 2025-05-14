import React, { useEffect, useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = 'switch_camera';

const PersistentSwitch = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Cargar el valor guardado al iniciar
        const loadSwitchValue = async () => {
            try {
                const savedValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedValue !== null) {
                    setIsEnabled(savedValue === 'true');
                }
            } catch (e) {
                console.error('Error loading switch value:', e);
            }
        };
        loadSwitchValue();
    }, []);

    const toggleSwitch = async () => {
        try {
            const newValue = !isEnabled;
            setIsEnabled(newValue);
            await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
        } catch (e) {
            console.error('Error saving switch value:', e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Posición de la Camara:</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.label}>Frontal</Text>
                <Switch value={isEnabled} onValueChange={toggleSwitch} />
                <Text style={styles.label}>Trasera</Text>
            </View>

        </View>
    );
};

export default PersistentSwitch;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
});
