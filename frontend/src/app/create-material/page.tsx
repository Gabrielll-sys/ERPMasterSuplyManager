"use client";

import { useState, useEffect } from "react";
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Box, Flex, Table, Text, TextField, Card, Button } from "@radix-ui/themes";
import { useMutation } from "react-query";
import { filterMateriais, searchByDescription, searchByFabricanteCode, createMaterial } from "../services/Material.Services";
import type { IInventario } from "../interfaces/IInventarios";

function BuscaMateriais() {
  const [loadingMateriais, setLoadingMateriais] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [codigoFabricante, setCodigoFabricante] = useState("");
  const [marca, setMarca] = useState("");
  const [tensao, setTensao] = useState("127V");
  const [localizacao, setLocalizacao] = useState("");
  const [corrente, setCorrente] = useState("");
  const [unidade, setUnidade] = useState("UN");
  const [precoCusto, setPrecoCusto] = useState("");
  const [markup, setMarkup] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [severidadeAlert, setSeveridadeAlert] = useState("info");
  const [materiais, setMateriais] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const unidadeMaterial = ["UN", "RL", "MT", "PC"];
  const tensoes = ["", "12V", "24V", "127V", "220V", "380V", "440V", "660V"];

  // Verificar se está em dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carregar usuário atual do localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user != null) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.log("Usuário não logado");
    }
  }, []);

  // Carregar dados da sessão
  useEffect(() => {
    const description = sessionStorage.getItem("description");
    const materiaisStorage = JSON.parse(sessionStorage.getItem("materiais"));

    if (materiaisStorage != null && materiaisStorage) setMateriais(materiaisStorage);
    if (description) setDescricao(description);
  }, []);

  const buscarDescricao = async (value) => {
    setDescricao(value);
    if (value && value.length > 3) {
      try {
        setLoadingMateriais(true);
        const res = await searchByDescription(value);
        setLoadingMateriais(false);
        setMateriais(res);
      } catch (e) {
        console.log(e);
        setLoadingMateriais(false);
      }
    }
  };

  const buscaCodigoFabricante = async (codigo) => {
    setCodigoFabricante(codigo);
    if (codigo.length > 3) {
      try {
        const res = await searchByFabricanteCode(codigo);
        setMateriais(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    const filtro = {
      descricao,
      codigoFabricante,
      marca,
      tensao,
      localizacao,
      corrente,
      unidade,
      precoCusto,
      markup
    };

    try {
      setLoadingMateriais(true);
      const materiaisFiltrados = await filterMateriais(filtro);
      setMateriais(materiaisFiltrados);
      setLoadingMateriais(false);
    } catch (e) {
      console.log(e);
      setLoadingMateriais(false);
    }
  };

  const mutationMaterial = useMutation({
    mutationFn: createMaterial,
    onSuccess: (res) => {
      setOpenSnackBar(true);
      setSeveridadeAlert("success");
      setMessageAlert("Material Criado com sucesso");
    },
  });

  const handleCreateMaterial = () => {
    if (!descricao || !unidade) {
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Preencha todas as informações necessárias");
      return;
    }

    const material = {
      codigoFabricante: codigoFabricante.trim().replace(/\s\s+/g, " "),
      descricao: descricao.trim().replace(/\s\s+/g, " "),
      categoria: "",
      marca: marca.trim().replace(/\s\s+/g, " "),
      corrente: corrente.trim().replace(/\s\s+/g, " "),
      unidade: unidade.trim().replace(/\s\s+/g, " "),
      tensao: tensao.trim().replace(/\s\s+/g, " "),
      localizacao: localizacao.trim().replace(/\s\s+/g, " "),
      precoCusto,
      markup,
    };

    mutationMaterial.mutate(material);
  };

  const handleEditMaterial = (id) => {
    if (descricao) {
      sessionStorage.setItem("description", descricao);
      sessionStorage.setItem("materiais", JSON.stringify(materiais));
      window.location.href = `/update-material/${id}`;
    }
  };

  // Renderização para dispositivos móveis
  if (isMobile) {
    return (
      <Flex direction="column" gap="2" className="mt-7 w-full p-4">
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Text size="5" weight="bold">Busca de Materiais</Text>
            
            <TextField.Root>
              <TextField.Input
                value={descricao}
                variant="classic"
                onChange={(x) => buscarDescricao(x.target.value)}
                placeholder="Digite o nome do material (ex: min.dis.tri)"
                className="w-full"
                size="3"
              />
            </TextField.Root>
            
            <Text size="2" color="gray">
              Dica: Use abreviações separadas por pontos (ex: "min.dis.tri" para "MINI DISJUNTOR TRIPOLAR")
            </Text>
            
            <Button 
              variant="solid" 
              className="bg-blue-600 text-white"
              onClick={handleFilterSubmit}
            >
              Buscar
            </Button>
          </Flex>
        </Card>

        {loadingMateriais && (
          <Text className="w-full mt-4" align="center">
            Carregando...
          </Text>
        )}

        {materiais.length > 0 && !loadingMateriais && (
          <Card className="mt-4">
            <Flex direction="column" gap="3" p="4">
              <Flex justify="between" align="center">
                <Text size="5" weight="bold">Resultados da Busca</Text>
                <Text size="2" color="gray">{materiais.length} itens encontrados</Text>
              </Flex>
              
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell align="center">Descrição</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Estoque</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Local</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {materiais.map((inventario: IInventario) => (
                    <Table.Row key={inventario.material.id} className="hover:bg-gray-50">
                      <Table.Cell align="center">{inventario.material.descricao}</Table.Cell>
                      <Table.Cell align="center" className={inventario.saldoFinal > 10 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {inventario.saldoFinal}
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Box className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {inventario.material.localizacao}
                        </Box>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Flex>
          </Card>
        )}

        <Snackbar
          open={openSnackBar}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => setOpenSnackBar(false)}
        >
          <MuiAlert
            onClose={() => setOpenSnackBar(false)}
            severity={severidadeAlert}
            sx={{ width: "100%" }}
          >
            {messageAlert}
          </MuiAlert>
        </Snackbar>
      </Flex>
    );
  }

  // Renderização para desktop
  return (
    <Flex direction="column" gap="4" className="mt-7 w-full max-w-[1200px] mx-auto px-4">
      <Card className="w-full">
        <Flex direction="column" gap="4" p="4">
          <Text size="5" weight="bold">Busca de Materiais</Text>
          
          <Flex direction="column">
            <Flex direction="row" gap="4" wrap="wrap">
              <Box className="w-full">
                <Text size="2" weight="medium" mb="1">Descrição do Material</Text>
                <TextField.Root>
                  <TextField.Input
                    value={descricao}
                    variant="classic"
                    onChange={(x) => buscarDescricao(x.target.value)}
                    placeholder="Digite sua busca (ex: min.dis.tri)"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
                <Text size="1" color="gray" mt="1">
                  Dica: Use abreviações separadas por pontos (ex: "min.dis.tri" para "MINI DISJUNTOR TRIPOLAR")
                </Text>
              </Box>
            </Flex>
            
            <Flex direction="row" gap="4" wrap="wrap" mt="4">
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Código Fabricante</Text>
                <TextField.Root>
                  <TextField.Input
                    value={codigoFabricante}
                    variant="classic"
                    onChange={(x) => buscaCodigoFabricante(x.target.value)}
                    placeholder="Código do fabricante"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Marca</Text>
                <TextField.Root>
                  <TextField.Input
                    value={marca}
                    variant="classic"
                    onChange={(x) => setMarca(x.target.value)}
                    placeholder="Nome da marca"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Localização</Text>
                <TextField.Root>
                  <TextField.Input
                    value={localizacao}
                    variant="classic"
                    onChange={(x) => setLocalizacao(x.target.value)}
                    placeholder="Setor/Prateleira"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
            </Flex>
            
            <Flex direction="row" gap="4" wrap="wrap" mt="4">
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Preço Custo</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={precoCusto}
                    variant="classic"
                    onChange={(x) => setPrecoCusto(x.target.value)}
                    placeholder="Valor R$"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Markup</Text>
                <TextField.Root>
                  <TextField.Input
                    value={markup}
                    variant="classic"
                    onChange={(x) => setMarkup(x.target.value)}
                    placeholder="%"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Corrente</Text>
                <TextField.Root>
                  <TextField.Input
                    value={corrente}
                    variant="classic"
                    onChange={(x) => setCorrente(x.target.value)}
                    placeholder="A"
                    className="w-full"
                    size="3"
                  />
                </TextField.Root>
              </Box>
            </Flex>
            
            <Flex direction="row" gap="4" wrap="wrap" mt="4">
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Tensão</Text>
                <Autocomplete
                  placeholder="Selecione"
                  defaultSelectedKey="127V"
                  className="w-full"
                  onSelectionChange={(value) => setTensao(value)}
                >
                  {tensoes.map((item) => (
                    <AutocompleteItem key={item} value={item}>
                      {item || "Selecione"}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                <Text size="2" weight="medium" mb="1">Unidade</Text>
                <Autocomplete
                  placeholder="Selecione"
                  defaultSelectedKey="UN"
                  className="w-full"
                  onSelectionChange={(value) => setUnidade(value)}
                >
                  {unidadeMaterial.map((item) => (
                    <AutocompleteItem key={item} value={item}>
                      {item}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </Box>
              
              <Box className="flex-1 min-w-[200px]">
                {/* Espaço para manter o alinhamento */}
              </Box>
            </Flex>
            
            <Flex justify="between" mt="4">
              <Button variant="solid" className="bg-blue-600 text-white" onClick={handleFilterSubmit}>
                Buscar
              </Button>
              
              {currentUser && (
                <Button variant="solid" className="bg-green-600 text-white" onClick={handleCreateMaterial}>
                  Criar Material
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {materiais.length > 0 && (
        <Card className="w-full">
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="center">
              <Text size="5" weight="bold">Resultados da Busca</Text>
              <Text size="2" color="gray">{materiais.length} itens encontrados</Text>
            </Flex>
            
            <Box className="overflow-x-auto">
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell align="center">Cód. Interno</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Cód. Fabricante</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Descrição</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Marca</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Tensão</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Estoque</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Localização</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Preço Custo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Preço Venda</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Preço Total</Table.ColumnHeaderCell>
                    {currentUser && <Table.ColumnHeaderCell align="center">Ações</Table.ColumnHeaderCell>}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {materiais.map((inventario) => (
                    <Table.Row key={inventario.material.id} className="hover:bg-gray-50">
                      <Table.Cell align="center">{inventario.material.id}</Table.Cell>
                      <Table.Cell align="center">{inventario.material.codigoFabricante}</Table.Cell>
                      <Table.RowHeaderCell align="center" onClick={() => buscarDescricao(inventario.material.descricao)}>
                        {inventario.material.descricao}
                      </Table.RowHeaderCell>
                      <Table.Cell align="center">{inventario.material.marca}</Table.Cell>
                      <Table.Cell align="center">{inventario.material.tensao}</Table.Cell>
                      <Table.Cell align="center" className={inventario.saldoFinal > 10 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {inventario.saldoFinal}
                      </Table.Cell>
                      <Table.Cell align="center">
                        <Box className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {inventario.material.localizacao}
                        </Box>
                      </Table.Cell>
                      <Table.Cell align="center" className="font-medium">
                        R${inventario.material.precoCusto?.toFixed(2).replace('.', ',') || "0,00"}
                      </Table.Cell>
                      <Table.Cell align="center" className="font-medium">
                        R${inventario.material.precoVenda?.toFixed(2).replace('.', ',') || "0,00"}
                      </Table.Cell>
                      <Table.Cell align="center" className="font-medium">
                        R${inventario.material.precoVenda && inventario.saldoFinal > 0
                          ? (inventario.material.precoVenda * inventario.saldoFinal).toFixed(2).replace('.', ',')
                          : "0,00"}
                      </Table.Cell>
                      {currentUser && (
                        <Table.Cell align="center">
                          <Button
                            variant="soft"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                            onClick={() => handleEditMaterial(inventario.material.id)}
                          >
                            Editar
                          </Button>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Flex>
        </Card>
      )}

      <Snackbar
        open={openSnackBar}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        onClose={() => setOpenSnackBar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackBar(false)}
          severity={severidadeAlert}
          sx={{ width: "100%" }}
        >
          {messageAlert}
        </MuiAlert>
      </Snackbar>
    </Flex>
  );
}

export default BuscaMateriais;