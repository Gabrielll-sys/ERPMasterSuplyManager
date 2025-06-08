"use client"

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Button, 
  Input, 
  Card, 
  CardBody, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Spinner,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  Package, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import useSWR from "swr";
import { searchByInternCode } from "../services/Inventario.Services";

// Types
interface Material {
  id: number;
  codigoFabricante: number;
  descricao: string;
  unidade: string;
}

interface Inventario {
  id: number;
  movimentacao: number | null;
  estoque: number;
  saldoFinal: number | null;
  razao: string;
  dataAlteracao: string;
  material: Material;
  responsavel?: string;
}

// Custom hook para busca com debounce
const useInventorySearch = (codigoInterno: string) => {
  const { data, error, isLoading } = useSWR(
    codigoInterno.length >= 1 ? `inventory-${codigoInterno}` : null,
    () => searchByInternCode(Number(codigoInterno)),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  return {
    inventarios: data || [],
    loading: isLoading,
    error
  };
};

// Componente principal
export default function SearchInventory() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados
  const [codigoInterno, setCodigoInterno] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventario | null>(null);

  // Hook customizado para busca
  const { inventarios, loading, error } = useInventorySearch(codigoInterno);

  // Dados computados
  const latestInventory = useMemo(() => {
    return inventarios.length > 0 ? inventarios[inventarios.length - 1] : null;
  }, [inventarios]);

  const displayedInventarios = useMemo(() => {
    return showAll ? inventarios : (latestInventory ? [latestInventory] : []);
  }, [showAll, inventarios, latestInventory]);

  // Handlers
  const handleEdit = useCallback((materialId: number) => {
    router.push(`/update-inventory/${materialId}`);
  }, [router]);

  const handleShowDetails = useCallback((item: Inventario) => {
    setSelectedItem(item);
    onOpen();
  }, [onOpen]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  // Função para formatar status
  const getStatusChip = (item: Inventario) => {
    if (item.movimentacao === null && item.estoque === 0) {
      return <Chip color="warning" variant="flat" size="sm">Material Criado</Chip>;
    }
    return <Chip color="success" variant="flat" size="sm">Atualizado</Chip>;
  };

  // Função para formatar data
  const formatDate = (date: string, item: Inventario) => {
    const isCreated = item.movimentacao === null && item.estoque === 0;
    const prefix = isCreated ? "Material Criado em" : "Última atualização";
    return `${prefix} ${dayjs(date).format("DD/MM/YYYY [às] HH:mm")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestão de Inventário
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Consulte e gerencie seu inventário de materiais
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-md">
            <CardBody className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="relative">
                  <Input
                    value={codigoInterno}
                    onValueChange={setCodigoInterno}
                    label="Código Interno"
                    placeholder="Digite o código..."
                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                    className="w-80 max-w-full"
                    size="lg"
                    variant="bordered"
                    classNames={{
                      input: "text-lg",
                      inputWrapper: "border-2 border-gray-200 hover:border-blue-400 focus-within:!border-blue-500"
                    }}
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Spinner size="sm" color="primary" />
                    </div>
                  )}
                </div>
                
                {inventarios.length > 1 && (
                  <Button
                    onClick={toggleShowAll}
                    variant="flat"
                    color="primary"
                    startContent={showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    size="lg"
                    className="font-medium"
                  >
                    {showAll ? 'Mostrar Apenas Atual' : `Ver Histórico (${inventarios.length})`}
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {codigoInterno.length >= 1 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {loading ? (
                <Card className="shadow-lg">
                  <CardBody className="p-8 text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="mt-4 text-gray-600">Buscando inventário...</p>
                  </CardBody>
                </Card>
              ) : error ? (
                <Card className="shadow-lg border-l-4 border-l-red-500">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Erro ao buscar inventário</span>
                    </div>
                  </CardBody>
                </Card>
              ) : inventarios.length === 0 ? (
                <Card className="shadow-lg border-l-4 border-l-yellow-500">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 text-yellow-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Nenhum inventário encontrado para este código</span>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardBody className="p-0">
                    <Table 
                      aria-label="Tabela de inventário"
                      classNames={{
                        wrapper: "shadow-none",
                        th: "bg-blue-50 text-blue-900 font-semibold text-sm",
                        td: "py-4"
                      }}
                    >
                      <TableHeader>
                        <TableColumn align="center">CÓDIGO</TableColumn>
                        <TableColumn align="center">FABRICANTE</TableColumn>
                        <TableColumn align="center">DESCRIÇÃO</TableColumn>
                        <TableColumn align="center">ESTOQUE</TableColumn>
                        <TableColumn align="center">MOVIMENTAÇÃO</TableColumn>
                        <TableColumn align="center">SALDO FINAL</TableColumn>
                        <TableColumn align="center">STATUS</TableColumn>
                        <TableColumn align="center">DATA</TableColumn>
                        <TableColumn align="center">AÇÕES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {displayedInventarios.map((item :any, index:number) => (
                          <TableRow key={`${item.id}-${index}`}>
                            <TableCell>
                              <div className="font-mono font-medium text-blue-600">
                                {item.material.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-mono">
                                {item.material.codigoFabricante}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="font-medium text-gray-900 truncate">
                                  {item.material.descricao}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                {item.estoque === null ? (
                                  <span className="text-gray-400 italic">Não registrado</span>
                                ) : (
                                  <span className="font-medium">
                                    {item.estoque} {item.material.unidade}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                {item.movimentacao === null ? (
                                  <span className="text-gray-400 italic">Não registrado</span>
                                ) : (
                                  <div className="flex items-center justify-center gap-1">
                                     <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">
                                      {item.movimentacao} {item.material.unidade}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                {item.saldoFinal === null ? (
                                  <span className="text-gray-400 italic">Não registrado</span>
                                ) : (
                                  <span className="font-semibold text-green-600">
                                    {item.saldoFinal} {item.material.unidade}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                {getStatusChip(item)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <Tooltip content={formatDate(item.dataAlteracao, item)}>
                                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {dayjs(item.dataAlteracao).format("DD/MM/YY")}
                                  </div>
                                </Tooltip>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Tooltip content="Ver detalhes">
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleShowDetails(item)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Tooltip>
                                
                                {/* Só permite editar o último item */}
                                {(!showAll || index === displayedInventarios.length - 1) && (
                                  <Tooltip content="Editar inventário">
                                    <Button
                                      isIconOnly
                                      color="success"
                                      variant="flat"
                                      size="sm"
                                      onClick={() => handleEdit(item.material.id)}
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                  </Tooltip>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Detalhes */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {selectedItem && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">Detalhes do Inventário</h3>
                  <p className="text-sm text-gray-500">
                    Código: {selectedItem.material.id}
                  </p>
                </ModalHeader>
                <ModalBody className="pb-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border">
                        <CardBody className="p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Material</h4>
                          <div className="space-y-2">
                            <p><strong>Descrição:</strong> {selectedItem.material.descricao}</p>
                            <p><strong>Código Fabricante:</strong> {selectedItem.material.codigoFabricante}</p>
                            <p><strong>Unidade:</strong> {selectedItem.material.unidade}</p>
                          </div>
                        </CardBody>
                      </Card>
                      
                      <Card className="border">
                        <CardBody className="p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Inventário</h4>
                          <div className="space-y-2">
                            <p><strong>Estoque:</strong> {selectedItem.estoque || 'Não registrado'}</p>
                            <p><strong>Movimentação:</strong> {selectedItem.movimentacao || 'Não registrado'}</p>
                            <p><strong>Saldo Final:</strong> {selectedItem.saldoFinal || 'Não registrado'}</p>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                    
                    <Card className="border">
                      <CardBody className="p-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Informações Adicionais</h4>
                        <div className="space-y-2">
                          <p><strong>Razão:</strong> {selectedItem.razao}</p>
                          <p><strong>Data:</strong> {formatDate(selectedItem.dataAlteracao, selectedItem)}</p>
                          {selectedItem.responsavel && (
                            <p><strong>Responsável:</strong> {selectedItem.responsavel}</p>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </motion.div>
    </div>
  );
}