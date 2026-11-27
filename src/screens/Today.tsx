import React from 'react';
import { Layers, Mic, BookOpen, TrendingUp } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { Mascot } from '../components/Mascot';
import type { TabId } from '../context/AppContext';

interface TodayProps {
  onTabChange: (tab: TabId) => void;
}

const STREAK_EMOJI = ['🌱', '🌿', '🎋', '🎋', '🌳', '🌳', '🏆'];

function StreakBar({ streak }: { streak: number }) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const today = new Date().getDay(); // 0=вс
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '12px 0 4px' }}>
      {days.map((d, i) => {
        const done = i <= todayIdx && i >= todayIdx - streak + 1;
        const isToday = i === todayIdx;
        return (
          <div key={d} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: 'var(--r-sm)',
              background: done ? 'var(--bamboo)' : isToday ? 'var(--bamboo-soft)' : 'var(--paper-3)',
              border: isToday ? '2px solid var(--bamboo)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>
              {done ? '✓' : isToday ? '·' : ''}
            </div>
            <span style={{ fontSize: 9, color: isToday ? 'var(--bamboo)' : 'var(--ink-4)', fontWeight: isToday ? 700 : 400 }}>{d}</span>
          </div>
        );
      })}
    </div>
  );
}

export const Today: React.FC<TodayProps> = ({ onTabChange }) => {
  const { todayCount, streak, totalWords, reviewedWords, dailyGoal, loading } = useProgress();
  const pct = dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;
  const streakEmoji = STREAK_EMOJI[Math.min(streak, STREAK_EMOJI.length - 1)];

  const mascotState = streak > 0
    ? (todayCount >= dailyGoal ? 'happy' : 'think')
    : 'hello';

  return (
    <div className="screen">
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)' }}>
        <div>
          <div className="page-kicker">學而時習之</div>
          <h1 className="page-title">Хань-Лаб</h1>
        </div>
        <div className="seal-stamp" style={{ width: 40, height: 40, fontSize: 18 }}>汉</div>
      </div>

      {/* Серия + панда */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-4)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Mascot state={mascotState} size={80} />
        </div>
        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 2 }}>
          {streakEmoji} {streak} {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', marginBottom: 12 }}>
          {streak === 0 ? 'Начни серию сегодня!' : streak < 3 ? 'Бамбук растёт!' : 'Великолепная серия!'}
        </div>
        <StreakBar streak={streak} />
      </div>

      {/* Дневная цель */}
      <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Дневная цель</span>
          <span style={{ fontWeight: 700, color: pct >= 100 ? 'var(--bamboo)' : 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>
            {todayCount} / {dailyGoal}
          </span>
        </div>
        <div className="progress-track" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct >= 100 && (
          <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--bamboo)', fontWeight: 600 }}>
            ✓ Цель выполнена — так держать!
          </div>
        )}
      </div>

      {/* Статистика */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
          {[
            { label: 'Слов изучено', value: reviewedWords, icon: <BookOpen size={18} color="var(--bamboo)" /> },
            { label: 'Всего слов', value: totalWords, icon: <TrendingUp size={18} color="var(--gold)" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card-paper" style={{ textAlign: 'center', padding: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Быстрые действия */}
      <h3 style={{ marginBottom: 'var(--sp-3)', color: 'var(--ink-2)', fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Начать занятие
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <button
          className="btn btn-primary btn-full"
          onClick={() => onTabChange('review')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Layers size={18} />
          Повторять карточки {todayCount < dailyGoal ? `(осталось ${dailyGoal - todayCount})` : '✓'}
        </button>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => onTabChange('tones')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Mic size={18} />
          Тренировка тонов
        </button>
        <button
          className="btn btn-ghost btn-full"
          onClick={() => onTabChange('path')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)' }}
        >
          <BookOpen size={18} />
          Словарь и избранное
        </button>
      </div>
    </div>
  );
};
