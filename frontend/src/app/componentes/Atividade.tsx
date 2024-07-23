
"use client"
import { AlertColor, Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';
import imageCompression from 'browser-image-compression';
import "dayjs/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconArrowDownCircle from '../assets/icons/IconArrowDownCircleFill';
import IconCamera from '../assets/icons/IconCamera';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
import { Box, Flex, TextField } from '@radix-ui/themes';


//@ts-ignore
const Atividade = ({ relatorioDiario, atividade, onUpdate, onDelete, isFinished}) => {
  const [imageModal, setImageModal] = useState<IImagemAtividadeRd>();
  const [widthImageModal, setWidthImageModal] = useState<number>(0);
  const [heightImageModal, setHeightImageModal] = useState<number>(0);
  const [observacoes, setObservacoes] = useState<string>(atividade.observacoes);
  const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
  const [descricao, setDescricao] = useState(atividade.descricao);
  const [imagesInAtividades, setImagesInAtividades] = useState<IImagemAtividadeRd[]>();
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [image, setImage] = useState<File[]>([]);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const[blockButton,setBlockButton] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    getImages();
  }, []);

  const handleImageModal = async (imageModal: IImagemAtividadeRd) => {
    const res: any = await getImageDimensions(imageModal.urlImagem);
    setWidthImageModal(res.width);
    setHeightImageModal(res.height);
    setImageModal(imageModal);
  };

  const getImages = async () => {
    const res: IImagemAtividadeRd[] = await getAllImagensInAtividade(atividade.id);
    for (let imagem of res) {
      const dimensions = await getImageDimensions(imagem.urlImagem);
      imagem.height = dimensions.height;
      imagem.width = dimensions.width;
    }
    setImagesInAtividades(res);
  };

 
  const handleDeleteAtividade = (id: number) => {
    setBlockButton(true)

    setTimeout(()=>{

    },6000)
    onDelete(id);
  };

  const handleDeleteImagemAtividade = async () => {

    setBlockButton(true)
    await deleteImageFromAzure(imageModal?.urlImagem,"images");
    await deleteImagemAtividadeRd(imageModal?.id);

    setTimeout(()=>{
      setBlockButton(false)
    },2000)

    getImages();
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

  const handleImageChange = async (event: any) => {
    const selectedImage: File = event.target.files[0];

    if (selectedImage !== undefined) {
      let imageFile = selectedImage;

      if (selectedImage.type === 'image/jpeg') {
        imageFile = await convertToPng(selectedImage);
      }
      
      
      const imageBase64 = await readImageFromFile(imageFile);
      const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name,"images");

      await handleImageUploadResponse(urlImagem);
    }
  };

  const handleImageUploadResponse = async (urlImagem: string) => {
    const imagemAtividadeRd: IImagemAtividadeRd = {
      atividadeRdId: atividade.id,
      descricao: atividade.descricao,
      urlImagem: urlImagem,
    };
    const res = await addImagemAtividadeRd(imagemAtividadeRd);

    if (res === 200) {
      setOpenSnackBar(true);
      setSeveridadeAlert('success');
      setMessageAlert('Imagem Adicionada a atividade');
      getImages();
    }
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
        <div className="border p-4 rounded-md shadow-sm flex flex-col gap-5">
          <div className="mb-4">

            <Flex direction="column" gap={'3'} >
              <label className="block text-gray-700 ">{atividade.descricao}</label>
              {!isFinished && (
              
                 <TextField.Root   >
                    <TextField.Input
              
                    value={descricao}
              
                    variant='classic'
                    onKeyDown={handleKeyDown}
                    onBlur={()=>onUpdate(atividade, checkboxStatus, observacoes, descricao)}
                    onChange={(x)=>setDescricao(x.target.value)}
                    placeholder='Descrição'>
                    </TextField.Input>
                    </TextField.Root>
              )}
            </Flex>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-4 ml-2">Status:</label>
            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
              <Checkbox color="success"
                isReadOnly={isFinished}
                isSelected={checkboxStatus == "Não Iniciada"}
                onValueChange={() =>{setCheckboxStatus("Não Iniciada"),onUpdate(atividade, "Não Iniciada", observacoes, descricao)}}>
                Não Iniciada
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Em Andamento"}
                onValueChange={() =>{setCheckboxStatus("Em Andamento"),onUpdate(atividade, "Em Andamento", observacoes, descricao)}}>
                Em Andamento
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Concluída"}
                onValueChange={() =>{setCheckboxStatus("Concluída"),onUpdate(atividade, "Concluída", observacoes, descricao)}}>
                Concluída
              </Checkbox>
            </div>
          </div>  

          <div className="mb-4">
            <label className="block text-gray-700">Observações Sobre a Atividade:</label>
            <Textarea
              isDisabled={isFinished}
              placeholder="Observações Sobre a Atividade"
              className="w-full mt-2 p-3 rounded-sm bg-transparent shadow-sm"
              rows={5}
              value={observacoes}
              onValueChange={setObservacoes}
              onBlur={()=>onUpdate(atividade, checkboxStatus, observacoes, descricao)}
            />
          </div>


      {!isFinished && (

          <div className="flex flex-col justify-center items-center mb-4 gap-5">
          
            <Button
              color="danger"
              variant="solid"
              onPress={() => handleDeleteAtividade(atividade.id)}
              className="ml-2"
              isDisabled={blockButton}
            >
              Deletar Atividade
            </Button>
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
            { imagesInAtividades?.map((image) => (
              <div
                key={image.id}
                className="relative flex justify-center items-center bg-gray-200 rounded-lg shadow-md overflow-hidden"
                style={{
                  width: '100%',
                  height: 250,
                }}
                onClick={() => {
                    onOpenChange(), handleImageModal(image)
                    }}
              >
              
                <Image
                  src={ image.urlImagem != undefined ?image.urlImagem:""}
                  alt={image.descricao != undefined ?image.descricao:""}
                  layout="fill"
                  objectFit="cover"
                  className="cursor-pointer"
                
                />
                
              </div>
            ))}
          </div>
        </div>
        <Modal isOpen={isOpen } backdrop="blur" size='xl' onOpenChange={onOpenChange} >
          <ModalContent>
          {(onClose) => (
                 <>
            <ModalBody className="flex flex-col items-center justify-center relative">
              {imageModal ? (
                <Image
                  src={imageModal.urlImagem != undefined ?imageModal.urlImagem:""}
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
      
                                     <IconArrowDownCircle height={"1.4em"} width={"1.4em"}  />
                             </a>
             
            </ModalBody>
            <ModalFooter className="flex flex-row justify-between">
              {!relatorioDiario?.isFinished && (
                
              <Button color="danger" isDisabled={blockButton} onPress={handleDeleteImagemAtividade}>Deletar Imagem</Button>
              )}
              <Button color="danger" variant="light" onPress={()=>{onClose(),setImageModal(undefined)}}>
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

