import React, { useState } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing } from '../theme';
import { FormInput, Btn, RowButtons } from './FormComponents';

interface Props {
    onSubmit: (data: {
        tripName: string;
        isSingleDay: boolean;
        startDate: string;
        endDate: string;
    }) => void;
    onCancel: () => void;
}

const CreateTripForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
    const [tripName, setTripName] = useState('');
    const [isSingleDay, setIsSingleDay] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const handleSubmit = () => {
        if (!tripName.trim()) return;
        onSubmit({
            tripName: tripName.trim(),
            isSingleDay,
            startDate: fmt(startDate),
            endDate: fmt(endDate),
        });
    };

    return (
        <View>
            <FormInput
                label="Trip/Day Name"
                placeholder="e.g., Goa Trip 2026"
                value={tripName}
                onChangeText={setTripName}
            />

            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Single Day Event</Text>
                <Switch
                    value={isSingleDay}
                    onValueChange={setIsSingleDay}
                    trackColor={{ false: Colors.borderGlass, true: Colors.accent1 }}
                    thumbColor="#fff"
                />
            </View>

            <View style={{ marginBottom: Spacing.md }}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text style={{ color: Colors.textMain }}>{fmt(startDate)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(_, d) => {
                            setShowStartPicker(false);
                            if (d) setStartDate(d);
                        }}
                    />
                )}
            </View>

            {!isSingleDay && (
                <View style={{ marginBottom: Spacing.md }}>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <TouchableOpacity
                        style={styles.datePicker}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <Text style={{ color: Colors.textMain }}>{fmt(endDate)}</Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(_, d) => {
                                setShowEndPicker(false);
                                if (d) setEndDate(d);
                            }}
                        />
                    )}
                </View>
            )}

            <RowButtons>
                <Btn label="Cancel" onPress={onCancel} variant="secondary" style={{ flex: 1 }} />
                <Btn label="Create" onPress={handleSubmit} variant="primary" style={{ flex: 1 }} />
            </RowButtons>
        </View>
    );
};

const styles = StyleSheet.create({
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: 12,
        padding: 12,
        marginBottom: Spacing.md,
    },
    switchLabel: {
        color: Colors.textMain,
        fontSize: 15,
        fontWeight: '500',
    },
    dateLabel: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    datePicker: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: 16,
        padding: 14,
        paddingHorizontal: 16,
    },
});

export default CreateTripForm;
