// "use client"
// import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';
// import MuiAlert from "@mui/material/Alert";
// import "dayjs/locale/pt-br";
// import { Table } from 'flowbite-react';
// import { useEffect, useState } from "react";
// import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
// import Image from "next/image";
// import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
// import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
// import { AlertColor, Snackbar } from '@mui/material';
// import imageCompression from 'browser-image-compression';
// import { IImageDimensions } from '../interfaces/IImageDimensions';
// import dayjs from 'dayjs';
// import IconWatch from '../assets/icons/IconWatch';
// import { useRef } from 'react';
// import IconCamera from '../assets/icons/IconCamera';
// import IconArrowDownCircle from '../assets/icons/IconArrowDownCircleFill';
// // @ts-ignore
//  const Atividade = ({ atividade,onUpdate,onDelete,isFinished})=>{
//     const [imageModal,setImageModal] = useState<IImagemAtividadeRd>()
//     const[widthImageModal,setWidthImageModal] = useState<number>(0)
//     const[heightImageModal,setheightImageModal] = useState<number>(0)
//     const[observacoes,setObservacoes] = useState<string>(atividade.observacoes)
//     const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
//     const [descricao, setDescricao] = useState(atividade.descricao);
//     const[imagesInAtividades,setImagesInAtividades] = useState<IImagemAtividadeRd[]>()
//     const {isOpen, onOpen, onOpenChange} = useDisclosure();
//     const [image,setImage] = useState<File[]>([]);
//     const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
//     const [messageAlert, setMessageAlert] = useState<string>();
//     const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     useEffect(()=>{

//         getImages()



//     },[])



// const handleImageModal = async(imageModal:IImagemAtividadeRd) =>{

//     const res :any = await getImageDimensions(imageModal.urlImagem)
//     setWidthImageModal(res.width)
//     setheightImageModal(res.height)
//     setImageModal(imageModal)
// }
// const getImages = async()=>{

//     const res : IImagemAtividadeRd[]   =  await getAllImagensInAtividade(atividade.id)
//     let dimensoesImagem : IImageDimensions;
   
//     for(let imagem of res){
      
//         const dimensions = await getImageDimensions(imagem.urlImagem)
//         imagem.height = dimensions.height
//         imagem.width = dimensions.width
//     }
   
  
//      setImagesInAtividades(res)

// }

//     const handleInputChange = () => {
//         onUpdate(atividade, checkboxStatus, observacoes,descricao);
//          }

//      const handleDeleteAtividade = (id:number)=>{
//         onDelete(id)
//      }

//      const handleDeleteImagemAtividade = async ()=>
//     {

//          await deleteImageFromAzure(imageModal?.urlImagem)
//          await deleteImagemAtividadeRd(imageModal?.id),
//          getImages()
   
//      }

//      const readImageFromFile = (file: File): Promise<string> => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 resolve(reader.result as string);
//             };
//             reader.onerror = (error) => {
//                 reject(error);
//             };
//             reader.readAsDataURL(file);
//         });
//     };

//     const convertToPng = async (file: File): Promise<File> => {
//         const options = {
//             maxSizeMb: 3,
//             maxWidthOrHeight: 2000,
//             fileType: 'image/png',
//         };
//         return await imageCompression(file, options);
//     };

//     const handleImageChange = async (event: any) => {
//         const selectedImage: File = event.target.files[0];
//         if (selectedImage) {
//             let imageFile = selectedImage;
//             if (selectedImage.type === 'image/jpeg') {
//                 imageFile = await convertToPng(selectedImage);
//             }
//             const imageBase64 = await readImageFromFile(imageFile);
//             const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name);
//             await handleImageUploadResponse(urlImagem);
//             event.target.value = '';  // Reset the input value to allow the same file to be selected again
//         }
//     }
//     const handleImageUploadResponse = async (urlImagem: string) => {
//         const imagemAtividadeRd: IImagemAtividadeRd = {
//             atividadeRdId: atividade.id,
//             descricao: atividade.descricao,
//             urlImagem: urlImagem,
//         };
//         const res = await addImagemAtividadeRd(imagemAtividadeRd);
//         if (res === 200) {
//             setOpenSnackBar(true);
//             setSeveridadeAlert('success');
//             setMessageAlert('Imagem Adicionada a atividade');
//             getImages();
//         }
//     };
  
//     return(


// <>


//         <Table  hoverable striped className="w-[100%]   ">
//             <Table.Head className="border-1 border-black  text-center p-3 rounded-md ">
//                 <p className="text-base p-3 font-bold">Atividade</p>
//             </Table.Head>
//         <Table.Body className="divide-y">

//                     <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">

//                                                     <Table.Cell className="text-left text-black border-1 border-black " >

//                                                         <div className="flex flex-col max-sm:gap-8 md:gap-6">

