"use client"

import { Button } from "@nextui-org/react";


import { Snackbar } from '@mui/material';

import { url } from "@/app/api/webApiUrl";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";
import { Text } from "@radix-ui/themes";
import { authHeader } from "@/app/_helpers/auth_headers";
import { IInventario, IOrdemSeparacao } from "@/app/interfaces";
import { TextField } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export default function UpdateMaterial({params}:any){
 
  const[ordemServicos,setOrdemServicos] = useState<IOrdemSeparacao[]>([])
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [material,setMaterial] = useState<IInventario>()
  const [ordemServicoEscolhida,setOrdemServicoEscolhida] = useState<IOrdemSeparacao>()
  const [currentUser, setCurrentUser] = useState<any>(null);
  const[quantidade,setQuantidade] = useState<string>("1")
  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
  const { data: session } = useSession();
 




  const tensoes : string[] = ["","12V","24V","127V","220V","380V","440V","660V"]
 
 
 
 useEffect(()=>{
 
    getMaterial(params.materialId).then().catch()
    getAllOs()
       //@ts-ignore
       const user = JSON.parse(localStorage.getItem("currentUser"));
       if(user != null)
       {
           setCurrentUser(user)
     
       }

 },[])

const getAllOs = async()=>{

  const res = await axios.get(`${url}/OrdemServicos`).then((r:any)=>{
  return r.data
  })

  const filteredOs = res.filter((x:IOrdemSeparacao)=>!x.isAuthorized)
    //Ira setar no autocomplete somente as Ordem de serviços que ainda não foram autorizadas
  setOrdemServicos(filteredOs)
  }
 



  const getMaterial = async(id:number)=>{
 
  await axios.get(`${url}/Materiais/getMaterialWithInvetory/${id}`,{headers:authHeader()}).then(r=>{

    setMaterial(r.data)
  
 
 
  })
 
  }
 
 
  const handleCreateItem = async(id:number | undefined)=>
  {
try{


  const os = ordemServicos.find(x=>x.id==id)

  const item = {
    materialId:Number(params.materialId),
    responsavelAdicao:session?.user?.name,
    material:null,
    ordemServicoId:os?.id,
    ordemServico:null,
    quantidade:Number(quantidade),

  }
console.log(item)

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

  const saldoFinal:number = material?.saldoFinal!=undefined?material.saldoFinal-Number(quantidade):0
 

  const inventario = {
    razao:`${session?.user?.name} Removeu do inventário`,
    saldoFinal:saldoFinal,
    estoque:material?.saldoFinal,
    materialId:material?.material.id,
    material:{},
    movimentacao:-Number(quantidade)
    }


  const inventarioAtualizado =  await axios.post(`${url}/Inventarios/remove_from_qr_code`,inventario)
  .then(r=>
    {

      return r.data
}).catch()

  if(inventarioAtualizado){
    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert(`${quantidade} ${material?.material.unidade} de ${material?.material.descricao} removido com sucesso`);
  }

}

const setValue = (id:any)=>{
  console.log(ordemServicoEscolhida?.descricao)
  const osFinded = ordemServicos.find(x=>x.id==id)
  setOrdemServicoEscolhida(osFinded)



}


  const onValueChange = (value:any)=>
  {
    if(value>=Number(material?.saldoFinal)) setQuantidade((Number(material?.saldoFinal)).toString())
     else{
    setQuantidade(value)
  }

  }
   return (
     <>
 

 {currentUser&&(
  <>
  <h1  className='text-center font-bold text-2xl mt-20 max-sm:text-base'>{material?.material.id} - {material?.material.descricao}</h1>
  <h1  className='text-center font-bold text-2xl mt-2 max-sm:text-base'>Estoque:{material?.saldoFinal} {material?.material.unidade}</h1>
  {material?.material.marca!=""&& (<h1 className='text-center font-bold text-2xl  max-sm:text-lg'>({material?.material.marca})</h1>)}
   
   <div className=' w-full flex sm:flex-row   justify-center mt-10 max-sm:mt-2 gap- max-sm:    ' >


    <TextField.Root   size="2" >
                <TextField.Input 
              
                value={quantidade}
                max={material?.saldoFinal}
                
                variant='classic'
                min={1}
                onChange={(x)=>onValueChange(x.target.value)}
                placeholder='Quantidade'>
                </TextField.Input>
                <TextField.Slot >
                <Text>{material?.material.unidade}</Text>
              </TextField.Slot>
            </TextField.Root>


{/*   
<Autocomplete
       label="Ordem de Serviço "
       placeholder="Procure uma OS"
       className="max-sm:w-[350px] max-sm:mx-auto  max-w-[480px] border-1 border-black rounded-md shadow-sm shadow-black"
       radius="md"

       value={ordemServicoEscolhida?.descricao}
       onSelectionChange={setValue}

       
     >
     
     {ordemServicos.map((item:IOrderServico) => (
      
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
      </Autocomplete> */}

   

 
   </div>

   <div className='text-center mt-12 ml-4 flex flex-row  max-sm:justify-evenly gap-3   justify-center'>
   {/* <Button 
   onPress={()=>handleCreateItem(ordemServicoEscolhida?.id)} 
   isDisabled={quantidade=="0"|| quantidade=="" || !ordemServicoEscolhida}

   className='bg-master_black text-white p-3 rounded-lg font-bold  max-sm:text-sm max-sm:w-[160px] text-2xl  '>

     Adicionar material a OS

    </Button> */}
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
 )
 }

     </>
     
     
   );
}