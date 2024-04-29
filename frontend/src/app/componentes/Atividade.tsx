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



export default function Atividade({ atividade, onUpdate }){
    const route = useRouter()

    const[observacoesRd,setObservacoesRd] = useState<string>("")
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

    return(

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
                                                                {/*<Button*/}
                                                                {/*    color="primary"*/}
                                                                {/*    variant="solid"*/}
                                                                {/*    onPress={()=>setAtividadeRdEditing(atividade)}*/}
                                                                {/*    className="w-[120px] self-center"*/}
                                                                {/*>*/}
                                                                {/*    Editar*/}

                                                                {/*</Button>*/}
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
                                                            <Button
                                                                color="primary"
                                                                variant="ghost"
                                                                onPress={handleInputChange}
                                                                className="w-[120px] self-center"
                                                            >
                                                                Salvar

                                                            </Button>
                                                            {/*<Input className="w-[145px]" accept="image/*" type="file"*/}
                                                            {/*       onChange={handleImageChange}/>*/}
                                                            <div
                                                                className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto ">

                                                                {/*{image && image.map((x: File, index: number) => (*/}
                                                                {/*    <Button key={index}*/}
                                                                {/*            className="bg-white h-full hover:-translate-y-2  "*/}
                                                                {/*            onPress={() => {*/}
                                                                {/*                onOpenChange(), setImageModal(URL.createObjectURL(x))*/}
                                                                {/*            }}>*/}

                                                                {/*        <Image className="my-auto " key={index} height={150} width={150}*/}
                                                                {/*               src={URL.createObjectURL(x)} alt={"sa"}/>*/}
                                                                {/*    </Button>*/}
                                                                {/*))}*/}


                                                            </div>
                                                        </div>
                                                    </Table.Cell>

                                                </Table.Row>

                        </Table.Body>

                    </Table>

    )



}
