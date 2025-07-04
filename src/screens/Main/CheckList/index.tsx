import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Employee, SearchUsersParams, searchUsersService } from '@siga/api/searchUsersService';
import Container from '@siga/components/Container';
import CustomModal from '@siga/components/CustomModal';
import { CustomText } from '@siga/components/CustomText';
import Header from '@siga/components/Header';
import { InputText } from '@siga/components/InputText';
import UserCard from '@siga/components/UserCard';
import { useTheme } from '@siga/context/themeProvider';
import { useToastTop } from '@siga/context/toastProvider';
import { useDebounce } from '@siga/hooks/useDebounce';
import { useValidateGeolocation } from '@siga/hooks/useValidateGeolocation';
import { RootStackParamList } from '@siga/screens/Capture';
import { useCaptureStore } from '@siga/store/capture';
import { reportError } from '@siga/util/reportError';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Keyboard,
} from 'react-native';
import ContentBody from '@siga/components/ContentBody';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CaptureScreen'>

export default function CheckListScreen() {
    const showToast = useToastTop();
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const { validateGeolocation, loading: isLoadingValidation } = useValidateGeolocation();
    const { message, clearResult } = useCaptureStore((state) => state);

    const [filteredData, setFilteredData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    const keyboardDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (keyboardDismissTimer.current) {
            clearTimeout(keyboardDismissTimer.current);
        }

        if (query) {
            keyboardDismissTimer.current = setTimeout(() => {
                Keyboard.dismiss();
            }, 4000); // 3 segundos
        }

        return () => {
            if (keyboardDismissTimer.current) {
                clearTimeout(keyboardDismissTimer.current);
            }
        };
    }, [query]);

    useFocusEffect(
        React.useCallback(() => {
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
                reportError(error);
                console.warn('Error buscando usuarios:', error);
                showToast(error.response?.data?.message ?? error?.message ?? 'Error buscando usuarios');
                if (active) { setFilteredData([]); }
            }).finally(() => active && setLoading(false));

            return () => {
                active = false;
            };
        }, [debouncedQuery, showToast])
    );

    const handleItem = async (item: Employee) => {
        if (isLoadingValidation) { return; }
        const isActiveLocation = await validateGeolocation();
        if (!isActiveLocation) { return; }

        if (item?.faceCompleted) {
            item?.message && showToast(item?.message);
            return;
        }
        navigation.navigate('CaptureScreen', { id: item?.id, mode: 'register' });
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
        <Container>
            <Header mode="drawer" />
            <ContentBody scrollable={false}>
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
                    style={styles.list}
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderItem(item)}
                    ListEmptyComponent={
                        <CustomText style={[styles.noResults]}>
                            {query.trim().length ? 'Sin resultados' : '🔎 Realiza una busqueda'}
                        </CustomText>
                    }
                />
            </ContentBody>
            <CustomModal
                title="👋 ¡Hola!"
                visible={!!message} onClose={() => clearResult()}>
                <CustomText style={styles.infoText}>
                    🌟 {message}
                </CustomText>
            </CustomModal>
        </Container>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    infoText: {
        color: '#0d47a1',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
    noResults: { textAlign: 'center', marginTop: 20 },
});
