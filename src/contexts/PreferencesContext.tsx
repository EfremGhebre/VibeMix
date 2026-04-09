import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type NotificationPreferences = {
  newPlaylists: boolean;
  recommendations: boolean;
  updates: boolean;
};

type PreferencesState = {
  animationsEnabled: boolean;
  compactView: boolean;
  notifications: NotificationPreferences;
};

interface PreferencesContextType extends PreferencesState {
  setAnimationsEnabled: (enabled: boolean) => void;
  setCompactView: (enabled: boolean) => void;
  setNotificationPreference: (key: keyof NotificationPreferences, enabled: boolean) => void;
}

const DEFAULT_PREFERENCES: PreferencesState = {
  animationsEnabled: true,
  compactView: false,
  notifications: {
    newPlaylists: true,
    recommendations: false,
    updates: true,
  },
};

const STORAGE_KEY = "vibemix-preferences";
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const parsePreferences = (value: string | null): PreferencesState => {
  if (!value) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(value) as Partial<PreferencesState>;

    return {
      animationsEnabled: parsed.animationsEnabled ?? DEFAULT_PREFERENCES.animationsEnabled,
      compactView: parsed.compactView ?? DEFAULT_PREFERENCES.compactView,
      notifications: {
        newPlaylists: parsed.notifications?.newPlaylists ?? DEFAULT_PREFERENCES.notifications.newPlaylists,
        recommendations: parsed.notifications?.recommendations ?? DEFAULT_PREFERENCES.notifications.recommendations,
        updates: parsed.notifications?.updates ?? DEFAULT_PREFERENCES.notifications.updates,
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(() =>
    parsePreferences(localStorage.getItem(STORAGE_KEY)),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", !preferences.animationsEnabled);
    document.documentElement.classList.toggle("compact-view", preferences.compactView);
  }, [preferences.animationsEnabled, preferences.compactView]);

  const value = useMemo<PreferencesContextType>(
    () => ({
      ...preferences,
      setAnimationsEnabled: (enabled) =>
        setPreferences((prev) => ({ ...prev, animationsEnabled: enabled })),
      setCompactView: (enabled) =>
        setPreferences((prev) => ({ ...prev, compactView: enabled })),
      setNotificationPreference: (key, enabled) =>
        setPreferences((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [key]: enabled,
          },
        })),
    }),
    [preferences],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
