"use client";

import { useState } from "react";
import { Card, CardBody, Input, Button, Textarea } from "@nextui-org/react";
import { Plus, Send } from "lucide-react";
import { CreateSolicitacaoPayload } from "../interfaces/ISolicitacaoServico";

interface SolicitacaoServicoFormProps {
  onSubmit: (payload: CreateSolicitacaoPayload) => Promise<void>;
  isLoading: boolean;
}

/**
 * Formulário para criar uma nova solicitação de serviço
 */
export const SolicitacaoServicoForm = ({ 
  onSubmit, 
  isLoading 
}: SolicitacaoServicoFormProps) => {
  const [descricao, setDescricao] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim() || !nomeCliente.trim()) return;

    await onSubmit({ descricao, nomeCliente });
    
    // Limpar formulário após sucesso
    setDescricao("");
    setNomeCliente("");
    setIsExpanded(false);
  };

  return (
    <Card className="mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        {!isExpanded ? (
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={20} />}
            className="w-full font-semibold"
            onPress={() => setIsExpanded(true)}
          >
            Nova Solicitação de Serviço
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Criar Nova Solicitação
            </h3>
            
            <Input
              label="Nome do Cliente"
              placeholder="Digite o nome do cliente"
              value={nomeCliente}
              onValueChange={setNomeCliente}
              variant="bordered"
              isRequired
              classNames={{
                label: "text-gray-700 dark:text-gray-300",
              }}
            />
            
            <Textarea
              label="Descrição do Serviço"
              placeholder="Descreva o serviço a ser realizado..."
              value={descricao}
              onValueChange={setDescricao}
              variant="bordered"
              minRows={3}
              isRequired
              classNames={{
                label: "text-gray-700 dark:text-gray-300",
              }}
            />
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="light"
                onPress={() => {
                  setIsExpanded(false);
                  setDescricao("");
                  setNomeCliente("");
                }}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading && <Send size={18} />}
                isDisabled={!descricao.trim() || !nomeCliente.trim()}
              >
                Criar Solicitação
              </Button>
            </div>
          </form>
        )}
      </CardBody>
    </Card>
  );
};

export default SolicitacaoServicoForm;
