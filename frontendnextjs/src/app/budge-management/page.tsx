"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion } from '@nextui-org/react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
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



export default function BudgeManagement({params}:any){
    const route = useRouter()
    const { data: session } = useSession();

    const componentRef: any = useRef();
    const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()

    const [os,setOs] = useState<IOrderServico>()
    const[inventarioDialog,setInventarioDialog] = useState<IInventario>()
 
    const[materiaisOs,setMateriaisOs]= useState<any>([])
    const [materiais,setMateriais]= useState<IInventario[] >([])
    const list:string [] = ["1","2","23","34"]
    const [openDialog,setOpenDialog] = useState<boolean>(false)
  const [openDialogAuthorize,setOpenDialogAuthorize] = useState<boolean>(false)
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [openList,setOpenList] = useState<boolean>(false)
  const[precoCustoTotalOs,setPrecoCustoTotalOs] = useState<number>();
  const[precoVendaTotalOs,setPrecoVendaTotalOs] = useState<number>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>()
  const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
    const[materiaisOrcamento,setMateriaisOrcamento] = useState<IInventario[]>([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    useEffect(()=>{

        getAllMaterial()
  
  
       },[])
    
    const getAllMaterial = async()=>{

        const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
         
         return r.data
        
    })
    for(let i=0; i<100;i++){
            
            setMateriaisOrcamento(current=>[...current,materiaisWithInvetory[i]])

        }    
       setMateriais(materiaisWithInvetory)
      }
      const handleOpenDialog =  (item:any)=>{

        setInventarioDialog(item)
        setOpenDialog(true)
      
      }
      const handleCloseDialog = ()=>{

        if(isEditingOs) setIsEditingOs(false)
      
        setOpenDialog(false)
        setQuantidadeMaterial("")
        setInventarioDialog(undefined)
      }
      const handleAddMaterialOrcamento = (item?:any)=>{

      let a = Object.assign(item)
      let material = {...a,quantidadeMaterial:quantidadeMaterial}
        setMateriaisOrcamento(current =>[...current,material])
        handleCloseDialog()
      }

      const handleUpdateItem = (item?:IInventario) =>{
    

      }
return(
    <>
    <div className='flex flex-col  mt-10  justify-center text-center '>
     <Autocomplete
           label="Material"
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="max-w-[500px]  self-center border-1 border-black rounded-xl shadow-sm shadow-black"
         >

         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material.marca}</p>
              { !materiaisOrcamento.includes(item) &&
              item.saldoFinal!=null && item.saldoFinal>0 &&
              <IconPlus  onClick={()=>handleOpenDialog(item)} />
              }
     
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
       
        <p className=' text-sm mt-1 ml-2 max-w-[400px]' >Adicionado por: {item.responsavelAdicao} {dayjs(item.dataAdicaoItem).format("DD/MM/YYYY [as] HH:mm:ss")}</p>
        <p className=' text-sm mt-1 ml-2' >{item.quantidade} {item.material.unidade}</p>
     </div>

       {!os?.isAuthorized &&(
      <div className=' flex flex-row mt-2  w-14 justify-between '>

      <Button  className="p-0" onPress={()=>{setItemToBeUpdated(item),setIsEditingOs(true),setOpenDialog(true),findInventory(item.material.id)}} >
        <IconPen />
      </Button>
<Button className="p-0" onPress={()=>handleRemoveMaterial(item.id)}>
  
        <IconBxTrashAlt />
</Button>
      </div>
       )}

      <Divider className="bg-black mt-2"/>

      </> 
      ))}
      
     </div>
     <div className=' '>
        <Accordion className="ml-6">
      <AccordionItem key="1" aria-label="`Materias do Orçamento" subtitle="Pressione para expandir" title={`Materias do Orçamento ${materiaisOrcamento?.length}`}>
        {materiaisOrcamento.map(x=>(
           
           <div className='flex flex-row justify-between w-[400px] '>
            <p>{x.material.codigoInterno}- {x.material.descricao}</p>
            <p>{x.quantidadeMaterial} {x.material.unidade}</p>

           </div>
        ))}
      </AccordionItem>
   
    </Accordion>

     </div>
     <Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}>{isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material.descricao}</DialogTitle>
    <DialogContent >

      <p className='text-center'>
        Estoque: {inventarioDialog?.saldoFinal} {inventarioDialog?.material.unidade} 
          </p>
      <div className=' flex flex-row justify-center'>
        <Input
          type='number'
          autoFocus
          className="border-1   border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px] max-h-14"
          endContent={<p>{isEditingOs? itemToBeUpdated?.material.unidade:inventarioDialog?.material.unidade}</p>}
          onValueChange={setQuantidadeMaterial}
        
          value={quantidadeMaterial}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onPress={handleCloseDialog}>Fechar</Button>
       
        <Button isDisabled={inventarioDialog!= undefined && Number(quantidadeMaterial) > inventarioDialog.saldoFinal}  onPress={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>
     </>
)



}