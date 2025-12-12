"use client";

import React from 'react';
import { colors, borderRadius, shadows, spacing } from '@/app/lib/design-tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variante visual do card */
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  /** Padding interno do card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Se true, adiciona hover effect */
  hoverable?: boolean;
  /** Se true, adiciona cursor pointer */
  clickable?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título do card */
  title?: string;
  /** Subtítulo do card */
  subtitle?: string;
  /** Ação à direita (botão, menu, etc) */
  action?: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alinhamento dos itens no footer */
  align?: 'left' | 'center' | 'right' | 'between';
}

/**
 * Componente Card unificado do ERP Master
 *
 * @example
 * ```tsx
 * <Card variant="elevated" hoverable>
 *   <CardHeader title="Orçamento #123" subtitle="Cliente XYZ" />
 *   <CardBody>
 *     Conteúdo do card...
 *   </CardBody>
 *   <CardFooter align="right">
 *     <Button>Editar</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-white border border-gray-200',
      bordered: 'bg-white border-2 border-gray-300',
      elevated: 'bg-white shadow-lg',
      flat: 'bg-gray-50',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          transition-all duration-200
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverable ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
          ${clickable ? 'cursor-pointer' : ''}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Header do Card com título, subtítulo e ação opcional
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between mb-4 ${className || ''}`}
        {...props}
      >
        <div className="flex-1">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Corpo do Card
 */
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * Footer do Card com alinhamento configurável
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 ${alignStyles[align]} ${
          className || ''
        }`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
