import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Plus,
    Calendar,
    Users,
    Download,
    Upload,
    Trash,
    Trash2,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../theme';
import { Trip } from '../types';
import { useSettingsStore } from '../store';
import GradientText from '../components/GradientText';

const { width } = Dimensions.get('window');

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';
type FilterType = 'all' | 'single' | 'multi';

interface Props {
    trips: Trip[];
    onCreateTrip: () => void;
    onSelectTrip: (id: string) => void;
    onDeleteTrip: (id: string) => void;
    onClearAll: () => void;
    onExport: () => void;
    onImport: () => void;
}

const HomeScreen: React.FC<Props> = ({
    trips,
    onCreateTrip,
    onSelectTrip,
    onDeleteTrip,
    onClearAll,
    onExport,
    onImport,
}) => {
    const { currency, themePrimary, themeSecondary, tripLimit } = useSettingsStore();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [filterType, setFilterType] = useState<FilterType>('all');

    const filtered = trips
        .filter((trip) => {
            const s = search.toLowerCase();
            const tripNameMatch = trip.tripName.toLowerCase().includes(s);

            // Smarter date matching
            const startDateStr = trip.startDate ? new Date(trip.startDate).toLocaleDateString().toLowerCase() : '';
            const endDateStr = trip.endDate ? new Date(trip.endDate).toLocaleDateString().toLowerCase() : '';
            const dateMatch = startDateStr.includes(s) || endDateStr.includes(s) ||
                (trip.startDate && trip.startDate.includes(s)) ||
                (trip.endDate && trip.endDate.includes(s));

            if (!tripNameMatch && !dateMatch) return false;
            if (filterType === 'single' && !trip.isSingleDay) return false;
            if (filterType === 'multi' && trip.isSingleDay) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-asc':
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                case 'date-desc':
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                case 'name-asc':
                    return a.tripName.localeCompare(b.tripName);
                case 'name-desc':
                    return b.tripName.localeCompare(a.tripName);
                default:
                    return 0;
            }
        });

    const quotaPercent = Math.min(trips.length / tripLimit, 1);

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Hero */}
            <View style={styles.hero}>
                <View style={[styles.heroTitleRow, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[styles.heroTitle, { color: '#ffffff', marginBottom: 0 }]}>Split</Text>
                    <GradientText
                        colors={[themePrimary, themeSecondary]}
                        style={[styles.heroTitle, { marginBottom: 0 }]}
                    >
                        Sync
                    </GradientText>
                </View>
                <Text style={styles.heroSub}>
                    Effortlessly track trips, group expenses, and balances.
                </Text>

                {/* Create Trip Button */}
                <TouchableOpacity
                    onPress={onCreateTrip}
                    activeOpacity={0.85}
                    style={styles.createBtnWrap}
                >
                    <LinearGradient
                        colors={[themePrimary, themeSecondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.createBtn}
                    >
                        <Plus size={22} color="#fff" />
                        <Text style={styles.createBtnText}>Create a new Day / Trip</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quota Pill */}
                <View style={styles.quotaPillContainer}>
                    <View style={styles.quotaPill}>
                        <View
                            style={[
                                styles.quotaBar,
                                {
                                    width: `${quotaPercent > 0 ? Math.max(quotaPercent * 100, 8) : 0}%`,
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[themePrimary, themeSecondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFillObject}
                            />
                        </View>
                    </View>
                    <Text style={styles.quotaText}>
                        <Text style={{ color: Colors.textMain, fontWeight: '800' }}>{trips.length}</Text>
                        <Text style={{ color: Colors.textMuted }}> / {tripLimit} trips active</Text>
                        {trips.length >= tripLimit && (
                            <Text style={{ color: Colors.danger, fontWeight: '700' }}> · LIMIT REACHED</Text>
                        )}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={onExport}
                        activeOpacity={0.8}
                    >
                        <Download size={16} color={Colors.textMain} />
                        <Text style={styles.actionBtnText}>Export</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={onImport}
                        activeOpacity={0.8}
                    >
                        <Upload size={16} color={Colors.textMain} />
                        <Text style={styles.actionBtnText}>Import</Text>
                    </TouchableOpacity>
                    {trips.length > 0 && (
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.actionBtnDanger]}
                            onPress={onClearAll}
                            activeOpacity={0.8}
                        >
                            <Trash size={16} color={Colors.danger} />
                            <Text style={[styles.actionBtnText, { color: Colors.danger }]}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterCard}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search trips or date..."
                    placeholderTextColor={Colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    selectionColor={themePrimary}
                />

                <View style={styles.filterRow}>
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Type</Text>
                        <View style={styles.segmented}>
                            {(['all', 'single', 'multi'] as FilterType[]).map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    style={[
                                        styles.seg,
                                        filterType === f && { backgroundColor: themePrimary },
                                    ]}
                                    onPress={() => setFilterType(f)}
                                >
                                    <Text
                                        style={[
                                            styles.segText,
                                            filterType === f && { color: '#fff' },
                                        ]}
                                    >
                                        {f === 'all' ? 'All' : f === 'single' ? '1 Day' : 'Multi'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Sort</Text>
                        <View style={styles.segmented}>
                            {(
                                [
                                    ['date-desc', 'Newest'],
                                    ['date-asc', 'Oldest'],
                                    ['name-asc', 'A-Z'],
                                    ['name-desc', 'Z-A'],
                                ] as [SortOption, string][]
                            ).map(([val, lbl]) => (
                                <TouchableOpacity
                                    key={val}
                                    style={[
                                        styles.seg,
                                        sortBy === val && { backgroundColor: themePrimary },
                                    ]}
                                    onPress={() => setSortBy(val)}
                                >
                                    <Text
                                        style={[
                                            styles.segText,
                                            sortBy === val && { color: '#fff' },
                                        ]}
                                    >
                                        {lbl}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            {/* Trip List */}
            <View style={styles.tripList}>
                {filtered.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Calendar size={48} color={Colors.textMuted} opacity={0.5} />
                        <Text style={styles.emptyTitle}>No trips found</Text>
                        <Text style={styles.emptyDesc}>
                            {trips.length === 0
                                ? 'Create your first trip or day to start tracking expenses.'
                                : 'Adjust your search or filters to find trips.'}
                        </Text>
                    </View>
                ) : (
                    filtered.map((trip) => {
                        const totalSpent = trip.members.reduce(
                            (acc, m) => acc + m.expense,
                            0
                        );
                        return (
                            <TouchableOpacity
                                key={trip.id}
                                style={styles.tripCard}
                                onPress={() => onSelectTrip(trip.id)}
                                activeOpacity={0.8}
                            >
                                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                                <View style={styles.tripCardTop}>
                                    <Text style={[styles.tripName, { color: '#ffffff' }]} numberOfLines={1}>
                                        {trip.tripName}
                                    </Text>
                                    <View style={styles.tripCardRight}>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                {trip.isSingleDay
                                                    ? '1 Day'
                                                    : `${trip.numberOfDays} Days`}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.deleteCardBtn}
                                            onPress={(e) => {
                                                onDeleteTrip(trip.id);
                                            }}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Trash2 size={15} color={Colors.danger} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.tripDateRow}>
                                    <Calendar size={14} color={Colors.textMuted} />
                                    <Text style={styles.tripDate}>
                                        {trip.isSingleDay
                                            ? trip.startDate
                                                ? new Date(trip.startDate).toLocaleDateString()
                                                : 'N/A'
                                            : `${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'} - ${trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}`}
                                    </Text>
                                </View>

                                <View style={styles.tripCardBottom}>
                                    <View style={styles.membersRow}>
                                        <Users size={14} color={Colors.textMuted} />
                                        <Text style={styles.membersText}>
                                            {trip.members.length} members
                                        </Text>
                                    </View>
                                    <Text style={styles.tripTotal}>
                                        {currency}
                                        {totalSpent.toFixed(2)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        paddingBottom: 60,
    },
    hero: {
        alignItems: 'center',
        paddingTop: 36,
        paddingBottom: 32,
        paddingHorizontal: Spacing.lg,
    },
    heroTitle: {
        fontSize: 44,
        fontWeight: '800',
        letterSpacing: -2,
        marginBottom: 10,
    },
    heroTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
    },
    heroSub: {
        fontSize: 15,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: 28,
        maxWidth: 300,
    },
    createBtnWrap: {
        borderRadius: Radius.lg,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 340,
        marginBottom: 16,
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: Spacing.xxl,
    },
    createBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    quotaPillContainer: {
        width: '100%',
        maxWidth: 280,
        gap: 8,
        marginBottom: 24,
        alignItems: 'center',
    },
    quotaPill: {
        height: 6,
        width: '100%',
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
    },
    quotaBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        borderRadius: 100,
        overflow: 'hidden',
    },
    quotaText: {
        fontSize: 12,
        letterSpacing: 0.5,
    },
    actionRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: Spacing.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.md,
    },
    actionBtnDanger: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderColor: 'rgba(239,68,68,0.2)',
    },
    actionBtnText: {
        color: Colors.textMain,
        fontSize: 14,
        fontWeight: '600',
    },
    filterCard: {
        marginHorizontal: Spacing.lg,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        gap: Spacing.md,
        overflow: 'hidden',
    },
    searchInput: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        paddingHorizontal: Spacing.lg,
        color: Colors.textMain,
        fontSize: 14,
    },
    filterRow: {
        gap: Spacing.md,
    },
    filterGroup: {
        gap: 6,
    },
    filterLabel: {
        color: Colors.textMuted,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    segmented: {
        flexDirection: 'row',
        gap: 4,
        flexWrap: 'wrap',
    },
    seg: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: Colors.borderGlass,
    },
    segText: {
        color: Colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    tripList: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    emptyTitle: {
        color: Colors.textMain,
        fontSize: 18,
        fontWeight: '700',
    },
    emptyDesc: {
        color: Colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 280,
    },
    tripCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: Radius.xxl,
        padding: Spacing.xl,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
    },
    tripCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    tripName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textMain,
        flex: 1,
        paddingRight: 8,
    },
    tripCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    badgeText: {
        color: Colors.textMain,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    deleteCardBtn: {
        padding: 4,
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
    },
    tripDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    tripDate: {
        color: Colors.textMuted,
        fontSize: 13,
    },
    tripCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderGlass,
        paddingTop: 12,
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    membersText: {
        color: Colors.textMuted,
        fontSize: 13,
    },
    tripTotal: {
        color: Colors.textMain,
        fontSize: 17,
        fontWeight: '700',
    },
});

export default HomeScreen;
