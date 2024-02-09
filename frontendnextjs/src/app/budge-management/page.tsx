"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion } from '@nextui-org/react';
import Excel from 'exceljs';
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
import path from 'path';
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
  const[precoCustoTotalOrcamento,setPrecoCustoTotalOrcamento] = useState<number >();
  const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>()
  const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
  const[nomeOrçamento,setNomeOrçamento] = useState<string>("")
    const[materiaisOrcamento,setMateriaisOrcamento] = useState<IInventario[]>([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
    useEffect(()=>{

        getAllMaterial()
  
  
       },[])
    useEffect(()=>{

      calcPrecoVenda()
      calcPrecoCusto()
    },[materiaisOrcamento])
    const getAllMaterial = async()=>{

        const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
         
         return r.data
        
    })
    for(let i=200; i<250;i++)
      {
            
            setMateriaisOrcamento(current=>[...current,materiaisWithInvetory[i]])
            materiaisWithInvetory[i].quantidadeMaterial=1;
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
      const handleDelete = (material:IInventario) =>{
        const newList: IInventario[]   = materiaisOrcamento.filter(x=>x!=material)

      setMateriaisOrcamento(newList)
      }

      const calcPrecoVenda = () =>{

        let custoTotal:number | undefined = 0

        for(let item of materiaisOrcamento){
          
            custoTotal+=item.material.precoVenda*item.quantidadeMaterial
        

        }
        setPrecoVendaTotalOrcamento(Number(custoTotal.toFixed(2)))
    

      }
      const calcPrecoCusto = () =>{

        let custoTotal:number | undefined = 0

          for(let item of materiaisOrcamento){
              custoTotal+=item.material.precoCusto*item.quantidadeMaterial

          }
          setPrecoCustoTotalOrcamento(Number(custoTotal.toFixed(2)))
          console.log(custoTotal)

      }

      const generatePlanilha = async ()=>{

        const reader = new FileReader();
        reader.readAsArrayBuffer()



    // const workbook : Excel.Workbook = new Excel.Workbook();
    // await  workbook.xlsx.readFile('../planilhas/modelo-planilha-orcamento-cliente.xlsx')
    
  
    // const ws :Excel.Worksheet = workbook.getWorksheet(1)

    // // materiaisOrcamento.forEach((item) => {
    // //   console.log(item)
    // //   let precoCusto = item.material.precoCusto==null?0:item.material.precoCusto.toFixed(2)
    // //   let precoVenda = item.material.precoVenda==null?0:item.material.precoVenda.toFixed(2)
    // //   console.log(precoCusto)
    // //   ws.addRow([item.material.descricao,"R$"+precoCusto,"R$"+precoVenda,item.quantidadeMaterial+" "+item.material.unidade]);
      
    // // });
    // // ws.addRow(["",` Custo Total:R$${precoCustoTotalOrcamento}`,`Venda Total:R$${precoVendaTotalOrcamento}`]);

    // let date = dayjs()
    // ws.getCell('M2').value = 25
  
    // let buffer = await workbook.xlsx.writeBuffer();
    // let blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

    // // Cria um objeto URL a partir do Blob
    // let url = URL.createObjectURL(blob);

    // // Cria um link de download e clica nele
    // console.log(url)
    // let a = document.createElement('a');
    // a.href = url;
    // a.download = `${nomeOrçamento}.xlsx`
    // a.click();
       }
      
return(
    <>
    <div className='flex flex-col  mt-10  justify-center text-center '>
     <Autocomplete
           label="Material"
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="max-w-[600px]  self-center border-1 border-black rounded-xl shadow-sm shadow-black"
         >

         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material.marca}</p>
              { !materiaisOrcamento.includes(item) &&
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
          <div className='flex flex-row justify-between w-[430px]'>
          <Input
        value={nomeOrçamento}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setNomeOrçamento}
        label="Nome Orçamento" 
      />
      <Button 
      isDisabled={!nomeOrçamento?.length}
        className="bg-master_black text-white p-7 rounded-lg font-bold text-lg shadow-lg mt-10 "
      onPress={generatePlanilha}>Gerar Planilha</Button>
      </div>
     </div>
     <div className=''>
        <Accordion className="ml-6">
      <AccordionItem key="1" aria-label="`Materias do Orçamento" subtitle="Pressione para expandir" title={`Materias do Orçamento ${materiaisOrcamento?.length}`}>
        {materiaisOrcamento.map(x=>(
           
           <div className='flex flex-row justify-between w-[800px] '>
            <p className='m-4 max-w-[250px]'>{x.material.id}- {x.material.descricao}</p>
            <p >{x.quantidadeMaterial} {x.material.unidade}</p>
    
  
  <IconBxTrashAlt onClick={()=>handleDelete(x)} />

           </div>
        ))}
      </AccordionItem>
   
    </Accordion>
<div className='flex flex-col ml-8 gap-2'>
  <p className='mt-5 font-bold text-lg'>Preço Custo Total:R$ {precoCustoTotalOrcamento?.toString().replace('.',',')}</p>
  <p  className='mt-5 font-bold  text-lg'>Preço Venda Total:R$ {precoVendaTotalOrcamento?.toString().replace('.',',')}</p>
</div>
     </div>
     <Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}>{isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material.descricao}</DialogTitle>
    <DialogContent >

      <p className='text-center'>
        Estoque: {inventarioDialog?.saldoFinal == 0 || null?0:inventarioDialog?.saldoFinal} {inventarioDialog?.material.unidade} 
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
       
        <Button  onPress={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>
     </>
)



}