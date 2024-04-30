"use client"
import {Link, Button,Autocomplete,Textarea, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import {  Snackbar} from '@mui/material';
import { useRouter } from "next/navigation";

import {Table} from 'flowbite-react';
import React, { useEffect, useRef, useState } from "react";
import "dayjs/locale/pt-br";

import dayjs from 'dayjs';

import {createAtividadeRd, getAllAtivdadesInRd} from "@/app/services/AtvidadeRd.Service";
import Image from "next/image";
import {uploadImageToAzure} from "@/app/services/Images.Services";
import MuiAlert, {AlertColor} from "@mui/material/Alert";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {getRelatorioDiario} from "@/app/services/RelatorioDiario.Services";



export default function Atividade({ atividade, onUpdate,onDelete }){
    const route = useRouter()

    const[observacoesRd,setObservacoesRd] = useState<string>("")
    const [imageModal,setImageModal] = useState<any>()
    const[observacoes,setObservacoes] = useState<string>(atividade.observacoes)
    const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const [atividadesInRd,setAtividadesInRd] = useState<IAtividadeRd[]>([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);


    const [atividadeRdEditing,setAtividadeRdEditing] = useState<IAtividadeRd>()

    const handleInputChange = () => {
        onUpdate(atividade, checkboxStatus, observacoes);
         }

     const handleDeleteAtividade = (id:number)=>{
        onDelete(id)
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


            // const res =  await uploadImageToAzure(imgBlob,selectedImage.name);


        if(selectedImage !=undefined){
            const image =  readImageFromFile(selectedImage).then( async (imgBlob)=>{

                await uploadImageToAzure(imgBlob,selectedImage.name)
            })
            setImage(current=>[...current,selectedImage]);
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

                                                            <div className="flex flex-row gap-5">
                                                                <p className="text-2xl"> Nº {atividade.numeroAtividade} - {atividade.descricao} </p>

                                                            </div>


                                                            <div className="flex md:flex-row gap-4 max-sm:flex-col ">
                                                                <Checkbox color="success"


                                                                          isSelected={checkboxStatus == "Não Iniciada"}
                                                                          onValueChange={() => setCheckboxStatus("Não Iniciada")}>
                                                                    Não Iniciada
                                                                </Checkbox>
                                                                <Checkbox

                                                                    color="success"
                                                                    isSelected={checkboxStatus == "Em Andamento"}
                                                                    onValueChange={() => setCheckboxStatus("Em Andamento")}>
                                                                    Em Andamento
                                                                </Checkbox>
                                                                <Checkbox
                                                                    color="success" isSelected={checkboxStatus == "Concluída"}
                                                                    onValueChange={() => setCheckboxStatus("Concluída")}>
                                                                    Concluída
                                                                </Checkbox>
                                                            </div>

                                                            <Textarea

                                                                placeholder="Observaçoes Sobre a Atividade"
                                                                className="w-full p-3 rounded-base  bg-transparent shadow-sm shadow-black"
                                                                rows={5}
                                                                value={observacoes}
                                                                onValueChange={setObservacoes}
                                                            />
                                                            <div className="flex flex-row max-sm:flex-col gap-6 mx-auto">
                                                            <Button
                                                                color="primary"
                                                                variant="ghost"
                                                                onPress={handleInputChange}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Salvar

                                                            </Button>

                                                            <Button
                                                                color="danger"
                                                                variant="ghost"
                                                                onPress={()=>handleDeleteAtividade(atividade.id)}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Deletar Atividade

                                                            </Button>
                                                            </div>
                                                            <Input className="w-[145px]" accept="image/*" type="file"
                                                                   onChange={handleImageChange}/>
                                                            <div
                                                                className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto ">

                                                                {image && image.map((x: File, index: number) => (
                                                                    <Button key={index}
                                                                            className="bg-white h-full hover:-translate-y-2  "
                                                                            onPress={() => {
                                                                                onOpenChange(), setImageModal(URL.createObjectURL(x))
                                                                            }}>

                                                                        <Image className="my-auto " key={index} height={150} width={150}
                                                                               src={URL.createObjectURL(x)} alt={"sa"}/>
                                                                    </Button>
                                                                ))}


                                                            </div>
                                                        </div>
                                                    </Table.Cell>

                                                </Table.Row>

                        </Table.Body>

                    </Table>

    <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalBody className="flex flex-col gap-4 ">
                        <Image
                            width={200} height={200} className= "hover:scale-30 max-sm:mt-1 max-sm:w-full w-[400px] h-[400px] self-center" src={imageModal} alt="" />
                        <p className='text-center font-bold'>
                            Aqui será descricao da imagem
                        </p>
                        <Button
                            color="primary"
                            variant="ghost"
                            onPress={()=>console.log("dfds")}
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
</>

    )



}
