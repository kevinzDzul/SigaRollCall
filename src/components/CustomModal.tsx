import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

type CustomModalProps = {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    title,
    children,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.container}>
                        {title ? <Text style={styles.title}>{title}</Text> : null}
                        <View>{children}</View>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        minWidth: 280,
        maxWidth: 340,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
    },
    closeBtn: {
        marginTop: 18,
        backgroundColor: '#eee',
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 12,
    },
    closeText: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomModal;
