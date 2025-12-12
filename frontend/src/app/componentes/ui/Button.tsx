"use client";

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { colors, borderRadius, spacing, transitions } from '@/app/lib/design-tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
  /** Se true, o botão ocupa toda a largura disponível */
  fullWidth?: boolean;
  /** Se true, mostra um spinner e desabilita o botão */
  loading?: boolean;
  /** Ícone à esquerda do texto */
  leftIcon?: React.ReactNode;
  /** Ícone à direita do texto */
  rightIcon?: React.ReactNode;
  /** Se true, renderiza como um componente filho (útil para Next Link) */
  asChild?: boolean;
}

/**
 * Componente Button unificado do ERP Master
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Salvar
 * </Button>
 *
 * <Button variant="danger" loading={isDeleting} leftIcon={<TrashIcon />}>
 *   Excluir
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg
      transition-all duration-${transitions.base}
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantStyles = {
      primary: `
        bg-blue-600 text-white
        hover:bg-blue-700
        active:bg-blue-800
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-600 text-white
        hover:bg-gray-700
        active:bg-gray-800
        focus:ring-gray-500
      `,
      success: `
        bg-green-600 text-white
        hover:bg-green-700
        active:bg-green-800
        focus:ring-green-500
      `,
      warning: `
        bg-yellow-600 text-white
        hover:bg-yellow-700
        active:bg-yellow-800
        focus:ring-yellow-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        active:bg-red-800
        focus:ring-red-500
      `,
      ghost: `
        bg-transparent text-gray-700
        hover:bg-gray-100
        active:bg-gray-200
        focus:ring-gray-500
      `,
      outline: `
        bg-transparent border-2 border-gray-300 text-gray-700
        hover:bg-gray-50 hover:border-gray-400
        active:bg-gray-100
        focus:ring-gray-500
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <Comp
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