//                                                             <div className="flex flex-col gap-5">
//                                                                 <p className="md:text-2xl max-sm:text-[20px]"> Nº {atividade.numeroAtividade} - {atividade.descricao} </p>
//                                                                 <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
//                                                                   isReadOnly = {isFinished}
//                                                                   value={descricao}
//                                                                   onValueChange={setDescricao}
                                                                
//                                                                  />
//                                                             </div>


//                                                             <div className="flex md:flex-row gap-4 max-sm:flex-col ">
//                                                                 <Checkbox color="success"
//                                                                             isReadOnly = {isFinished}

//                                                                           isSelected={checkboxStatus == "Não Iniciada"}
//                                                                           onValueChange={() => setCheckboxStatus("Não Iniciada")}>
//                                                                     Não Iniciada
//                                                                 </Checkbox>

//                                                                 <Checkbox
//                                                                             isReadOnly = {isFinished}

//                                                                     color="success"
//                                                                     isSelected={checkboxStatus == "Em Andamento"}
//                                                                     onValueChange={() => setCheckboxStatus("Em Andamento")}>
//                                                                     Em Andamento
//                                                                 </Checkbox>

//                                                                 <Checkbox
//                                                                     isReadOnly = {isFinished}
//                                                                     color="success" isSelected={checkboxStatus == "Concluída"}
//                                                                     onValueChange={() => setCheckboxStatus("Concluída")}>
//                                                                     Concluída
//                                                                 </Checkbox>
//                                                             </div>

//                                                             <Textarea
//                                                                             isReadOnly = {isFinished}

//                                                                 placeholder="Observaçoes Sobre a Atividade"
//                                                                 className="w-full p-3 rounded-base  bg-transparent shadow-sm shadow-black"
//                                                                 rows={5}
//                                                                 value={observacoes}
//                                                                 onValueChange={setObservacoes}
//                                                             />
//                                                             {!isFinished && (
//                                                                 <>

//                                                             <div className="flex flex-row max-sm:flex-col gap-6 mx-auto">
//                                                             <Button
//                                                                 color="primary"
//                                                                 variant="solid"
//                                                                 onPress={handleInputChange}
//                                                                 className="w-[120px] self-center"
//                                                             >
//                                                                 Salvar

//                                                             </Button>

//                                                             <Button
//                                                                 color="danger"
//                                                                 variant="solid"
//                                                                 onPress={()=>handleDeleteAtividade(atividade.id)}
//                                                                 className="w-[120px] self-center"
//                                                             >
//                                                                 Deletar Atividade

//                                                             </Button>
//                                                             </div>
//                                                                 </>
//                                                             )}
//                                                              <div className="flex flex-col items-center my-2">
//                                                             <input
//                                                                 type="file"
//                                                                 ref={fileInputRef}
//                                                                 onChange={handleImageChange}
//                                                                 className="hidden"
//                                                             />
//                                                             <button
//                                                                 className="bg-blue-500 text-white py-2 px-4 rounded-md items-center gap-2  hover:bg-blue-700 flex flex-row"
//                                                                 onClick={() => fileInputRef.current?.click()}
//                                                             >
//                                                                 Subir Imagem
//                                                                 <IconCamera height="1.4em" width="1.4em"/>
//                                                             </button>
//                                                             </div>
//                                                             <div
//                                                                 className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto max-w-[750px] ">

                                                              
//                                                                 { imagesInAtividades && imagesInAtividades.map((image: IImagemAtividadeRd,index:number)=>(
//                                                                     <>
//                                                                  <Button key={image.id}
//                                                                  className="bg-white h-full hover:-translate-y-2  "
//                                                                  onPress={() => {
//                                                                      onOpenChange(), handleImageModal(image)
//                                                                  }}>  
                                                               

//                                                                 <Image key={image.id}  quality={100} className={`hover:scale-105 hover:border-3 w-[300px] ml-auto mr-auto  rounded-md`} onClick={onOpen} alt='none' height={300} width={300} src={image.urlImagem}/>
//                                                                 </Button>
                                                                    
//                                                                     </>
//                                                                 ))} 
                                                                
//                                                             </div>
//                                                         </div>
//                                                     </Table.Cell>

//                                                 </Table.Row>

//                         </Table.Body>

//                     </Table>

//     <Modal isOpen={isOpen } backdrop="blur" size='xl' onOpenChange={onOpenChange} >
//         <ModalContent>
//             {(onClose) => (
//                 <>
//                     <ModalBody  className={` flex flex-col gap-4 w-[${widthImageModal}] h-[${heightImageModal}]`}>
//                         { widthImageModal && heightImageModal && (

//                         <Image
//                             quality={100}
//                             width={widthImageModal}
//                             height={heightImageModal}
//                              className= {`hover:scale-30 max-sm:mt-1 max-sm:w-full  self-center border-1 border-black rounded-md`} src={imageModal?.urlImagem} alt="" />
//                         )}
                   

