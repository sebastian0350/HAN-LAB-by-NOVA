import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Welcome } from './screens/Welcome';
import { Today } from './screens/Today';
import { Path } from './screens/Path';
import { Tones } from './screens/Tones';
import { Review } from './screens/Review';
import { Profile } from './screens/Profile';
import { useAuth } from './hooks/useAuth';
import { db } from './db/schema';
import type { TabId } from './context/AppContext';

type AppMode = 'welcome' | 'app';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('welcome');
  const [currentTab, setCurrentTab] = useState<TabId>('today');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user || localStorage.getItem('hanlab_user')) {
      setAppMode('app');
    }
  }, [user]);

  // Применяем сохранённую тему
  useEffect(() => {
    db.settings.get('main').then((s) => {
      if (s?.theme && s.theme !== 'auto') {
        document.documentElement.dataset.theme = s.theme;
      }
    });
  }, []);

  const handleStart = (mode: 'guest' | 'authenticated') => {
    localStorage.setItem('hanlab_user', JSON.stringify({ mode }));
    setAppMode('app');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🐼</div>
        <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Загрузка...</p>
      </div>
    );
  }

  if (appMode === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'today':   return <Today onTabChange={setCurrentTab} />;
      case 'path':    return <Path />;
      case 'tones':   return <Tones />;
      case 'review':  return <Review />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <>
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {renderScreen()}
      </main>
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}

export default App;
