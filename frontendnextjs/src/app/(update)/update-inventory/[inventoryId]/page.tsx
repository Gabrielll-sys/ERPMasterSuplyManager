"use client"

import { Button } from '@nextui-org/react';

import { Snackbar } from '@mui/material';

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
export default function UpdateInventory({params}:any){
    

    //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material

   
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
   
   useEffect(()=>{

   getItemInventory(params.inventoryId).then().catch()
   
   },[])
   
   
    
   const getItemInventory = async (id:number) => {
   
     try{
   
     const res = await axios
       .get(`${url}/Inventarios/buscaCodigoInventario/${id}`)
       .then( (r)=> {
   
        return r.data
        
       })
       .catch();
       setDescricao(res[res.length-1].material.descricao)
       setCategoria(res[res.length-1].material.categoria)
       setCodigoInterno(res[res.length-1].material.id)
       setMovimento(res[res.length-1].saldoFinal==undefined?0:res[res.length-1].saldoFinal)
       setEstoque(res[res.length-1].saldoFinal)
       setDataentrada(res[res.length-1].dataAlteracao)
   
   }
   catch(e){
   
     console.log(e)
   }
   };
   const updateInventario=  async ()=>{
   
   if( !razao){
   
     setOpenSnackBar(true)
     setSeveridadeAlert("warning")
     setMessageAlert("É necessário informar a razão")
   
   }
   else{
   
     // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
   const inventario = {
       razao:razao.trim().replace(/\s\s+/g, ' '),
       saldoFinal:movimento,
       estoque:estoque,
       materialId:codigoInterno,
       material:{}
       }
   
      
   
   try{
   
     const inventarioAtualizado =  await axios.post(`${url}/Inventarios`,inventario)
     .then(r=>
       {
         setOpenSnackBar(true)
         setSeveridadeAlert("success")
         setMessageAlert("Inventário Atualizado com sucesso")
         setStateBotao(true)
         return r.data
   }).catch()
   
   
   
   }
   catch(e){
   
     console.log(e)
   }
   }
   
   }
   
   
     return (
       <>
   

       <>
       <h1 className='text-center font-bold text-2xl mt-16'>Editando inventário de  {descricao} </h1>
       <h1 className='text-center font-bold text-2xl mt-6'>Codigo interno: {codigoInterno} </h1>
   
       </>
     
       <div className=' w-full flex flex-row justify-center mt-12 '>
   
   
       
   
   
       
   
   
       {/* <TextField  disabled={true}   value={categoria} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
       className={updateInventory.inputs} onChange={e=>setCategoria(e.target.value)} label='Categoria' required /> */}
   
       <TextField  disabled={true}  value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
        onChange={e=>setDescricao(e.target.value)} label='Descrição' required />
     
       <TextField    value={razao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
             error={severidadeAlert != "warning" || razao.length ? false : true}
              onChange={e=>setRazao(e.target.value)} label='Razão' required />
   
       <TextField   value={movimento} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
         onChange={(e) => setMovimento(e.target.value)} label='Estoque' required />
   
   
      
   
       
     
    
       
       </div>
  
       <div className='text-center mt-8'>
     <Button  onPress={updateInventario} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl mt-10 '>
       Atualizar Inventário
      </Button>
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