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
  ...props
}) => {
  return (
    <button
      className={className}
      style={{
        fontWeight: 500,
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        ...(variant === 'primary' && {
          backgroundColor: 'var(--bamboo)',
          color: 'white',
          height: 'var(--button-height)',
          padding: '0 var(--space-lg)',
        }),
        ...(variant === 'secondary' && {
          backgroundColor: 'transparent',
          color: 'var(--ink)',
          border: '1px solid var(--line)',
          height: 'var(--button-height)',
          padding: '0 var(--space-lg)',
        }),
        ...(variant === 'danger' && {
          backgroundColor: 'transparent',
          color: 'var(--seal)',
          height: 'var(--button-height)',
          padding: '0 var(--space-lg)',
        }),
        ...(variant === 'ghost' && {
          backgroundColor: 'transparent',
          color: 'var(--ink)',
          height: '40px',
          padding: '0 var(--space-md)',
        }),
        ...(size === 'sm' && {
          height: '40px',
          padding: '0 var(--space-md)',
          fontSize: 'var(--text-sm)',
        }),
        ...(size === 'lg' && {
          height: '60px',
          padding: '0 var(--space-xl)',
          fontSize: 'var(--text-lg)',
        }),
        ...(fullWidth && { width: '100%' }),
      }}
      {...props}
    >
      {children}
    </button>
  );
};
