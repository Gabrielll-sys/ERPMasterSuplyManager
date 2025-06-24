// src/app/(os-management)/editing-os/[osId]/components/MaterialList.tsx
"use client";

import { Card, Flex, Heading, Table, Text, IconButton, Tooltip, Box } from '@radix-ui/themes';
import { Trash2, Package } from 'lucide-react';
import { IItem } from '@/app/interfaces/IItem';

// 🎓 CONCEITO: Componente Reutilizável e Presentacional.
// 🤔 PORQUÊ: Este componente não tem lógica própria, apenas exibe os dados que recebe.
// Podemos usá-lo tanto para a lista de itens cadastrados quanto para a de não cadastrados.
interface MaterialListProps {
  title: string;
  items: IItem[];
  canDelete: boolean;
  onDeleteItem: (itemId: number) => void;
}

export function MaterialList({ title, items, canDelete, onDeleteItem }: MaterialListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <Flex direction="column" p="4" gap="4">
          <Heading size="5">{title}</Heading>
          <Flex direction="column" align="center" gap="2" p="6" className="border-2 border-dashed rounded-lg">
            <Package className="w-10 h-10 text-gray-300" />
            <Text color="gray">Nenhum item nesta lista.</Text>
          </Flex>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" p="4" gap="4">
        <Heading size="5">{title}</Heading>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="center">Qtd</Table.ColumnHeaderCell>
              {canDelete && <Table.ColumnHeaderCell />}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.material?.descricao || item.descricaoNaoCadastrado}</Table.Cell>
                <Table.Cell align="center">
                  <Text weight="bold">{item.quantidade} {item.material?.unidade || 'UN'}</Text>
                </Table.Cell>
                {canDelete && (
                  <Table.Cell>
                    <Tooltip content="Remover">
                      <IconButton size="1" color="red" variant="ghost" onClick={() => onDeleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </Tooltip>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
    </Card>
  );
}