import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mascot } from '../components/Mascot';

type AuthMode = 'login' | 'register';

export const Auth: React.FC<{
  onBack: () => void;
  onSuccess: (mode?: 'guest' | 'authenticated') => void;
  initialMode?: AuthMode;
}> = ({ onBack, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [ageConsent, setAgeConsent] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithMagicLink, resetPassword } = useAuth();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!emailValid) {
      setError('Введите корректный e-mail');
      return;
    }

    if (mode === 'register') {
      if (password.length < 8) {
        setError('Пароль должен быть не короче 8 символов');
        return;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
      if (!ageConsent) {
        setError('Необходимо согласие на обработку данных');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const result = await signUp(email, password, displayName || undefined);
        // Supabase: если email confirmation включён — user идёт, но session нет
        if (result && !result.session) {
          setInfo('Аккаунт создан! Проверьте почту для подтверждения.');
          return;
        }
        onSuccess('authenticated');
      } else {
        await signIn(email, password);
        onSuccess('authenticated');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Неверный e-mail или пароль');
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Этот e-mail уже зарегистрирован. Попробуйте войти.');
      } else if (msg.includes('rate limit')) {
        setError('Слишком много попыток. Подождите немного.');
      } else if (msg.includes('Email not confirmed')) {
        setError('E-mail не подтверждён. Проверьте почту.');
      } else {
        setError(msg || 'Произошла ошибка. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!emailValid) {
      setError('Введите корректный e-mail');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithMagicLink(email);
      setInfo('Ссылка для входа отправлена на почту ✉');
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить ссылку');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!emailValid) {
      setError('Введите e-mail для восстановления');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setInfo('Ссылка для сброса пароля отправлена 📮');
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить ссылку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen" style={{ paddingTop: 40 }}>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: 'var(--ink-2)',
          cursor: 'pointer', marginBottom: 'var(--sp-5)',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)',
        }}
      >
        ← Назад
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-3)' }}>
        <Mascot state="think" size={90} />
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: 4 }}>
        {mode === 'login' ? 'С возвращением!' : 'Создай аккаунт'}
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--ink-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-5)' }}>
        {mode === 'login'
          ? 'Твой прогресс и избранные слова ждут тебя'
          : 'Синхронизация прогресса между устройствами'}
      </p>

      <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontWeight: 500 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontWeight: 500 }}>
                Имя <span style={{ color: 'var(--ink-4)' }}>(необязательно)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                placeholder="Как тебя зовут?"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontWeight: 500 }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'register' ? 'Минимум 8 символов' : '••••••••'}
            />
            {mode === 'register' && password.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                {[0, 1, 2, 3].map((i) => {
                  const color = password.length >= 12 ? 'var(--bamboo)' : password.length >= 8 ? 'var(--gold)' : 'var(--seal)';
                  return (
                    <div key={i} style={{
                      height: 3, flex: 1, borderRadius: 2,
                      background: i < Math.min(4, Math.floor(password.length / 3)) ? color : 'var(--paper-3)',
                    }} />
                  );
                })}
              </div>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-2)', fontWeight: 500 }}>
                  Повтори пароль
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 'var(--text-xs)', color: 'var(--ink-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ageConsent}
                  onChange={(e) => setAgeConsent(e.target.checked)}
                  style={{ width: 'auto', marginTop: 2 }}
                />
                <span>Мне есть 14 лет, или у меня есть согласие родителей на обработку моих данных</span>
              </label>
            </>
          )}

          {error && (
            <div style={{
              padding: '10px 12px', borderRadius: 'var(--r-sm)',
              background: 'var(--seal-soft)', color: 'var(--seal)',
              fontSize: 'var(--text-sm)',
              borderLeft: '3px solid var(--seal)',
            }} role="alert">
              {error}
            </div>
          )}

          {info && (
            <div style={{
              padding: '10px 12px', borderRadius: 'var(--r-sm)',
              background: 'var(--bamboo-soft)', color: 'var(--bamboo-dark)',
              fontSize: 'var(--text-sm)',
              borderLeft: '3px solid var(--bamboo)',
            }} role="status">
              {info}
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-ghost btn-full btn-sm" type="button" onClick={handleMagicLink} disabled={loading}>
                ✉ Войти по ссылке
              </button>
              <button className="btn btn-ghost btn-full btn-sm" type="button" onClick={handleResetPassword} disabled={loading}>
                Забыли пароль?
              </button>
            </div>
          )}
        </form>
      </div>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
          setInfo('');
          setPassword('');
          setConfirmPassword('');
        }}
        style={{
          background: 'none', border: 'none', color: 'var(--bamboo)',
          cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600,
          textAlign: 'center', width: '100%',
        }}
      >
        {mode === 'login' ? 'Нет аккаунта? Зарегистрируйся →' : 'Уже есть аккаунт? Войти →'}
      </button>
    </div>
  );
};
