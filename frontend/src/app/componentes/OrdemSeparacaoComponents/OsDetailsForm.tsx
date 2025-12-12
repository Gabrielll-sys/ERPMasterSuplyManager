// src/app/(os-management)/editing-os/[osId]/components/OsDetailsForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Flex, Heading, TextArea, TextField, Button, Text as RadixText } from '@radix-ui/themes';
import { User, Save } from 'lucide-react';
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao'; // Importando a interface da OS
import { useEffect } from "react";

const osDetailsSchema = z.object({
  descricao: z.string().min(3, "Descrição precisa de ao menos 3 caracteres"),
  responsavel: z.string().optional(),
  observacoes: z.string().optional(),
});
type OsDetailsFormData = z.infer<typeof osDetailsSchema>;

// --- Props do Componente ---
interface OsDetailsFormProps {
  os: IOrdemSeparacao;
  onSave: (data: OsDetailsFormData) => void;
  isSaving: boolean;
  disabled: boolean; // Prop para desabilitar todo o formulário
}

export function OsDetailsForm({ os, onSave, isSaving, disabled }: OsDetailsFormProps) {
  // --- Configuração do React Hook Form ---
  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<OsDetailsFormData>({
    

    resolver: zodResolver(osDetailsSchema),
    defaultValues: {
      descricao: os.descricao || '',
      responsavel: os.responsavel || '',
      observacoes: os.observacoes || '',
    }
  });


  useEffect(() => {
    reset({
      descricao: os.descricao || '',
      responsavel: os.responsavel || '',
      observacoes: os.observacoes || '',
    });
  }, [os, reset]);

  return (
    <Card>
     
      <form onSubmit={handleSubmit(onSave)}>
        <Flex direction="column" gap="5" p="4">
          <Heading size="5">Detalhes da Ordem de Separação</Heading>
        
      
          <Controller
            name="descricao"
            control={control}
            render={({ field, fieldState }) => (
              <Flex direction="column" gap="1">
                <TextArea {...field} size="3" placeholder="Descrição detalhada do serviço..." disabled={disabled || isSaving} />
                {fieldState.error && <RadixText size="1" color="red">{fieldState.error.message}</RadixText>}
              </Flex>
            )}
          />
          <Controller
            name="responsavel"
            control={control}
            render={({ field }) => (
              <TextField.Root>
                <TextField.Slot><User className="w-4 h-4 text-gray-500" /></TextField.Slot>
                <TextField.Input {...field} size="3" placeholder="Nomes dos responsáveis" disabled={disabled || isSaving} />
              </TextField.Root>
            )}
          />
          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => (
              <TextArea {...field} size="2" placeholder="Observações adicionais..." disabled={disabled || isSaving} />
            )}
          />

          {/* 
            📝 O QUE FAZ: O botão de salvar só aparece se o formulário tiver sido modificado (`isDirty`).
            🤔 PORQUÊ: Isso melhora a UX. Não faz sentido mostrar um botão de "Salvar" se não há nada para ser salvo.
            📊 EFEITO: A interface fica mais limpa e inteligente, guiando o usuário para a ação correta apenas quando ela é necessária.
          */}
          {isDirty && !disabled && (
            <Button type="submit" size="3" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          )}
        </Flex>
      </form>
    </Card>
  );
}