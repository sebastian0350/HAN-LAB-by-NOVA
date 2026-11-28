import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Welcome } from './screens/Welcome';
import { Today } from './screens/Today';
import { Path } from './screens/Path';
import { Tones } from './screens/Tones';
import { Review } from './screens/Review';
import { Profile } from './screens/Profile';
import { Games } from './screens/Games';
import { useAuth } from './hooks/useAuth';
import { db, initializeDatabase } from './db/schema';
import type { TabId } from './context/AppContext';

type AppMode = 'welcome' | 'app';

function App() {
  const [appMode, setAppMode] = useState<AppMode>(() =>
    localStorage.getItem('hanlab_user') ? 'app' : 'welcome'
  );
  const [currentTab, setCurrentTab] = useState<TabId>('today');
  const { user, loading } = useAuth();

  // Инициализация базы данных и применение темы при первом запуске
  useEffect(() => {
    initializeDatabase()
      .then(() => db.settings.get('main'))
      .then((s) => {
        if (s?.theme === 'dark') {
          document.documentElement.dataset.theme = 'dark';
        } else if (s?.theme === 'auto') {
          delete document.documentElement.dataset.theme;
        } else {
          document.documentElement.dataset.theme = 'light';
        }
      })
      .catch(console.error);
  }, []);

  const handleStart = (mode: 'guest' | 'authenticated') => {
    localStorage.setItem('hanlab_user', JSON.stringify({ mode }));
    setAppMode('app');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🐼</div>
        <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Загрузка Хань-Лаб...</p>
      </div>
    );
  }

  if (appMode === 'welcome' && !user) {
    return <Welcome onStart={handleStart} />;
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'today':   return <Today onTabChange={setCurrentTab} />;
      case 'path':    return <Path onTabChange={setCurrentTab} />;
      case 'tones':   return <Tones />;
      case 'review':  return <Review onTabChange={setCurrentTab} />;
      case 'games':   return <Games />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <>
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        {renderScreen()}
      </main>
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}

export default App;

