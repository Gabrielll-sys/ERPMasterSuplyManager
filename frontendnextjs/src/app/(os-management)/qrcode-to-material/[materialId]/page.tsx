"use client"
import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";


import { InputAdornment, Snackbar } from '@mui/material';

import { Key, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "@/app/api/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { IInventario } from "@/app/interfaces/IInventarios";
import { IOrderServico } from "@/app/interfaces/IOrderServico";
import GoogleIcon from "@/app/assets/icons/GoogleIcon";
import { signIn, useSession } from "next-auth/react";

export default function UpdateMaterial({params}:any){
  const route = useRouter()

  const[ordemServicos,setOrdemServicos] = useState<IOrderServico[]>([])
  const [descricao,setDescricao] = useState<string>("")
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState<string>("")
  const [marca,setMarca] = useState<string>("")
  const [ tensao,setTensao] = useState<string>("")
  const [corrente,setCorrente] = useState<string>("")
  const [ordemServicoEscolhida,setOrdemServicoEscolhida] = useState<any>("sd")
  const [estoque,setEstoque] = useState<string>()
  const [unidade,setUnidade] = useState<string>("")
  const[quantidade,setQuantidade] = useState<string>("1")
  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
  const { data: session } = useSession();
 




  const tensoes : string[] = ["","12V","24V","127V","220V","380V","440V","660V"]
 
 
 
 useEffect(()=>{
 
    getMaterial(params.materialId).then().catch()
    getAllOs()

 },[])

const getAllOs = async()=>{

  const res = await axios.get(`${url}/OrdemServicos`).then((r:any)=>{
  return r.data
  })

  const filteredOs = res.filter((x:IOrderServico)=>!x.isAuthorized)
    //Ira setar no autocomplete somente as Ordem de serviços que ainda não foram autorizadas
  setOrdemServicos(filteredOs)
  }
 

 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }

  const getMaterial = async(id:number)=>{
 
  await axios.get(`${url}/Materiais/getMaterialWithInvetory/${id}`).then(r=>{

 setCodigoInterno(r.data.material.id)
 setUnidade(verifyNull(r.data.material.unidade))
 setCodigoFabricante(verifyNull(r.data.material.codigoFabricante))
 setCorrente(verifyNull(r.data.material.corrente))
 setMarca(verifyNull(r.data.material.marca))
 setDescricao(verifyNull(r.data.material.descricao))
 setEstoque(verifyNull(r.data.saldoFinal))

 
 setTensao(verifyNull(tensoes[tensoes.findIndex((x)=>x==r.data.material.tensao)]))
 
  })
 
  }
 
 
  const handleCreateItem = async(id:number)=>
  {
try{


  const os = ordemServicos.find(x=>x.id==id)

  const item = {
    materialId:Number(params.materialId),
    material:null,
    ordemServicoId:os?.id,
    ordemServico:null,
    quantidade:Number(quantidade),

  }


 const res = await axios.post(`${url}/Itens/CreateItem`,item).then(r=>{
   return r.data
}).catch((e:AxiosError) => {
console.log(e.code)
});

if(res){
  
  setOpenSnackBar(true);
  setSeveridadeAlert("success");
  setMessageAlert("Material adiciona a lista da OS");

}
}
catch(error){

  console.log()
}

  } 
 
const removeMaterialInvetario = ()=>
{

}



  const onValueChange = (value:any)=>
  {
    if(value>=Number(estoque)) setQuantidade((Number(estoque)).toString())
     else{
    setQuantidade(value)
  }

  }
   return (
     <>
 

 {session && session.user ?(
  <>
  <h1  className='text-center font-bold text-2xl mt-28'>{codigoInterno} - {descricao} ({marca})</h1>
   
   <div className=' w-full flex flex-row justify-center mt-20 gap-4  ' >


   <Input
        type="number"
        label="Quantidade"
        className="w-32 border-1 border-black rounded-xl shadow-sm shadow-black "
        max={estoque}
        min={1}
        placeholder="0" 
        value={quantidade}
        onValueChange={onValueChange}
        labelPlacement="inside"
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">{unidade}</span>
          </div>
        }
      />

  
<Autocomplete
       label="Material "
       placeholder="Procure um material"
       className="max-w-[480px] border-1 border-black rounded-xl shadow-sm shadow-black"
        
       selectedKey={ordemServicoEscolhida}
        onSelectionChange={setOrdemServicoEscolhida}

       
     >
     
     { ordemServicos.map((item:IOrderServico) => (
      
        <AutocompleteItem
         key={item.id} 
         aria-label='teste'
        
         endContent={
         <>
         <p className='text-xs'>Aberta: {dayjs(item.dataAbertura).format("DD/MM/YYYY")}</p>
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
   <Button 
   onPress={()=>handleCreateItem(ordemServicoEscolhida)} 
   className='bg-master_black text-white p-6 rounded-lg font-bold text-2xl  '>

     Adicionar material a OS

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
 ):(
 
  <div className='flex flex-col items-center mt-56 content-center  '>
  <p className='text-2xl p-6'>Você precisa estar logado para realizar esta ação</p>
        <Button // Continuar com Google
        variant="flat"
        
        className="hover:opacity-90 hover:scale-105  p-10 bg-red-800 text-white border-2 border-black rounded-md shadow-md" 
        onClick={() => signIn("google")}
      >
        <div className="flex gap-3">
        <GoogleIcon className="text-2xl mt-1" />
        <p className="text-2xl self-center " >Continuar com Google</p>
        </div>
      </Button>
      </div>
 )}
     
   


     </>
     
     
   );
}