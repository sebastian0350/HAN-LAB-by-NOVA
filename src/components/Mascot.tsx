import React from 'react';
import hello from '../assets/illustrations/bao-hello.svg';
import think from '../assets/illustrations/bao-think.svg';
import listen from '../assets/illustrations/bao-listen.svg';
import happy from '../assets/illustrations/bao-happy.svg';
import sleep from '../assets/illustrations/bao-sleep.svg';

type MascotState = 'hello' | 'think' | 'listen' | 'happy' | 'sleep';

interface MascotProps {
  state: MascotState;
  size?: number;
  className?: string;
}

const illustrations: Record<MascotState, string> = {
  hello,
  think,
  listen,
  happy,
  sleep,
};

export const Mascot: React.FC<MascotProps> = ({ state, size = 120, className = '' }) => {
  return (
    <img
      src={illustrations[state]}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    />
  );
};
