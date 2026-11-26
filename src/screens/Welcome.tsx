import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Mascot } from '../components/Mascot';
import { BRAND } from '../config/brand';
import { ru } from '../config/i18n';
import { Auth } from './Auth';

type WelcomeMode = 'welcome' | 'auth';

export const Welcome: React.FC<{ onStart: (mode: 'guest' | 'authenticated') => void }> = ({ onStart }) => {
  const [mode, setMode] = useState<WelcomeMode>('welcome');
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const handleAuthStart = (type: 'login' | 'register') => {
    setAuthType(type);
    setMode('auth');
  };

  const handleBack = () => {
    setMode('welcome');
  };

  const handleAuthSuccess = () => {
    onStart('authenticated');
  };

  if (mode === 'auth') {
    return <Auth onBack={handleBack} onSuccess={handleAuthSuccess} initialMode={authType} />;
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        gap: 'var(--space-xl)',
        textAlign: 'center',
      }}
    >
      <Mascot state="hello" size={160} />
      
      <div>
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-sm)' }}>
          {BRAND.fullName}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-2)' }}>
          {ru.welcome.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%', maxWidth: '320px' }}>
        <Button fullWidth onClick={() => onStart('guest')}>
          {ru.welcome.startGuest}
        </Button>
        <Button variant="secondary" fullWidth onClick={() => handleAuthStart('register')}>
          {ru.welcome.createAccount}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => handleAuthStart('login')}>
          {ru.welcome.signIn}
        </Button>
      </div>
    </div>
  );
};
