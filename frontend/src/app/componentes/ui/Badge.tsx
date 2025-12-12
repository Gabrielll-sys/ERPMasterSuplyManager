"use client";

import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante visual do badge */
  variant?: BadgeVariant;
  /** Tamanho do badge */
  size?: BadgeSize;
  /** Ícone antes do texto */
  icon?: React.ReactNode;
  /** Se true, adiciona um ponto indicador */
  dot?: boolean;
}

/**
 * Componente Badge para exibir status, categorias, contadores
 *
 * @example
 * ```tsx
 * <Badge variant="success">Pago</Badge>
 * <Badge variant="warning" dot>Pendente</Badge>
 * <Badge variant="info" icon={<BellIcon />}>3 notificações</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, dot, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800 ring-gray-500/10',
      primary: 'bg-blue-100 text-blue-800 ring-blue-600/20',
      success: 'bg-green-100 text-green-800 ring-green-600/20',
      warning: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
      danger: 'bg-red-100 text-red-800 ring-red-600/20',
      info: 'bg-cyan-100 text-cyan-800 ring-cyan-600/20',
    };

    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ring-1 ring-inset
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className || ''}
        `}
        {...props}
      >
        {dot && (
          <svg className="h-1.5 w-1.5 fill-current" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
