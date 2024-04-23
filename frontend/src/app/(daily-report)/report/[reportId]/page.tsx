"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import {  Snackbar} from '@mui/material';
import { useRouter } from "next/navigation";

import {Table, Textarea} from 'flowbite-react';
import React, { useEffect, useRef, useState } from "react";
import "dayjs/locale/pt-br";

import dayjs from 'dayjs';

import {createAtividadeRd} from "@/app/services/AtvidadeRd.Service";
import Image from "next/image";
import {uploadImageToAzure} from "@/app/services/Images.Services";
import MuiAlert, {AlertColor} from "@mui/material/Alert";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";



export default function Report({params}:any){
    const route = useRouter()
  const[inputIsEditable,setInputIsEditable] = useState<boolean>(true)
    const [imageModal,setImageModal] = useState<any>()
    const[nomeCliente,setNomeCliente] = useState<string>()
    const[emailCliente,setEmailCliente] = useState<string>()
    const[telefone,setTelefone] = useState<string>()
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const status : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);
    let date = dayjs()
    const[checkBoxStatus,setCheckboxStatus] = useState<string>()
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();


const handleCreateaAtividade = async ()=>{

        const atividadeRd:IAtividadeRd = {
            descricao:descricaoAtividade,
            relatorioRdId: 3,
            relatorioDiario : {}
        }
        const res : any = await createAtividadeRd(atividadeRd)
        if (res){
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Adicionada Ao Relatório");
        }
}

const inputsIsEditable = ()=> {

}

    const handleImageChange =  async (event :any) => {
        const selectedImage: File = event.target.files[0];

        const reader = new FileReader();

        reader.onloadend = async () => {
            // O resultado será um Blob representando a imagem
            const imgBlob = reader.result as string;
            // Agora você pode enviar esse Blob para o Azure Blob Storage
          // await uploadImageToAzure(imgBlob,selectedImage.name);
        };
        reader.readAsDataURL(selectedImage);
        if(selectedImage !=undefined){

        setImage(current=>[...current,selectedImage]);
        }
    };


return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center text-2xl mt-4'>Relatório Diário N 20</h1>
    <div className='flex flex-col gap-4 self-center itens-center justify-center  '>


    <Input
         label = "Email Cliente"
        labelPlacement='outside'
        value={emailCliente}
         isReadOnly={inputIsEditable}
        className="border-1 border-black rounded-md shadow-sm shadow-black  w-[200px]"
        onValueChange={setEmailCliente}

      />
        <Textarea
            placeholder="Observaçoes Sobre a Atividade"
            className="max-w-[330px] p-3 rounded-base shadow-sm shadow-black"
            rows = {5}

        />

    </div>

            <div className="flex flex-row gap-4 justify-center ">


            </div>



            <div className="overflow-x-auto flex flex-col self-center max-sm:w-[90%] md:w-[60%]  gap-5   ">
                <Input
                    label = "Atividade"
                    labelPlacement='outside'
                    value={descricaoAtividade}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mx-auto w-[200px]"
                    onValueChange={setDescricaoAtividade}

                />
                <Button  isDisabled={!descricaoAtividade} onPress={handleCreateaAtividade} className='bg-master_black max-sm:w-[50%] md:w-[20%] mx-auto text-white rounded-md font-bold text-base  '>
                    Adicionar Atividade
                </Button>

                <Table  hoverable striped className="w-[100%] ">
                    <Table.Head className="border-1 border-black  text-center p-3 ">
                    <p className="text-base p-3 font-bold">Atividades</p>
                    </Table.Head>

                    <Table.Body className="divide-y">
                            <Table.Row  className=" dark:border-gray-700 dark:bg-gray-800 ">

                                <Table.Cell className="text-left text-black border-1 border-black " >

                                <div className="flex flex-col max-sm:gap-8 md:gap-6">

                                <p className="text-2xl">Realizar ação </p>
                                    <div className = "flex md:flex-row gap-4 max-sm:flex-col ">
                                    <Checkbox color="success"  isSelected={checkBoxStatus=="Não Iniciada"} onValueChange={()=>setCheckboxStatus("Não Iniciada")}>
                                        Não Iniciada
                                    </Checkbox>
                                    <Checkbox color="success"  isSelected={checkBoxStatus=="Em Andamento"} onValueChange={()=>setCheckboxStatus("Em Andamento")}>
                                       Em Andamento
                                    </Checkbox>
                                    <Checkbox color="success"  isSelected={checkBoxStatus=="Concluída"} onValueChange={()=>setCheckboxStatus("Concluída")}>
                                        Concluída
                                    </Checkbox>
                                    </div>

                                    <Textarea

                                        placeholder="Observaçoes Sobre a Atividade"
                                        className="w-full p-3 rounded-base  bg-transparent shadow-sm shadow-black"
                                        rows = {5}


                                    />

                                        <Input className="w-[145px]" accept="image/*" type="file" onChange={handleImageChange} />
                                    <div className=" flex md:flex-row max-sm:flex-col flex-wrap max-sm:items-center gap-4 mx-auto ">

                                        { image &&   image.map((x:File,index:number)=>(
                                    <Button  key={index} className="bg-white h-full hover:-translate-y-2  "  onPress={()=>{onOpenChange(),setImageModal(URL.createObjectURL(x))}}>

                                          <Image  className="my-auto " key={index}  height={150} width={150} src={URL.createObjectURL(x)} alt={"sa"}/>
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
                                        onPress={()=>setInputIsEditable}
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

            </div>

        </div>

        <Snackbar
            open={openSnackBar}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
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
