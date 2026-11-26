import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Mascot } from '../components/Mascot';
import { SealStamp } from '../components/ui/SealStamp';
import { ru } from '../config/i18n';

export const Today: React.FC = () => {
  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      <h1>{ru.nav.today}</h1>
      
      {/* Прогресс серии */}
      <Card style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
          <Mascot state="happy" size={60} />
        </div>
        <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)' }}>
          {ru.progress.streak}: 3 {ru.progress.days}
        </h2>
        <p style={{ color: 'var(--ink-2)', marginBottom: 'var(--space-md)' }}>
          Бамбук растёт! Продолжайте каждый день.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
          <div style={{ width: '8px', height: '24px', backgroundColor: 'var(--bamboo)', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '24px', backgroundColor: 'var(--bamboo)', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '24px', backgroundColor: 'var(--bamboo)', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '24px', backgroundColor: 'var(--line)', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '24px', backgroundColor: 'var(--line)', borderRadius: '4px' }} />
        </div>
      </Card>

      {/* Дневная цель */}
      <Card style={{ marginTop: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)' }}>Дневная цель</h3>
          <span style={{ color: 'var(--bamboo)', fontWeight: 'bold' }}>0/10 {ru.settings.cards}</span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--line)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '100%', width: '0%', backgroundColor: 'var(--bamboo)' }} />
        </div>
      </Card>

      {/* Быстрые действия */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--text-lg)' }}>Начать занятие</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <Button fullWidth onClick={() => window.location.hash = '#review'}>
            Повторение карточек
          </Button>
          <Button variant="secondary" fullWidth onClick={() => window.location.hash = '#tones'}>
            Тренировка тонов
          </Button>
        </div>
      </div>

      {/* Достижения */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--text-lg)' }}>Последние достижения</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <SealStamp character="通" show />
          <SealStamp character="熟" show />
        </div>
      </div>
    </div>
  );
};
