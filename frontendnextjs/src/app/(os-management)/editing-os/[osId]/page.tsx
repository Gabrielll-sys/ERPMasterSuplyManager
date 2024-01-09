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
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IItem } from '@/app/interfaces/IItem';

export default function EditingOs({params}:any){
      const route = useRouter()
      const { data: session } = useSession();

      const componentRef: any = useRef();
      const[observacao,setObservacao]= useState<string>()
      const [os,setOs] = useState<IOrderServico>()
      const [descricaoOs,setDescricaoOS] = useState<string>()
      const [participantesOs,setParticipantesOs] = useState<string>()
      const[materiaisOs,setMateriaisOs]= useState<any>([])
      const [materiais,setMateriais]= useState<IInventario[] >([])
      const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [openList,setOpenList] = useState<boolean>(false)
    const[precoCustoTotalOs,setPrecoCustoTotalOs] = useState<number>();
    const[precoVendaTotalOs,setPrecoVendaTotalOs] = useState<number>();
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
      const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
      useEffect(()=>{

      getOs(params.osId)
      getMateriasOs(params.osId)
      getAllMaterial()


     },[])
     
     
      const getOs = async(id:number)=>{
      const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
        console.log(r.data)
       return r.data
       
     })
     setOs(res)
     setDescricaoOS(res.descricao)
     setParticipantesOs(res.resposaveisExecucao)
 
   }
   const getAllMaterial = async()=>{

    const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
     
     return r.data
    
})
    
   setMateriais(materiaisWithInvetory)
  }

   const getMateriasOs = async(id:number)=>{


    //Recebe id da ordem de serviço
        const res = await axios.get(`${url}/Itens/GetAllMateriaisOs/${id}`).then(r=>{
          return r.data
        }).catch(e=>console.log(e))
       
        setPrecoCustoTotalOs(handleCalcCustoTotal(res))
        setPrecoVendaTotalOs(handleCalcVendaTotal(res))
        setMateriaisOs(res)
    
      }
  const handleUpdateOs = async(id:number|undefined)=>{

            const ordemServico = {
              id:os?.id,
              descricaoOs:descricaoOs,
              observacoes:observacao,
              responsavelAutorizacao:session?.user?.name,
              precoTotalEquipamentos:23,


          }
            const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
              return r.data
            }).catch(e=>console.log(e))
            console.log(res)
            setMateriaisOs(res)
        
          }  
const handleAuthorizeOs = async  ()=>{
        const ordemServico = {
            id:os?.id,
            descricaoOs:descricaoOs,
            observacoes:observacao,
            responsavelAutorizacao:session?.user?.name,
            precoTotalEquipamentos:23,


        }

        await axios.put(`${url}/OrdemServicos/updateAuhorize/${params.osId}`,ordemServico)
        getOs(params.osId)
      }



 const handleRemoveMaterial =  async (id:number)=>{

    
        await axios.delete(`${url}/Itens/${id}`).then(r=>{
      
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Removido da Lista da Os");
          getMateriasOs(params.osId)
        }).catch(r=>console.log(r))
        
      
      }

const handleCalcCustoTotal = (itens:any) :number=>{
  let custoTotalOs:number=0;

  for(let item of itens ){

    custoTotalOs+=item.material.precoCusto * item.quantidade

    }
    return custoTotalOs
  }

const handleCalcVendaTotal = (itens:any) :number=>{
  let custoTotalOs:number=0;

  for(let item of itens ){

    custoTotalOs+=item.material.precoVenda * item.quantidade

    }
    return custoTotalOs
}
return (
      <>

      
      <h1 className='text-center mt-8 text-lg'>{os?.descricao}</h1>
   <div className='flex flex-row  justify-between '>
     <div className='flex flex-row  mt-10'>
      <div className='flex flex-col'>
        <Input
        label="Ordem de Serviço"
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[300px] max-h-14"
          onValueChange={setDescricaoOS}
        value={descricaoOs}
        />
        <Input
        label="Resposáveis Execução"
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[300px] max-h-14"
          onValueChange={setParticipantesOs}
        value={participantesOs}
        />
      </div>
     <Textarea
        label="Observações sobre a OS"
        placeholder="Escreva detalhes sobre a execução da OS"
        className="max-w-xl border-1 border-black rounded-xl min-w-[450px] shadow-sm shadow-black"
        minRows={10}
        value={observacao}
        onValueChange={setObservacao}
     
      />
     
     </div>
     <div className='flex flex-col  mt-10 mr-24'>
     <Autocomplete
           label="Material "
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="min-w-[500px]  border-1 border-black rounded-xl shadow-sm shadow-black"
     
     
         >
     
         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material.marca}</p>
              {materiais.includes(item)?<IconBxTrashAlt  onClick={()=>console.log("oii")} />:<IconPlus  onClick={()=>console.log("oii")} />}
     
             </>
             }
             startContent={<p>{item.material.id} -</p>}
              value={item.material.descricao}
              >
              {item.material.descricao}
            </AutocompleteItem>
          ))}
          </Autocomplete>
     {materiaisOs?.map((item:IItem)=>(

      <div  key ={item.id} className=' flex flex-row justify-between '>
        <p className='font-semibold text-sm p-2'>{item.material.descricao}</p>
        <p className='font-semibold text-sm p-2'>{item.quantidade} {item.material.unidade}</p>
  
  
      </div>
      ))}
      <p className='font-semibold text-sm p-2'>Preço de Custo Total:R${precoCustoTotalOs?.toFixed(2).toString().replace('.',",")}</p>
      <p className='font-semibold text-sm p-2'> Preço Venda Total:  R${precoVendaTotalOs?.toFixed(2).toString().replace('.',",")}</p>
     </div>
   </div>
{!os?.isAuthorized ?(

<div className=' flex flex-row justify-center mt-52 gap-8 '>

<Button  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl ' onPress={onOpen}>
                   Autorizar
                  </Button>
<Button  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl ' onPress={()=>handleUpdateOs(os?.id)}>
                   Atualizar OS
    </Button>
</div>
):
<div className=' flex flex-row justify-center mt-52'>
  <Button  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl ' onPress={()=>handleUpdateOs(os?.id)}>
                     Atualizar OS
      </Button>
</div>
}


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
                , pressione o botão AUTORIZAR somente se tiver certeza
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
       
     );
}