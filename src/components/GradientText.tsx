import React from 'react';
import { Text, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface Props {
    children: string;
    style?: TextStyle | TextStyle[];
    colors?: [string, string];
}

const GradientText: React.FC<Props> = ({
    children,
    style,
    colors = ['#6366f1', '#ec4899'],
}) => {
    return (
        <MaskedView
            maskElement={
                <Text style={[{ backgroundColor: 'transparent' }, style]}>{children}</Text>
            }
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={[style, { opacity: 0 }]}>{children}</Text>
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;
