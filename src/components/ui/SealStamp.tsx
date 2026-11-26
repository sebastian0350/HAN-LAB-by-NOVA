import React from 'react';

interface SealStampProps {
  character: string;
  show?: boolean;
}

export const SealStamp: React.FC<SealStampProps> = ({ character, show = true }) => {
  if (!show) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        backgroundColor: 'var(--seal)',
        borderRadius: '4px',
        color: 'white',
        fontSize: '32px',
        fontFamily: 'var(--font-hanzi-serif)',
        fontWeight: 'bold',
        animation: 'stamp 250ms ease-out',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {character}
    </div>
  );
};

// Добавляем анимацию в глобальные стили
const style = document.createElement('style');
style.textContent = `
  @keyframes stamp {
    0% {
      transform: scale(1.15) rotate(-3deg);
      opacity: 0;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
