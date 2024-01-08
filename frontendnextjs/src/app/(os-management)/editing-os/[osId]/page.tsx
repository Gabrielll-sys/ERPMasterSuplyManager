"use client"

import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal } from '@nextui-org/react';

import { Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";

import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateInventory.module.css";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IMaterial from '@/app/interfaces/IMaterial';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";


import { useReactToPrint } from 'react-to-print';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IFilterMaterial } from '@/app/interfaces/IFilterMaterial';
import { IOrderServico } from '@/app/interfaces/IOrderServico';
import { useSession } from 'next-auth/react';

export default function EditingOs({params}:any){
      const route = useRouter()
      const { data: session } = useSession();

      const componentRef: any = useRef();
      const[observacao,setObservacao]= useState<string>()
      const [os,setOs] = useState<IOrderServico>()
      const [descricaoOs,setDescricaoOS] = useState<string>()
      const[materiaisOs,setMateriaisOs]= useState()
      const {isOpen, onOpen, onOpenChange} = useDisclosure();
     useEffect(()=>{
  
      getOs(params.osId)
      getMateriasOs(params.osId)
     },[])
     
     
      const getOs = async(id:number)=>{
      const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
        console.log(r.data)
       return r.data
       
     })
     setOs(res)
     setDescricaoOS(res.descricao)
 
   }

   const getMateriasOs = async(id:number)=>{
    //Recebe id da ordem de serviço
        const res = await axios.get(`${url}/Itens/GetAllMateriaisOs/${id}`).then(r=>{
          return r.data
        }).catch(e=>console.log(e))
        console.log(res)
        setMateriaisOs(res)
    
      }
      
      const handleAuthorizeOs = async  ()=>{
        const ordemServico = {
            id:os?.id,
            descricaoOs:"sda",
            observacoes:"sda",
            responsavelAutorizacao:session?.user?.name,
            precoTotalEquipamentos:23,


        }

        await axios.put(`${url}/OrdemServicos/updateAuhorize/${params.osId}`,ordemServico)
        getOs(params.osId)
      }


     return (
      <>

      
      <h1 className='text-center mt-10'>{os?.descricao}</h1>
   <div className='flex flex-row justify-center mt-10'>
    <Input
    className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px] max-h-14"
      onValueChange={setDescricaoOS}
    value={descricaoOs}
    />
   <Textarea
      label="Observações sobre a OS"
      placeholder="Escreva detalhes sobre a execução da OS"
      className="max-w-xl border-1 border-black rounded-xl shadow-sm shadow-black"
      minRows={10}
      value={observacao}
      onValueChange={setObservacao}
      
    />
     
   </div>

<div className=' flex flex-row justify-center'>
<Button  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl ' onPress={onOpen}>
                   Autorizar
                  </Button>
</div>
<Modal isOpen={isOpen} size='xl' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h2 className=' text-red-950 font-bold text-center mt-4'> 
                  ATENÇÃO
                </h2>
                <p className='text-center font-bold'>
                Após autorizar a OS {os?.descricao},todos os materiais e suas quantidade serão retirados do estoque e não podera mais incluir ou remover materias da os
                , pressione o botão "Autorizar" somente se tiver certeza
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={handleAuthorizeOs}>
                  Autorizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

   
       

              </>
       
     );
}