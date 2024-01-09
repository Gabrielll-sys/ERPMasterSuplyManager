"use client"

import {Link, Button,Autocomplete, AutocompleteItem } from '@nextui-org/react';

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
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import QrCodeMaterial from '@/app/componentes/QrCodeMaterial';
import IconQrCode from '@/app/assets/icons/IconQrCode';
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import { useReactToPrint } from 'react-to-print';

export default function UpdateInventory({params}:any){
    type Inventario = {
      id: number,
      codigoInterno: string,
      codigoFabricante: string,
      categoria: string,
      descricao: string,
      marca: string,
      corrente: string,
      unidade: string,
      tensao: string,
      localizacao: string,
      dataEntradaNF: any,
      precoCusto: number,
      markup: number,
      precoVenda: number
      material:{
        id:string | number,
        categoria?: string
        codigoFabricante?: string
        codigoInterno?:number
        corrente?:string,
        dataEntradaNF? : any,
        descricao?: string,
        localizacao?: string,
        marca?: number,
        markup?: number ,
        precoCusto?: number,
        precoVenda?: number,
        tensao?: string,
        unidade?: string
        

      }
    }

  

    //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material


  const route = useRouter()
    const [qrCodes,setQrcodes] = useState<Inventario[]>([])
    const [ messageAlert,setMessageAlert] = useState<string>();
    const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
   const[stateBotao,setStateBotao] = useState<any>()
   
   const [materiais,setMateriais]= useState<Inventario[] >([])
   const [listQrCodes,setListQrCodes]= useState<Inventario[] >([])
   const componentRef: any = useRef();

 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Visitor Pass',
  onAfterPrint: () => console.log('Printed PDF successfully!'),
 });
   

  useEffect(()=>{
    
      getAllMaterial()
   
      
  },[])

  useEffect(()=>{
    
},[listQrCodes])
  const getAllMaterial = async()=>{

      const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
       
       return r.data
      
  })
      
     setMateriais(materiaisWithInvetory)
    }
    const onInputChange = (value:any) => {

        console.log(materiais.includes(value))
      setStateBotao(value)
    };
    const createQrcode = (material:Inventario)=>
    {
      setQrcodes(current=>[...current,material])
      console.log(qrCodes.includes(material))


    }
    const deleteQrcode = (material:Inventario)=>
    {

      const newList: Inventario[]   = qrCodes.filter(x=>x!=material)

      setQrcodes(newList)


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
       <h1 className='text-center font-bold text-2xl mt-16'>Geração QrCode para Materiais </h1>

   
      
     
       <div className=' w-full flex flex-row justify-center mt-12 '>
   
   
         <Autocomplete
         label="Material "
         isDisabled={!materiais}
         isLoading={!materiais.length}
         placeholder="Procure um material"
         className="max-w-2xl  border-1 border-black rounded-xl shadow-sm shadow-black"
         onInputChange={onInputChange}
         value={stateBotao}


         
       >
       
       {materiais.map((item:Inventario) => (
        
          <AutocompleteItem
           key={item.id} 
           aria-label='teste'
           endContent={
           <>
       
           <p className='text-xs'>{item.material.marca}</p>

            {qrCodes.includes(item)?<IconBxTrashAlt onClick={()=>deleteQrcode(item)} />:<IconQrCode onClick={()=>createQrcode(item)} />}
           
           </>
           }
           startContent={<p>{item.material.id}-</p>}
            value={item.material.descricao}
            >
            {item.material.descricao}
          </AutocompleteItem>
        ))}
        </Autocomplete>
   
 
       
   <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>setQrcodes([])}>
Limpar
   </Button>
   <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>handlePrint()}>
Imprimir
   </Button>
     
    
       
       </div>
  
       <div className='flex justify-center mt-12 flex-row flex-wrap gap-12 w-full  ' ref={componentRef}>
    {qrCodes?.map((material:Inventario)=>(
  <div key={material.id} className='flex flex-row'>

<QrCodeMaterial  material={material}/>
<IconBxTrashAlt onClick={()=>deleteQrcode(material)} />
</div>
    ))}

      
      </div>


   
       

              </>
       
     );
}