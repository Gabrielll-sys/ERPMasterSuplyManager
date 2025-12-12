"use client";

import { Flex, Text } from '@radix-ui/themes';
import { Spinner } from '@nextui-org/react';

type LoadingStateProps = {
  /** Mensagem exibida durante o carregamento */
  message?: string;
  /** Tamanho do spinner */
  size?: 'small' | 'medium' | 'large';
  /** Altura mínima do container */
  minHeight?: string;
};

/**
 * Componente de loading state unificado para todo o app
 *
 * @example
 * if (isLoading) return <LoadingState message="Carregando materiais..." />;
 */
export function LoadingState({
  message = 'Carregando...',
  size = 'medium',
  minHeight = '200px'
}: LoadingStateProps) {
  const sizeMap = {
    small: { spinner: '1', text: '2' },
    medium: { spinner: '2', text: '3' },
    large: { spinner: '3', text: '4' },
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="3"
      style={{ minHeight }}
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size={sizeMap[size].spinner as any} />
      <Text size={sizeMap[size].text as any} color="gray">
        {message}
      </Text>
    </Flex>
  );
}

/**
 * Skeleton para loading de tabelas
 *
 * @example
 * {isLoading ? <TableSkeleton rows={10} /> : <Table data={data} />}
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 animate-pulse" role="status" aria-label="Carregando tabela">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={`header-${i}`} className="h-10 bg-gray-300 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={`cell-${i}-${j}`} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para loading de cards
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
