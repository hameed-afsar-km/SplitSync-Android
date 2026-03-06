import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    ScrollView,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { useSettingsStore } from '../store';
import { LinearGradient } from 'expo-linear-gradient';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (t: string) => void;
    keyboardType?: any;
    defaultValue?: string;
    multiline?: boolean;
    editable?: boolean;
    style?: any;
}

export const FormInput: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    defaultValue,
    multiline = false,
    editable = true,
    style,
}) => {
    const [focused, setFocused] = React.useState(false);
    const { themePrimary } = useSettingsStore();
    return (
        <View style={{ marginBottom: Spacing.md }}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                style={[
                    styles.input,
                    focused && { borderColor: themePrimary },
                    multiline && { height: 80, textAlignVertical: 'top' },
                    !editable && { opacity: 0.5 },
                    style,
                ]}
                placeholder={placeholder}
                placeholderTextColor={Colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                defaultValue={defaultValue}
                multiline={multiline}
                editable={editable}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                selectionColor={themePrimary}
            />
        </View>
    );
};

interface BtnProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    style?: any;
    textStyle?: any;
    loading?: boolean;
}

export const Btn: React.FC<BtnProps> = ({
    label,
    onPress,
    variant = 'secondary',
    style,
    textStyle,
}) => {
    const { themePrimary, themeSecondary } = useSettingsStore();
    if (variant === 'primary') {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.btnBase, style]}>
                <LinearGradient
                    colors={[themePrimary, themeSecondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBtn}
                >
                    <Text style={[styles.btnText, { color: '#fff' }, textStyle]}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
    if (variant === 'danger') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.btnBase, styles.btnDanger, style]}
            >
                <Text style={[styles.btnText, { color: Colors.danger }, textStyle]}>{label}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.btnBase, styles.btnSecondary, style]}
        >
            <Text style={[styles.btnText, { color: Colors.textMain }, textStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

interface RowBtnProps extends BtnProps {
    icon?: React.ReactNode;
}

export const IconBtn: React.FC<RowBtnProps> = ({
    label,
    onPress,
    variant = 'secondary',
    icon,
    style,
}) => {
    const { themePrimary, themeSecondary } = useSettingsStore();
    if (variant === 'primary') {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.btnBase, { overflow: 'hidden' }, style]}>
                <LinearGradient
                    colors={[themePrimary, themeSecondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradientBtn, { flexDirection: 'row', gap: 6 }]}
                >
                    {icon}
                    <Text style={[styles.btnText, { color: '#fff' }]}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
    if (variant === 'danger') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.btnBase, styles.btnDanger, { flexDirection: 'row', gap: 6, alignItems: 'center' }, style]}
            >
                {icon}
                <Text style={[styles.btnText, { color: Colors.danger }]}>{label}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.btnBase, styles.btnSecondary, { flexDirection: 'row', gap: 6, alignItems: 'center' }, style]}
        >
            {icon}
            <Text style={[styles.btnText, { color: Colors.textMain }]}>{label}</Text>
        </TouchableOpacity>
    );
};

export const RowButtons: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
    <View style={[styles.rowButtons, style]}>{children}</View>
);

const styles = StyleSheet.create({
    label: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: Spacing.sm,
        paddingLeft: 2,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        color: Colors.textMain,
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
        fontSize: 15,
    },
    btnBase: {
        borderRadius: Radius.md,
        overflow: 'hidden',
    },
    gradientBtn: {
        paddingVertical: 13,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radius.md,
    },
    btnSecondary: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        paddingVertical: 13,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
    },
    btnDanger: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        paddingVertical: 13,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 15,
        fontWeight: '600',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        flexWrap: 'wrap',
    },
});
