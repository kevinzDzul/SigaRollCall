import { CustomText } from '@siga/components/CustomText';
import { useTheme } from '@siga/context/themeProvider';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';


type TypeCardProps = {
    emoji: string;
    text: string;
    style?: StyleProp<ViewStyle>;
    emojiStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const TipCard = ({ emoji, text, style, emojiStyle, textStyle }: TypeCardProps) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.tipCard, { backgroundColor: colors.secondaryFixed }, style]}>
            <CustomText style={[styles.tipEmoji, emojiStyle]}>{emoji}</CustomText>
            <CustomText style={[styles.tipText, { color: colors.onSecondaryFixed }, textStyle]}>{text}</CustomText>
        </View>
    );
};

export default TipCard;

const styles = StyleSheet.create({
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        elevation: 2, // sombra en Android
        shadowColor: '#000', // sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tipEmoji: {
        fontSize: 22,
        marginRight: 12,
    },
    tipText: {
        fontSize: 14,
        flexShrink: 1,
    },
});