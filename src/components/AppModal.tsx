import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius } from '../theme';
import { useSettingsStore } from '../store';

interface Props {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const AppModal: React.FC<Props> = ({ visible, title, onClose, children }) => {
    const { themePrimary, themeSecondary } = useSettingsStore();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <View style={[styles.content, { backgroundColor: '#030305' }]}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Text style={[styles.title, { color: themePrimary }]}>{title}</Text>
                            {children}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    content: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: Radius.xxl + 8,
        width: '100%',
        maxWidth: 480,
        maxHeight: Dimensions.get('window').height * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    scrollContent: {
        padding: Spacing.xl,
        flexGrow: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: Spacing.xl,
        letterSpacing: -0.5,
    },
});

export default AppModal;
