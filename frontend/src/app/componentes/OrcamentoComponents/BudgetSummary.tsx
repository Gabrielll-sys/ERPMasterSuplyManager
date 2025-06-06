// app/budgets/[orcamentoId]/_components/BudgetSummary.tsx
"use client";

import { useMemo } from 'react';
import { Card, Flex, Text, Separator } from '@radix-ui/themes';

type BudgetSummaryProps = {
  materiais: any[];
  desconto: string;
};

// Função helper para formatar moeda
const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function BudgetSummary({ materiais, desconto }: BudgetSummaryProps) {
  
  const { precoVendaTotal, precoComDesconto } = useMemo(() => {
    const total = materiais.reduce((acc, item) => {
      const itemTotal = (item.material.precoVenda || 0) * item.quantidadeMaterial;
      return acc + itemTotal;
    }, 0);

    const discountValue = parseFloat(desconto.replace(',', '.')) || 0;
    const finalPrice = total * (1 - discountValue / 100);

    return {
      precoVendaTotal: total,
      precoComDesconto: finalPrice
    };
  }, [materiais, desconto]);

  return (
    <Card size="4">
      <Flex direction="column" gap="3">
        <Text as="div" size="6" weight="bold">Resumo Financeiro</Text>
        
        <Flex justify="between" align="center">
          <Text size="3" color="gray">Subtotal</Text>
          <Text size="3" weight="medium">{formatCurrency(precoVendaTotal)}</Text>
        </Flex>

        <Flex justify="between" align="center">
          <Text size="3" color="gray">Desconto ({desconto}%)</Text>
          <Text size="3" weight="medium" color="red">
            - {formatCurrency(precoVendaTotal - precoComDesconto)}
          </Text>
        </Flex>
        
        <Separator my="1" size="4" />

        <Flex justify="between" align="center">
          <Text size="5" weight="bold">Total</Text>
          <Text size="5" weight="bold">{formatCurrency(precoComDesconto)}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}