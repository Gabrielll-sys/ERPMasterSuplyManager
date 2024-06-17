"use client"
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';
import MuiAlert from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { Table } from 'flowbite-react';
import { useEffect, useState } from "react";
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
import Image from "next/image";
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { AlertColor, Snackbar } from '@mui/material';
import sizeOf from "image-size";
import { IImageDimensions } from '../interfaces/IImageDimensions';
import dayjs from 'dayjs';
import IconWatch from '../assets/icons/IconWatch';


// @ts-ignore
 const Atividade = ({ atividade,onUpdate,onDelete,isFinished})=>{
    const [imageModal,setImageModal] = useState<IImagemAtividadeRd>()
    const[widthImageModal,setWidthImageModal] = useState<number>(0)
    const[heightImageModal,setheightImageModal] = useState<number>(0)
    const[observacoes,setObservacoes] = useState<string>(atividade.observacoes)
    const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
    const [descricao, setDescricao] = useState(atividade.descricao);
    const[imagesInAtividades,setImagesInAtividades] = useState<IImagemAtividadeRd[]>()
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
   

    useEffect(()=>{

        getImages()



    },[])



const handleImageModal = async(imageModal:IImagemAtividadeRd) =>{

    const res :any = await getImageDimensions(imageModal.urlImagem)
    setWidthImageModal(res.width)
    setheightImageModal(res.height)
    setImageModal(imageModal)
}
const getImages = async()=>{

    const res : IImagemAtividadeRd[]   =  await getAllImagensInAtividade(atividade.id)
    let dimensoesImagem : IImageDimensions;
    console.log(res)

    for(let imagem of res){
      
        const dimensions = await getImageDimensions(imagem.urlImagem)
        imagem.height = dimensions.height
        imagem.width = dimensions.width
    }
    console.log(res)
  
     setImagesInAtividades(res)

}

    const handleInputChange = () => {
        onUpdate(atividade, checkboxStatus, observacoes,descricao);
         }

     const handleDeleteAtividade = (id:number)=>{
        onDelete(id)
     }

     const handleDeleteImagemAtividade = async ()=>
    {

         await deleteImageFromAzure(imageModal?.urlImagem)
         await deleteImagemAtividadeRd(imageModal?.id),
         getImages()
   
     }

    const readImageFromFile = async (file:File): Promise<string> =>  {

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
    }
    const handleImageChange =  async (event :any) => {
        const selectedImage: File = event.target.files[0];

        if(selectedImage !=undefined){
            const image =  readImageFromFile(selectedImage).then( async (imgBlob)=>{

                const urlImagem =  await uploadImageToAzure(imgBlob,selectedImage.name)

                if(urlImagem)
                {
                  const imagemAtividadeRd : IImagemAtividadeRd = {
                  atividadeRdId:atividade.id,
                  descricao:atividade.descricao,
                  urlImagem:urlImagem,  
                  
                }
                    const res = await addImagemAtividadeRd(imagemAtividadeRd)

                    if(res == 200){
                        setOpenSnackBar(true);
                        setSeveridadeAlert("success");
                        setMessageAlert("Imagem Adicionada a atividade");
                        getImages()
                    }

                }

            })
         
        }
    };
    return(


<>


        <Table  hoverable striped className="w-[100%]  ">
            <Table.Head className="border-1 border-black  text-center p-3 ">
                <p className="text-base p-3 font-bold">Atividade</p>
            </Table.Head>
        <Table.Body className="divide-y">

                    <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">

                                                    <Table.Cell className="text-left text-black border-1 border-black " >

                                                        <div className="flex flex-col max-sm:gap-8 md:gap-6">

                                                            <div className="flex flex-col gap-5">
                                                                <p className="md:text-2xl max-sm:text-[20px]"> Nº {atividade.numeroAtividade} - {atividade.descricao} </p>
                                                                <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
                                                                  isReadOnly = {isFinished}
                                                                  value={descricao}
                                                                  onValueChange={setDescricao}
                                                                
                                                                 />
                                                            </div>


                                                            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
                                                                <Checkbox color="success"
                                                                            isReadOnly = {isFinished}

                                                                          isSelected={checkboxStatus == "Não Iniciada"}
                                                                          onValueChange={() => setCheckboxStatus("Não Iniciada")}>
                                                                    Não Iniciada
                                                                </Checkbox>

                                                                <Checkbox
                                                                            isReadOnly = {isFinished}

                                                                    color="success"
                                                                    isSelected={checkboxStatus == "Em Andamento"}
                                                                    onValueChange={() => setCheckboxStatus("Em Andamento")}>
                                                                    Em Andamento
                                                                </Checkbox>

                                                                <Checkbox
                                                                    isReadOnly = {isFinished}
                                                                    color="success" isSelected={checkboxStatus == "Concluída"}
                                                                    onValueChange={() => setCheckboxStatus("Concluída")}>
                                                                    Concluída
                                                                </Checkbox>
                                                            </div>

                                                            <Textarea
                                                                            isReadOnly = {isFinished}

                                                                placeholder="Observaçoes Sobre a Atividade"
                                                                className="w-full p-3 rounded-base  bg-transparent shadow-sm shadow-black"
                                                                rows={5}
                                                                value={observacoes}
                                                                onValueChange={setObservacoes}
                                                            />
                                                            {!isFinished && (
                                                                <>

                                                            <div className="flex flex-row max-sm:flex-col gap-6 mx-auto">
                                                            <Button
                                                                color="primary"
                                                                variant="solid"
                                                                onPress={handleInputChange}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Salvar

                                                            </Button>

                                                            <Button
                                                                color="danger"
                                                                variant="solid"
                                                                onPress={()=>handleDeleteAtividade(atividade.id)}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Deletar Atividade

                                                            </Button>
                                                            </div>
                                                                </>
                                                            )}
                                                            <Input className="w-[145px]" type="file"
                                                                   onChange={handleImageChange}/>
                                                            <div
                                                                className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto max-w-[750px] ">

                                                              
                                                                { imagesInAtividades && imagesInAtividades.map((image: IImagemAtividadeRd)=>(
                                                                 <Button key={image.id}
                                                                 className="bg-white h-full hover:-translate-y-2  "
                                                                 onPress={() => {
                                                                     onOpenChange(), handleImageModal(image)
                                                                 }}>  
                                                               

                                                                <Image  quality={100} className='hover:scale-105 hover:border-3 w-[300px]  hover:border-black' onClick={onOpen} alt='none' height={300} width={300} src={image.urlImagem}/>
                                                        
                                                                </Button>

                                                                ))} 
                                                                
                                                            </div>
                                                        </div>
                                                    </Table.Cell>

                                                </Table.Row>

                        </Table.Body>

                    </Table>

    <Modal isOpen={isOpen } backdrop="blur" size='xl' onOpenChange={onOpenChange} >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalBody  className={` flex flex-col gap-4 w-[${widthImageModal}] h-[${heightImageModal}]`}>
                        { widthImageModal && heightImageModal && (

                        <Image
                            quality={100}
                            width={widthImageModal}
                            height={heightImageModal}
                             className= {`hover:scale-30 max-sm:mt-1 max-sm:w-full  self-center border-1 border-black rounded-md`} src={imageModal?.urlImagem} alt="" />
                        )}
                        <p className='text-center font-bold' >
                            {imageModal?.descricao} 
                        </p>
                        <div className='flex flex-row self-center gap-2'>
                                <IconWatch  height={"1.2em"} width={"1.2em"}/>
                            <p className=' font-bold' >
                                Adicionada as {dayjs(imageModal?.dataAdicao).format("DD/MM/YYYY [as] HH:mm:ss").toString()}
                            </p>
                        </div>
                        <Button
                            color="primary"
                            variant="ghost"
                            onPress={()=>{handleDeleteImagemAtividade(),onClose}}
                            className="w-[120px] self-center"
                        >
                            Excluir item

                        </Button>
                    </ModalBody>
                    <ModalFooter>
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

</>

    )



}
export default Atividade;