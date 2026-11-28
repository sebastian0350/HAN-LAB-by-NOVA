import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Target,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { db, initializeDatabase } from '../db/schema';

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--line-2)', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--bamboo)', width: 20, display: 'flex', alignItems: 'center' }}>{icon}</span>
        <span style={{ fontSize: 'var(--text-sm)' }}>{label}</span>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function ToggleBtn({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24,
        borderRadius: 12,
        background: value ? 'var(--bamboo)' : 'var(--paper-3)',
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background var(--t-normal)',
      }}
      role="switch"
      aria-checked={value}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3,
        left: value ? 23 : 3,
        transition: 'left var(--t-normal)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

export const Profile: React.FC = () => {
  const { user, signOut, isGuest } = useAuth();
  const { refresh } = useProgress();

  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    soundEnabled: true,
    autoSpeak: true,
    mascotEnabled: true,
    dailyGoal: 10,
    newCardsPerDay: 10,
    currentHsk: 1 as 1 | 2 | 3 | 4,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => db.settings.get('main'))
      .then((s) => {
        if (s) setSettings((prev) => ({ ...prev, ...s }));
      })
      .catch(console.error);
  }, []);

  const updateSetting = async <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await db.settings.put({ id: 'main', ...next, language: 'ru', updatedAt: new Date() });

    if (key === 'theme') {
      if (value === 'dark') {
        document.documentElement.dataset.theme = 'dark';
      } else if (value === 'auto') {
        document.documentElement.dataset.theme = 'auto';
      } else {
        document.documentElement.dataset.theme = 'light';
      }
    }

    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };


  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('hanlab_user');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="screen">
      {/* Шапка профиля */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--bamboo)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 12px',
          border: '3px solid white',
          boxShadow: 'var(--shadow-md)',
        }}>🐼</div>
        {user ? (
          <>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
              {user.user_metadata?.display_name || user.email?.split('@')[0] || 'Ученик'}
            </div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--text-sm)' }}>{user.email}</div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Гостевой режим</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--text-xs)' }}>
              Прогресс сохраняется только на этом устройстве
            </div>
          </>
        )}
        {saved && (
          <div style={{ marginTop: 6, fontSize: 'var(--text-xs)', color: 'var(--bamboo)', fontWeight: 600 }}>✓ Сохранено</div>
        )}
      </div>

      {/* Уровень HSK */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-2)' }}>Мой уровень HSK</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {([1, 2, 3, 4] as const).map((level) => (
            <button
              key={level}
              onClick={() => updateSetting('currentHsk', level)}
              style={{
                padding: '10px 0',
                borderRadius: 'var(--r-sm)',
                border: settings.currentHsk === level ? 'none' : '1.5px solid var(--line)',
                background: settings.currentHsk === level ? 'var(--bamboo)' : 'var(--paper)',
                color: settings.currentHsk === level ? 'white' : 'var(--ink-2)',
                fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer',
                transition: 'background var(--t-fast)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
            >
              <span>HSK {level}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Настройки */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-4)' }}>
        <Row icon={<Target size={18} />} label="Дневная цель (карточек)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => updateSetting('dailyGoal', Math.max(1, settings.dailyGoal - 1))}
              style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--paper-3)', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{settings.dailyGoal}</span>
            <button
              onClick={() => updateSetting('dailyGoal', Math.min(50, settings.dailyGoal + 1))}
              style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--paper-3)', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >+</button>
          </div>
        </Row>
        <Row icon={<BookOpen size={18} />} label="Новых слов в день">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => updateSetting('newCardsPerDay', Math.max(1, settings.newCardsPerDay - 1))}
              style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--paper-3)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{settings.newCardsPerDay}</span>
            <button onClick={() => updateSetting('newCardsPerDay', Math.min(20, settings.newCardsPerDay + 1))}
              style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--paper-3)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>
        </Row>
        <Row icon={settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} label="Звуки">
          <ToggleBtn value={settings.soundEnabled} onChange={(v) => updateSetting('soundEnabled', v)} />
        </Row>
        <Row icon={<Volume2 size={18} />} label="Авто-озвучка карточки">
          <ToggleBtn value={settings.autoSpeak} onChange={(v) => updateSetting('autoSpeak', v)} />
        </Row>
        <Row icon={settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} label="Тема">
          <div style={{ display: 'flex', gap: 4 }}>
            {(['light', 'auto', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateSetting('theme', t)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--r-pill)',
                  border: 'none', cursor: 'pointer',
                  background: settings.theme === t ? 'var(--bamboo)' : 'var(--paper-3)',
                  color: settings.theme === t ? 'white' : 'var(--ink-2)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                }}
              >
                {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '⚙️'}
              </button>
            ))}
          </div>
        </Row>
      </div>

      {/* Выход */}
      {user && (
        <button
          className="btn btn-danger btn-full"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={handleSignOut}
        >
          <LogOut size={16} /> Выйти из аккаунта
        </button>
      )}

      {isGuest && (
        <div style={{
          marginTop: 'var(--sp-5)', padding: 'var(--sp-4)',
          background: 'var(--gold-soft)', borderRadius: 'var(--r-md)',
          textAlign: 'center',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 'var(--text-sm)' }}>Синхронизация прогресса</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-2)', marginBottom: 12 }}>
            Создай аккаунт, чтобы не потерять прогресс при смене устройства
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => window.location.reload()}
          >
            Создать аккаунт
          </button>
        </div>
      )}
    </div>
  );
};
