// app/budgets/[orcamentoId]/_components/MaterialsTable.tsx
"use client";

import { Table, Text, IconButton, Flex } from '@radix-ui/themes';
import { Pencil, Trash2 } from 'lucide-react';

type MaterialsTableProps = {
  materiais: any[];
  isPaid?: boolean;
  onEdit: (item: any) => void;
  onDelete: (itemId: number) => void;
};

// Função helper para formatar moeda
const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function MaterialsTable({ materiais, isPaid, onEdit, onDelete }: MaterialsTableProps) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">Qtd.</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">Preço Venda</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">Total</Table.ColumnHeaderCell>
          {!isPaid && <Table.ColumnHeaderCell />}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {materiais.length > 0 ? (
          materiais.map((item) => (
            <Table.Row key={item.id}>
              <Table.RowHeaderCell>{item.material.descricao}</Table.RowHeaderCell>
              <Table.Cell align="center">{item.quantidadeMaterial}</Table.Cell>
              <Table.Cell align="right">{formatCurrency(item.material.precoVenda)}</Table.Cell>
              <Table.Cell align="right">{formatCurrency(item.material.precoVenda * item.quantidadeMaterial)}</Table.Cell>
              {!isPaid && (
                <Table.Cell>
                  <Flex gap="3" justify="end">
                    <IconButton size="2" variant="ghost" onClick={() => onEdit(item)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton size="2" variant="ghost" color="red" onClick={() => onDelete(item.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              )}
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={5} align="center" py="4">
              <Text color="gray">Nenhum material adicionado ao orçamento.</Text>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}