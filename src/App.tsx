import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Welcome } from './screens/Welcome';
import { Today } from './screens/Today';
import { Path } from './screens/Path';
import { Tones } from './screens/Tones';
import { Review } from './screens/Review';
import { Profile } from './screens/Profile';
import { useAuth } from './hooks/useAuth';

type AppMode = 'welcome' | 'app';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('welcome');
  const [currentTab, setCurrentTab] = useState('today');
  const { user, loading } = useAuth();

  // Проверяем, есть ли сохранённый пользователь
  useEffect(() => {
    const savedUser = localStorage.getItem('hanlab_user');
    if (savedUser || user) {
      setAppMode('app');
    }
  }, [user]);

  const handleStart = (mode: 'guest' | 'authenticated') => {
    localStorage.setItem('hanlab_user', JSON.stringify({ mode }));
    setAppMode('app');
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'today':
        return <Today />;
      case 'path':
        return <Path />;
      case 'tones':
        return <Tones />;
      case 'review':
        return <Review />;
      case 'profile':
        return <Profile />;
      default:
        return <Today />;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (appMode === 'welcome') {
    return <Welcome onStart={handleStart} />;
  }

  return (
    <>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {renderScreen()}
      </main>
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}

export default App;
