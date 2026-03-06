import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Zap, Smartphone, RefreshCw } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';

const isExpoGo = Constants.appOwnership === 'expo';

// Dynamic imports to prevent crash in Expo Go
let RewardedAd: any, RewardedAdEventType: any, TestIds: any, BannerAd: any, BannerAdSize: any, AppOpenAd: any, AdEventType: any;

if (!isExpoGo) {
  const Ads = require('react-native-google-mobile-ads');
  RewardedAd = Ads.RewardedAd;
  RewardedAdEventType = Ads.RewardedAdEventType;
  TestIds = Ads.TestIds;
  BannerAd = Ads.BannerAd;
  BannerAdSize = Ads.BannerAdSize;
  AppOpenAd = Ads.AppOpenAd;
  AdEventType = Ads.AdEventType;
} else {
  // Mocks for Expo Go
  TestIds = { REWARDED: '', APP_OPEN: '', BANNER: '' };
  BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: 'BANNER' };
  BannerAd = () => null;
  RewardedAdEventType = { LOADED: 'LOADED', EARNED_REWARD: 'EARNED_REWARD' };
  AdEventType = { LOADED: 'LOADED' };
  RewardedAd = { createForAdRequest: () => null };
  AppOpenAd = { createForAdRequest: () => null };
}

import { Colors, Spacing, Radius } from './src/theme';
import { Trip, Member, Log, ModalState, HistoryEntry } from './src/types';
import { useSettingsStore } from './src/store';

import SplashScreen from './src/components/SplashScreen';
import Header from './src/components/Header';
import Toast from './src/components/Toast';
import AppModal from './src/components/AppModal';
import HomeScreen from './src/screens/HomeScreen';
import TripScreen from './src/screens/TripScreen';
import CreateTripForm from './src/components/CreateTripForm';
import ActionForm from './src/components/ActionForm';
import { FormInput, Btn, RowButtons } from './src/components/FormComponents';

const STORAGE_KEY = 'splitsync_trips';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const AddMemberModalContent = ({ onClose, onAddMember }: any) => {
  const [name, setName] = React.useState('');
  return (
    <View>
      <FormInput label="Member Name" placeholder="e.g., Alice" value={name} onChangeText={setName} />
      <RowButtons>
        <Btn label="Cancel" onPress={onClose} variant="secondary" style={{ flex: 1 }} />
        <Btn label="Add Member" onPress={() => name.trim() && onAddMember(name.trim())} variant="primary" style={{ flex: 1 }} />
      </RowButtons>
    </View>
  );
};

const EditMemberModalContent = ({ data, onClose, onEditMember }: any) => {
  const [name, setName] = React.useState(data?.name || '');
  return (
    <View>
      <FormInput label="Member Name" value={name} onChangeText={setName} />
      <RowButtons>
        <Btn label="Cancel" onPress={onClose} variant="secondary" style={{ flex: 1 }} />
        <Btn label="Save Changes" onPress={() => name.trim() && onEditMember(data.memberId, name.trim())} variant="primary" style={{ flex: 1 }} />
      </RowButtons>
    </View>
  );
};

const EditTripModalContent = ({ data, onClose, onEditTrip }: any) => {
  const [name, setName] = React.useState(data?.tripName || '');
  return (
    <View>
      <FormInput label="Trip/Day Name" value={name} onChangeText={setName} />
      <RowButtons>
        <Btn label="Cancel" onPress={onClose} variant="secondary" style={{ flex: 1 }} />
        <Btn label="Save Changes" onPress={() => name.trim() && onEditTrip(name.trim())} variant="primary" style={{ flex: 1 }} />
      </RowButtons>
    </View>
  );
};

