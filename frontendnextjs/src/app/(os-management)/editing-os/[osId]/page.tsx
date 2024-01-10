"use client"

import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider } from '@nextui-org/react';

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
import IconEdit from '@/app/assets/icons/IconEdit';
import IconPen from '@/app/assets/icons/IconPen';
import dayjs from 'dayjs';

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
      const [numeroOs,setNumeroOs]= useState<string>("")
      
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
     setNumeroOs(res.numeroOs)
     setOs(res)
     const description :string = res.descricao
     //Para pegar somente a descricao da os eliminando o numero da os e o numero
     const formatedDescription:string = description.split('-')[2]

     setDescricaoOS(formatedDescription)
     setParticipantesOs(res.responsaveisExecucao)
     setObservacao(res.observacoes)
 
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

    const descricaoOsFormated = descricaoOs?.trim().replace(/\s\s+/g, " ")
    const numeroOsFormated = numeroOs?.trim().replace(/\s\s+/g, " ")

      const ordemServico = {
              id:os?.id,
              numeroOs:numeroOsFormated,
              descricao:descricaoOsFormated,
              responsaveisExecucao:participantesOs,
              observacoes:observacao,

          }
          console.log(ordemServico)
            const res = await axios.put(`${url}/OrdemServicos/${id}`,ordemServico).then(r=>{
              setOpenSnackBar(true);
              setSeveridadeAlert("success");
              setMessageAlert("Ordem de serviço atualizada com sucesso");
              getMateriasOs(params.osId)

              return r.data
            }).catch(e=>console.log(e))
            console.log(res)

          }  
const handleAuthorizeOs = async  ()=>{
        const ordemServico = {
            id:os?.id,
            descricaoOs:descricaoOs,
            observacoes:observacao,
            responsavelAutorizacao:session?.user?.name,
            precoVendaTotalOs:precoVendaTotalOs,
            precoCustoTotalOs:precoCustoTotalOs,


        }

        await axios.put(`${url}/OrdemServicos/updateAuhorize/${params.osId}`,ordemServico)
        getOs(params.osId)
      }



 const handleRemoveMaterial =  async (id:number)=>{

    console.log(id)
        await axios.delete(`${url}/Itens/${id}`).then(r=>{
      
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Removido da Lista da Os");
          getMateriasOs(params.osId)
        }).catch(r=>console.log(r))
        
      
      }
 const handleUpdateItem =  async (item:IItem)=>{
console.log(item)
  //   console.log(id)
  //       const item = {
  //   materialId:item.id,
  //   material:{},
  //   ordemServicoId:idOs.state,
  //   ordemServico:{},
  //   quantidade:quantidadeMaterial,

  // }
// await axios.put(`${url}/Itens/${id}`,item)
        
      
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
     <div className='flex flex-row  mt-10 border-2 border-black  max-h-[350px] shadow-sm shadow-black p-2 ml-4 rounded-md'>
      <div className='flex flex-col'>
      <Input
        label="Numero Os"
        className="border-1 self-center border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px] max-h-14"
        onValueChange={setNumeroOs}
        value={numeroOs}
        />
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
        placeholder={`Escreva detalhes sobre a execução da ${os?.descricao}`}
        className="max-w-xl border-1 border-black rounded-xl min-w-[600px] max-h-[320px]  shadow-sm shadow-black"
        
        maxRows={14}
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
      <>
      <div  key ={item.id} className=' flex flex-row justify-between mt-2 '>
  
        <p className=' text-sm p-1 h-5'>{item.material.id} - {item.material.descricao}</p>

      </div>
     <div className=' flex flex-row justify-between mt-3 '>
       
        <p className=' text-sm mt-1 ml-2 max-w-[400px]' >Adicionado por: {item.responsavel} {dayjs(item.DataAdicaoItem).format("DD/MM/YYYY [as] HH:mm:ss")} </p>
        <p className=' text-sm mt-1 ml-2' >{item.quantidade} {item.material.unidade}</p>
     </div>

       
      <div className=' flex flex-row mt-2 ml-2 w-24 justify-evenly '>

      <IconPen onClick={()=>handleUpdateItem(item)}/>

      <IconBxTrashAlt onClick={()=>handleRemoveMaterial(item.id)}/>
      </div>
      <Divider className="bg-black mt-2"/>

      </> 
      ))}
      <p className='text-base text-center p-2'>Preço de Custo Total:R${precoCustoTotalOs?.toFixed(2).toString().replace('.',",")}</p>
      <p className='text-base text-center p-2'>Preço Venda Total:   R${precoVendaTotalOs?.toFixed(2).toString().replace('.',",")}</p>
     </div>
   </div>
   {!os?.isAuthorized ?(

<div className=' flex flex-row justify-center mt-5  gap-8 '>

<Button  
className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '
disabled={!descricaoOs}
onPress={()=>handleUpdateOs(os?.id)}
 >
                   Atualizar OS
    </Button>
<Button  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl ' onPress={onOpen}>
                   Autorizar
                  </Button>
</div>
):
<div className=' flex flex-row justify-center mt-5 '>
  <Button  
  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '
  disabled={!descricaoOs}
   onPress={()=>handleUpdateOs(os?.id)}>
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
                Após autorizar a {os?.descricao},todos os materiais e suas quantidade serão retirados do estoque e não podera mais incluir ou remover materias da os
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