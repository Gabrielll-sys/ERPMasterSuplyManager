// app/budgets/[orcamentoId]/_components/BudgetHeader.tsx
"use client";

import { Flex, Heading, Button, Box } from "@radix-ui/themes";
import { ChevronsLeft } from 'lucide-react';

type BudgetHeaderProps = {
  budgetId?: number;
  onBack: () => void;
};

export function BudgetHeader({ budgetId, onBack }: BudgetHeaderProps) {
  return (
    <Flex align="center" justify="between" mb="6">
      <Button variant="soft" size="3" onClick={onBack}>
        <ChevronsLeft size={20} />
        Retornar
      </Button>
      <Heading as="h1" size="8" align="center">
        Orçamento Nº {budgetId || '...'}
      </Heading>
      {/* Espaçador para manter o título centralizado */}
      <Box style={{ width: '96px' }} /> 
    </Flex>
  );
}