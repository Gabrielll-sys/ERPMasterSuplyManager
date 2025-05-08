"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Use Next.js Link for internal navigation

// Radix UI Themes Components
import { Flex, TextField, Button, Text, Box, Card, Heading, Select, Dialog, IconButton } from "@radix-ui/themes";

// Radix UI Icons (ou Heroicons)
import { ArrowLeftIcon, CameraIcon, DownloadIcon, TrashIcon, Cross2Icon } from '@radix-ui/react-icons'; // Exemplos Radix

// Serviços (mantendo a lógica existente por enquanto)
import { getMaterialById, updateMaterial } from "@/app/services/Material.Services";
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from "@/app/services/Images.Services";
import { IImage } from "@/app/interfaces/IImage";
import IMaterial from "@/app/interfaces/IMaterial";

// MUI Snackbar (mantendo por enquanto)
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";

// Outras libs
import imageCompression from "browser-image-compression";
import "dayjs/locale/pt-br";
import { Spinner } from "@nextui-org/react";


export default function UpdateMaterialPage({ params }: { params: { materialId: string } }) { // Nome do Componente
    const router = useRouter();
    const materialId = parseInt(params.materialId); // Converter para número

    // --- Estados ---
    const [descricao, setDescricao] = useState<string>("");
    const [codigoFabricante, setCodigoFabricante] = useState<string>("");
    const [marca, setMarca] = useState<string>("");
    const [tensao, setTensao] = useState<string>(""); // Radix Select usa string
    const [corrente, setCorrente] = useState<string>("");
    const [localizacao, setLocalizacao] = useState<string>("");
    const [unidade, setUnidade] = useState<string>(""); // Radix Select usa string
    const [precoCusto, setPrecoCusto] = useState<string>("");
    const [precoVenda, setPrecoVenda] = useState<string>("");
    const [markup, setMarkup] = useState<string>("");
    const [imagem, setImagem] = useState<IImage | undefined>(undefined);
    const [descricaoMaterialOriginal, setDescricaoMaterialOriginal] = useState<string>(""); // Para o título
    const [codigoInterno, setCodigoInterno] = useState<string>(""); // Para o título

    // Estados de UI e Modais
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isImageProcessing, setIsImageProcessing] = useState<boolean>(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageModalData, setImageModalData] = useState<IImage | undefined>(undefined);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: AlertColor }>({ open: false, message: "" });
    const openSnackbar = (message: string, severity: AlertColor) => setSnackbar({ open: true, message, severity });

    // Constantes
    const unidadeMaterial: string[] = ["UN", "RL", "PC", "MT", "P", "CX", "KIT"]; // Adicionei CX e KIT
    const tensoes: string[] = ["0V", "12V", "24V", "110V", "127V", "220V", "380V", "440V", "660V"]; // Adicionei opções

    // --- Funções de Busca e Lógica (mantendo como estavam, mas com useCallback) ---
    const verifyNull = useCallback((item: any): string => {
        return item == null ? "" : String(item); // Converte para string também
    }, []);

    const formatPrice = useCallback((price: number | null | undefined): string => {
        return price == null ? "" : price.toFixed(2).replace('.', ',');
    }, []);

    const parsePrice = useCallback((priceString: string | undefined): number | undefined => {
        if (priceString === undefined || priceString === null || priceString.trim() === "") return undefined;
        // Permite usar vírgula ou ponto como separador decimal
        const numberValue = parseFloat(priceString.replace(',', '.'));
        return isNaN(numberValue) ? undefined : numberValue;
    }, []);

    const fetchMaterialData = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const material = await getMaterialById(id);
            setCodigoInterno(verifyNull(material.id));
            setUnidade(verifyNull(material.unidade));
            setCodigoFabricante(verifyNull(material.codigoFabricante));
            setCorrente(verifyNull(material.corrente));
            setMarca(verifyNull(material.marca));
            setDescricaoMaterialOriginal(material.descricao); // Guarda original para título
            setDescricao(material.descricao);
            // setOldCategory(verifyNull(material.categoria)); // Categoria não está no form, removi
            setLocalizacao(verifyNull(material.localizacao));
            setPrecoCusto(formatPrice(material.precoCusto));
            setPrecoVenda(formatPrice(material.precoVenda));
            setMarkup(verifyNull(material.markup));
            setTensao(verifyNull(material.tensao));

            if (material.urlImage) {
                const imageDims = await getImageDimensions(material.urlImage);
                setImagem(imageDims);
            } else {
                setImagem(undefined);
            }
        } catch (error) {
            console.error("Erro ao buscar material:", error);
            openSnackbar("Erro ao carregar dados do material.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [verifyNull, formatPrice]); // Inclui dependencies do useCallback

    useEffect(() => {
        if (materialId) {
            fetchMaterialData(materialId);
        }
    }, [materialId, fetchMaterialData]);


    // Cálculo de Markup/Preço Venda (Disparado manualmente ou no submit)
    const calcularMarkup = useCallback(() => {
        const pCusto = parsePrice(precoCusto);
        const pVenda = parsePrice(precoVenda);

        if (pCusto === undefined || pVenda === undefined || pCusto === 0) {
            setMarkup("");
            return;
        }
        const calculatedMarkup = ((pVenda / pCusto) - 1) * 100;
        setMarkup(calculatedMarkup.toFixed(2).replace('.', ','));

    }, [precoCusto, precoVenda, parsePrice]);

    const calcularPrecoVenda = useCallback(() => {
        const pCusto = parsePrice(precoCusto);
        const mkup = parsePrice(markup);

        if (pCusto === undefined || mkup === undefined) {
            // Não calcular se um dos valores estiver faltando ou inválido
            // Poderia limpar precoVenda ou manter o valor atual
            // setPrecoVenda("");
            return;
        }
        const percentage = (mkup / 100) + 1;
        const calculatedVenda = pCusto * percentage;
        setPrecoVenda(calculatedVenda.toFixed(2).replace('.', ','));

    }, [precoCusto, markup, parsePrice]);

    // --- Handlers de Ação ---

    const handleUpdateMaterial = async () => {
        setIsUpdating(true);
        const pc = parsePrice(precoCusto);
        const pv = parsePrice(precoVenda);
        const mk = parsePrice(markup);

        const materialPayload = {
            id: materialId,
            codigoFabricante: codigoFabricante.trim().replace(/\s\s+/g, ' '),
            // categoria: "", // Removido se não está no form
            descricao: descricao.trim().replace(/\s\s+/g, ' '),
            marca: marca.trim().replace(/\s\s+/g, ' '),
            corrente: corrente.trim().replace(/\s\s+/g, ' '),
            unidade: unidade,
            tensao: tensao,
            localizacao: localizacao.trim().replace(/\s\s+/g, ' '),
            precoCusto: pc === undefined ? null : pc, // Envia null se vazio/inválido
            precoVenda: pv === undefined ? null : pv,
            markup: mk === undefined ? null : mk,
            urlImage: imagem?.urlImagem ?? null // Envia URL atual ou null
        };

        try {
            const status = await updateMaterial(materialPayload as IMaterial); // Casting para IMaterial
            if (status === 200) { // Assumindo que updateMaterial retorna status
                openSnackbar("Material Atualizado com sucesso!", "success");
                setTimeout(() => {
                   // Apenas invalida, não redireciona mais automaticamente
                   // route.back(); 
                   fetchMaterialData(materialId); // Refaz o fetch para pegar dados atualizados
                }, 1200);
            } else {
                throw new Error("Falha ao atualizar material.");
            }
        } catch (error) {
            console.error("Erro ao atualizar material:", error);
            openSnackbar("Falha ao atualizar o material.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Lógica de Imagem ---
    const handleImageModalOpen = async (urlImagem: string | undefined) => {
        if (!urlImagem) return;
        try {
             setIsImageProcessing(true); // Indica carregamento da imagem no modal
             const res = await getImageDimensions(urlImagem);
             setImageModalData(res);
             setIsImageModalOpen(true);
        } catch (error) {
            console.error("Erro ao carregar dimensões da imagem:", error);
            openSnackbar("Erro ao carregar imagem.", "error");
        } finally {
            setIsImageProcessing(false);
        }
    };

    const handleDeleteImagemMaterial = async () => {
        if (!imageModalData?.urlImagem) return;
        setIsImageProcessing(true);
        try {
            await deleteImageFromAzure(imageModalData.urlImagem, "materiais-images");

            const materialPayload = {
                id: materialId,
                urlImage: null // Define a URL como null
            };
             // Chama a API para atualizar SÓ a URL da imagem no material
            const status = await updateMaterial(materialPayload as IMaterial);
            if (status === 200) {
                 openSnackbar("Imagem removida com sucesso!", "success");
                 setImagem(undefined); // Limpa a imagem na UI
                 setImageModalData(undefined);
                 setIsImageModalOpen(false); // Fecha o modal
            } else {
                 throw new Error("Falha ao remover URL da imagem do material.");
            }

        } catch (error) {
            console.error("Erro ao deletar imagem:", error);
            openSnackbar("Falha ao remover imagem.", "error");
        } finally {
            setIsImageProcessing(false);
        }
    };

    const readImageFromFile = (file: File): Promise<string> => {
        // (implementação igual à anterior)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          });
    };

    const convertToPng = async (file: File): Promise<File> => {
       // (implementação igual à anterior)
       const options = { maxSizeMb: 3, maxWidthOrHeight: 2000, fileType: 'image/png' };
        return await imageCompression(file, options);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];
        if (!selectedImage) return;

        setIsImageProcessing(true);
        try {
            let imageFile = selectedImage;
            if (selectedImage.type === 'image/jpeg') {
                imageFile = await convertToPng(selectedImage);
            }

            const imageBase64 = await readImageFromFile(imageFile);
            const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name, "materiais-images");

             // Atualiza apenas a URL da imagem no material
            const materialPayload = { id: materialId, urlImage: urlImagem };
            const status = await updateMaterial(materialPayload as IMaterial);

            if (status === 200) {
                openSnackbar("Imagem adicionada ao material!", "success");
                // Rebusca os dados para atualizar a imagem na UI
                fetchMaterialData(materialId);
            } else {
                 throw new Error("Falha ao atualizar a URL da imagem no material.");
                 // Considerar deletar a imagem do Azure se a atualização no DB falhar?
            }

        } catch (error) {
            console.error("Erro no upload/atualização da imagem:", error);
            openSnackbar("Erro ao fazer upload da imagem.", "error");
        } finally {
            setIsImageProcessing(false);
             // Limpa o input de arquivo para permitir selecionar a mesma imagem novamente se necessário
             if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };


    // --- Renderização ---
    if (isLoading) {
        return (
          <Flex justify="center" align="center" className="min-h-screen">
            <Spinner size="lg" />
            <Text ml="2">Carregando dados do material...</Text>
          </Flex>
        );
    }

    return (
        <>
            <Box className="container mx-auto p-4 md:p-6">
                <Link href="/create-material" passHref legacyBehavior>
                     <Button variant="soft" highContrast className="mb-6 inline-flex items-center">
                         <ArrowLeftIcon height="16" width="16" /> Retornar
                     </Button>
                </Link>
                <Heading align="center" size="7" mb="6">
                    Editando {descricaoMaterialOriginal || 'Material'} (ID: {codigoInterno || 'N/A'})
                </Heading>

                <Card variant="surface" size="4">
                    <Flex direction="column" gap="5">
                        {/* Linha 1 */}
                        <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
                             <TextField.Root className="flex-1">
                                <TextField.Slot>Fab.:</TextField.Slot> {/* Label curto */}
                                <TextField.Input
                                value={codigoFabricante} variant='surface' size="3"
                                onChange={(e) => setCodigoFabricante(e.target.value)}
                                placeholder='Código Fabricante'
                                />
                            </TextField.Root>
                             <TextField.Root className="flex-1 md:flex-[2]"> {/* Descrição maior */}
                                <TextField.Slot>Desc.:</TextField.Slot>
                                <TextField.Input
                                value={descricao} variant='surface' size="3"
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder='Descrição do Material' required
                                />
                            </TextField.Root>
                        </Flex>

                        {/* Linha 2 */}
                        <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
                             <TextField.Root className="flex-1">
                                <TextField.Slot>Marca:</TextField.Slot>
                                <TextField.Input
                                value={marca} variant='surface' size="3"
                                onChange={(e) => setMarca(e.target.value)}
                                placeholder='Marca'
                                />
                            </TextField.Root>
                             <TextField.Root className="flex-1">
                                <TextField.Slot>Loc.:</TextField.Slot>
                                <TextField.Input
                                value={localizacao} variant='surface' size="3"
                                onChange={(e) => setLocalizacao(e.target.value)}
                                placeholder='Localização'
                                />
                            </TextField.Root>
                        </Flex>

                        {/* Linha 3 - Preços e Markup */}
                        <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
                             <TextField.Root className="flex-1">
                                 <TextField.Slot>R$</TextField.Slot>
                                <TextField.Input
                                value={precoCusto} variant='surface' size="3"
                                onChange={(e) => setPrecoCusto(e.target.value)}
                                onBlur={calcularMarkup} // Calcula markup ao sair do campo
                                placeholder='Preço Custo' type="text" inputMode="decimal"
                                />
                            </TextField.Root>
                            <TextField.Root className="flex-1">
                                 <TextField.Slot>%</TextField.Slot>
                                <TextField.Input
                                value={markup} variant='surface' size="3"
                                onChange={(e) => setMarkup(e.target.value)}
                                onBlur={calcularPrecoVenda} // Calcula venda ao sair do campo
                                placeholder='Markup' type="text" inputMode="decimal"
                                />
                            </TextField.Root>
                            <TextField.Root className="flex-1">
                                 <TextField.Slot>R$</TextField.Slot>
                                <TextField.Input
                                value={precoVenda} variant='surface' size="3"
                                onChange={(e) => setPrecoVenda(e.target.value)}
                                onBlur={calcularMarkup} // Recalcula markup ao sair
                                placeholder='Preço Venda' type="text" inputMode="decimal"
                                />
                            </TextField.Root>
                        </Flex>

                         {/* Linha 4 - Elétrica e Unidade */}
                         <Flex direction={{ initial: 'column', md: 'row' }} gap="4" align="end"> {/* align="end" para alinhar Selects com Inputs */}
                             <TextField.Root className="flex-1">
                                 <TextField.Slot>Cor.:</TextField.Slot>
                                <TextField.Input
                                value={corrente} variant='surface' size="3"
                                onChange={(e) => setCorrente(e.target.value)}
                                placeholder='Corrente'
                                />
                            </TextField.Root>

                             <Flex direction="column" className="flex-1" gap="1">
                                <Text size="1" color="gray">Tensão</Text>
                                <Select.Root value={tensao} onValueChange={setTensao} size="3">
                                    <Select.Trigger variant="surface" placeholder="Selecione Tensão" />
                                    <Select.Content position="popper">
                                        {tensoes.map((t) => (
                                        <Select.Item key={t} value={t}>{t || 'N/A'}</Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                             </Flex>

                            <Flex direction="column" className="flex-1" gap="1">
                                <Text size="1" color="gray">Unidade*</Text>
                                <Select.Root value={unidade} onValueChange={setUnidade} required size="3">
                                    <Select.Trigger variant="surface" placeholder="Selecione Unidade" />
                                    <Select.Content position="popper">
                                        {unidadeMaterial.map((u) => (
                                        <Select.Item key={u} value={u}>{u}</Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            </Flex>
                         </Flex>

                         {/* Botão Atualizar */}
                         <Flex justify="end" mt="4">
                             <Button
                                size="3"
                                variant='solid'
                                color="blue"
                                onClick={handleUpdateMaterial}
                                disabled={isUpdating || isImageProcessing}
                                className='cursor-pointer'
                              >
                                {isUpdating && <Spinner size="sm" />}
                                Atualizar Material
                              </Button>
                         </Flex>
                    </Flex>
                </Card>
 
                 {/* Seção da Imagem */}
                 {/* <Card variant="surface" size="4" mt="6">
                     <Heading size="4" mb="4">Imagem do Material</Heading>
                     <Flex direction="column" align="center" gap="4">
                         <input
                                type="file"
                                accept="image/png, image/jpeg" // Aceita PNG e JPG
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden" // Esconde o input padrão
                            />
                         <Button
                            variant="soft"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isImageProcessing}
                          >
                            {isImageProcessing && <Spinner size="sm" />}
                            <CameraIcon height="16" width="16" />
                            {imagem ? "Alterar Imagem" : "Subir Imagem"}
                          </Button>

                          {imagem?.urlImagem && !isImageProcessing && (
                              <Box
                                className="relative w-full max-w-xs h-64 bg-gray-100 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleImageModalOpen(imagem.urlImagem)}
                              >
                                <Image
                                    src={imagem.urlImagem}
                                    alt={`Imagem ${descricaoMaterialOriginal}`}
                                    layout="fill"
                                    objectFit="contain" // Contain para ver a imagem inteira
                                />
                              </Box>
                          )}
                           {isImageProcessing && <Spinner label="Processando imagem..."/>}
                     </Flex>
                 </Card>  */}

            </Box>

            {/* Modal de Visualização/Deleção de Imagem (Radix Dialog) */}
            <Dialog.Root open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                     <Dialog.Content className="DialogContent max-w-3xl" style={{ maxWidth: '80vw', width: 'auto' }}> {/* Ajuste de tamanho */}
                         <Dialog.Title className="text-center">{descricaoMaterialOriginal}</Dialog.Title>
                         <Flex direction="column" align="center" justify="center" my="4" className="relative">
                             {imageModalData?.urlImagem ? (
                                <Image
                                    src={imageModalData.urlImagem}
                                    alt={`Imagem ${descricaoMaterialOriginal}`}
                                    width={imageModalData.width || 600} // Default width
                                    height={imageModalData.height || 400} // Default height
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '70vh' }} // Responsividade
                                />
                             ) : (
                                <Spinner size="lg" />
                             )}
                              {/* Botão Download */}
                             {imageModalData?.urlImagem && (
                                 <a
                                     href={imageModalData.urlImagem}
                                     download={`material_${materialId}.png`} // Nome de download
                                     className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100"
                                     aria-label="Baixar Imagem"
                                     title="Baixar Imagem"
                                 >
                                     <DownloadIcon height="18" width="18" />
                                 </a>
                             )}
                         </Flex>

                         <Flex gap="3" mt="4" justify="between">
                             <Button variant="soft" color="red" onClick={handleDeleteImagemMaterial} disabled={isImageProcessing}>
                                {isImageProcessing && <Spinner size="sm" />}
                                 <TrashIcon height="16" width="16" /> Deletar Imagem
                             </Button>
                             <Dialog.Close>
                                 <Button variant="soft" color="gray">Fechar</Button>
                             </Dialog.Close>
                         </Flex>
                          <Dialog.Close >
                             <IconButton variant="ghost" color="gray" className="absolute top-3 right-3" aria-label="Fechar">
                                <Cross2Icon />
                             </IconButton>
                          </Dialog.Close>
                     </Dialog.Content>
                 
            </Dialog.Root>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

