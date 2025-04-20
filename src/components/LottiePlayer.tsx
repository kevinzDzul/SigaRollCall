import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

interface LottiePlayerProps {
    loop?: boolean
    autoPlay?: boolean
    style?: StyleProp<ViewStyle>
}

export default function LottiePlayer({
    loop = true,
    autoPlay = true,
    style,
}: LottiePlayerProps) {
    return (
        <LottieView
            autoPlay={autoPlay}
            loop={loop}
            style={style}
        />
    );
}