//                         <p className='text-center font-bold' >
//                             {imageModal?.descricao} 
//                         </p>
//                         <div className='flex flex-row self-center gap-2'>
//                                 <IconWatch  height={"1.2em"} width={"1.2em"}/>
//                             <p className=' font-bold' >
//                                 Adicionada as {dayjs(imageModal?.dataAdicao).format("DD/MM/YYYY [as] HH:mm:ss").toString()}
//                             </p>
//                         </div>
//                         <div className='flex flex-row gap-6 items-center justify-center'>
//                             <Button
//                                 color="primary"
//                                 variant="ghost"
//                                 onPress={()=>{handleDeleteImagemAtividade(),onClose}}
//                                 className="w-[120px] self-center"
//                             >
//                                 Excluir item
//                             </Button>
//                             <a
//                               href={imageModal?.urlImagem}
//                               download={imageModal?.descricao}
                              
//                                     >
      
//                                     <IconArrowDownCircle height={"1.4em"} width={"1.4em"}  />
//                             </a>
//                         </div>
                
                        
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button color="danger" variant="light" onPress={onClose}>
//                             Fechar
//                         </Button>
//                     </ModalFooter>
//                 </>
//             )}
//         </ModalContent>
//     </Modal>

//     <Snackbar
//             open={openSnackBar}
//             anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'center'
//               }}
//             autoHideDuration={2000}
//             onClose={(e) => setOpenSnackBar(false)}
//           >
//             <MuiAlert
//               onClose={(e) => setOpenSnackBar(false)}
//               severity={severidadeAlert}
//               sx={{ width: "100%" }}
//             >
//               {messageAlert}
//             </MuiAlert>
//           </Snackbar>

// </>

//     )



// }
// export default Atividade;
"use client"
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';
import MuiAlert from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { Table } from 'flowbite-react';
import { useEffect, useState, useRef } from "react";
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
import Image from "next/image";
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { AlertColor, Snackbar } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { IImageDimensions } from '../interfaces/IImageDimensions';
import dayjs from 'dayjs';
import IconCamera from '../assets/icons/IconCamera';
import IconArrowDownCircle from '../assets/icons/IconArrowDownCircleFill';

const Atividade = ({ atividade, onUpdate, onDelete, isFinished }) => {
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

  const handleInputChange = () => {
    onUpdate(atividade, checkboxStatus, observacoes, descricao);
  };

  const handleDeleteAtividade = (id: number) => {
    onDelete(id);
  };

  const handleDeleteImagemAtividade = async () => {
    await deleteImageFromAzure(imageModal?.urlImagem);
    await deleteImagemAtividadeRd(imageModal?.id);
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
      const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name);
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

  return (
    <>
      <div className="p-4">
        <h2 className="text-center text-2xl font-bold mb-4">ATIVIDADE</h2>
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block text-gray-700">Nº {atividade.numeroAtividade} - {atividade.descricao}</label>
            <Input
              className='bg-transparent w-full mt-2'
              isReadOnly={isFinished}
              value={descricao}
              onValueChange={setDescricao}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
              <Checkbox color="success"
                isReadOnly={isFinished}
                isSelected={checkboxStatus == "Não Iniciada"}
                onValueChange={() => setCheckboxStatus("Não Iniciada")}>
                Não Iniciada
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Em Andamento"}
                onValueChange={() => setCheckboxStatus("Em Andamento")}>
                Em Andamento
              </Checkbox>
              <Checkbox
                isReadOnly={isFinished}
                color="success"
                isSelected={checkboxStatus == "Concluída"}
                onValueChange={() => setCheckboxStatus("Concluída")}>
                Concluída
              </Checkbox>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Observações Sobre a Atividade:</label>
            <Textarea
              isReadOnly={isFinished}
              placeholder="Observações Sobre a Atividade"
              className="w-full mt-2 p-3 rounded-base bg-transparent shadow-sm"
              rows={5}
              value={observacoes}
              onValueChange={setObservacoes}
            />
          </div>

          <div className="flex justify-center items-center mb-4">
            <Button
              color="primary"
              variant="solid"
              onPress={handleInputChange}
              className="mr-2"
            >
              Salvar
            </Button>
            <Button
              color="danger"
              variant="solid"
              onPress={() => handleDeleteAtividade(atividade.id)}
              className="ml-2"
            >
              Deletar Atividade
            </Button>
          </div>

          <div className="flex justify-center items-center mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagesInAtividades?.map((image) => (
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
                  src={image.urlImagem}
                  alt={image.descricao}
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
                  src={imageModal?.urlImagem}
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
              <Button color="danger" onPress={handleDeleteImagemAtividade}>Deletar Imagem</Button>
              <Button color="danger" variant="light" onPress={onClose}>
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