const AnimatedBackground = () => {
  const anim1 = React.useRef(new Animated.Value(0)).current;
  const anim2 = React.useRef(new Animated.Value(0)).current;
  const anim3 = React.useRef(new Animated.Value(0)).current;
  const anim4 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const createAnim = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.timing(val, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

    createAnim(anim1, 25000).start();
    createAnim(anim2, 35000).start();
    createAnim(anim3, 22000).start();
    createAnim(anim4, 40000).start();
  }, []);

  const x1 = anim1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-50, 150, -50] });
  const y1 = anim1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-50, 100, -50] });

  const x2 = anim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [50, -200, 50] });
  const y2 = anim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -150, 0] });

  const x3 = anim3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-100, 100, -100] });
  const y3 = anim3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [150, -150, 150] });

  const x4 = anim4.interpolate({ inputRange: [0, 0.5, 1], outputRange: [100, -100, 100] });
  const y4 = anim4.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-200, 200, -200] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#030305', '#08081a', '#030305']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, styles.blob1, { transform: [{ translateX: x1 }, { translateY: y1 }] }]} />
      <Animated.View style={[styles.blob, styles.blob2, { transform: [{ translateX: x2 }, { translateY: y2 }] }]} />
      <Animated.View style={[styles.blob, styles.blob3, { transform: [{ translateX: x3 }, { translateY: y3 }] }]} />
      <Animated.View style={[styles.blob, styles.blob4, { transform: [{ translateX: x4 }, { translateY: y4 }] }]} />
      <BlurView intensity={Platform.OS === 'ios' ? 70 : 100} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; id: string } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null, data: null });
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  const { currency, setCurrency, themePrimary, setThemePrimary, themeSecondary, setThemeSecondary, resetTheme, tripLimit, increaseTripLimit } = useSettingsStore();

  const rewarded = React.useMemo(() => {
    if (isExpoGo) return null;
    return RewardedAd.createForAdRequest(TestIds.REWARDED, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['finance', 'travel', 'expenses'],
    });
  }, []);

  const appOpenAd = React.useMemo(() => {
    if (isExpoGo) return null;
    return AppOpenAd.createForAdRequest(TestIds.APP_OPEN, {
      requestNonPersonalizedAdsOnly: true,
    });
  }, []);

  useEffect(() => {
    if (isExpoGo || !rewarded || !appOpenAd) return;

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        increaseTripLimit();
        showToast('Trip limit increased by 1! 🎉');
        setRewardedLoaded(false);
        rewarded.load(); // Load next ad
      },
    );

    rewarded.load();

    const unsubscribeAppOpen = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenAd.show();
    });

    appOpenAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeAppOpen();
    };
  }, [increaseTripLimit]);

  // Load trips
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setTrips(JSON.parse(val));
    });
  }, []);

  // Save trips
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const currentTrip = useMemo(() => trips.find(t => t.id === currentTripId), [trips, currentTripId]);

  const showToast = (message: string) => {
    setToast({ message, id: uuid() });
  };

  const openModal = (type: any, data: any = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  const updateTrips = (updater: (prev: Trip[]) => Trip[], undoMsg: string) => {
    setTrips(prev => {
      setHistory(h => [...h, { action: undoMsg, state: prev }]);
      const next = updater(prev);
      showToast(undoMsg);
      return next;
    });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setTrips(prev.state);
      setHistory(h => h.slice(0, -1));
      showToast(`Undid: ${prev.action}`);
    } else {
      showToast('Nothing to undo');
    }
  };

  // ---- Trip CRUD ----
  const handleCreateTrip = (data: {
    tripName: string;
    isSingleDay: boolean;
    startDate: string;
    endDate: string;
  }) => {
    if (trips.length >= tripLimit) {
      closeModal();
      setTimeout(() => openModal('LIMIT_REACHED'), 50);
      return;
    }
    let numberOfDays = 1;
    if (!data.isSingleDay && data.startDate && data.endDate) {
      const diff = Math.abs(new Date(data.endDate).getTime() - new Date(data.startDate).getTime());
      numberOfDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
    const newTrip: Trip = {
      id: uuid(),
      tripName: data.tripName,
      isSingleDay: data.isSingleDay,
      startDate: data.startDate,
      endDate: data.endDate,
      numberOfDays,
      createdAt: new Date().toISOString(),
      members: [],
      logs: [],
    };
    updateTrips(prev => [...prev, newTrip], 'Trip created');
    closeModal();
  };

  const handleDeleteCurrentTrip = () => {
    updateTrips(prev => prev.filter(t => t.id !== currentTripId), 'Trip deleted');
    setCurrentTripId(null);
    closeModal();
  };

  const handleDeleteIndividual = (tripId: string) => {
    openModal('CONFIRM_DELETE_INDIVIDUAL', tripId);
  };

  const handleDeleteIndividualFinal = (tripId: string) => {
    updateTrips(prev => prev.filter(t => t.id !== tripId), 'Trip deleted');
    closeModal();
  };

  const handleClearAll = () => {
    updateTrips(() => [], 'All trips cleared');
    closeModal();
  };

  const handleExport = async () => {
    try {
      const data = JSON.stringify(trips);
      await Clipboard.setStringAsync(data);
      showToast('Data copied to clipboard! Share it safely.');
    } catch (e) {
      showToast('Export failed.');
    }
  };

  const handleImport = async () => {
    try {
      const jsonString = await Clipboard.getStringAsync();
      if (!jsonString) {
        showToast('Clipboard is empty.');
        return;
      }
      const importedTrips: Trip[] = JSON.parse(jsonString);
      if (!Array.isArray(importedTrips)) throw new Error('Invalid format');

      if (importedTrips.length > tripLimit) {
        openModal('LIMIT_REACHED', {
          mode: 'IMPORT',
          count: 2,
          total: importedTrips.length,
          pendingData: importedTrips
        });
        return;
      }

      setTrips(prev => [...prev, ...importedTrips]);
      showToast(`${importedTrips.length} trips imported successfully!`);
    } catch (e) {
      showToast('Import failed: Invalid JSON data.');
    }
  };

  const handleFinishImportAds = (pendingData: Trip[]) => {
    // When 2 ads are watched, we increase limit to accommodate the import
    // or at least let the user proceed.
    setTrips(prev => [...prev, ...pendingData]);
    // Optionally increase limit so they don't get blocked immediately again
    useSettingsStore.getState().setTripLimit(Math.max(tripLimit, pendingData.length + trips.length));
    showToast('Import successful after ads! 🎉');
  };

  // ---- Member CRUD ----
  const handleAddMember = (name: string) => {
    const newMember: Member = {
      id: uuid(), name,
      received: 0, expense: 0, toGive: 0, toGet: 0, remaining: 0,
    };
    updateTrips(prev => prev.map(t => t.id === currentTripId
      ? { ...t, members: [...t.members, newMember] }
      : t), 'Member added');
    closeModal();
  };

  const handleEditMember = (memberId: string, name: string) => {
    updateTrips(prev => prev.map(t => t.id === currentTripId
      ? { ...t, members: t.members.map(m => m.id === memberId ? { ...m, name } : m) }
      : t), 'Member name edited');
    closeModal();
  };

  const handleEditTrip = (tripName: string) => {
    updateTrips(prev => prev.map(t => t.id === currentTripId ? { ...t, tripName } : t), 'Trip name edited');
    closeModal();
  };

  const handleDeleteMember = (memberId: string) => {
    updateTrips(prev => prev.map(t => t.id === currentTripId
      ? { ...t, members: t.members.filter(m => m.id !== memberId) }
      : t), 'Member removed');
    closeModal();
  };

  const handleResetStats = () => {
    const log: Log = { id: uuid(), date: new Date().toISOString(), action: 'Reset Data', description: 'Reset all members data to zero.', amount: 0, memberIds: [] };
    updateTrips(prev => prev.map(t => t.id === currentTripId ? {
      ...t,
      members: t.members.map(m => ({ ...m, received: 0, expense: 0, toGive: 0, toGet: 0, remaining: 0 })),
      logs: [...(t.logs || []), log],
    } : t), 'Stats reset');
    closeModal();
  };

  const handleResetMemberStats = (memberId: string) => {
    const member = currentTrip?.members.find(m => m.id === memberId);
    const log: Log = { id: uuid(), date: new Date().toISOString(), action: 'Reset Member', description: `Reset data for ${member?.name} to zero.`, amount: 0, memberIds: [memberId] };
    updateTrips(prev => prev.map(t => t.id === currentTripId ? {
      ...t,
      members: t.members.map(m => m.id === memberId ? { ...m, received: 0, expense: 0, toGive: 0, toGet: 0, remaining: 0 } : m),
      logs: [...(t.logs || []), log],
    } : t), 'Member stats reset');
    closeModal();
  };

  // ---- Transactions ----
  const handleAction = (actionType: 'ADD_EXPENSE' | 'ADD_AMOUNT' | 'TO_GIVE' | 'TO_GET', data: { amount: number; selectedMemberIds: string[]; expenseName?: string }) => {
    const { amount, selectedMemberIds, expenseName } = data;
    const y = amount / selectedMemberIds.length;

    const log: Log = {
      id: uuid(),
      date: new Date().toISOString(),
      action: actionType === 'ADD_EXPENSE' ? 'Add Expense' : actionType === 'ADD_AMOUNT' ? 'Add Amount' : actionType === 'TO_GIVE' ? 'To Give' : 'To Get',
      description: expenseName || (actionType === 'ADD_AMOUNT' ? 'Amount Added' : actionType === 'TO_GIVE' ? 'To Give' : 'To Get'),
      amount,
      splitAmount: actionType === 'ADD_EXPENSE' ? y : undefined,
      memberIds: selectedMemberIds,
    };

    updateTrips(prev => prev.map(t => {
      if (t.id !== currentTripId) return t;
      const newMembers = t.members.map(m => {
        if (!selectedMemberIds.includes(m.id)) return m;
        switch (actionType) {
          case 'ADD_EXPENSE': return { ...m, expense: m.expense + y, remaining: m.remaining - y };
          case 'ADD_AMOUNT': return { ...m, received: m.received + amount, remaining: m.remaining + amount };
          case 'TO_GIVE': return { ...m, toGive: m.toGive + amount, remaining: m.remaining + amount };
          case 'TO_GET': return { ...m, toGet: m.toGet + amount, remaining: m.remaining - amount };
          default: return m;
        }
      });
      return { ...t, members: newMembers, logs: [...(t.logs || []), log] };
    }), `${log.action} added`);
    closeModal();
  };

  // ---- Render Modals ----
  const renderModalContent = () => {
    const { type, data } = modal;

    if (type === 'CREATE_TRIP') {
      return (
        <AppModal visible title="Create a new Day / Trip" onClose={closeModal}>
          <CreateTripForm onSubmit={handleCreateTrip} onCancel={closeModal} />
        </AppModal>
      );
    }

    if (type === 'ADD_MEMBER') {
      return (
        <AppModal visible title="Add Member" onClose={closeModal}>
          <AddMemberModalContent onClose={closeModal} onAddMember={handleAddMember} />
        </AppModal>
      );
    }

    if (type === 'EDIT_MEMBER') {
      return (
        <AppModal visible title="Edit Member" onClose={closeModal}>
          <EditMemberModalContent data={data} onClose={closeModal} onEditMember={handleEditMember} />
        </AppModal>
      );
    }

    if (type === 'EDIT_TRIP') {
      return (
        <AppModal visible title="Edit Trip Name" onClose={closeModal}>
          <EditTripModalContent data={data} onClose={closeModal} onEditTrip={handleEditTrip} />
        </AppModal>
      );
    }

    if (['ADD_EXPENSE', 'ADD_AMOUNT', 'TO_GIVE', 'TO_GET'].includes(type || '')) {
      const titleMap: any = {
        ADD_EXPENSE: 'Add Expense', ADD_AMOUNT: 'Add Amount (Received)', TO_GIVE: 'To Give', TO_GET: 'To Get',
      };
      return (
        <AppModal visible title={titleMap[type!]} onClose={closeModal}>
          <ActionForm
            type={type as any}
            members={currentTrip?.members || []}
            onSubmit={(d) => handleAction(type as any, d)}
            onCancel={closeModal}
          />
        </AppModal>
      );
    }

    if (type === 'VIEW_TRIP_LOGS') {
      const logs = currentTrip?.logs || [];
      return (
        <AppModal visible title="Trip Logs" onClose={closeModal}>
          {logs.length === 0 ? (
            <Text style={s.mutedCenter}>No activity logged yet.</Text>
          ) : (
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {[...logs].reverse().map(log => (
                <View key={log.id} style={s.logItem}>
                  <View style={s.logTop}>
                    <Text style={[s.logAction, { color: themePrimary }]}>{log.action}</Text>
                    <Text style={s.logDate}>{new Date(log.date).toLocaleString()}</Text>
                  </View>
                  <Text style={s.logDesc}>{log.description}</Text>
                </View>
              ))}
            </ScrollView>
          )}
          <RowButtons><Btn label="Close" onPress={closeModal} variant="secondary" style={{ flex: 1 }} /></RowButtons>
        </AppModal>
      );
    }

    if (type === 'VIEW_MEMBER_LOGS') {
      const memberId = data;
      const member = currentTrip?.members.find(m => m.id === memberId);
      const memberLogs = (currentTrip?.logs || []).filter(l => l.memberIds?.includes(memberId));
      return (
        <AppModal visible title={`Details: ${member?.name}`} onClose={closeModal}>
          {memberLogs.length === 0 ? (
            <Text style={s.mutedCenter}>No events found for this member.</Text>
          ) : (
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {[...memberLogs].reverse().map(log => {
                let amountEffect = '';
                let color = Colors.textMain;
                if (log.action === 'Add Expense') { amountEffect = `-${currency}${log.splitAmount?.toFixed(2)}`; color = Colors.danger; }
                else if (log.action === 'Add Amount') { amountEffect = `+${currency}${log.amount?.toFixed(2)}`; color = Colors.success; }
                else if (log.action === 'To Give') { amountEffect = `+${currency}${log.amount?.toFixed(2)}`; color = Colors.success; }
                else if (log.action === 'To Get') { amountEffect = `-${currency}${log.amount?.toFixed(2)}`; color = Colors.danger; }
                return (
                  <View key={log.id} style={s.logItem}>
                    <View style={s.logTop}>
                      <View>
                        <Text style={[s.logAction, { color: themePrimary }]}>{log.description}</Text>
                        <Text style={s.logDate}>{new Date(log.date).toLocaleString()}</Text>
                      </View>
                      <Text style={[s.logAmount, { color }]}>{amountEffect}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
          <RowButtons><Btn label="Close" onPress={closeModal} variant="secondary" style={{ flex: 1 }} /></RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_DELETE_TRIP') {
      return (
        <AppModal visible title="Delete Current Trip" onClose={closeModal}>
          <Text style={s.confirmText}>Are you sure you want to delete this entire trip? This action cannot be undone.</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Delete Permanently" onPress={handleDeleteCurrentTrip} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_DELETE_INDIVIDUAL') {
      const tripId = data;
      const trip = trips.find(t => t.id === tripId);
      return (
        <AppModal visible title="Delete Trip" onClose={closeModal}>
          <Text style={s.confirmText}>Are you sure you want to delete <Text style={{ color: Colors.textMain, fontWeight: '700' }}>{trip?.tripName}</Text>? This cannot be undone.</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Delete Permanently" onPress={() => handleDeleteIndividualFinal(tripId)} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_CLEAR_ALL_TRIPS') {
      return (
        <AppModal visible title="Clear All Trips" onClose={closeModal}>
          <Text style={s.confirmText}>Are you sure you want to delete <Text style={{ color: Colors.textMain, fontWeight: '700' }}>ALL</Text> trips? This cannot be undone.</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Clear Everything" onPress={handleClearAll} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_RESET_STATS') {
      return (
        <AppModal visible title="Reset Trip Data" onClose={closeModal}>
          <Text style={s.confirmText}>Reset all data for all members in this trip to zero?</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Reset Data" onPress={handleResetStats} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_RESET_MEMBER') {
      const memberId = data;
      const member = currentTrip?.members.find(m => m.id === memberId);
      return (
        <AppModal visible title="Reset Member Stats" onClose={closeModal}>
          <Text style={s.confirmText}>Reset all data for <Text style={{ color: Colors.textMain, fontWeight: '700' }}>{member?.name}</Text> to zero?</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Reset Data" onPress={() => handleResetMemberStats(memberId)} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'CONFIRM_DELETE_MEMBER') {
      const memberId = data;
      const member = currentTrip?.members.find(m => m.id === memberId);
      return (
        <AppModal visible title="Remove Member" onClose={closeModal}>
          <Text style={s.confirmText}>Remove <Text style={{ color: Colors.textMain, fontWeight: '700' }}>{member?.name}</Text> from this trip? Their history will be lost.</Text>
          <RowButtons>
            <Btn label="Cancel" onPress={closeModal} variant="secondary" style={{ flex: 1 }} />
            <Btn label="Remove Member" onPress={() => handleDeleteMember(memberId)} variant="danger" style={{ flex: 1 }} />
          </RowButtons>
        </AppModal>
      );
    }

    if (type === 'SETTINGS') {
      const currencies = [
        { label: 'US Dollar ($)', value: '$' },
        { label: 'Euro (€)', value: '€' },
        { label: 'British Pound (£)', value: '£' },
        { label: 'Indian Rupee (₹)', value: '₹' },
        { label: 'Japanese Yen (¥)', value: '¥' },
        { label: 'Australian Dollar (A$)', value: 'A$' },
        { label: 'Canadian Dollar (C$)', value: 'C$' },
        { label: 'Indonesian Rupiah (Rp)', value: 'Rp' },
        { label: 'South Korean Won (₩)', value: '₩' },
      ];
      return (
        <AppModal visible title="Settings" onClose={closeModal}>
          <Text style={s.settingLabel}>CURRENCY DENOMINATION</Text>
          <View style={s.currencyGrid}>
            {currencies.map(c => (
              <TouchableOpacity
                key={c.value}
                style={[s.currencyItem, currency === c.value && { borderColor: themePrimary, backgroundColor: `${themePrimary}20` }]}
                onPress={() => setCurrency(c.value)}
              >
                <Text style={[s.currencyText, currency === c.value && { color: themePrimary }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[s.settingLabel, { marginTop: Spacing.xl }]}>APP APPEARANCE</Text>
          <View style={s.colorRow}>
            <View style={s.colorCard}>
              <View>
                <Text style={s.colorCardTitle}>Primary Accent</Text>
                <Text style={s.colorCardSub}>Core brand & buttons</Text>
                <Text style={s.colorHex}>{themePrimary}</Text>
              </View>
              <View style={[s.colorSwatch, { backgroundColor: themePrimary }]} />
            </View>
            <View style={s.colorCard}>
              <View>
                <Text style={s.colorCardTitle}>Secondary Accent</Text>
                <Text style={s.colorCardSub}>Highlights & gradients</Text>
                <Text style={s.colorHex}>{themeSecondary}</Text>
              </View>
              <View style={[s.colorSwatch, { backgroundColor: themeSecondary }]} />
            </View>
          </View>

          <TouchableOpacity
            style={s.resetBtn}
            onPress={() => { resetTheme(); showToast('Theme reset to default'); }}
          >
            <RefreshCw size={14} color={Colors.textMain} />
            <Text style={s.resetBtnText}>Reset Theme to Default</Text>
          </TouchableOpacity>

          <Btn label="Save & Close" onPress={closeModal} variant="primary" style={{ marginTop: Spacing.lg }} />
        </AppModal>
      );
    }

    if (type === 'LIMIT_REACHED') {
      const isImport = data?.mode === 'IMPORT';
      const countNeeded = data?.count || 1;

      return (
        <AppModal visible title={isImport ? "✦ Unlock Imported Data" : "✦ Trip Limit Reached"} onClose={closeModal}>
          <View style={s.limitBody}>
            <View style={s.limitIconWrap}>
              <LinearGradient colors={[themePrimary, themeSecondary]} style={s.limitIconGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Zap size={28} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={s.limitDesc}>
              {isImport
                ? `You've imported ${data?.total} trips, but your current limit is ${tripLimit}.`
                : `You've reached your limit of ${tripLimit} trips.`}
              {"\n"}
              {isImport ? `Please watch ${countNeeded} ads to unlock everything.` : "Watch an ad to increase your limit!"}
            </Text>
            {isExpoGo && (
              <Text style={{ color: Colors.warning, fontSize: 13, textAlign: 'center', marginBottom: 10 }}>
                Note: Ads are disabled in Expo Go. Please use a regular build to view ads.
              </Text>
            )}
            <View style={s.featureList}>
              <View style={s.featureItem}>
                <View style={s.featureCheck}>
                  <LinearGradient colors={[themePrimary, themeSecondary]} style={StyleSheet.absoluteFillObject} />
                  <Text style={s.checkMark}>{isImport ? countNeeded : 1}</Text>
                </View>
                <Text style={s.featureText}>Watch {isImport ? `${countNeeded} ad(s)` : "a short ad"} to permanently increase your limit</Text>
              </View>
            </View>

            {rewardedLoaded && !isExpoGo && rewarded ? (
              <Btn
                label={`Watch Ad (${countNeeded} more needed)`}
                onPress={() => {
                  const sub = rewarded.addAdEventListener(
                    RewardedAdEventType.EARNED_REWARD,
                    () => {
                      sub(); // Unsubscribe this specific handler
                      if (isImport && countNeeded > 1) {
                        openModal('LIMIT_REACHED', { ...data, count: countNeeded - 1 });
                      } else {
                        if (isImport && data?.pendingData) {
                          handleFinishImportAds(data.pendingData);
                        }
                        closeModal();
                      }
                    }
                  );
                  rewarded.show();
                }}
                variant="primary"
                style={{ width: '100%' }}
              />
            ) : (
              <Btn label={isExpoGo ? "Ads unavailable in Expo Go" : "Loading Ad..."} onPress={() => { }} variant="secondary" style={{ width: '100%', opacity: 0.7 }} />
            )}
            <Btn label="Maybe Later" onPress={closeModal} variant="secondary" style={{ width: '100%' }} />
          </View>
        </AppModal>
      );
    }

    return null;
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={styles.root}>
      {/* Background blobs */}
      <AnimatedBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <Header
          onUndo={handleUndo}
          onSettings={() => openModal('SETTINGS')}
          onLogoPress={() => setCurrentTripId(null)}
        />

        {currentTripId && currentTrip ? (
          <TripScreen
            trip={currentTrip}
            onBack={() => setCurrentTripId(null)}
            onOpenModal={openModal}
          />
        ) : (
          <HomeScreen
            trips={trips}
            onCreateTrip={() => openModal('CREATE_TRIP')}
            onSelectTrip={setCurrentTripId}
            onDeleteTrip={(id) => openModal('CONFIRM_DELETE_INDIVIDUAL', id)}
            onClearAll={() => openModal('CONFIRM_CLEAR_ALL_TRIPS')}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </SafeAreaView>

      {/* AdMob Banner at bottom */}
      {!isExpoGo && (
        <View style={{ alignItems: 'center', backgroundColor: '#000' }}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}

      {/* Modals */}
      {modal.isOpen && renderModalContent()}

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          onUndo={handleUndo}
          onDismiss={() => setToast(null)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  mutedCenter: { color: Colors.textMuted, textAlign: 'center', paddingVertical: 16 },
  logItem: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  logAction: { fontWeight: '700', fontSize: 13 },
  logDate: { color: Colors.textMuted, fontSize: 11 },
  logDesc: { color: Colors.textMain, fontSize: 13 },
  logAmount: { fontWeight: '700', fontSize: 15 },
  confirmText: { color: Colors.textMuted, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  settingLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyItem: {
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1,
    borderColor: Colors.borderGlass,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  currencyText: { color: Colors.textMuted, fontSize: 13, fontWeight: '500' },
  colorRow: { gap: 8 },
  colorCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    borderRadius: 24, padding: Spacing.lg, marginBottom: 8,
  },
  colorCardTitle: { color: Colors.textMain, fontSize: 14, fontWeight: '700' },
  colorCardSub: { color: Colors.textMuted, fontSize: 12 },
  colorHex: { color: Colors.textMuted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  colorSwatch: { width: 48, height: 48, borderRadius: 16, borderWidth: 4, borderColor: 'rgba(255,255,255,0.1)' },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    borderRadius: 14, paddingVertical: 12, marginTop: 8,
  },
  resetBtnText: { color: Colors.textMain, fontSize: 14, fontWeight: '600' },
  limitBody: { alignItems: 'center', gap: 16 },
  limitIconWrap: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  limitIconGrad: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  limitDesc: { color: Colors.textMuted, fontSize: 15, lineHeight: 24, textAlign: 'center', maxWidth: 300 },
  featureList: {
    width: '100%', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    borderRadius: 16, padding: 16,
  },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureCheck: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: '800', zIndex: 1 },
  featureText: { color: Colors.textMuted, fontSize: 14, flex: 1 },
  limitFootnote: { color: Colors.textMuted, fontSize: 12, opacity: 0.6, textAlign: 'center' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  bg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
  },
  blob: { position: 'absolute', borderRadius: 9999, opacity: 0.12 },
  blob1: { width: 500, height: 500, backgroundColor: Colors.accent1, top: -100, left: -100 },
  blob2: { width: 450, height: 450, backgroundColor: Colors.accent2, bottom: -100, right: -80 },
  blob3: { width: 380, height: 380, backgroundColor: '#4f46e5', top: '20%', left: '10%', opacity: 0.08 },
  blob4: { width: 320, height: 320, backgroundColor: '#8b5cf6', bottom: '20%', right: '10%', opacity: 0.08 },
});
