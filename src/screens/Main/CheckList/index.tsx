import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Employee, SearchUsersParams, searchUsersService } from '@siga/api/searchUsersService';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { InputText } from '@siga/components/InputText';
import { useTheme } from '@siga/context/themeProvider';
import { useDebounce } from '@siga/hooks/useDebounce';
import { RootStackParamList } from '@siga/screens/Capture';
import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function CheckListScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const [filteredData, setFilteredData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setFilteredData([]);
            return;
        }

        let active = true;
        setLoading(true);

        const params: SearchUsersParams = { query: debouncedQuery };
        searchUsersService(params).then((res) => {
            if (active && res?.success) {
                setFilteredData(res?.data);
            }
        }).catch((error) => {
            console.warn('Error buscando usuarios:', error);
            if (active) { setFilteredData([]); }
        }).finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [debouncedQuery]);


    const renderItem = (item: Employee) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('CaptureScreen', { id: item.id, mode: 'register' })}
            style={[styles.item, { backgroundColor: colors.surfaceContainerHighest }]}>
            <CustomText style={[styles.itemText, { color: colors.onSurface }]}>{`👤 ${item.firstName} ${item.middleName} ${item.lastName}`}</CustomText>
        </TouchableOpacity>
    );

    return (
        <Container style={styles.container}>
            <Header mode="drawer" />
            <View style={[styles.body]}>
                <InputText
                    placeholder="Buscar..."
                    value={query}
                    loading={loading}
                    onClear={() => setQuery('')}
                    onChangeText={setQuery}
                    placeholderTextColor={colors.surfaceVariant}
                    style={[styles.searchInput, { borderColor: colors.surfaceVariant }]}
                />
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderItem(item)}
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
