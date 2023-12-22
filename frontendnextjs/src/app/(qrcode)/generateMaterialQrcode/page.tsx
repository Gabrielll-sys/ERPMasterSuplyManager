"use client"

import {Link, Button } from '@nextui-org/react';

import { Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";

import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateInventory.module.css";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import QrCodeMaterial from '@/app/componentes/QrCodeMaterial';

export default function UpdateInventory({params}:any){
    

    //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material


  const route = useRouter()
    const [descricao,setDescricao] = useState<string>("")
    const [codigoInterno,setCodigoInterno] = useState<string>("")
    const [razao,setRazao] = useState<string>("Levantamento de Estoque")
    const [movimento,setMovimento] = useState<string>("")
    const[estoque,setEstoque] = useState<number>()
   const [categoria,setCategoria] = useState<string>("")
    const[dataentrada,setDataentrada] = useState<any>()
    const [openSnackBar,setOpenSnackBar]= useState<boolean>(false)
    const [ messageAlert,setMessageAlert] = useState<string>();
    const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
   const[stateBotao,setStateBotao] = useState<boolean>(false)
   
   const [lista,setLista]= useState<any[]>()
   
   useEffect(()=>{
    console.log(estoque)
   },[estoque])
   

  useEffect(()=>{
    
  
      getMaterial()
      // itens.push(`http://192.168.100.216:3000/update-material/${index}`)
      
    

    // setLista(itens)
  },[])

  const getMaterial = async()=>{
    let materiais = []

    for (let index = 1; index <= 90; index++) 
    {
      const material = await axios.get(`${url}/Materiais/${index}`).then(r=>{
       materiais.push(r.data)
        r.data
      }
      )
     
      
      
    }
    setLista(materiais)

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
       <h1 className='text-center font-bold text-2xl mt-16'>Editando inventário de  {descricao} </h1>
       <h1 className='text-center font-bold text-2xl mt-6'>Codigo interno: {codigoInterno} </h1>
   
      
     
       <div className=' w-full flex flex-row justify-center mt-12 '>
   
   
       
   
   <Button  onClick={()=>setLista([])}/>
       
   <Button color='secondary' onClick={()=>setLista([])}>

Clear
   </Button>
     
    
       
       </div>
  
       <div className='flex justify-center mt-8 flex-row flex-wrap gap-12 w-full'>
    {lista?.map(material=>(
  


  
<QrCodeMaterial material={material}/>

    ))}

      

     
      </div>

       <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
       open={openSnackBar} autoHideDuration={2500} onClose={e=>setOpenSnackBar(false)}>
               <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
                {messageAlert}
              </MuiAlert>
              </Snackbar>
          
   
       
      
              </>
       
     );
}