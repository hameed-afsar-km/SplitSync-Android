import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
    onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const ring1Rotation = useRef(new Animated.Value(0)).current;
    const ring2Rotation = useRef(new Animated.Value(0)).current;
    const orbScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Ring animations
        Animated.loop(
            Animated.timing(ring1Rotation, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(ring2Rotation, {
                toValue: -1,
                duration: 4000,
                useNativeDriver: true,
            })
        ).start();

        // Orb pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(orbScale, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
                Animated.timing(orbScale, { toValue: 1.0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        // Logo reveal
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 60,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar
        Animated.timing(progressWidth, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(onFinish, 2500);
        return () => clearTimeout(timer);
    }, []);

    const ring1Spin = ring1Rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const ring2Spin = ring2Rotation.interpolate({
        inputRange: [-1, 0],
        outputRange: ['-360deg', '0deg'],
    });

    const progressBarWidth = progressWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            {/* Background blobs */}
            <View style={styles.blobContainer}>
                <LinearGradient
                    colors={[Colors.accent1, 'transparent']}
                    style={styles.blob1}
                />
                <LinearGradient
                    colors={[Colors.accent2, 'transparent']}
                    style={styles.blob2}
                />
            </View>

            {/* Mesh grid overlay */}
            <View style={styles.meshOverlay} pointerEvents="none" />

            {/* Content */}
            <View style={styles.content}>
                {/* Kinetic logo */}
                <View style={styles.logoContainer}>
                    <Animated.View
                        style={[
                            styles.ring,
                            styles.ring1,
                            { transform: [{ rotate: ring1Spin }] },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.ring,
                            styles.ring2,
                            { transform: [{ rotate: ring2Spin }] },
                        ]}
                    />
                    <Animated.View
                        style={[styles.orb, { transform: [{ scale: orbScale }] }]}
                    />
                    <Animated.View
                        style={{
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                            flexDirection: 'row',
                        }}
                    >
                        <Text style={styles.logoText}>Split</Text>
                        <Text style={[styles.logoText, styles.logoAccent]}>Sync</Text>
                    </Animated.View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.tagline}>OPTIMIZING GROUP TRAVEL</Text>
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressBar, { width: progressBarWidth }]}>
                            <LinearGradient
                                colors={[Colors.accent1, Colors.accent2]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFillObject}
                            />
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030305',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    blobContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    blob1: {
        position: 'absolute',
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width * 0.35,
        top: -width * 0.2,
        left: -width * 0.1,
        opacity: 0.3,
    },
    blob2: {
        position: 'absolute',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        bottom: -width * 0.1,
        right: -width * 0.1,
        opacity: 0.3,
    },
    meshOverlay: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
    },
    content: {
        alignItems: 'center',
        gap: 64,
    },
    logoContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        borderRadius: 9999,
        borderWidth: 2,
    },
    ring1: {
        width: 190,
        height: 190,
        borderColor: Colors.accent1,
        borderTopColor: Colors.accent1,
        borderBottomColor: 'transparent',
        borderLeftColor: Colors.accent1,
        borderRightColor: 'transparent',
        opacity: 0.3,
    },
    ring2: {
        width: 150,
        height: 150,
        borderColor: Colors.accent2,
        borderTopColor: 'transparent',
        borderBottomColor: Colors.accent2,
        borderLeftColor: 'transparent',
        borderRightColor: Colors.accent2,
        opacity: 0.2,
    },
    orb: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.accent1,
        opacity: 0.5,
    },
    logoText: {
        fontSize: 40,
        fontWeight: '800',
        color: Colors.textMain,
        letterSpacing: -1,
    },
    logoAccent: {
        color: Colors.accent1,
    },
    footer: {
        alignItems: 'center',
        gap: 20,
        width: 280,
    },
    tagline: {
        color: Colors.textMuted,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 4,
        opacity: 0.6,
    },
    progressTrack: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    progressBar: {
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default SplashScreen;
