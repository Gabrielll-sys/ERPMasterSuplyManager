"use client"

import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea } from '@nextui-org/react';

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

export default function EditingOs(params:any){
      const route = useRouter()

      const componentRef: any = useRef();
      const[observacao,setObservacao]= useState<string>()
      const [os,setOs] = useState<any>("")

   const getOs = async(id:number)=>{
    
      const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
       return r.data
       
     })
     setOs(res)

 
   }
     return (
      <>

       
    
 
    
      
   <div className='flex flex-row justify-center mt-10'>
   <Textarea
      label="Observações sobre a OS"
      placeholder="Escreva detalhes sobre a execução da OS"
      className="max-w-xl border-1 border-black rounded-xl shadow-sm shadow-black"
      minRows={10}
      value={observacao}
      onValueChange={setObservacao}
      
    />
     
   </div>


   
       

              </>
       
     );
}