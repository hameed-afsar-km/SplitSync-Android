import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';

interface Props {
    message: string;
    onUndo: () => void;
    onDismiss: () => void;
}

const Toast: React.FC<Props> = ({ message, onUndo, onDismiss }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const progressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
        }).start();

        Animated.timing(progressAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View
            style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
            <View style={styles.content}>
                <Text style={styles.message} numberOfLines={2}>{message}</Text>
                <TouchableOpacity style={styles.undoBtn} onPress={onUndo}>
                    <Text style={styles.undoText}>Undo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: Colors.bgSecondary,
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        zIndex: 5000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.lg,
    },
    message: {
        color: Colors.textMain,
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    undoBtn: {
        backgroundColor: Colors.accent1,
        borderRadius: Radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    undoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    progressTrack: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    progressBar: {
        height: 3,
        backgroundColor: Colors.accent1,
    },
});

export default Toast;
