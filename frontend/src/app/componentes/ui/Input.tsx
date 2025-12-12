"use client";

import React from 'react';
import { colors, borderRadius, spacing } from '@/app/lib/design-tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label do input */
  label?: string;
  /** Texto de ajuda abaixo do input */
  helperText?: string;
  /** Mensagem de erro */
  error?: string;
  /** Ícone à esquerda do input */
  leftIcon?: React.ReactNode;
  /** Ícone à direita do input */
  rightIcon?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
}

/**
 * Componente Input unificado do ERP Master
 *
 * @example
 * ```tsx
 * <Input
 *   label="Nome"
 *   placeholder="Digite seu nome"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   error={errors.name}
 * />
 *
 * <Input
 *   label="Email"
 *   type="email"
 *   leftIcon={<MailIcon />}
 *   helperText="Usaremos para enviar notificações"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName || ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full px-4 py-2 text-base
              border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${
                hasError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
              ${className || ''}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
