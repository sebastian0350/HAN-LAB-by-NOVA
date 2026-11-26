import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ru } from '../config/i18n';

export interface WordData {
  id: string;
  hanzi: string;
  pinyin: string;
  tone: number;
  translation: string;
}

interface WordCardProps {
  word: WordData;
  onAnswer: (rating: 'again' | 'hard' | 'good' | 'easy') => void;
}

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
  0: 'var(--tone-neutral)',
};

const TONE_MARKS: Record<number, string> = {
  1: '¯',
  2: 'ˊ',
  3: 'ˇ',
  4: 'ˋ',
  0: '',
};

export const WordCard: React.FC<WordCardProps> = ({ word, onAnswer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    onAnswer(rating);
    setShowAnswer(false);
  };

  return (
    <Card style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      {/* Иероглиф */}
      <div
        style={{
          fontSize: 'var(--hanzi-size)',
          fontFamily: 'var(--font-hanzi-serif)',
          fontWeight: 'bold',
          marginBottom: 'var(--space-sm)',
          color: 'var(--ink)',
        }}
      >
        {word.hanzi}
      </div>

      {/* Пиньинь с тоном */}
      <div
        style={{
          fontSize: 'var(--text-xl)',
          marginBottom: 'var(--space-md)',
          color: TONE_COLORS[word.tone],
          fontFamily: 'var(--font-sans)',
        }}
      >
        {word.pinyin}
        <span style={{ marginLeft: '4px', fontSize: 'var(--text-lg)' }}>
          {TONE_MARKS[word.tone]}
        </span>
      </div>

      {/* Перевод (скрыт до показа ответа) */}
      {showAnswer ? (
        <>
          <div
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--ink-2)',
              marginBottom: 'var(--space-lg)',
              paddingBottom: 'var(--space-md)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            {word.translation}
          </div>

          {/* Кнопки оценки */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAnswer('again')}
              style={{ borderColor: 'var(--seal)', color: 'var(--seal)' }}
            >
              {ru.card.forgot}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAnswer('hard')}
            >
              {ru.card.hard}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAnswer('good')}
              style={{ borderColor: 'var(--bamboo)', color: 'var(--bamboo)' }}
            >
              {ru.card.good}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAnswer('easy')}
              style={{ borderColor: 'var(--bamboo-dark)', color: 'var(--bamboo-dark)' }}
            >
              {ru.card.easy}
            </Button>
          </div>
        </>
      ) : (
        <Button fullWidth onClick={handleShowAnswer}>
          {ru.card.showAnswer}
        </Button>
      )}
    </Card>
  );
};
