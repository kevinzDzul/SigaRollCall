import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { InputText } from '@siga/components/InputText';
import { useTheme } from '@siga/context/themeProvider';
import { RootStackParamList } from '@siga/screens/Capture';
import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const dummyData = Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Nombre ${i + 1}`,
}));
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function CheckListScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>()
    const [query, setQuery] = useState('');
    const [filteredData, setFilteredData] = useState(dummyData);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length > 0) {
                const filtered = dummyData.filter((item) =>
                    item.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredData(filtered);
            } else {
                setFilteredData(dummyData);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const renderItem = ({ item }: { item: typeof dummyData[number] }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('CaptureScreen', { mode: 'register' })}
            style={[styles.item, { backgroundColor: colors.surfaceContainerHighest }]}>
            <CustomText style={[styles.itemText, { color: colors.onSurface }]}>{item.name}</CustomText>
        </TouchableOpacity>
    );

    return (
        <Container style={styles.container}>
            <Header mode='drawer' />
            <View style={[styles.body]}>
                <InputText
                    placeholder="Buscar..."
                    value={query}
                    onChangeText={setQuery}
                    placeholderTextColor={colors.surfaceVariant}
                    style={[styles.searchInput, { borderColor: colors.surfaceVariant }]}
                />
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<CustomText style={[styles.noResults]}>Sin resultados</CustomText>}
                />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    body: { flex: 1, padding: 16 },
    searchInput: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    item: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemText: { fontSize: 16 },
    noResults: { textAlign: 'center', marginTop: 20 },
});
