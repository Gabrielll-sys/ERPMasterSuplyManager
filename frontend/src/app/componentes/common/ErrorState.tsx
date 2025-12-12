"use client";

import React from 'react';
import { Flex, Text, Button, Callout } from '@radix-ui/themes';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ErrorStateProps = {
  /** Objeto de erro ou mensagem de erro */
  error?: Error | string;
  /** Função para tentar novamente */
  onRetry?: () => void;
  /** Título customizado */
  title?: string;
  /** Mostrar botão de voltar ao início */
  showHomeButton?: boolean;
};

/**
 * Componente de error state unificado para todo o app
 *
 * @example
 * if (error) return <ErrorState error={error} onRetry={refetch} />;
 */
export function ErrorState({
  error,
  onRetry,
  title = 'Algo deu errado',
  showHomeButton = false
}: ErrorStateProps) {
  const router = useRouter();

  const errorMessage = typeof error === 'string'
    ? error
    : error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      style={{ minHeight: '200px', padding: '2rem' }}
    >
      <Callout.Root color="red" size="3" style={{ maxWidth: '600px', width: '100%' }}>
        <Callout.Icon>
          <AlertTriangle />
        </Callout.Icon>
        <Callout.Text>
          <Text as="div" weight="bold" size="3" mb="2">
            {title}
          </Text>
          <Text as="div" size="2" color="gray">
            {errorMessage}
          </Text>
        </Callout.Text>
      </Callout.Root>

      <Flex gap="3" wrap="wrap" justify="center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="soft"
            size="3"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </Button>
        )}

        {showHomeButton && (
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="3"
          >
            <Home size={16} />
            Voltar ao Início
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

/**
 * Error boundary component para capturar erros no nível de componente
 *
 * @example
 * <ErrorBoundary fallback={<ErrorState />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorState
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
