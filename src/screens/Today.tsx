import React, { useState } from 'react';
import { Layers, Mic, BookOpen, TrendingUp, Clock, CheckCircle2, Sparkles, Gamepad2 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { Mascot } from '../components/Mascot';
import type { TabId } from '../context/AppContext';

interface TodayProps {
  onTabChange: (tab: TabId) => void;
}

const STREAK_EMOJI = ['🌱', '🌿', '🎋', '🎋', '🌳', '🌳', '🏆'];
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function StreakBar({ streak, todayIdx }: { streak: number; todayIdx: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '12px 0 4px' }}>
      {WEEK_DAYS.map((d, i) => {
        const done = streak > 0 && i <= todayIdx && i >= todayIdx - streak + 1;
        const isToday = i === todayIdx;
        return (
          <div
            key={d}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}
          >
            <div
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--r-sm)',
                background: done ? 'var(--bamboo)' : isToday ? 'var(--bamboo-soft)' : 'var(--paper-3)',
                color: done ? 'white' : 'var(--ink)',
                border: isToday ? '2px solid var(--bamboo)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}
            >
              {done ? '✓' : isToday ? '·' : ''}
            </div>
            <span style={{ fontSize: 10, color: isToday ? 'var(--bamboo)' : 'var(--ink-3)', fontWeight: isToday ? 700 : 400 }}>
              {d}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const Today: React.FC<TodayProps> = ({ onTabChange }) => {
  const {
    todayCount,
    dueTodayCount,
    streak,
    totalWords,
    reviewedWords,
    masteredWords,
    learningWords,
    newWords,
    dailyGoal,
    mascotEnabled,
    loading,
  } = useProgress();

  const [todayIdx] = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  });

  const dailyPct = dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;
  const coursePct = totalWords > 0 ? Math.min(100, Math.round((reviewedWords / totalWords) * 100)) : 0;
  const streakEmoji = STREAK_EMOJI[Math.min(streak, STREAK_EMOJI.length - 1)];

  const mascotState = streak > 0
    ? (todayCount >= dailyGoal ? 'happy' : 'think')
    : 'hello';

  return (
    <div className="screen">
      {/* Шапка */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
        <div>
          <div className="page-kicker">學而時習之 · HAN-LAB BY NOVA</div>
          <h1 className="page-title">Сегодня</h1>
          <p className="page-lead">Твой ежедневный путь в китайском языке</p>
        </div>
        <div className="seal-stamp" style={{ width: 44, height: 44, fontSize: 20 }}>汉</div>
      </div>

      {/* Серия + панда */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-4)', textAlign: 'center' }}>
        {mascotEnabled && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Mascot state={mascotState} size={84} />
          </div>
        )}
        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 2 }}>
          {streakEmoji} {streak} {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'} подряд
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)', marginBottom: 10 }}>
          {streak === 0
            ? 'Пройди первую карточку и начни серию сегодня!'
            : todayCount >= dailyGoal
              ? 'Дневная норма выполнена! Отличная работа!'
              : 'Продолжай заниматься каждый день!'}
        </div>
        <StreakBar streak={streak} todayIdx={todayIdx} />
      </div>

      {/* Дневная цель */}
      <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Дневная цель повторений</span>
          <span style={{ fontWeight: 700, color: dailyPct >= 100 ? 'var(--bamboo)' : 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>
            {todayCount} / {dailyGoal} слов ({dailyPct}%)
          </span>
        </div>
        <div className="progress-track" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${dailyPct}%` }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: dailyPct >= 100 ? 'var(--bamboo)' : 'var(--ink-3)', fontWeight: dailyPct >= 100 ? 600 : 400 }}>
          {dailyPct >= 100
            ? '✓ Дневная цель достигнута! Можно повторить ещё или потренировать тоны.'
            : `Осталось повторить ещё ${Math.max(0, dailyGoal - todayCount)} слов для выполнения цели дня.`}
        </div>
      </div>

      {/* 4 ключевых показателя из реальной базы данных */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        {[
          {
            label: 'Слов в базе HSK 1',
            value: loading ? '...' : totalWords,
            sub: 'базовый курс',
            icon: <BookOpen size={18} color="var(--gold)" />,
          },
          {
            label: 'К повторению сегодня',
            value: loading ? '...' : dueTodayCount,
            sub: 'ждут ответа',
            icon: <Clock size={18} color="var(--seal)" />,
          },
          {
            label: 'Повторено сегодня',
            value: loading ? '...' : todayCount,
            sub: `цель: ${dailyGoal}`,
            icon: <CheckCircle2 size={18} color="var(--bamboo)" />,
          },
          {
            label: 'Изучено слов',
            value: loading ? '...' : reviewedWords,
            sub: `освоено: ${masteredWords}`,
            icon: <TrendingUp size={18} color="var(--tone-1)" />,
          },
        ].map(({ label, value, sub, icon }) => (
          <div key={label} className="card-paper" style={{ padding: 'var(--sp-4)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)', fontWeight: 600, marginTop: 3 }}>{label}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Прогресс обучения по курсу HSK 1 */}
      <div className="card-paper" style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} color="var(--gold)" />
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Прогресс обучения HSK 1</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--bamboo)' }}>
            {reviewedWords} из {totalWords} ({coursePct}%)
          </span>
        </div>
        <div className="progress-track" style={{ height: 8, marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${coursePct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--ink-2)' }}>
          <span>🌱 Новые: <strong>{newWords}</strong></span>
          <span>📖 Изучаются: <strong>{learningWords}</strong></span>
          <span>🎋 Освоено: <strong>{masteredWords}</strong></span>
        </div>
      </div>

      {/* Кнопки быстрых действий */}
      <h3 style={{ marginBottom: 'var(--sp-3)', color: 'var(--ink-2)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Учебный процесс
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={() => onTabChange('review')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Layers size={18} />
          Начать повторение ({dueTodayCount} к повторению)
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={() => onTabChange('path')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <BookOpen size={18} />
          Перейти к словарю HSK 1 ({totalWords} слов)
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-full"
          onClick={() => onTabChange('tones')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--gold)', border: '1.5px solid rgba(184,134,58,0.3)', background: 'var(--gold-soft)',
          }}
        >
          <Mic size={18} />
          Тренировка китайских тонов
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-full"
          onClick={() => onTabChange('games')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--seal)', border: '1.5px solid rgba(163,31,24,0.25)', background: 'var(--seal-soft)',
          }}
        >
          <Gamepad2 size={18} />
          Мини-игры (сопоставление, тоны)
        </button>
      </div>
    </div>
  );
};
