import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import {
    ArrowLeft,
    Trash2,
    Users,
    Calendar,
    Share2,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    RefreshCw,
    Edit3,
    List,
    Plus,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../theme';
import { Trip, Member } from '../types';
import { useSettingsStore } from '../store';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    trip: Trip;
    onBack: () => void;
    onOpenModal: (type: string, data?: any) => void;
}

const StatBox: React.FC<{
    label: string;
    value: string;
    color?: string;
}> = ({ label, value, color }) => (
    <View style={styles.statBox}>
        <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
        <Text style={[styles.statValue, color ? { color } : {}]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
);

const TripScreen: React.FC<Props> = ({ trip, onBack, onOpenModal }) => {
    const { currency, themePrimary, themeSecondary } = useSettingsStore();
    const [searchTerm, setSearchTerm] = useState('');

    const totalSpent = trip.members.reduce((acc, m) => acc + m.expense, 0);
    const totalReceived = trip.members.reduce((acc, m) => acc + m.received, 0);

    const filteredMembers = trip.members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={onBack}
                activeOpacity={0.8}
            >
                <ArrowLeft size={16} color={Colors.textMain} />
                <Text style={styles.backText}>Back to Trips</Text>
            </TouchableOpacity>

            {/* Trip Header Card */}
            <View style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <Text style={[styles.tripTitle, { color: '#ffffff' }]}>
                                {trip.tripName}
                            </Text>
                            <TouchableOpacity
                                style={styles.editIconBtn}
                                onPress={() => onOpenModal('EDIT_TRIP', { tripName: trip.tripName })}
                            >
                                <Edit3 size={14} color={Colors.textMain} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateRow}>
                            <Calendar size={14} color={Colors.textMuted} />
                            <Text style={styles.dateText}>
                                {trip.isSingleDay
                                    ? `${new Date(trip.startDate).toLocaleDateString()} (Single Day)`
                                    : `${new Date(trip.startDate).toLocaleDateString()} to ${new Date(trip.endDate).toLocaleDateString()} (${trip.numberOfDays} Days)`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statItemLabel}>Total Spent</Text>
                            <Text style={[styles.statItemValue, { color: Colors.danger }]}>
                                {currency}{totalSpent.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statItemLabel}>Total Pool</Text>
                            <Text style={[styles.statItemValue, { color: Colors.success }]}>
                                {currency}{totalReceived.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            {trip.members.length > 0 && (
                <View style={styles.actionsCard}>
                    <View style={styles.actionsTop}>
                        <Text style={styles.actionsTitle}>Quick Actions</Text>
                        <View style={styles.actionsTopBtns}>
                            <TouchableOpacity
                                style={styles.smallBtn}
                                onPress={() => onOpenModal('VIEW_TRIP_LOGS')}
                            >
                                <FileText size={15} color={Colors.textMain} />
                                <Text style={styles.smallBtnText}>Logs</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.smallBtn}
                                onPress={() => onOpenModal('CONFIRM_RESET_STATS')}
                            >
                                <RefreshCw size={15} color={Colors.textMain} />
                                <Text style={styles.smallBtnText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.smallBtn, styles.dangerBtn]}
                                onPress={() => onOpenModal('CONFIRM_DELETE_TRIP')}
                            >
                                <Trash2 size={15} color={Colors.danger} />
                                <Text style={[styles.smallBtnText, { color: Colors.danger }]}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionGridItem}
                            onPress={() => onOpenModal('ADD_EXPENSE')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[themePrimary, themeSecondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.actionGridBtn}
                            >
                                <Share2 size={18} color="#fff" />
                                <Text style={[styles.actionGridText, { color: '#fff' }]}>Add Expense</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionGridItem}
                            onPress={() => onOpenModal('ADD_AMOUNT')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.actionGridBtnSecondary}>
                                <DollarSign size={18} color={Colors.textMain} />
                                <Text style={styles.actionGridText}>Add Amount</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionGridItem}
                            onPress={() => onOpenModal('TO_GIVE')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.actionGridBtnSecondary}>
                                <ArrowUpRight size={18} color={Colors.textMain} />
                                <Text style={styles.actionGridText}>To Give</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionGridItem}
                            onPress={() => onOpenModal('TO_GET')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.actionGridBtnSecondary}>
                                <ArrowDownRight size={18} color={Colors.textMain} />
                                <Text style={styles.actionGridText}>To Get</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Members Section */}
            <View style={styles.membersSection}>
                <View style={styles.membersSectionTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Users size={22} color={themePrimary} />
                        <Text style={styles.membersTitle}>
                            Members{' '}
                            <Text style={styles.memberCount}>({trip.members.length})</Text>
                        </Text>
                    </View>
                    <View style={styles.memberSearchRow}>
                        <TextInput
                            style={styles.memberSearch}
                            placeholder="Search member..."
                            placeholderTextColor={Colors.textMuted}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            selectionColor={themePrimary}
                        />
                        <TouchableOpacity
                            style={styles.addMemberBtn}
                            onPress={() => onOpenModal('ADD_MEMBER')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[themePrimary, themeSecondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.addMemberGrad}
                            >
                                <Plus size={16} color="#fff" />
                                <Text style={styles.addMemberText}>Add</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {trip.members.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Users size={40} color={Colors.textMuted} opacity={0.5} />
                        <Text style={styles.emptyText}>
                            No members added yet. Add members to start sharing expenses.
                        </Text>
                    </View>
                ) : (
                    filteredMembers.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            currency={currency}
                            themePrimary={themePrimary}
                            onOpenModal={onOpenModal}
                        />
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const MemberCard: React.FC<{
    member: Member;
    currency: string;
    themePrimary: string;
    onOpenModal: (type: string, data?: any) => void;
}> = ({ member, currency, themePrimary, onOpenModal }) => (
    <View style={styles.memberCard}>
        <View style={styles.memberCardTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <Text style={[styles.memberName, { color: '#ffffff' }]} numberOfLines={1}>
                    {member.name}
                </Text>
                <TouchableOpacity
                    style={styles.editIconBtn}
                    onPress={() =>
                        onOpenModal('EDIT_MEMBER', { memberId: member.id, name: member.name })
                    }
                >
                    <Edit3 size={13} color={Colors.textMain} />
                </TouchableOpacity>
            </View>
            <View style={styles.memberActionsRow}>
                <TouchableOpacity
                    style={styles.compactBtn}
                    onPress={() => onOpenModal('VIEW_MEMBER_LOGS', member.id)}
                >
                    <List size={11} color={Colors.textMain} />
                    <Text style={styles.compactBtnText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.compactBtn}
                    onPress={() => onOpenModal('CONFIRM_RESET_MEMBER', member.id)}
                >
                    <RefreshCw size={11} color={Colors.textMain} />
                    <Text style={styles.compactBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.compactBtn, styles.dangerBtn]}
                    onPress={() => onOpenModal('CONFIRM_DELETE_MEMBER', member.id)}
                >
                    <Trash2 size={11} color={Colors.danger} />
                    <Text style={[styles.compactBtnText, { color: Colors.danger }]}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.statsGrid}>
            <StatBox label="Received" value={`${currency}${member.received.toFixed(2)}`} color={Colors.success} />
            <StatBox label="Expense" value={`${currency}${member.expense.toFixed(2)}`} color={Colors.danger} />
            <StatBox
                label="To Give"
                value={`${currency}${member.toGive.toFixed(2)}`}
                color={member.toGive > 0 ? Colors.warning : undefined}
            />
            <StatBox
                label="To Get"
                value={`${currency}${member.toGet.toFixed(2)}`}
                color={member.toGet > 0 ? themePrimary : undefined}
            />
            <StatBox
                label="Remaining"
                value={`${currency}${Math.abs(member.remaining).toFixed(2)}${member.remaining < 0 ? ' (due)' : ''}`}
                color={member.remaining < 0 ? Colors.danger : undefined}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: Spacing.lg, paddingBottom: 60 },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.md,
        paddingVertical: 10,
        paddingHorizontal: Spacing.md,
        alignSelf: 'flex-start',
        marginBottom: Spacing.xl,
    },
    backText: { color: Colors.textMain, fontSize: 14, fontWeight: '600' },
    headerCard: {
        backgroundColor: Colors.bgGlass,
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.xxl,
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    headerTop: { gap: Spacing.md },
    headerLeft: { gap: 8 },
    tripTitle: {
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { color: Colors.textMuted, fontSize: 13 },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.xl,
        flexWrap: 'wrap',
    },
    statItem: {},
    statItemLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    statItemValue: { fontSize: 22, fontWeight: '700' },
    actionsCard: {
        backgroundColor: Colors.bgGlass,
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
        gap: Spacing.md,
    },
    actionsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionsTitle: { color: Colors.textMain, fontSize: 17, fontWeight: '700' },
    actionsTopBtns: { flexDirection: 'row', gap: 6 },
    smallBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.sm,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    smallBtnText: { color: Colors.textMain, fontSize: 12, fontWeight: '600' },
    dangerBtn: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderColor: 'rgba(239,68,68,0.2)',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionGridItem: {
        flex: 1,
        minWidth: '45%',
        borderRadius: Radius.md,
        overflow: 'hidden',
    },
    actionGridBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        paddingHorizontal: Spacing.md,
    },
    actionGridBtnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        paddingHorizontal: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.md,
    },
    actionGridText: { color: Colors.textMain, fontSize: 14, fontWeight: '600' },
    membersSection: { gap: Spacing.md },
    membersSectionTop: { gap: Spacing.md, marginBottom: 4 },
    membersTitle: { color: Colors.textMain, fontSize: 20, fontWeight: '700' },
    memberCount: { color: Colors.textMuted, fontSize: 16 },
    memberSearchRow: { flexDirection: 'row', gap: 8 },
    memberSearch: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        color: Colors.textMain,
        fontSize: 14,
    },
    addMemberBtn: {
        borderRadius: Radius.md,
        overflow: 'hidden',
    },
    addMemberGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 12,
        paddingHorizontal: Spacing.md,
    },
    addMemberText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
        backgroundColor: Colors.bgGlass,
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.xl,
    },
    emptyText: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', maxWidth: 260 },
    memberCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: Radius.xl,
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    memberCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderGlass,
        paddingBottom: 10,
        flexWrap: 'wrap',
        gap: 8,
    },
    memberName: { color: Colors.textMain, fontSize: 16, fontWeight: '700', flex: 1 },
    memberActionsRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
    compactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: 6,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    compactBtnText: { color: Colors.textMain, fontSize: 10, fontWeight: '600' },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    statBox: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
        width: '48.5%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: {
        color: Colors.textMuted,
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        textAlign: 'center',
    },
    statValue: {
        color: Colors.textMain,
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
        textAlign: 'center',
    },
    editIconBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: 8,
        padding: 5,
    },
});

export default TripScreen;
