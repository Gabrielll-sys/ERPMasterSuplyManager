"use client"

import {Link, Button,Autocomplete, AutocompleteItem, Input, Spinner } from '@nextui-org/react';

import { Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
import { IInventario } from '@/app/interfaces/IInventarios';

export default function MaterialRelatory(params:any){
   
    const route = useRouter()
   const componentRef: any = useRef();
   const [loadingMateriais,setLoadingMateriais] = useState<boolean>(false)  

  const [descricao,setDescricao] = useState<string>()
  const [marca,setMarca] = useState<string>()
  const [precoVendaMin,setPrecoVendaMin] = useState<string>()
  const [precoVendaMax,setPrecoVendaMax] = useState<string>()
  const [precoCustoMin,setPrecoCustoMin] = useState<string>()
  const [precoCustoMax,setPrecoCustoMax] = useState<string>()
  const[materiaisFiltros,setMateriaisFiltro] = useState<IInventario[]>()
  const filtrosProntos = ["Materias com maior quantidade em estoque","Materias com maior taxa de saída","Materiais com menor taxa de saída"]

 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Visitor Pass',
  onAfterPrint: () => console.log('Printed PDF successfully!'),
 });

 const verifyNumberIsEmpty = (item:string | undefined)=>{
 
  return !item?.length ? null: Number(item?.replace(',','.')).toFixed(2)

}

const generateRelatory = async()=>{
  setLoadingMateriais(true)

const filtro  = {
    descricao: descricao,
    marca: marca,
    precoVendaMin:verifyNumberIsEmpty(precoVendaMin),
    precoVendaMax:verifyNumberIsEmpty(precoVendaMax),
    precoCustoMin:verifyNumberIsEmpty(precoCustoMin),
    precoCustoMax:verifyNumberIsEmpty(precoCustoMax),



}

  const materiaisFiltrados = await axios
  .post(`${url}/Inventarios/filter-material`,filtro)
  .then((r) : IInventario [] => {
    console.log(r.data)
    return  r.data
  })
  setLoadingMateriais(false)

  setMateriaisFiltro(materiaisFiltrados)
}

    


     return (
      <>

       
       <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Retornar
      </Link>
       <h1 className='text-center font-bold text-2xl mt-4'>Filtragem de Materiais</h1>

   
      
     <div className=' w-full flex flex-row justify-center mt-12 gap-6 items-center '>

     <Input
       
          label="Descricao do Material"
          className="w-[400px] border-1 border-black rounded-xl shadow-sm shadow-black"
          placeholder="Ex:Inversor Frequência"
          labelPlacement="outside"
          value={descricao}
          onValueChange={setDescricao}
         
        />
     <Input
          label="Marca"
          className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black"
          placeholder="Ex: WEG"
          labelPlacement="outside"
          value={marca}
          onValueChange={setMarca}
         
        />
  

     </div>

       <div className=' w-full flex flex-row justify-center mt-12 gap-4 items-center '>
   
       <Input
          type="number"
          label="Preço custo min"
          className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black"
          value={precoCustoMin}
          onValueChange={setPrecoCustoMin}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />

    <Input
          type="number"
          label="Preço custo max"
          className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black"
          placeholder="0,00"
          labelPlacement="outside"
          value={precoCustoMax}
          onValueChange={setPrecoCustoMax}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
     
       <Input
          type="number"
          label="Preço venda min"
          className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black"
          placeholder="0,00" 
          value={precoVendaMin}
          onValueChange={setPrecoVendaMin}
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
     <Input
          type="number"
          label="Preço venda max"
          className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black"
          value={precoVendaMax}
       
          onValueChange={setPrecoVendaMax}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
   
 
    
       
      
      </div>

   <div className='flex flex-row justify-center mt-10'>
     <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>generateRelatory()}>
     Filtrar
     </Button>
     <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>handlePrint()}>
   Imprimir
     </Button>
   </div>

   <div className='mt-16 flex '  ref={componentRef}>
      

       { materiaisFiltros!=undefined && materiaisFiltros.length>0?
       <>
       <TableContainer   sx={{ overflow:"hidden"  }} component={Paper} >
       <Table
       stickyHeader
         sx={{ width: "100vw" }}
         aria-label="simple table"
       >
         <TableHead>
           <TableRow >

             <TableCell
              align="center"
              className="text-base border-1 max-w-[70px]    ">Cod.Interno</TableCell>
             <TableCell align="center"
             className="text-base border-1  ">Cod.Fabricante</TableCell>
             <TableCell align="center"
             className="text-base border-1  ">Descrição</TableCell>
             <TableCell align="center"
              className="text-base border-1  ">Marca</TableCell>
             <TableCell align="center"
              className="text-base border-1  ">Tensão</TableCell>

             <TableCell align="center"
             className="text-base border-1 max-w-[90px]  ">Estoque</TableCell>

             <TableCell align="center"
             className="text-base  border-1  ">Localização</TableCell>
             <TableCell align="center"
             className="text-base  min-w-[120px] border-1  ">Preço Custo</TableCell>
             <TableCell align="center"
             className="text-base min-w-[120px] border-1  ">Preço venda</TableCell>
              <TableCell align="center" className="text-xl min-w-[140px] border-1 ">Preço Total</TableCell> 
             
           </TableRow>
         </TableHead>
         <TableBody>
           {  materiaisFiltros!=undefined && materiaisFiltros.length>=1 && materiaisFiltros?.map((row:IInventario) => (
             <TableRow
               key={row.material.id}
              className=""
             >
           
          
               <TableCell 
               
               align="center"
               className="text-base border-[0.2px]  "
               >{row.material.id}</TableCell>
               <TableCell align="center" className="text-base border-1  max-w-[150px] ">{row.material.codigoFabricante}</TableCell>
               <TableCell align="center" className="text-sm border-1  " >{row.material.descricao}</TableCell>
               <TableCell align="center" className="text-base border-1  ">{row.material.marca}</TableCell>
               <TableCell align="center" size ="small" className="text-base border-1  ">{row.material.tensao}</TableCell>

               <TableCell align="center" size ="small"
               className="text-base border-1  ">{row.saldoFinal==null?"Não registrado":row.saldoFinal +" "+row.material.unidade}</TableCell>
               <TableCell align="center" size ="small"
               className="text-base border-1  ">{row.material.localizacao}</TableCell>
               <TableCell align="center" size ="small"
               className="text-base border-1  ">{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</TableCell>
               <TableCell align="center" size ="small"
               className="text-base border-1  ">{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}</TableCell>
               <TableCell align="center" size ="small"
               className="text-base border-1  ">{row.material.precoVenda==null ?"Sem registro":"R$ "+((row?.material?.precoCusto) * (row.saldoFinal)).toFixed(2).toString().replace(".",",")}</TableCell>
               
         
              
             </TableRow>
           ))}
            
         </TableBody>
   
 
       </Table>
     </TableContainer>
     </>
     :  
          loadingMateriais &&(

            <div className="w-full flex flex-row justify-center mt-16">
              <Spinner size="lg"/>
            </div>
          )
          }
          </div>
          
              </>
       
     );
}