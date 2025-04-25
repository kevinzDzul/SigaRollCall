import { CustomText } from '@siga/components/CustomText';
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import {
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    message: string
    type?: ToastType
}

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => { });

export const toastRef = {
    show: (message: string, type?: ToastType) => { },
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [visible, setVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type });
        setVisible(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setVisible(false);
                    setToast(null);
                });
            }, 2500);
        });
    }, [opacity]);

    // Expone la función global
    useEffect(() => {
        toastRef.show = showToast;
    }, [showToast]);

    const getBackgroundColor = (type?: ToastType) => {
        switch (type) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#F44336';
            case 'warning':
                return '#FFC107';
            default:
                return '#333';
        }
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast && visible && (
                <Animated.View
                    style={[
                        styles.toast,
                        {
                            backgroundColor: getBackgroundColor(toast.type),
                            opacity,
                        },
                    ]}
                >
                    <CustomText style={styles.toastText}>
                        {toast.type === 'success' && '✅ '}
                        {toast.type === 'error' && '❌ '}
                        {toast.type === 'warning' && '⚠️ '}
                        {toast.type === 'info' && 'ℹ️ '}
                        {toast.message}
                    </CustomText>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

export const useToastTop = () => useContext(ToastContext);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: Platform.select({ ios: 60, android: 40 }),
        left: width * 0.1,
        width: width * 0.8,
        padding: 14,
        borderRadius: 10,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});
