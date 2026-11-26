import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { ru } from '../config/i18n';

type AuthMode = 'login' | 'register';

export const Auth: React.FC<{
  onBack: () => void;
  onSuccess: () => void;
  initialMode?: AuthMode;
}> = ({ onBack, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [ageConsent, setAgeConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password.length < 10) {
          setError(ru.auth.passwordTooShort);
          setLoading(false);
          return;
        }
        if (!ageConsent) {
          setError('Необходимо согласие на обработку данных');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName || undefined);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Введите e-mail');
      return;
    }
    setLoading(true);
    try {
      await signInWithMagicLink(email);
      setError(ru.auth.checkEmail);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--ink-2)',
          cursor: 'pointer',
          marginBottom: 'var(--space-lg)',
          fontSize: 'var(--text-base)',
        }}
      >
        ← Назад
      </button>

      <h1 style={{ marginBottom: 'var(--space-lg)' }}>
        {mode === 'login' ? ru.auth.logIn : ru.auth.signUp}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              {ru.auth.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
              placeholder="your@email.com"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
                {ru.auth.displayName}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: '100%' }}
                placeholder="Ваше имя"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              {ru.auth.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%' }}
              placeholder="Минимум 10 символов"
            />
          </div>

          {mode === 'register' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={ageConsent}
                onChange={(e) => setAgeConsent(e.target.checked)}
                required
              />
              {ru.auth.ageConsent}
            </label>
          )}

          {error && (
            <p style={{ color: 'var(--seal)', fontSize: 'var(--text-sm)' }}>{error}</p>
          )}

          <Button fullWidth type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : mode === 'login' ? ru.auth.logIn : ru.auth.signUp}
          </Button>

          {mode === 'login' && (
            <Button variant="ghost" fullWidth type="button" onClick={handleMagicLink} disabled={loading}>
              {ru.auth.magicLink}
            </Button>
          )}
        </form>
      </Card>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
        }}
        style={{
          marginTop: 'var(--space-lg)',
          background: 'none',
          border: 'none',
          color: 'var(--bamboo)',
          cursor: 'pointer',
          fontSize: 'var(--text-base)',
        }}
      >
        {mode === 'login' ? ru.auth.signUp : ru.auth.logIn}
      </button>
    </div>
  );
};
