import React from 'react';
import { Home, BookOpen, Mic, RotateCcw, User } from 'lucide-react';
import { ru } from '../config/i18n';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'today', label: ru.nav.today, icon: Home },
    { id: 'path', label: ru.nav.path, icon: BookOpen },
    { id: 'tones', label: ru.nav.tones, icon: Mic },
    { id: 'review', label: ru.nav.review, icon: RotateCcw },
    { id: 'profile', label: ru.nav.profile, icon: User },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--paper)',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 'var(--space-sm) 0',
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--bamboo)' : 'var(--ink-2)',
              transition: 'color var(--transition-fast)',
              padding: 'var(--space-xs)',
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: 'var(--text-xs)' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
