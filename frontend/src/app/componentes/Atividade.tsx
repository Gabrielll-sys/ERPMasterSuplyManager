"use client"
import { AlertColor, Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import {Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Spinner, Textarea, useDisclosure } from '@nextui-org/react';
import imageCompression from 'browser-image-compression';
import "dayjs/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconArrowDownCircle from '../assets/icons/IconArrowDownCircleFill';
import IconCamera from '../assets/icons/IconCamera';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
import {  AlertDialog, Button, Flex, Text, TextField } from '@radix-ui/themes';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import IconTrash from '../assets/icons/IconTrash';

type AtividadeProps =  {
  relatorioDiario:IRelatorioDiario,
  atividade:IAtividadeRd,
  onUpdate:(atividade: IAtividadeRd , status: string | undefined, observacoes: string | undefined,descricao:string | undefined)=>void,
  onDelete:any,
  isFinished:boolean,
}

const Atividade = ({ relatorioDiario, atividade, onUpdate, onDelete, isFinished }:AtividadeProps) => {
  const [imageModal, setImageModal] = useState<IImagemAtividadeRd>();
  const [widthImageModal, setWidthImageModal] = useState<number>(0);
  const [heightImageModal, setHeightImageModal] = useState<number>(0);
  const [observacoes, setObservacoes] = useState<string | undefined>(atividade.observacoes);
  const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
  const [descricao, setDescricao] = useState(atividade.descricao);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [image, setImage] = useState<File[]>([]);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [blockButton, setBlockButton] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subindoImagem,setSubindoImagem] = useState(false)
  const queryClient = useQueryClient();
  
  const { data: imagesInAtividades, refetch: refetchImagensInAtividadeRd, isFetching } = useQuery({
    queryKey: ['imagesInAtividades', atividade.id],
    queryFn: () => getAllImagensInAtividade(atividade.id),
    enabled: relatorioDiario?.id != undefined,
    staleTime: isFinished ? (1 * 1000 * 60 * 60 * 24) * 20 : 1 * 1000 * 60 * 60 * 8,
    gcTime: isFinished ? (1 * 1000 * 60 * 60 * 24) * 20 : 1 * 1000 * 60 * 60 * 8,
  });

  useEffect(() => {
    if (imagesInAtividades) {
      imagesInAtividades.forEach(async (image:any) => {
        const dimensions = await getImageDimensions(image.urlImagem);
        image.height = dimensions.height;
        image.width = dimensions.width;
      });
    }
  }, [imagesInAtividades]);

  if(isFetching){
    console.log("Esta buscando")
  }
  
  const deleteAtividadeMutation = useMutation({
    mutationFn: (id: number | undefined) => onDelete(id),
    onMutate: () => setBlockButton(true),
    onSuccess: () => setBlockButton(false),
  });

  const addImagemAtividadeMutation = useMutation({
    mutationFn: addImagemAtividadeRd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagesInAtividades', atividade.id] });
      setOpenSnackBar(true);
      setSeveridadeAlert('success');
      setMessageAlert('Imagem adicionada à atividade');
    },
    onError: () => {
      setOpenSnackBar(true);
      setSeveridadeAlert('error');
      setMessageAlert('Erro ao adicionar imagem');
    }
  });

  const deleteImagemAtividadeMutation = useMutation({
    mutationFn: async () => {
      if (imageModal) {
        await deleteImageFromAzure(imageModal.urlImagem, "images");
        await deleteImagemAtividadeRd(imageModal.id);
      }
    },
    onMutate: () => setBlockButton(true),
    onSuccess: () => {
      setBlockButton(false);
      refetchImagensInAtividadeRd();
    },
  });

  const handleImageChange = async (event: any) => {
    const selectedImage: File = event.target.files[0];

    if (selectedImage !== undefined) {
      let imageFile = selectedImage;

      if (selectedImage.type === 'image/jpeg') {
        imageFile = await convertToPng(selectedImage);
      }

      const imageBase64 = await readImageFromFile(imageFile);

      setSubindoImagem(true)
      const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name, "images");

      //@ts-ignore
      addImagemAtividadeMutation.mutate({
        atividadeRdId: atividade.id,
        descricao: atividade.descricao,
        urlImagem: urlImagem,
        imageName: imageFile.name // Passando o nome da imagem diretamente
      });
    }
    setSubindoImagem(false)
  };

  const handleImageModal = async (imageModal: IImagemAtividadeRd) => {
    const res: any = await getImageDimensions(imageModal.urlImagem);
    setWidthImageModal(res.width);
    setHeightImageModal(res.height);
    setImageModal(imageModal);
  };

  const readImageFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertToPng = async (file: File): Promise<File> => {
    const options = {
      maxSizeMb: 3,
      maxWidthOrHeight: 2000,
      fileType: 'image/png',
    };
    return await imageCompression(file, options);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onUpdate(atividade, checkboxStatus, observacoes, descricao);
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-center max-md-text-2xl max-sm:text-[20px] font-bold mb-4 ">ATIVIDADE Nº {atividade.numeroAtividade}</h2>
        <div className="border p-4 rounded-md shadow-sm flex flex-col gap-5  mx-auto">
          <div className="mb-4 ">
            <Flex direction="column" gap={'3'}>
              <Text className=" text-gray-700 font-bold ">{atividade.descricao}</Text>
              {!isFinished && (
                <TextField.Root>
                  <TextField.Input
                    value={descricao}
                    variant='classic'
                    onKeyDown={handleKeyDown}
                    onBlur={() => onUpdate(atividade, checkboxStatus, observacoes, descricao)}
                    onChange={(x) => setDescricao(x.target.value)}
                    placeholder='Descrição'
                  />
                </TextField.Root>
              )}
            </Flex>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-4">Status:</label>
            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
              {relatorioDiario?.isFinished ?(
                <Text className='bg-[#d4edda] text-[#155724] b-l-[#28a745] p-1'>Atividade {atividade.status}</Text>
              ):(
                <>
                <Checkbox
                color="success"
                isReadOnly={isFinished}
                isSelected={checkboxStatus == "Não Iniciada"}
                onValueChange={() => { setCheckboxStatus("Não Iniciada"), onUpdate(atividade, "Não Iniciada", observacoes, descricao) }}
              >
                Não Iniciada
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Em Andamento"}
                onValueChange={() => { setCheckboxStatus("Em Andamento"), onUpdate(atividade, "Em Andamento", observacoes, descricao) }}
              >
                Em Andamento
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Concluída"}
                onValueChange={() => { setCheckboxStatus("Concluída"), onUpdate(atividade, "Concluída", observacoes, descricao) }}
              >
                Concluída
              </Checkbox>
              </>
              )}
            
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-5 text-gray-700">Observações Sobre a Atividade</label>
            {!relatorioDiario?.isFinished ? (
            <Textarea
              placeholder="Observações Sobre a Atividade"
              className="w-full mt-2 p-3 rounded-sm bg-transparent shadow-sm"
              rows={5}
              value={observacoes}
              onValueChange={setObservacoes}
              onBlur={() => onUpdate(atividade, checkboxStatus, observacoes, descricao)}
            />
            ):
            <Text className='mt-7 italic'>{observacoes}</Text>
            }
          </div>

          {!isFinished && (
            <div className="flex max-md:flex-row max-sm:flex-col justify-center items-center mb-4 gap-5">
                <AlertDialog.Root>
                <AlertDialog.Trigger>
                <Button
                  color="crimson"
                  variant="outline"
                  className="hover:opacity-50 text-base"
                 
                >
                 <IconTrash/>
                  Excluir Atividade
                </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title>Excluir Atividade</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    
                  Tem certeza que deseja a atividade? Todas as imagens vinculadas a esta atividades tambem serão apagadas
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="blue">
                        Cancelar
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                    <Button
                           color="crimson"
                  variant="outline"
                        onClick={() => deleteAtividadeMutation.mutate(atividade.id)}
                        className="ml-2"
                       
                      >
                        Deletar Atividade
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
              
            
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md items-center gap-2 hover:bg-blue-700 flex flex-row"
                onClick={() => fileInputRef.current?.click()}
              >
                Subir Imagem
                <IconCamera height="1.4em" width="1.4em" />
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagesInAtividades?.map((image:any) => (
              <div
                key={image.id}
                
                className="relative flex justify-center items-center bg-gray-200 rounded-md shadow-md overflow-hidden"
                style={{
                  width: '100%',
                  height: 250,
                }}
                onClick={() => {
                  onOpenChange(), handleImageModal(image)
                }}
              >
                <Image
                  src={image.urlImagem != undefined ? image.urlImagem : ""}
                  alt={image.descricao != undefined ? image.descricao : ""}
                  layout="responsive"
                  loading='lazy'
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="cursor-pointer"
                />
              </div>
            ))}
            {subindoImagem && (

          <Spinner size='lg'/>
            )}
          </div>
        </div>
        <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex flex-col items-center justify-center relative">
                  {imageModal ? (
                    <Image
                      src={imageModal.urlImagem != undefined ? imageModal.urlImagem : ""}
                      alt="Imagem da Atividade"
                    
                      width={widthImageModal}
                      height={heightImageModal}
                    />
                  ) : (
                    <p>Carregando...</p>
                  )}
                  <a
                    href={imageModal?.urlImagem}
                    download={imageModal?.descricao}
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <IconArrowDownCircle height={"1.4em"} width={"1.4em"} />
                  </a>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-between">
                  {!relatorioDiario?.isFinished && (
                    <Button color="red"  onClick={() => deleteImagemAtividadeMutation.mutate()}>Deletar Imagem</Button>
                  )}
                  <Button color="red" variant="soft" onClick={() => { onClose(), setImageModal(undefined) }}>
                    Fechar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Snackbar
          open={openSnackBar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          autoHideDuration={2000}
          onClose={(e) => setOpenSnackBar(false)}
        >
          <MuiAlert
            onClose={(e) => setOpenSnackBar(false)}
            severity={severidadeAlert}
            sx={{ width: "100%" }}
          >
            {messageAlert}
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
};

export default Atividade;
