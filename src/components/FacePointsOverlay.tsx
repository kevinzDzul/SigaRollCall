// FacePointsOverlay.tsx
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { useTheme } from '@siga/context/themeProvider';

const { width, height } = Dimensions.get('window');

type Props = {
    landmarks: number[][] | undefined;
};
const mockLandmarks: number[][] = Array.from({ length: 468 }, () => [
    Math.random() * width,
    Math.random() * height,
]);

export const FacePointsOverlay = ({ landmarks = mockLandmarks }: Props) => {
    const { colors } = useTheme();
    if (!landmarks) {return null;}

    return (
        <Svg
            style={{
                position: 'absolute',
                width,
                height,
                zIndex: 100,
            }}
        >
            {landmarks.map((point, index) => (
                <Circle
                    key={index}
                    cx={point[0]}
                    cy={point[1]}
                    fill={colors.primary}
                    r="2"
                />
            ))}
        </Svg>
    );
};
