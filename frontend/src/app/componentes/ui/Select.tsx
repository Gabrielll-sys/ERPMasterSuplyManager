"use client";

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Label do select */
  label?: string;
  /** Texto de ajuda abaixo do select */
  helperText?: string;
  /** Mensagem de erro */
  error?: string;
  /** Opções do select */
  options: SelectOption[];
  /** Placeholder (primeira opção desabilitada) */
  placeholder?: string;
  /** Container className */
  containerClassName?: string;
}

/**
 * Componente Select unificado do ERP Master
 *
 * @example
 * ```tsx
 * <Select
 *   label="Categoria"
 *   placeholder="Selecione uma categoria"
 *   options={[
 *     { value: 'eletrico', label: 'Elétrico' },
 *     { value: 'mecanico', label: 'Mecânico' },
 *   ]}
 *   value={category}
 *   onChange={(e) => setCategory(e.target.value)}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      options,
      placeholder,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName || ''}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              w-full px-4 py-2 text-base
              border rounded-lg
              appearance-none
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
              pr-10
              ${
                hasError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
              ${className || ''}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Ícone de seta */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-sm text-red-600 flex items-center gap-1">
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
          <p id={`${selectId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
