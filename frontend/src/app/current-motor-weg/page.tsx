"use client";

// 🎓 IMPORTS ENXUTOS: Importamos apenas o necessário. React, os componentes Radix UI
//    e nossos dados/tipos externalizados.
import { useState, useMemo, useCallback } from "react";
import { Box, Flex, Heading, Text, Table, Select } from "@radix-ui/themes";
import { IMotor, motores } from './data'; // 📝 Importando de nosso novo arquivo de dados

// 🎓 CUSTOM HOOK: Encapsula toda a lógica de estado e busca.
// 📝 O QUE FAZ: Gerencia qual a potência selecionada e qual o objeto `motor` correspondente.
// 🤔 PORQUÊ: Separação de Concerns. O componente principal não precisa saber *como* o motor é encontrado.
// 📊 EFEITO: Componente de UI limpo e lógica de negócio testável e reutilizável.
function useMotorData() {
  // 🎓 useState: Gerencia a string da potência selecionada no <Select>.
  const [selectedPower, setSelectedPower] = useState<string | undefined>();

  //  Memoriza o resultado da busca do motor.
  // Executa a busca (motores.find) apenas quando `selectedPower` muda.
  // Performance. Evita refazer a busca a cada renderização, sendo que o resultado seria o mesmo.
  //    `.find()` é mais eficiente que `.filter()[0]` pois para na primeira correspondência.

  const motor = useMemo(() => {
    if (!selectedPower) return undefined;
    return motores.find(m => m.potencia.toString() === selectedPower);
  }, [selectedPower]);

  // Garante que a função de callback não seja recriada a cada render.
  //  Otimização de performance, especialmente se esta função fosse passada para componentes filhos memorizados.
  const handlePowerChange = useCallback((power: string) => {
    setSelectedPower(power);
  }, []);

  return { motor, selectedPower, handlePowerChange };
}

export default function MotorWegCalculatorPage() {
  // 🎓 UTILIZAÇÃO DO HOOK: Obtemos o estado e as funções da nossa lógica encapsulada.
  const { motor, selectedPower, handlePowerChange } = useMotorData();

  return (
    // 🎓 RADIX UI FLEX: Componente para layout flexbox. Mais legível que classes de CSS utilitárias para estrutura.
    <Flex direction="column" align="center" gap="6" p="6">
      <Box className="text-center">
        <Heading as="h1" size="7">Calculadora de Corrente de Motor (WEG)</Heading>
        <Text color="gray" mt="2">Selecione a potência em CV para ver os detalhes.</Text>
      </Box>

      {/* 🎓 COMPONENTE CONTROLADO: O valor do Select é controlado pelo estado do React. */}
      <Select.Root value={selectedPower} onValueChange={handlePowerChange}>
        <Select.Trigger 
          placeholder="Selecione a potência do motor (CV)..." 
          className="min-w-[300px]"
          // 🎓 ARIA LABELS: Radix cuida da maior parte da acessibilidade, mas é bom sempre conferir.
          aria-label="Seleção de potência do motor em Cavalos-vapor"
        />
        <Select.Content position="popper">
          {/* 🎓 RENDERIZAÇÃO DE LISTA: Mapeamos nosso array de dados para criar as opções. */}
          {/*    A `key` é essencial para o React otimizar a renderização da lista. */}
          {motores.map((m) => (
            <Select.Item key={m.potencia} value={m.potencia.toString()}>
              {m.potencia} CV
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* 🎓 RENDERIZAÇÃO CONDICIONAL: A tabela só é exibida se um motor for encontrado. */}
      {/*    Isso cria uma UI reativa e evita mostrar uma tabela vazia e confusa. */}
      {motor ? (
        <Table.Root variant="surface" className="w-full max-w-2xl mt-4">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Parâmetro</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Valor</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><Text weight="bold">Potência (CV)</Text></Table.Cell>
              <Table.Cell>{motor.potencia} CV</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><Text weight="bold">Corrente em 220V</Text></Table.Cell>
              <Table.Cell>{motor.correntes['220V']} A</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><Text weight="bold">Corrente em 380V</Text></Table.Cell>
              <Table.Cell>{motor.correntes['380V']} A</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><Text weight="bold">Corrente em 440V</Text></Table.Cell>
              <Table.Cell>{motor.correntes['440V']} A</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      ) : (
  
        <Box mt="8" p="6" className="bg-gray-100 rounded-md text-center">
            <Text color="gray">Os detalhes do motor aparecerão aqui após a seleção.</Text>
        </Box>
      )}
    </Flex>
  );
}