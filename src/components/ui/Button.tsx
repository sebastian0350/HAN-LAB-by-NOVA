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
  const baseStyles = `
    font-weight: 500;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
  `;

  const variantStyles = {
    primary: `
      background-color: var(--bamboo);
      color: white;
      height: var(--button-height);
      padding: 0 var(--space-lg);
    `,
    secondary: `
      background-color: transparent;
      color: var(--ink);
      border: 1px solid var(--line);
      height: var(--button-height);
      padding: 0 var(--space-lg);
    `,
    danger: `
      background-color: transparent;
      color: var(--seal);
      height: var(--button-height);
      padding: 0 var(--space-lg);
    `,
    ghost: `
      background-color: transparent;
      color: var(--ink);
      height: 40px;
      padding: 0 var(--space-md);
    `,
  };

  const sizeStyles = {
    sm: 'height: 40px; padding: 0 var(--space-md); font-size: var(--text-sm);',
    md: '',
    lg: 'height: 60px; padding: 0 var(--space-xl); font-size: var(--text-lg);',
  };

  const hoverStyles = {
    primary: '&:hover { background-color: var(--bamboo-dark); }',
    secondary: '&:hover { background-color: var(--paper-2); }',
    danger: '&:hover { opacity: 0.8; }',
    ghost: '&:hover { background-color: var(--paper-2); }',
  };

  const widthStyle = fullWidth ? 'width: 100%;' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      style={{
        cssText: `
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyle}
          ${hoverStyles[variant]}
        `,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
