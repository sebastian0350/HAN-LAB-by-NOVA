import React from 'react';

interface SealStampProps {
  character: string;
  show?: boolean;
  label?: string;
}

export const SealStamp: React.FC<SealStampProps> = ({ character, show = true, label }) => {
  if (!show) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="seal">{character}</div>
      {label && (
        <span style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>{label}</span>
      )}
    </div>
  );
};
