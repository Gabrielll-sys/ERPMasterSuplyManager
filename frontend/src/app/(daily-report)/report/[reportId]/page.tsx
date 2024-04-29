"use client"
import {Link, Button,Autocomplete,Textarea, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import {  Snackbar} from '@mui/material';
import { useRouter } from "next/navigation";

import {Table} from 'flowbite-react';
import React, { useEffect, useRef, useState } from "react";
import "dayjs/locale/pt-br";

import dayjs from 'dayjs';

import {createAtividadeRd, getAllAtivdadesInRd, updateAtividadeRd} from "@/app/services/AtvidadeRd.Service";
import Image from "next/image";
import {uploadImageToAzure} from "@/app/services/Images.Services";
import MuiAlert, {AlertColor} from "@mui/material/Alert";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {getRelatorioDiario} from "@/app/services/RelatorioDiario.Services";
import Atividade from "@/app/componentes/Atividade";



export default function Report({params}:any){
    const route = useRouter()
  const[inputIsEditable,setInputIsEditable] = useState<boolean>(true)
    const [imageModal,setImageModal] = useState<any>()
    const[observacoesRd,setObservacoesRd] = useState<string>("")
    const[contato,setContato] = useState<string>()
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const [atividadesInRd,setAtividadesInRd] = useState<IAtividadeRd[]>([])
    const status : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const [relatorioDiario,setRelatorioDiario] =  useState<IRelatorioDiario | any>()
    const [atividadeRdEditing,setAtividadeRdEditing] = useState<IAtividadeRd>()

    useEffect(() => {

         getRelatorioDiarioById(params.reportId)
         getAtividades(params.reportId)
    }, []);


const getRelatorioDiarioById =async (id:number)=>
    {
        const res = await getRelatorioDiario(id)
        setObservacoesRd(res.observacoes)
        setContato (res.contato)
        setRelatorioDiario(res)
    }
const getAtividades = async(id:number)=>{
    const res = await getAllAtivdadesInRd(id)
    console.log(res)
    setAtividadesInRd(res)
}

const handleCreateaAtividade = async ()=>{

        const atividadeRd:IAtividadeRd = {
            descricao:descricaoAtividade,
            relatorioRdId: relatorioDiario.id,
            relatorioDiario : {}
        }
        const res : any = await createAtividadeRd(atividadeRd)
        if (res){
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Adicionada Ao Relatório");
            await getAtividades(relatorioDiario.id)
        }
}

const updateAtividade  = async(atividade: IAtividadeRd, status: string, observacoes: string)=>{

    const novaAtividade: IAtividadeRd[] = [...atividadesInRd]
    const index = atividadesInRd.findIndex(x=>x.id==atividade.id)

    novaAtividade[index].status =status ;
    novaAtividade[index].observacoes = observacoes;
    console.log(novaAtividade[index])
     const res = await updateAtividadeRd(novaAtividade[index])

    if(res == 200)
    {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Atividade Atualizada");
    }

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
    <h1 className='text-center text-2xl mt-4'>Relatório Diário Nº {relatorioDiario?.id}</h1>
    <div className='flex flex-col gap-4 self-center itens-center justify-center  '>


    <Input
         label = "Contato"
        labelPlacement='outside'
        value={contato}
         isReadOnly={inputIsEditable}
        className="border-1 border-black rounded-md shadow-sm shadow-black  w-[200px]"
        onValueChange={setContato}

      />
        <Textarea
            placeholder="Observaçoes do Relatório Diário"
            className="max-w-[330px] p-3 rounded-base shadow-sm shadow-black"
            rows = {5}
            value={observacoesRd}
            onValueChange = {setObservacoesRd}
        />

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
                <Button

                    variant="solid"
                    onPress={()=>console.log(atividadeRdEditing)}
                    className="w-[120px] self-center bg-blue-300"
                >
                    see
                </Button>

                        {atividadesInRd?.length ?
                            (
                            <>
                                {atividadesInRd.map((atividade:IAtividadeRd)=>(

                                    <Atividade  key={atividade.id} atividade={atividade}onUpdate={updateAtividade} />

                                ))}

                            </>
                        ):(

                        <p>dsa</p>
                        )
                        }






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
