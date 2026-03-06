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
} from 'react-native';
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.content}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={[styles.title, { color: themePrimary }]}>{title}</Text>
                        {children}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    backdrop: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    content: {
        backgroundColor: Colors.bgSecondary,
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.xxl + 8,
        width: '100%',
        maxWidth: 480,
        padding: Spacing.xxl,
        maxHeight: '90%',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: Spacing.xl,
        color: Colors.accent1,
    },
});

export default AppModal;
