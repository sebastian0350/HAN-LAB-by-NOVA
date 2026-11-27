import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const palette: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--bamboo)', color: '#f7efe4' },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--ink)',
      border: '1px solid var(--line)',
    },
    danger: {
      backgroundColor: 'var(--seal-soft)',
      color: 'var(--seal)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-2)',
    },
  };

  const heights = { sm: 40, md: 52, lg: 58 };

  return (
    <button
      className={`hl-btn ${className}`.trim()}
      style={{
        height: heights[size],
        padding: size === 'sm' ? '0 14px' : '0 20px',
        fontSize: size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)',
        width: fullWidth ? '100%' : undefined,
        ...palette[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
