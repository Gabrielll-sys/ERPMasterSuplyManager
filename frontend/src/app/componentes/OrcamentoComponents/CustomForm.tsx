"use client";

import { Grid, Card, Text, TextField, TextArea, Flex, Box } from "@radix-ui/themes";
import { User, MapPin, Mail, Hash, Phone } from 'lucide-react';

// Reutilizamos as interfaces e tipos definidos no componente pai
type BudgetState = {
  nomeCliente: string;
  endereco: string;
  emailCliente: string;
  cpfOrCnpj: string;
  telefone: string;
  observacoes: string;
  desconto:string;
};

type CustomerFormProps = {
  formState: BudgetState;
  onFormChange: (field: keyof BudgetState, value: string) => void;
  onBlur: () => void; // Função para salvar ao sair do campo
};

export function CustomerForm({ formState, onFormChange, onBlur }: CustomerFormProps) {
  return (
    <Card size="4">
        <Flex direction="column" gap="4">
            <Text as="div" size="6" weight="bold" mb="2">
                Dados do Cliente
            </Text>
            
            {/* Usando o Grid do Radix para um layout responsivo */}
            <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <TextField.Root size="3">
                    <TextField.Slot><User size={18} /></TextField.Slot>
                    <TextField.Input 
                        placeholder="Nome do Cliente" 
                        value={formState.nomeCliente}
                        onChange={(e) => onFormChange('nomeCliente', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>

                <TextField.Root size="3">
                    <TextField.Slot><MapPin size={18} /></TextField.Slot>
                    <TextField.Input 
                        placeholder="Endereço"
                        value={formState.endereco}
                        onChange={(e) => onFormChange('endereco', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>
                
                <TextField.Root size="3">
                    <TextField.Slot><Mail size={18} /></TextField.Slot>
                    <TextField.Input 
                        type="email"
                        placeholder="E-mail"
                        value={formState.emailCliente}
                        onChange={(e) => onFormChange('emailCliente', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>

                <TextField.Root size="3">
                    <TextField.Slot><Hash size={18} /></TextField.Slot>
                    <TextField.Input 
                        placeholder="CPF/CNPJ"
                        value={formState.cpfOrCnpj}
                        onChange={(e) => onFormChange('cpfOrCnpj', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>

                <TextField.Root size="3">
                    <TextField.Slot><Phone size={18} /></TextField.Slot>
                    <TextField.Input 
                        placeholder="Telefone"
                        value={formState.telefone}
                        onChange={(e) => onFormChange('telefone', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>
               <TextField.Root size="3">
                    <TextField.Slot>%</TextField.Slot>
                    <TextField.Input 
                        placeholder="Telefone"
                        value={formState.desconto}
                        onChange={(e) => onFormChange('desconto', e.target.value)}
                        onBlur={onBlur}
                    />
                </TextField.Root>
            </Grid>

            {/* O campo de observações ocupa a largura total */}
            <Box>
                <TextArea
                    size="3"
                    placeholder="Observações do orçamento..."
                    value={formState.observacoes}
                    onChange={(e) => onFormChange('observacoes', e.target.value)}
                    onBlur={onBlur}
                    style={{ minHeight: 120 }}
                />
            </Box>
        </Flex>
    </Card>
  );
}
