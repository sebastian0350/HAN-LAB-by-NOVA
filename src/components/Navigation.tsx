import React from 'react';
import { Home, BookOpen, Mic, Layers, User } from 'lucide-react';
import type { TabId } from '../context/AppContext';

interface NavigationProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: typeof Home; char?: string }[] = [
  { id: 'today',   label: 'Главная', Icon: Home   },
  { id: 'path',    label: 'Словарь', Icon: BookOpen },
  { id: 'tones',   label: 'Тоны',    Icon: Mic    },
  { id: 'review',  label: 'Учить',   Icon: Layers  },
  { id: 'profile', label: 'Профиль', Icon: User   },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => (
  <nav className="bottom-nav" aria-label="Навигация">
    {TABS.map(({ id, label, Icon }) => {
      const active = currentTab === id;
      return (
        <button
          key={id}
          className={`nav-item${active ? ' active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
        >
          <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
          <span>{label}</span>
        </button>
      );
    })}
  </nav>
);
