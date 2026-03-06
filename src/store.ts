import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PRIMARY = '#6366f1';
const DEFAULT_SECONDARY = '#ec4899';

interface SettingsStore {
    currency: string;
    setCurrency: (currency: string) => void;
    themePrimary: string;
    setThemePrimary: (color: string) => void;
    themeSecondary: string;
    setThemeSecondary: (color: string) => void;
    resetTheme: () => void;
    tripLimit: number;
    increaseTripLimit: () => void;
    setTripLimit: (limit: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            currency: '$',
            setCurrency: (currency) => set({ currency }),
            themePrimary: DEFAULT_PRIMARY,
            setThemePrimary: (themePrimary) => set({ themePrimary }),
            themeSecondary: DEFAULT_SECONDARY,
            setThemeSecondary: (themeSecondary) => set({ themeSecondary }),
            resetTheme: () => set({ themePrimary: DEFAULT_PRIMARY, themeSecondary: DEFAULT_SECONDARY }),
            tripLimit: 5,
            increaseTripLimit: () => set((state) => ({ tripLimit: state.tripLimit + 1 })),
            setTripLimit: (limit) => set({ tripLimit: limit }),
        }),
        {
            name: 'splitsync-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
