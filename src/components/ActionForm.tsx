import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';
import { FormInput, Btn, RowButtons } from './FormComponents';
import { Member } from '../types';
import { useSettingsStore } from '../store';

interface Props {
    type: 'ADD_EXPENSE' | 'ADD_AMOUNT' | 'TO_GIVE' | 'TO_GET';
    members: Member[];
    onSubmit: (data: {
        amount: number;
        selectedMemberIds: string[];
        expenseName?: string;
    }) => void;
    onCancel: () => void;
}

const typeConfig = {
    ADD_EXPENSE: { title: 'Add Expense', btn: 'Split Expense', hasName: true },
    ADD_AMOUNT: { title: 'Add Amount (Received)', btn: 'Add Amount', hasName: false },
    TO_GIVE: { title: 'To Give', btn: 'Update To Give', hasName: false },
    TO_GET: { title: 'To Get', btn: 'Update To Get', hasName: false },
};

const ActionForm: React.FC<Props> = ({ type, members, onSubmit, onCancel }) => {
    const config = typeConfig[type];
    const [amount, setAmount] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(members.map((m) => m.id))
    );
    const { themePrimary } = useSettingsStore();

    const filtered = members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleMember = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (filtered.every((m) => selectedIds.has(m.id))) {
            const next = new Set(selectedIds);
            filtered.forEach((m) => next.delete(m.id));
            setSelectedIds(next);
        } else {
            const next = new Set(selectedIds);
            filtered.forEach((m) => next.add(m.id));
            setSelectedIds(next);
        }
    };

    const handleSubmit = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || selectedIds.size === 0) return;
        onSubmit({
            amount: amt,
            selectedMemberIds: Array.from(selectedIds),
            expenseName: expenseName || undefined,
        });
    };

    return (
        <View>
            {config.hasName && (
                <FormInput
                    label="Expense Name"
                    placeholder="e.g., Dinner"
                    value={expenseName}
                    onChangeText={setExpenseName}
                />
            )}
            <FormInput
                label="Amount"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
            />

            <View style={{ marginBottom: Spacing.md }}>
                <View style={styles.memberHeader}>
                    <Text style={styles.memberLabel}>
                        Select Members{' '}
                        <Text style={{ color: themePrimary }}>({selectedIds.size} Selected)</Text>
                    </Text>
                    <TouchableOpacity onPress={toggleAll}>
                        <Text style={[styles.selectAll, { color: themePrimary }]}>
                            Select / Deselect All
                        </Text>
                    </TouchableOpacity>
                </View>

                <FormInput
                    placeholder="Search members..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginBottom: Spacing.sm }}
                />

                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                    {filtered.map((member) => {
                        const checked = selectedIds.has(member.id);
                        return (
                            <TouchableOpacity
                                key={member.id}
                                style={[styles.checkItem, checked && { borderColor: themePrimary }]}
                                onPress={() => toggleMember(member.id)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        checked && { backgroundColor: themePrimary, borderColor: themePrimary },
                                    ]}
                                >
                                    {checked && <Text style={styles.checkMark}>✓</Text>}
                                </View>
                                <Text style={styles.memberName}>{member.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <RowButtons>
                <Btn label="Cancel" onPress={onCancel} variant="secondary" style={{ flex: 1 }} />
                <Btn label={config.btn} onPress={handleSubmit} variant="primary" style={{ flex: 1 }} />
            </RowButtons>
        </View>
    );
};

const styles = StyleSheet.create({
    memberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    memberLabel: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    selectAll: {
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        marginBottom: 6,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.textMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
    },
    memberName: {
        color: Colors.textMain,
        fontSize: 15,
        fontWeight: '500',
    },
});

export default ActionForm;
