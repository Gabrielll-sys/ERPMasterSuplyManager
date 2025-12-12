/**
 * 🎨 Sistema de Design - Componentes UI Unificados
 *
 * Todos os componentes exportados aqui seguem o mesmo padrão visual
 * e são construídos sobre o design-tokens.ts para garantir consistência.
 *
 * @example
 * import { Button, Input, Card, Badge } from '@/app/componentes/ui';
 */

// Componentes básicos
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

// Componentes de layout
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';

// Componentes de feedback
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

// Componentes já existentes (re-exportar)
export { LoadingState, TableSkeleton, CardSkeleton } from '../common/LoadingState';
export { ErrorState, ErrorBoundary } from '../common/ErrorState';

// Hooks
export { useConfirmDialog } from '@/app/hooks/useConfirmDialog';

// Design tokens (opcional, para uso avançado)
export * as designTokens from '@/app/lib/design-tokens';
