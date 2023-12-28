"use client"
import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";


import { InputAdornment, Snackbar } from '@mui/material';

import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "@/app/api/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { IInventario } from "@/app/interfaces/IInventarios";
import { IOrderServico } from "@/app/interfaces/IOrderServico";

export default function UpdateMaterial({params}:any){
  const route = useRouter()

  const[ordemServicos,setOrdemServicos] = useState<IOrderServico[]>([])
  const [descricao,setDescricao] = useState<string>("")
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState<string>("")
  const [marca,setMarca] = useState<string>("")
  const [ tensao,setTensao] = useState<string>("")
  const [corrente,setCorrente] = useState<string>("")
  const [localizacao,setLocalizacao] = useState<string>("")
  const [unidade,setUnidade] = useState<string>("")
  const[quantidade,setQuantidade] = useState<string>(1)
  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
 
  const[oldCategory,setOldCategory]= useState<string>("")
  const [materiais, setMateriais] = useState<any>([]);


  const unidadeMaterial: string[] = ["UN","RL","PC","MT","P"]
  const tensoes : string[] = ["","12V","24V","127V","220V","380V","440V","660V"]
 
 
 
 useEffect(()=>{
 
    console.log(params.materialId)
    getMaterial(params.materialId).then().catch()
     getAllOs()

 },[])

const getAllOs = async()=>{

const res = await axios.get(`${url}/OrdemServicos`).then((r:any)=>{
  setOrdemServicos(r.data)
})

}
 




 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }

  const getMaterial = async(id:number)=>{
 
  axios.get(`${url}/Materiais/${id}`).then(r=>{

 setCodigoInterno(r.data.id)
 setUnidade(verifyNull(r.data.unidade))
 setCodigoFabricante(verifyNull(r.data.codigoFabricante))
 setCorrente(verifyNull(r.data.corrente))
 setMarca(verifyNull(r.data.marca))
 setDescricao(verifyNull(r.data.descricao))
 setOldCategory(verifyNull(r.data.categoria))
 setLocalizacao(verifyNull(r.data.localizacao))

 setTensao(verifyNull(tensoes[tensoes.findIndex((x)=>x==r.data.tensao)]))
 
  })
 
  }
 
 
 const handleUpdateMaterial=  async (id:number)=>{
 
 
 }
 const onInputChange = (value:any) => {

  console.log(materiais.includes(value))
setOrdemServicos(value)
};
 
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
     <h1  className='text-center font-bold text-2xl mt-10'>Adicionando Material a Ordem de Serviço </h1>
   
     <div className=' w-full flex flex-row justify-center mt-10 gap-4 ' >
 


 
     <Input
          type="number"
          label="Quantidade"
          className="w-32"
          max={20}
          min={1}
          placeholder="0,00" 
          value={quantidade}
          onValueChange={setQuantidade}
          labelPlacement="inside"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">{unidade}</span>
            </div>
          }
        />

    
 <Autocomplete
         label="Material "
         isDisabled={!materiais}
         placeholder="Procure um material"
         className="max-w-[380px]"
         description="Escolha qual OS o material será adicionado"
       
         
       >
       
       { ordemServicos.map((item:IOrderServico) => (
        
          <AutocompleteItem
           key={item.id} 
           aria-label='teste'
           endContent={
           <>
           <p className='text-xs'>{item.descricao}</p>
           </>
           }
        
            value={item.descricao}
            >
            {item.descricao}
          </AutocompleteItem>
        ))}
        </Autocomplete>

     
 
   
     </div>

     <div className='text-center mt-12'>
     <Button  onPress={x=>handleUpdateMaterial(params.materialId)} className='bg-master_black text-white p-6 rounded-lg font-bold text-2xl  '>
       Atualizar Material
      </Button>
      </div>
    
     <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={e=>setOpenSnackBar(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
     >
             <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
              {messageAlert}
            </MuiAlert>
            </Snackbar>
   
 
     
     </>
     
     
   );
}