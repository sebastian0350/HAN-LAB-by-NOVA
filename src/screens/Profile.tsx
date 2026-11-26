import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { ru } from '../config/i18n';

export const Profile: React.FC = () => {
  const { user, signOut, isGuest } = useAuth();
  const { syncStatus, lastSync, syncData, exportData } = useSync(user?.id || null);

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('hanlab_user');
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hanlab-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Никогда';
    const diff = Date.now() - lastSync.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч. назад`;
    return lastSync.toLocaleDateString('ru-RU');
  };

  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      <h1>{ru.nav.profile}</h1>

      {isGuest ? (
        <Card style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Гостевой режим</h3>
          <p style={{ color: 'var(--ink-2)', marginBottom: 'var(--space-md)' }}>
            Вы используете приложение без аккаунта. Данные хранятся только на этом устройстве.
          </p>
          <Button fullWidth onClick={() => window.location.reload()}>
            {ru.auth.createAccountLater}
          </Button>
        </Card>
      ) : (
        <>
          <Card style={{ marginTop: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-sm)' }}>{ru.profile.email}</h3>
            <p style={{ color: 'var(--ink-2)' }}>{user?.email}</p>
          </Card>

          <Card style={{ marginTop: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: 'var(--space-xs)' }}>{ru.profile.syncStatus}</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>
                  {syncStatus === 'syncing' && 'Синхронизация...'}
                  {syncStatus === 'error' && ru.profile.syncError}
                  {syncStatus === 'success' && ru.profile.synced.replace('{time}', formatLastSync())}
                  {syncStatus === 'idle' && ru.profile.synced.replace('{time}', formatLastSync())}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={syncData}>
                Обновить
              </Button>
            </div>
          </Card>

          <Card style={{ marginTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>{ru.profile.settings}</h3>
            <Button variant="secondary" fullWidth onClick={handleExport} style={{ marginBottom: 'var(--space-sm)' }}>
              {ru.profile.exportData}
            </Button>
            <Button variant="danger" fullWidth onClick={handleSignOut}>
              {ru.auth.logOut}
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};
