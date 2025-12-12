"use client";

import { useState } from 'react';
import { Dialog, Flex, Text, Button } from '@radix-ui/themes';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

type ConfirmOptions = {
  /** Título do modal */
  title: string;
  /** Descrição detalhada */
  description: string;
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelar */
  cancelText?: string;
  /** Variante visual (define cor e ícone) */
  variant?: 'danger' | 'warning' | 'info';
};

/**
 * Hook para criar diálogos de confirmação elegantes
 * Substitui o window.confirm() nativo por uma versão moderna e acessível
 *
 * @example
 * const { confirm, ConfirmDialog } = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Excluir material?',
 *     description: 'Esta ação não pode ser desfeita.',
 *     variant: 'danger'
 *   });
 *
 *   if (confirmed) {
 *     await deleteMaterial();
 *   }
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Excluir</Button>
 *     <ConfirmDialog />
 *   </>
 * );
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  /**
   * Abre o diálogo de confirmação e retorna uma Promise
   * @returns Promise<boolean> - true se confirmado, false se cancelado
   */
  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
  };

  const getIcon = () => {
    switch (options?.variant) {
      case 'danger':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getColor = () => {
    switch (options?.variant) {
      case 'danger':
        return 'red';
      case 'warning':
        return 'amber';
      case 'info':
      default:
        return 'blue';
    }
  };

  const ConfirmDialog = () => (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{options?.title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          <Flex align="start" gap="3" mt="2">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {getIcon()}
            </div>
            <Text>{options?.description}</Text>
          </Flex>
        </Dialog.Description>
        <Flex gap="3" justify="end" mt="4">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={handleCancel}>
              {options?.cancelText || 'Cancelar'}
            </Button>
          </Dialog.Close>
          <Button
            color={getColor() as any}
            onClick={handleConfirm}
          >
            {options?.confirmText || 'Confirmar'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );

  return { confirm, ConfirmDialog };
}
