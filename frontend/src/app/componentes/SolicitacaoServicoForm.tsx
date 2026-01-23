"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Input, Button, Textarea, CheckboxGroup, Checkbox, Spinner } from "@nextui-org/react";
import { Plus, Send } from "lucide-react";
import { CreateSolicitacaoPayload } from "../interfaces/ISolicitacaoServico";
import { getAllUsers } from "../services/User.Services";
import { IUsuario } from "../interfaces/IUsuario";

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
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);

  useEffect(() => {
    const loadUsuarios = async () => {
      setIsLoadingUsuarios(true);
      try {
        const users = await getAllUsers();
        // Carrega apenas usuários ativos para seleção
        setUsuarios(users.filter((u) => u.isActive));
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setIsLoadingUsuarios(false);
      }
    };

    if (isExpanded) {
      loadUsuarios();
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim() || !nomeCliente.trim()) return;

    const usuariosDesignados =
      selectedUsuarios.length > 0 ? selectedUsuarios.join(", ") : undefined;

    // Inclui usuários designados no payload quando selecionados
    await onSubmit({ descricao, nomeCliente, usuariosDesignados });
    
    // Limpar formulário após sucesso
    setDescricao("");
    setNomeCliente("");
    setSelectedUsuarios([]);
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
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Usuários responsáveis (opcional)
              </span>
              {isLoadingUsuarios ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Spinner size="sm" />
                  Carregando usuários...
                </div>
              ) : (
                <CheckboxGroup
                  value={selectedUsuarios}
                  onValueChange={setSelectedUsuarios}
                  className="gap-2"
                >
                  {usuarios.map((usuario) => (
                    <Checkbox key={usuario.id} value={usuario.nome || ""}>
                      {usuario.nome}
                      {usuario.cargo && (
                        <span className="text-xs text-gray-400 ml-2">
                          ({usuario.cargo})
                        </span>
                      )}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="light"
                onPress={() => {
                  setIsExpanded(false);
                  setDescricao("");
                  setNomeCliente("");
                  setSelectedUsuarios([]);
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
