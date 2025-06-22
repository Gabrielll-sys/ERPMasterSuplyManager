"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip, // Novo: Para exibir status
  Divider,
  Input, // Novo: Para campos de texto mais simples
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet, // Novo: Para exibir números de OS ou observações de forma elegante
  Spacer, // Novo: Para espaçamento
  Spinner, // Novo: Para indicar carregamento
  Switch,  // Exemplo: se houver uma configuração rápida
  Textarea, // Novo: Para descrições mais longas
  User,     // Exemplo: Para exibir o responsável
  useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem // Novo: Para ações no card
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { url } from "../../api/webApiUrl"; // Mantenha seu caminho correto
import dayjs from "dayjs";


import {
  PlusCircleIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  CogIcon,
  PencilIcon
} from "@heroicons/react/24/outline";

import { IOrdemServico } from "@/app/interfaces/IOrdemSeparacao"; // Mantenha seu caminho correto

// (Mantenha seu tipo Os, se necessário, ou use IOrderServico diretamente)
type Os = IOrdemServico & {
  // Adicione quaisquer campos específicos da UI aqui, se diferentes de IOrderServico
};

export default function OsManagement() {
  const route = useRouter();
  // const { data: session } = useSession(); // Descomente se usar session

  const [ordemServicos, setOrdemServicos] = useState<Os[]>([]);
  const [descricaoOs, setDescricaoOs] = useState<string>(""); // Inicialize como vazio
  const [numeroOs, setNumeroOs] = useState<string>("");     // Inicialize como vazio
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carregamento
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Estado de envio do formulário

  const [numerosOsExistentes, setNumerosOsExistentes] = useState<string[]>([]);

  const { isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange, onClose: onModalClose } = useDisclosure();
  const [selectedOsModal, setSelectedOsModal] = useState<Os | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<any>(null); // Mantenha sua lógica de usuário

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      setCurrentUser(user);
    }
    fetchAllOs();
  }, []);

  const fetchAllOs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<Os[]>(`${url}/OrdemServicos`);
      const sortedData = data.sort((a, b) => dayjs(b.dataAbertura).unix() - dayjs(a.dataAbertura).unix()); // Ordenar por mais recente
      setOrdemServicos(sortedData);
      setNumerosOsExistentes(data.map(os => String(os.numeroOs)));
    } catch (error) {
      console.error("Erro ao buscar Ordens de Serviço:", error);
      // Adicionar feedback de erro para o usuário (ex: toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (os: Os) => {
    setSelectedOsModal(os);
    onModalOpen();
  };

  const handleCreateOs = async () => {
    if (!numeroOs.trim() || !descricaoOs.trim()) {
      // Adicionar feedback de validação para o usuário
      alert("Número da OS e Descrição são obrigatórios.");
      return;
    }
    if (numerosOsExistentes.includes(numeroOs.trim())) {
        alert("Este número de OS já existe. Por favor, utilize outro.");
        return;
    }

    setIsSubmitting(true);
    const descricaoOsFormated = descricaoOs.trim().replace(/\s\s+/g, " ");
    const numeroOsFormated = numeroOs.trim().replace(/\s\s+/g, " ");

    const newOSPayload = {
      descricao: descricaoOsFormated,
      numeroOs: numeroOsFormated,
      responsavelAbertura: currentUser?.userName || "Sistema", // Fallback
      dataAbertura: dayjs().toISOString(), // Enviar data de abertura no momento da criação
      isAuthorized: false, // Default
      // outros campos default se necessário
    };

    try {
      await axios.post(`${url}/OrdemServicos`, newOSPayload);
      fetchAllOs(); // Re-buscar para atualizar a lista
      setNumeroOs(""); // Limpar campos após sucesso
      setDescricaoOs("");
      // Adicionar feedback de sucesso (ex: toast notification)
    } catch (error) {
      console.error("Erro ao criar OS:", error);
      // Adicionar feedback de erro (ex: toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Renderização ----
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Carregando Ordens de Serviço..." color="primary" labelColor="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Gerenciamento de Ordens de Serviço
          </h1>
        </header>

        {/* SEÇÃO DE CRIAÇÃO DE OS */}
        <Card className="mb-8 shadow-lg" isBlurred>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
              <PlusCircleIcon className="h-6 w-6 mr-2 text-primary" />
              Nova Ordem de Serviço
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Input
                label="Número da OS"
                placeholder="Ex: 2024001"
                value={numeroOs}
                onValueChange={setNumeroOs}
                isClearable
                variant="bordered"
                className="md:col-span-1"
                validationState={numerosOsExistentes.includes(numeroOs.trim()) && numeroOs.trim() !== "" ? "invalid" : "valid"}
                errorMessage={numerosOsExistentes.includes(numeroOs.trim()) && numeroOs.trim() !== "" ? "Número de OS já existe." : ""}
              />
              <Textarea
                label="Descrição da OS"
                placeholder="Detalhes do serviço..."
                value={descricaoOs}
                onValueChange={setDescricaoOs}
                variant="bordered"
                className="md:col-span-2"
                minRows={1}
                maxRows={3}
              />
            </div>
             <Spacer y={4} />
            <Button
                color="primary"
                onPress={handleCreateOs}
                isLoading={isSubmitting}
                isDisabled={isSubmitting || !numeroOs.trim() || !descricaoOs.trim() || numerosOsExistentes.includes(numeroOs.trim())}
                fullWidth
                size="lg"
                className="font-semibold"
              >
                {isSubmitting ? "Criando..." : "Criar OS"}
              </Button>
          </CardBody>
        </Card>

        {/* LISTA DE OS */}
        {ordemServicos.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl">Nenhuma Ordem de Serviço encontrada.</p>
            <p>Crie uma nova OS para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-40">
            {ordemServicos.map((os) => (
              <Card key={os.id} className="shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex justify-between items-start pb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-all">
                      OS: {os.numeroOs}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={os.descricao}>
                        {os.descricao && os.descricao.length > 50 ? `${os.descricao.substring(0, 50)}...` : os.descricao}
                    </p>
                  </div>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Ações da OS">
                      <DropdownItem
                        key="view"
                        startContent={<EyeIcon className="h-5 w-5" />}
                        onPress={() => handleOpenModal(os)}
                      >
                        Ver Detalhes
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        startContent={<PencilIcon className="h-5 w-5" />}
                        onPress={() => route.push(`/editing-os/${os.id}`)}
                      >
                        Editar OS
                      </DropdownItem>
                      {/* Exemplo: Ação de deletar (implementar lógica) */}
                       <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<TrashIcon className="h-5 w-5" />}
                        // onPress={() => handleDeleteOs(os.id)}
                      >
                        Excluir OS
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                </CardHeader>
                <Divider />
                <CardBody className="py-3 px-4">
                  <div className="flex justify-between items-center mb-2">
                     <Chip
                        color={os.isAuthorized ? "success" : "warning"}
                        variant="flat"
                        size="sm"
                        startContent={os.isAuthorized ? <CheckCircleIcon className="h-4 w-4" /> : <CogIcon className="h-4 w-4 animate-spin" />}
                      >
                        {os.isAuthorized ? "Concluída" : "Em Andamento"}
                      </Chip>
                     <p className="text-xs text-gray-500 dark:text-gray-400">
                        Abertura: {dayjs(os.dataAbertura).format("DD/MM/YYYY")}
                      </p>
                  </div>

                  {os.responsavelAbertura && (
                     <User   
                        name={os.responsavelAbertura}
                        description="Responsável Abertura"
                        avatarProps={{ size:"sm", name: os.responsavelAbertura.charAt(0).toUpperCase() }} // Simples avatar com inicial
                        className="text-xs"
                    />
                  )}
                   <Spacer y={2}/>
                  {os.observacoes && (
                    <Snippet symbol="" size="sm" variant="bordered" className="w-full text-xs">
                        {os.observacoes.length > 60 ? `${os.observacoes.substring(0, 60)}...` : os.observacoes}
                    </Snippet>
                  )}

                </CardBody>
                <Divider />
                <CardFooter className="flex justify-end gap-2 px-4 py-2">
                   <Button
                    variant="flat"
                    color="primary"
                    size="sm"
                    startContent={<EyeIcon className="h-4 w-4" />}
                    onPress={() => handleOpenModal(os)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<PencilIcon className="h-4 w-4" />}
                    onPress={() => route.push(`/editing-os/${os.id}`)}
                  >
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES */}
      {selectedOsModal && (
        <Modal
          isOpen={isModalOpen}
          onOpenChange={onModalOpenChange}
          onClose={onModalClose}
          size="2xl" // Ajuste o tamanho conforme necessário
          backdrop="blur"
          scrollBehavior="inside"
           classNames={{
             base: "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white",
             header: "border-b-[1px] border-gray-200 dark:border-gray-700",
             footer: "border-t-[1px] border-gray-200 dark:border-gray-700",
           }}
        >
          <ModalContent>
            {(onCloseModal) => ( // onCloseModal é injetado por NextUI
              <>
                <ModalHeader className="flex flex-col gap-1 text-xl font-semibold">
                  Detalhes da OS: {selectedOsModal.numeroOs}
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <p><strong>Descrição:</strong> {selectedOsModal.descricao}</p>
                  <Divider />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><strong>Data de Abertura:</strong> {dayjs(selectedOsModal.dataAbertura).format("DD/MM/YYYY HH:mm")}</p>
                    <p><strong>Aberta por:</strong> {selectedOsModal.responsavelAbertura}</p>
                    <p><strong>Status:</strong>
                      <Chip color={selectedOsModal.isAuthorized ? "success" : "warning"} variant="flat" size="sm" className="ml-2">
                        {selectedOsModal.isAuthorized ? "Concluída" : "Em Andamento"}
                      </Chip>
                    </p>
                    {selectedOsModal.isAuthorized && selectedOsModal.dataAutorizacao && (
                         <p><strong>Data de Autorização/Conclusão:</strong> {dayjs(selectedOsModal.dataAutorizacao).format("DD/MM/YYYY HH:mm")}</p>
                    )}
                    {selectedOsModal.dataFechamento && (
                         <p><strong>Data de Fechamento:</strong> {dayjs(selectedOsModal.dataFechamento).format("DD/MM/YYYY HH:mm")}</p>
                    )}

                  </div>
                   <Divider />
                  <p><strong>Responsáveis Execução:</strong> {selectedOsModal.responsaveisExecucao || "Não definido"}</p>
                  <Divider />
                  <div>
                    <p className="font-semibold">Observações:</p>
                    <Textarea
                        isReadOnly
                        value={selectedOsModal.observacoes || "Nenhuma observação."}
                        variant="faded"
                        className="mt-1"
                    />
                  </div>
                  {selectedOsModal.isAuthorized && (
                    <>
                    <Divider />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p><strong>Preço Custo Total:</strong> R$ {selectedOsModal.precoCustoTotalOs?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}</p>
                        <p><strong>Preço Venda Total:</strong> R$ {selectedOsModal.precoVendaTotalOs?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}</p>
                    </div>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onCloseModal}>
                    Fechar
                  </Button>
                  <Button color="primary" onPress={() => { route.push(`/editing-os/${selectedOsModal.id}`); onCloseModal(); }}>
                    <PencilIcon className="h-5 w-5 mr-1" /> Editar OS
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}