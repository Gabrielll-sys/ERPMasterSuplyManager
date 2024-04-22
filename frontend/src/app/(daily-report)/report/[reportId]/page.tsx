"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import {Table, Textarea} from 'flowbite-react';
import React, { useEffect, useRef, useState } from "react";

import "dayjs/locale/pt-br";

import autoTable from 'jspdf-autotable'

import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import {currentUser} from "@/app/services/Auth.services";
import CardImageMiniature from "@/app/componentes/CardImageMiniature";
import IconPen from "@/app/assets/icons/IconPencil";
import {createAtividadeRd} from "@/app/services/AtvidadeRd.Service";
import Image from "next/image";



export default function Report({params}:any){
    const route = useRouter()
  const[inputIsEditable,setInputIsEditable] = useState<boolean>(true)
    const [imageModal,setImageModal] = useState<>()
    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const status : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    let date = dayjs()




const handleCreateaAtividade = async ()=>{

        const atividadeRd = {
            descricao:descricaoAtividade,
        }

        const res = await createAtividadeRd(atividadeRd)

}

const inputsIsEditable = ()=> {

}




return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center text-2xl mt-4'>Relatório Diário N 20</h1>
    <div className='flex flex-col gap-4 '>


    <Input
         label = "Email Cliente"
        labelPlacement='outside'
        value={emailCliente}
         isReadOnly={inputIsEditable}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setEmailCliente}

      />
        <Textarea
            label="Observações sobre a OS"
            placeholder="Observaçoes Sobre a Atividade"
            className="max-w-[330px] p-3 rounded-base shadow-sm shadow-black"
            rows = {5}
            maxRows={7}


        />
        <Button  isDisabled={!nomeCliente} onPress={handleCreateaAtividade} className='bg-master_black max-sm:w-[40%] md:w-[20%] max-sm:self-center text-white rounded-md font-bold text-base shadow-lg  '>
            Adicionar Atividade
        </Button>
    </div>

            <div className="flex flex-row gap-4 justify-center ">
                <Input
                    labelPlacement='outside'
                    value={telefone}
                    className="bg-transparent w-[200px]"
                    isReadOnly={inputIsEditable}
                    onValueChange={setTelefone}
                    placeholder='99283-4235'
                    label="Atividade"
                />



            </div>



            <div className="overflow-x-auto self-center max-sm:w-[90%] md:w-[60%]   mt-5 ml-5 ">
                <Table  hoverable striped className="w-[100%] ">
                    <Table.Head className="border-1 border-black  text-center p-3 ">
                    <p className="text-base p-3 font-bold">Atividades</p>
                    </Table.Head>
                    <Table.Head className="border-1 border-black text-2xl text-center ">
                        <Table.HeadCell className="text-center text-sm border-1 border-black  w-[100px]">Nº</Table.HeadCell>
                        <Table.HeadCell className="text-center border-1 border-black text-sm">Atividade</Table.HeadCell>

                    </Table.Head>
                    <Table.Body className="divide-y">
                            <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">
                                <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
                                    teste
                                </Table.Cell>
                                <Table.Cell className="text-left text-black border-1 border-black " >
                                <div className="flex flex-col max-sm:gap-8 md:gap-4">



                                    <Textarea
                                        label="Observações sobre a OS"
                                        placeholder="Observaçoes Sobre a Atividade"
                                        className="max-w-[370px] p-3 rounded-base shadow-sm shadow-black"
                                        rows = {5}
                                        maxRows={7}


                                    />
                                        <Button
                                            color="primary"
                                            variant="ghost"
                                            onClick={setInputIsEditable}
                                            className="w-[120px]"
                                        >
                                            Excluir item

                                        </Button>
                                    <div className=" flex flex-wrap gap-4 ">
                                    <Button  className="bg-white h-full hover:-translate-y-2" onPress={()=>{onOpenChange(),setImageModal(``)}}>
                                        <CardImageMiniature  />

                                    </Button>
                                        <Input type="file" />

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
                                <ModalBody>
                                    <Image  className= "hover:scale-30 max-sm:mt-1 max-sm:w-full w-[400px] h-[400px] self-center" src={require("@/app/assets/mpw18.jpg")} alt="" />

                                    <p className='text-center font-bold'>
                                       Aqui será descricao da imagem
                                    </p>

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

            </div>

        </div>


     </>
)



}
