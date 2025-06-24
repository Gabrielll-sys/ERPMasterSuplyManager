// app/budgets/[orcamentoId]/_components/ActionButtons.tsx
"use client";

import { useState } from 'react';
import { Flex, Button, Dialog, TextField, Text } from '@radix-ui/themes';
import { FileDown, ShieldCheck } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // Mantendo sua lib de PDF
import OrcamentoPDF from '@/app/componentes/OrcamentoPDF'; // Seu componente de PDF

type ActionButtonsProps = {
  isPaid?: boolean;
  orcamento: any;
  materiais: any[];
  onAuthorize: () => void;
};

export function ActionButtons({ isPaid, orcamento, materiais, onAuthorize }: ActionButtonsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canAuthorize = confirmText === "AUTORIZAR";

  const handleAuthorizeClick = () => {
    onAuthorize();
    setIsConfirmOpen(false);
    setConfirmText("");
  };

  return (
    <Flex direction="column" gap="3">
      {!isPaid && (
         <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <Dialog.Trigger>
                <Button size="3" color="green">
                    <ShieldCheck size={18} /> Autorizar Orçamento
                </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Confirmar Autorização</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                Você está prestes a autorizar o Orçamento Nº {orcamento?.id}. Esta ação é
                irreversível e irá dar baixa nos materiais do estoque.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <Text as="label" size="2" weight="bold" htmlFor="confirm-input">
                        Para confirmar, digite AUTORIZAR abaixo:
                    </Text>
                    <TextField.Input 
                        id="confirm-input"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="AUTORIZAR"
                    />
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">Cancelar</Button>
                    </Dialog.Close>
                    <Button color="green" disabled={!canAuthorize} onClick={handleAuthorizeClick}>
                        Confirmar Autorização
                    </Button>
                </Flex>
            </Dialog.Content>
         </Dialog.Root>
      )}

      <Button size="3" variant="surface">
        <PDFDownloadLink
          document={
            <OrcamentoPDF
              materiaisOrcamento={materiais}
              orcamento={orcamento}
              // Passe as props necessárias para seu componente PDF
            />
          }
          fileName={`Orcamento_${orcamento?.id}.pdf`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileDown size={18} /> Gerar PDF
        </PDFDownloadLink>
      </Button>
    </Flex>
  );
}