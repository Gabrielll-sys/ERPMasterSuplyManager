"use client"
import { redirect, useRouter } from "next/navigation";

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
  const [ordemServicoEscolhida,setOrdemServicoEscolhida] = useState<IOrderServico>()
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
 
 
  const handleCreateItem = async(id:number | undefined)=>
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
 



const removeQtdMaterialInvetario = async ()=>
{


  const inventario = {
    razao:`${session?.user?.name} Removeu do inventário`,
    saldoFinal:movimento,
    estoque:estoque,
    materialId:codigoInterno,
    material:{}
    }


  const inventarioAtualizado =  await axios.post(`${url}/Inventarios`,inventario)
  .then(r=>
    {
    
      return r.data
}).catch()
}
const setValue = (id:any)=>{
  console.log(ordemServicoEscolhida?.descricao)
  const osFinded = ordemServicos.find(x=>x.id==id)
  setOrdemServicoEscolhida(osFinded)



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
 

 {session  && session.user?(
  <>
  <h1  className='text-center font-bold text-2xl mt-20 max-sm:text-base'>{codigoInterno} - {descricao}</h1>
  {marca!=""&& (<h1 className='text-center font-bold text-2xl  max-sm:text-lg'>{marca}</h1>)}
   
   <div className=' w-full flex sm:flex-row   justify-center mt-20 max-sm:mt-5 gap-4 max-sm: flex-col   ' >


   <Input
        type="number"
        label="Quantidade"
        isRequired
        radius="md"
        className="w-32  max-sm:mx-auto border-1 border-black rounded-md shadow-sm shadow-black  "
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
       label="Ordem de Serviço "
       placeholder="Procure uma OS"
       className="max-sm:w-[350px] max-sm:mx-auto  max-w-[480px] border-1 border-black rounded-md shadow-sm shadow-black"
       radius="md"
       value={ordemServicoEscolhida?.descricao}
       onSelectionChange={setValue}

       
     >
     
     { ordemServicos.map((item:IOrderServico) => (
      
        <AutocompleteItem
         key={item.id} 
         aria-label='ttttttt'
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

   <div className='text-center mt-12 ml-4 flex flex-row  max-sm:justify-evenly gap-3   justify-center'>
   <Button 
   onPress={()=>handleCreateItem(ordemServicoEscolhida?.id)} 
   isDisabled={quantidade=="0"|| quantidade==""}

   className='bg-master_black text-white p-3 rounded-lg font-bold  max-sm:text-sm max-sm:w-[160px] text-2xl  '>

     Adicionar material a OS

    </Button>
   <Button 
   onPress={removeQtdMaterialInvetario} 
   isDisabled={quantidade=="0" || quantidade==""}
   className='bg-master_black text-white p-3 rounded-lg font-bold  max-sm:text-sm max-sm:w-[160px] text-2xl  '>

    Remover quantidade

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
 
  <div className='flex flex-col items-center max-sm:mt-24 mt-56 content-center text-center  '>
  <p className='text-2xl max-sm:text-xl p-6'>Você precisa estar logado para realizar esta ação</p>
        <Button // Continuar com Google
        variant="flat"
        className="hover:opacity-90 hover:scale-105  p-10 bg-red-600 max-sm:bg-red-600 text-white border-2 border-black rounded-md shadow-md" 
        onClick={() => signIn("google")}
      >
        <div className="flex gap-3">
        <GoogleIcon className="text-2xl mt-1" />
        <p className="text-2xl max-sm:text-lg self-center " >Continuar com Google</p>
        </div>
      </Button>
      </div>
 )}
     
   


     </>
     
     
   );
}