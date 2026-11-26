import React from 'react';

type MascotState = 'hello' | 'think' | 'listen' | 'happy' | 'sleep';

interface MascotProps {
  state: MascotState;
  size?: number;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ state, size = 120, className = '' }) => {
  const illustrations: Record<MascotState, string> = {
    hello: '/src/assets/illustrations/bao-hello.svg',
    think: '/src/assets/illustrations/bao-think.svg',
    listen: '/src/assets/illustrations/bao-listen.svg',
    happy: '/src/assets/illustrations/bao-happy.svg',
    sleep: '/src/assets/illustrations/bao-sleep.svg',
  };

  return (
    <img
      src={illustrations[state]}
      alt={`Панда Бао - ${state}`}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    />
  );
};
