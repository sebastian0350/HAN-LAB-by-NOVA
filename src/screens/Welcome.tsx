import React, { useState } from 'react';
import { Mascot } from '../components/Mascot';
import { Auth } from './Auth';

type WelcomeMode = 'welcome' | 'auth';

export const Welcome: React.FC<{ onStart: (mode: 'guest' | 'authenticated') => void }> = ({ onStart }) => {
  const [mode, setMode] = useState<WelcomeMode>('welcome');
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  if (mode === 'auth') {
    return (
      <Auth
        onBack={() => setMode('welcome')}
        onSuccess={() => onStart('authenticated')}
        initialMode={authType}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px 48px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Акварельные пятна */}
      <div style={{
        position: 'absolute', top: -60, right: -40,
        width: 300, height: 300,
        background: 'radial-gradient(ellipse, rgba(61,107,72,0.10) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 100, left: -60,
        width: 250, height: 250,
        background: 'radial-gradient(ellipse, rgba(181,40,30,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Печать */}
      <div className="seal-stamp" style={{ marginBottom: 16 }}>汉</div>

      {/* Панда */}
      <div className="anim-popin" style={{ marginBottom: 8 }}>
        <Mascot state="hello" size={160} />
      </div>

      {/* Цитата */}
      <div className="page-kicker" style={{ marginBottom: 8, fontSize: 12 }}>學而時習之，不亦說乎</div>

      {/* Заголовок */}
      <h1 style={{ fontSize: 42, textAlign: 'center', marginBottom: 6, fontFamily: 'var(--font-serif)' }}>
        Хань-Лаб
      </h1>
      <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', marginBottom: 6, fontSize: 'var(--text-sm)', letterSpacing: '0.08em' }}>
        by Nova
      </p>
      <p style={{ color: 'var(--ink-2)', textAlign: 'center', maxWidth: 300, marginBottom: 36, fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
        Научись китайскому через карточки, тоны и умное повторение. Без скуки — как чай.
      </p>

      {/* Кнопки */}
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary btn-full" onClick={() => onStart('guest')}>
          Начать без аккаунта
        </button>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => { setAuthType('register'); setMode('auth'); }}
        >
          Создать аккаунт
        </button>
        <button
          className="btn btn-ghost btn-full"
          onClick={() => { setAuthType('login'); setMode('auth'); }}
          style={{ color: 'var(--ink-2)' }}
        >
          Войти
        </button>
      </div>

      {/* Декоративные иероглифы внизу */}
      <div style={{
        display: 'flex', gap: 16, marginTop: 32,
        fontSize: 'var(--text-xl)', color: 'var(--ink-4)',
        fontFamily: 'var(--font-serif)',
      }}>
        {['中', '文', '汉', '字', '学'].map((c) => (
          <span key={c} style={{ opacity: 0.4 }}>{c}</span>
        ))}
      </div>
    </div>
  );
};
