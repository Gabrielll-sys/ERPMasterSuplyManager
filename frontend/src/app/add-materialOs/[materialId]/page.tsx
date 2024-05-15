"use client"

import { Button } from '@nextui-org/react';
import { Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { url } from "@/app/api/webApiUrl";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import GoogleIcon from '@/app/assets/icons/GoogleIcon';
import TextField from "@mui/material/TextField";
import axios from "axios";
export default function AddMaterialOs({params}:any){
    

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
   const { data: session } = useSession();
   

  const route = useRouter()

   useEffect(()=>{

   getMaterial(params.materialId).then().catch()
   
   },[])
   
   
    
   const getMaterial = async(id:number)=>{
 
    axios.get(`${url}/Materiais/${id}`).then(r=>{
  
   setCodigoInterno(r.data.id)
  
   setDescricao(r.data.descricao)
 
   
    })
   
    }
   const updateInventario=  async ()=>{
   
   
     setOpenSnackBar(true)
     setSeveridadeAlert("warning")
     setMessageAlert("É necessário informar a razão")
   
   
   
     // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
   const inventario = {
       razao:razao.trim().replace(/\s\s+/g, ' '),
       saldoFinal:movimento,
       estoque:estoque,
       materialId:codigoInterno,
       material:{}
       }
   
      
   
   try{
    setTimeout(()=>{
      route.push('/create-material')

    },1000)
  //    const inventarioAtualizado =  await axios.post(`${url}/Inventarios`,inventario)
  //    .then(r=>
  //      {
  //        setOpenSnackBar(true)
  //        setSeveridadeAlert("success")
  //        setMessageAlert("Inventário Atualizado com sucesso")
  //        setStateBotao(true)
  //        return r.data
  //  }).catch()
   
   
   
   }
   catch(e){
   
     console.log(e)
   }
   
   
   }
   
   
     return (
       <>
   

     
       
   
       
     
      { session && session.user ? (
       <>


        <h1 className='text-center font-bold text-2xl mt-32'>Editando inventário de  {descricao} </h1>
       <h1 className='text-center font-bold text-2xl mt-6'>Codigo interno: {codigoInterno} </h1>
      <div className=' w-full flex flex-row justify-center mt-12 '>
   
  
   
      <TextField  disabled={true}  value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
       onChange={e=>setDescricao(e.target.value)} label='Descrição' required />
    
      <TextField    value={razao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
            error={severidadeAlert != "warning" || razao.length ? false : true}
             onChange={e=>setRazao(e.target.value)} label='Ordem de Serviço' required />
  
      <TextField   value={movimento} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
        onChange={(e) => setMovimento(e.target.value)} label='Estoque' required />
  
  
     
  
      
    
   
      
      </div>
 
      <div className='text-center mt-8'>
    <Button  onPress={updateInventario} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl mt-10 '>
      Adicionar material 
     </Button>
     </div>
     </>

     )
      :
      (
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

    )
      }

    

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