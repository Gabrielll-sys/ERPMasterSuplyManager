"use client";

import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem,  Spinner } from "@nextui-org/react";
import { Box, Button, Card, Flex, Heading,Separator, Table, Text, TextField, Callout } from "@radix-ui/themes"; // Usando mais Radix UI
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // React Query
import { IInventario } from "../interfaces/IInventarios";
import IMaterial from "../interfaces/IMaterial";
import { createMaterial, searchByDescription, searchByFabricanteCode } from "../services/Material.Services";

// Ícones
import { MagnifyingGlassIcon, PlusCircleIcon, PencilSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Hook customizado simples para Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timeout se o valor mudar antes do delay terminar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


function CreateMaterialPage() {
  const route = useRouter();
  const queryClient = useQueryClient();

  // --- Estados do Formulário e UI ---
  const [formDescricao, setFormDescricao] = useState<string>("");
  const [formCodigoFabricante, setFormCodigoFabricante] = useState<string>("");
  const [formMarca, setFormMarca] = useState<string>("");
  const [formTensao, setFormTensao] = useState<string>("");
  const [formLocalizacao, setFormLocalizacao] = useState<string>("");
  const [formCorrente, setFormCorrente] = useState<string>("");
  const [formUnidade, setFormUnidade] = useState<string>("UN");
  const [formPrecoCusto, setFormPrecoCusto] = useState<string>("");
  const [formMarkup, setFormMarkup] = useState<string>("");

  // Estados para os Inputs de Busca (para debounce)
  const [inputDescricao, setInputDescricao] = useState<string>("");
  const [inputCodigoFabricante, setInputCodigoFabricante] = useState<string>("");

  // Estados Debounced para disparar as queries
  const debouncedSearchTermDescricao = useDebounce(inputDescricao, 500); // 500ms debounce
  const debouncedSearchTermCodigo = useDebounce(inputCodigoFabricante, 500); // 500ms debounce

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: AlertColor }>({ open: false, message: "" });
  const openSnackbar = (message: string, severity: AlertColor) => setSnackbar({ open: true, message, severity });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const conditionsRoles = currentUser?.role === "Administrador" || currentUser?.role === "Diretor" || currentUser?.role === "SuporteTecnico";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) setCurrentUser(user);

    // Restaurar último termo de busca da descrição, se houver
    const persistedSearchTerm = sessionStorage.getItem("materialSearchDescription");
    if (persistedSearchTerm) setInputDescricao(persistedSearchTerm);

  }, []);

  // Efeito para limpar sessionStorage se termos de busca forem limpos
  useEffect(() => {
    if (debouncedSearchTermDescricao && debouncedSearchTermDescricao.length <= 3) {
        sessionStorage.removeItem("materialSearchDescription");
        sessionStorage.removeItem("lastSearchedMateriais"); // Limpa os resultados antigos
        queryClient.setQueryData(['materiaisByTerm', debouncedSearchTermDescricao], []); // Limpa cache se termo inválido
    } else if (debouncedSearchTermDescricao && debouncedSearchTermDescricao.length > 3) {
        sessionStorage.setItem("materialSearchDescription", debouncedSearchTermDescricao);
    }
  }, [debouncedSearchTermDescricao, queryClient]);


  // --- React Query: ÚNICA Query para Busca (combina descrição e código) ---
  // Usaremos a mesma chave de query e passaremos ambos os termos. A função de fetch decidirá qual busca fazer.
  const searchTerm = debouncedSearchTermDescricao.length > 3 ? debouncedSearchTermDescricao : (debouncedSearchTermCodigo.length > 3 ? debouncedSearchTermCodigo : "");
  const searchType = debouncedSearchTermDescricao.length > 3 ? 'descricao' : (debouncedSearchTermCodigo.length > 3 ? 'codigo' : 'none');

  const { data: materiais = [], isLoading: isLoadingMateriais, isFetching: isFetchingMateriais, isPreviousData } = useQuery<IInventario[], Error>(
    ['materiaisSearch', searchTerm, searchType], // A chave agora inclui o termo e o tipo
    async () => {
      if (searchType === 'descricao') {
        return searchByDescription(searchTerm);
      } else if (searchType === 'codigo') {
        return searchByFabricanteCode(searchTerm);
      } else {
        return []; // Não busca se nenhum termo for válido
      }
    },
    {
      enabled: searchType !== 'none', // Habilita a query apenas se um termo válido existir
      staleTime: 1000 * 60 * 2, // Considera os dados "fresh" por 2 minutos - REDUZ HITS NA API
      keepPreviousData: true, // Mantém dados antigos visíveis enquanto busca novos - MELHORA FLUIDEZ
      initialData: () => { // Tenta carregar do sessionStorage como dado inicial
        // Só carrega se o termo persistido for o mesmo que o atual
        const storedTerm = sessionStorage.getItem("materialSearchDescription");
        const storedMateriais = sessionStorage.getItem("lastSearchedMateriais");
        if (storedTerm === debouncedSearchTermDescricao && storedMateriais) {
           try { return JSON.parse(storedMateriais); } catch { return undefined; }
        }
        return undefined;
      },
      onSuccess: (data) => {
        // Salva apenas se a busca for por descrição (ou ajuste a lógica se necessário)
        if (searchType === 'descricao') {
            sessionStorage.setItem("lastSearchedMateriais", JSON.stringify(data));
        }
      },
       onError: (error) => {
        openSnackbar(`Erro ao buscar materiais: ${error.message}`, "error");
      }
    }
  );


  // --- React Query: Mutação para Criar Material (sem alterações aqui) ---
  const mutationCreateMaterial = useMutation<IInventario, Error, IMaterial>(createMaterial, {
     onSuccess: (newMaterial) => {
      openSnackbar("Material criado com sucesso!", "success");
      setFormDescricao(""); setFormCodigoFabricante(""); setFormMarca("");
      setFormTensao(""); setFormLocalizacao(""); setFormCorrente("");
      setFormUnidade("UN"); setFormPrecoCusto(""); setFormMarkup("");
      queryClient.invalidateQueries(['materiaisSearch']); // Invalida a busca geral
      queryClient.invalidateQueries(['allInventario']);
    },
    onError: (error) => {
      openSnackbar(`Erro ao criar material: ${error.message}`, "error");
    }
  });

 
  const handleCreateMaterialSubmit = () => {
    if (!formDescricao.trim() || !formUnidade.trim()) {
      openSnackbar("Descrição e Unidade são obrigatórios.", "warning");
      return;
    }
    const materialPayload: IMaterial = { /* ... seu payload ... */
      codigoFabricante: formCodigoFabricante.trim().replace(/\s\s+/g, " "),
      descricao: formDescricao.trim().replace(/\s\s+/g, " "),
      categoria: "",
      marca: formMarca.trim().replace(/\s\s+/g, " "),
      corrente: formCorrente.trim().replace(/\s\s+/g, " "),
      unidade: formUnidade.trim().replace(/\s\s+/g, " "),
      tensao: formTensao.trim().replace(/\s\s+/g, " "),
      localizacao: formLocalizacao.trim().replace(/\s\s+/g, " "),
      precoCusto: formPrecoCusto ? parseFloat(formPrecoCusto.replace(',', '.')) : 0,
      markup: formMarkup,
    };

    console.log("Criando material com payload:", materialPayload); // Debugging
    mutationCreateMaterial.mutate(materialPayload);
  };


  // Navegação (sem alterações aqui)
  const handleNavigateToUpdate = (materialId: string | number) => {
    // Salva o termo de busca atual se for por descrição
    if (searchType === 'descricao' && debouncedSearchTermDescricao) {
      sessionStorage.setItem("materialSearchDescription", debouncedSearchTermDescricao);
    }
    route.push(`update-material/${materialId}`);
  };
  
  // Constantes (sem alterações aqui)
  const unidadeMaterial: string[] = ["UN", "RL", "MT", "P", "CX", "KIT"];
  const tensoes: string[] = ["", "12V", "24V", "110V", "127V", "220V", "380V", "440V", "660V"];


  return (
    <Flex direction="column" gap="5" className="mt-7 w-full container mx-auto px-4 md:px-6">
      <Heading align="center" size="7" mb="4">Gerenciamento de Materiais</Heading>

      {/* Seção de Criação de Material (Interface igual, lógica de submit usa mutation) */}
       {conditionsRoles && (
        <Card variant="surface" mb="6">
          {/* ... (Conteúdo do formulário de criação igual ao anterior) ... */}
             <Box>
                <Heading size="5" className="flex items-center">
                <PlusCircleIcon className="h-6 w-6 mr-2 text-accent-9" /> Criar Novo Material
                </Heading>
            </Box>
            <Box p="4">
                <Flex direction="column" gap="4">
                {/* Linha 1: Cód Fab, Descrição */}
                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                    <TextField.Root className="flex-1">
                    <TextField.Slot><MagnifyingGlassIcon height="16" width="16" /></TextField.Slot>
                    <TextField.Input
                        value={formCodigoFabricante} variant='surface'
                        onChange={(e) => setFormCodigoFabricante(e.target.value)}
                        placeholder='Código Fabricante' size="3"
                    />
                    </TextField.Root>
                    <TextField.Root className="flex-1 sm:flex-[2]">
                    <TextField.Input
                        value={formDescricao} variant='surface'
                        onChange={(e) => setFormDescricao(e.target.value)}
                        placeholder='Descrição do Material*' size="3" required
                    />
                    </TextField.Root>
                </Flex>
                {/* Linha 2: Marca, Localização */}
                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4">
                    <TextField.Root className="flex-1">
                    <TextField.Input
                        value={formMarca} variant='surface'
                        onChange={(e) => setFormMarca(e.target.value)}
                        placeholder='Marca' size="3"
                    />
                    </TextField.Root>
                    <TextField.Root className="flex-1">
                    <TextField.Input
                        value={formLocalizacao} variant='surface'
                        onChange={(e) => setFormLocalizacao(e.target.value)}
                        placeholder='Localização (Ex: A1-B2)' size="3"
                    />
                    </TextField.Root>
                </Flex>
                {/* Linha 3: Preços, Corrente, Tensão, Unidade */}
                <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" align="end">
                    <TextField.Root className="flex-1">
                    <TextField.Input
                        value={formPrecoCusto} variant='surface'
                        onChange={(e) => setFormPrecoCusto(e.target.value)}
                        placeholder='Preço Custo (Ex: 10,50)' type="text"
                        inputMode="decimal" size="3"
                    />
                    </TextField.Root>
                    <TextField.Root className="flex-1">
                    <TextField.Input
                        value={formMarkup} variant='surface'
                        onChange={(e) => setFormMarkup(e.target.value)}
                        placeholder='Markup % (Ex: 25)' type="text"
                        inputMode="decimal" size="3"
                    />
                    </TextField.Root>
                    <TextField.Root className="flex-1">
                    <TextField.Input
                        value={formCorrente} variant='surface'
                        onChange={(e) => setFormCorrente(e.target.value)}
                        placeholder='Corrente (Ex: 10A)' size="3"
                    />
                    </TextField.Root>
                    <Box className="flex-1 min-w-[180px]">
                    <Autocomplete label="Tensão" placeholder="EX: 127V" variant="bordered"
                        defaultItems={tensoes.map(t => ({ id: t, name: t }))}
                        selectedKey={formTensao}
                        onSelectionChange={(key) => setFormTensao(key as string)}
                        size="lg" className="radix-equivalent-size-3"
                        listboxProps={{ itemClasses: { base: "text-sm" } }}
                    >
                        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                    </Autocomplete>
                    </Box>
                    <Box className="flex-1 min-w-[180px]">
                    <Autocomplete label="Unidade*" placeholder="EX: UN" variant="bordered"
                        defaultItems={unidadeMaterial.map(u => ({ id: u, name: u }))}
                        selectedKey={formUnidade}
                        onSelectionChange={(key) => setFormUnidade(key as string)}
                        isRequired size="lg" className="radix-equivalent-size-3"
                        listboxProps={{ itemClasses: { base: "text-sm" } }}
                    >
                        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                    </Autocomplete>
                    </Box>
                </Flex>
                {/* Botão Criar */}
                <Flex justify="end" mt="3">
                    <Button size="3" variant='solid' color="green"
                    onClick={handleCreateMaterialSubmit}
                    disabled={mutationCreateMaterial.isLoading}
                    >
                    {mutationCreateMaterial.isLoading && <Spinner size="lg" />}
                    <PlusCircleIcon className="h-5 w-5 mr-1" />
                    Criar Material
                    </Button>
                </Flex>
                </Flex>
            </Box>
        </Card>
      )}


      <Separator my="5" size="4" />

      {/* Seção de Busca e Lista de Materiais */}
      <Card variant="surface">
         <Box><Heading size="5">Buscar Materiais Existentes</Heading></Box>
         <Box p="4">
            <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" mb="4">
                <TextField.Root className="flex-1">
                 <TextField.Slot><MagnifyingGlassIcon height="16" width="16" /></TextField.Slot>
                    <TextField.Input
                    value={inputDescricao} // Controlado pelo input state
                    variant='surface'
                    onChange={(e) => setInputDescricao(e.target.value)} // Atualiza o input state
                    placeholder='Buscar por Descrição (mín. 4 caracteres)'
                    size="3"
                    />
                </TextField.Root>
                <TextField.Root className="flex-1">
                 <TextField.Slot><MagnifyingGlassIcon height="16" width="16" /></TextField.Slot>
                    <TextField.Input
                    value={inputCodigoFabricante} // Controlado pelo input state
                    variant='surface'
                    onChange={(e) => setInputCodigoFabricante(e.target.value)} // Atualiza o input state
                    placeholder='Buscar por Código do Fabricante (mín. 4 caracteres)'
                    size="3"
                    />
                </TextField.Root>
            </Flex>

             {/* Feedback de Carregamento */}
             {/* Usamos isFetching em vez de isLoading para mostrar loading mesmo com keepPreviousData */}
            {isFetchingMateriais && <Flex justify="center" my="4"><Spinner size="lg" /></Flex>}

            {/* Mensagem de Nenhum Resultado */}
            {!isFetchingMateriais && materiais.length === 0 && searchType !== 'none' && (
                <Callout.Root color="amber" my="4" data-fade-in>
                    <Callout.Icon><ExclamationTriangleIcon className="h-5 w-5"/></Callout.Icon>
                    <Callout.Text>Nenhum material encontrado.</Callout.Text>
                </Callout.Root>
            )}

            {/* Tabela de Resultados - Animação Suave */}
            {/* Usamos uma div com controle de opacidade e altura máxima para transição */}
            <div
               className={`transition-all duration-500 ease-in-out overflow-hidden ${
                 (materiais && materiais.length > 0 && !isFetchingMateriais) || (isPreviousData && materiais && materiais.length > 0) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
               }`}
               style={{ willChange: 'max-height, opacity' }} // Hint para performance da animação
            >
                {materiais && materiais.length > 0 && (
                <>
                    <Text size="2" color="gray" mb="2" className="block">
                        Resultados: {materiais.length} Itens {isPreviousData ? '(mantendo anteriores...)' : ''}
                    </Text>
                    <Box className="border rounded-lg overflow-hidden"> {/* Adiciona borda e esconde overflow */}
                     <Box style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Scroll interno */}
                            <Table.Root variant="surface" size="2">
                                <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Cód. Fab.</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell style={{minWidth: '250px'}}>Descrição</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Estoque</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Localização</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Pr. Custo</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Pr. Venda</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                {materiais.map((inv) => (
                                    <Table.Row  key={inv.material.id} className="hover:bg-accent-2">
                                        <Table.Cell>{inv.material.id}</Table.Cell>
                                        <Table.Cell>{inv.material.codigoFabricante}</Table.Cell>
                                        <Table.RowHeaderCell
                                            className="cursor-pointer hover:underline"
                                            onClick={() => setInputDescricao(inv.material.descricao || '')} // Atualiza input para nova busca
                                            title="Clique para pesquisar por esta descrição"
                                        >
                                            {inv.material.descricao}
                                        </Table.RowHeaderCell>
                                        <Table.Cell>{inv.material.marca}</Table.Cell>
                                        <Table.Cell>{inv.saldoFinal ?? 'N/D'} {inv.material.unidade}</Table.Cell>
                                        <Table.Cell>{inv.material.localizacao}</Table.Cell>
                                        <Table.Cell>R$ {inv.material.precoCusto?.toFixed(2).replace('.', ',') || '0,00'}</Table.Cell>
                                        <Table.Cell>R$ {inv.material.precoVenda?.toFixed(2).replace('.', ',') || '0,00'}</Table.Cell>
                                        <Table.Cell>
                                            <Button size="1" variant="soft" onClick={() => handleNavigateToUpdate(inv.material.id)} disabled={!conditionsRoles}>
                                                <PencilSquareIcon className="h-4 w-4 mr-1" /> Editar
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Box>
                </>
                )}
            </div>
         </Box>
      </Card>


      {/* Snackbar (sem alterações) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6} variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity} sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Flex>
  );
}

export default CreateMaterialPage;