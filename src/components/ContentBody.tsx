import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type ContentBodyProps = {
    style?: StyleProp<ViewStyle>,
    children: React.ReactNode;
    scrollable?: boolean;
};

const ContentBody = ({ children, style, scrollable = true }: ContentBodyProps) => {
    if (!scrollable) {
        return (
            <View style={[styles.viewContainer, style]}>
                {children}
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContentContainer, style]}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
        padding: 16,
    },
    viewContainer: {
        flex: 1,
        padding: 16,
    },
});

export default ContentBody; 