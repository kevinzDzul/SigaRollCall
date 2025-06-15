import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Employee, SearchUsersParams, searchUsersService } from '@siga/api/searchUsersService';
import Container from '@siga/components/Container';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { InputText } from '@siga/components/InputText';
import UserCard from '@siga/components/UserCard';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { useDebounce } from '@siga/hooks/useDebounce';
import { useValidateGeolocation } from '@siga/hooks/useValidateGeolocation';
import { RootStackParamList } from '@siga/screens/Capture';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Keyboard,
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function CheckListScreen() {
    const showToast = useToastTop();
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const { validateGeolocation, loading: isLoadingValidation } = useValidateGeolocation();

    const [filteredData, setFilteredData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // La función de limpieza se ejecuta cuando la pantalla pierde el foco (blur).
            return () => {
                setQuery('');
                setFilteredData([]);
            };
        }, [])
    );

        const keyboardDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (keyboardDismissTimer.current) {
            clearTimeout(keyboardDismissTimer.current);
        }

        if (query) {
            keyboardDismissTimer.current = setTimeout(() => {
                Keyboard.dismiss();
            }, 4000); // 4 segundos
        }

        return () => {
            if (keyboardDismissTimer.current) {
                clearTimeout(keyboardDismissTimer.current);
            }
        };
    }, [query]);

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
                console.log(res.data);
                const sorted = [...res.data].sort((a, b) => {
                    return (b.faceCompleted ? 1 : 0) - (a.faceCompleted ? 1 : 0);
                });
                setFilteredData(sorted);
            }
        }).catch((error) => {
            console.warn('Error buscando usuarios:', error);
            showToast(error.response?.data?.message ?? error?.message ?? 'Error buscando usuarios');
            if (active) { setFilteredData([]); }
        }).finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [debouncedQuery, showToast]);


    const handleItem = async (item: Employee) => {
        if (isLoadingValidation) { return; }
        const isActiveLocation = await validateGeolocation();
        if (!isActiveLocation) { return; }

        if (item?.faceCompleted) {
            item?.message && showToast(item?.message);
            return;
        }
        navigation.navigate('CaptureScreen', { id: item.id, mode: 'register' });
    };

    const renderItem = (item: Employee) => (
        <UserCard
            key={item.id}
            disabled={isLoadingValidation}
            name={`${item.firstName} ${item.lastName}`}
            username={item.username}
            isFaceCompleted={item.faceCompleted}
            onOptionsPress={() => handleItem(item)}
        />
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
    noResults: { textAlign: 'center', marginTop: 20 },
});
