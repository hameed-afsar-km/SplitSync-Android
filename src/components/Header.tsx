import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    StatusBar,
} from 'react-native';
import { Undo2, Settings } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../theme';
import { useSettingsStore } from '../store';
import GradientText from './GradientText';

interface Props {
    onUndo: () => void;
    onSettings: () => void;
    onLogoPress: () => void;
}

const Header: React.FC<Props> = ({ onUndo, onSettings, onLogoPress }) => {
    const { themePrimary, themeSecondary } = useSettingsStore();

    return (
        <View style={styles.header}>
            <StatusBar barStyle="light-content" backgroundColor="#030305" />
            <View style={styles.inner}>
                <TouchableOpacity onPress={onLogoPress} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.logoText, { color: '#ffffff' }]}>Split</Text>
                        <GradientText
                            colors={[themePrimary, themeSecondary]}
                            style={styles.logoText}
                        >
                            Sync
                        </GradientText>
                    </View>
                </TouchableOpacity>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={onUndo}
                        activeOpacity={0.7}
                    >
                        <Undo2 size={20} color={Colors.textMain} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={onSettings}
                        activeOpacity={0.7}
                    >
                        <Settings size={20} color={Colors.textMain} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(3,3,5,0.9)',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderGlass,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 4 : 50,
        paddingBottom: 12,
    },
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textMain,
        letterSpacing: -0.5,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
    },
});

export default Header;
