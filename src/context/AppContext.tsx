import { createContext, useContext } from 'react';

export type TabId = 'today' | 'path' | 'tones' | 'review' | 'games' | 'profile';
export type AuthScreenMode = 'login' | 'register';

export interface AppContextValue {
  tab: TabId;
  setTab: (tab: TabId) => void;
  session: 'guest' | 'authenticated';
  openAuth: (mode?: AuthScreenMode) => void;
  closeAuth: () => void;
  signOutToWelcome: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within App');
  return ctx;
}
