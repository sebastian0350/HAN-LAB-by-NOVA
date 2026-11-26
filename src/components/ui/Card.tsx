import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--paper-2)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--line)',
        padding: 'var(--space-lg)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
