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
  const[nomeOrçamento,setNomeOrçamento] = useState<string>()
    const[materiaisOrcamento,setMateriaisOrcamento] = useState<IInventario[]>([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const countries: any[] = [
      { name: 'Cameroon', capital: 'Yaounde', countryCode: 'CM', phoneIndicator: 237 },
      { name: 'France', capital: 'Paris', countryCode: 'FR', phoneIndicator: 33 },
      { name: 'United States', capital: 'Washington, D.C.', countryCode: 'US', phoneIndicator: 1 },
      { name: 'India', capital: 'New Delhi', countryCode: 'IN', phoneIndicator: 91 },
      { name: 'Brazil', capital: 'Brasília', countryCode: 'BR', phoneIndicator: 55 },
      { name: 'Japan', capital: 'Tokyo', countryCode: 'JP', phoneIndicator: 81 },
      { name: 'Australia', capital: 'Canberra', countryCode: 'AUS', phoneIndicator: 61 },
      { name: 'Nigeria', capital: 'Abuja', countryCode: 'NG', phoneIndicator: 234 },
      { name: 'Germany', capital: 'Berlin', countryCode: 'DE', phoneIndicator: 49 },
    ];
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
        

    //     // Cria um novo livro de trabalho
    // let workbook = new Excel.Workbook();
    // // Adiciona uma nova planilha ao livro de trabalho
    // let worksheet = workbook.addWorksheet('Minha Planilha');

    // // Adiciona algumas linhas com dados
    // worksheet.addRow(['ID', 'Nome', 'Email']);
    // worksheet.addRow([1, 'João', 'joao@example.com']);
    // worksheet.addRow([2, 'Maria', 'maria@example.com']);

    // // Salva o livro de trabalho
    // await workbook.xlsx.writeBuffer('MeuArquivo.xlsx');

    // console.log('Planilha criada com sucesso!');
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(nomeOrçamento);
  
    worksheet.columns = [
      { key: 'material', header: 'Material' },
      { key: 'precoCusto', header: 'Preço de Custo' },
      { key: 'precoVenda', header: 'Preço de Venda' },
      { key: 'quantidade', header: 'Quantidade' },
    
    ];
  
    materiaisOrcamento.forEach((item) => {
      console.log(item)
      let precoCusto = item.material.precoCusto==null?0:item.material.precoCusto.toFixed(2)
      let precoVenda = item.material.precoVenda==null?0:item.material.precoVenda.toFixed(2)
      console.log(precoCusto)
      worksheet.addRow([item.material.descricao,"R$"+precoCusto,"R$"+precoVenda,item.quantidadeMaterial+" "+item.material.unidade]);
      
    });
  
    
    let buffer = await workbook.xlsx.writeBuffer();
    let blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

    // Cria um objeto URL a partir do Blob
    let url = URL.createObjectURL(blob);

    // Cria um link de download e clica nele
    console.log(url)
    let a = document.createElement('a');
    a.href = url;
    a.download = `${nomeOrçamento}.xlsx`
    a.click();
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
          <Input
        value={nomeOrçamento}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setNomeOrçamento}
        label="Nome Orçamento" 
      />
     </div>
     <div className=' '>
      <Button onPress={generatePlanilha}>gerar</Button>
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