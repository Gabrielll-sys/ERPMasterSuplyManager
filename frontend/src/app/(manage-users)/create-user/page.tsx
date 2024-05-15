"use client"
import MuiAlert from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem, Button, Input } from '@nextui-org/react';

import { AlertColor, Snackbar } from '@mui/material';
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMaterialById } from "@/app/services/Material.Services";



export default function CreateUser(){
    const route = useRouter()
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

    const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [openDialog,setOpenDialog] = useState<boolean>(false)
    const[nome,setNome] = useState<string>()
    const[email,setEmail] = useState<string>("")
    const[userRole,setUserRole] = useState<string>()
    const [metodoPagamento,setMetodoPagamento] = useState<any>("")

    const funcoesUsuario : string[] = ["Administrador", "Usuário","Personalizado", ];




    const createUser = async()=>{
    const see = localStorage.getItem("currentUser")
    console.log(see)
      // let emailRegex =  /\S+@\S+\.\S+/;

      // if(!emailRegex.test(email))
      // {

      //   setOpenSnackBar(true);
      //   setSeveridadeAlert("error");
      //   setMessageAlert("Email inválido");
      // }

      const user = {
        email:"gabrielpuneco@gmail.com",
        senha:"1234"
      }
 
    }

   const getMaterial = async()=>{

await getMaterialById(120)

   }
      



return(
    <>


      
        
          <div className='  justify-center    flex flex-col h-[100vh] bg-gradient-to-t from-light_yellow from-2% via-transparent gap-2 '>

    
            <h1 className='text-center text-2xl mt-4'>Informações Do usuario</h1>

          <div className=' flex-flex-col  rounded-md shadow-md shadow-black border-1 border-black p-8 w-[400px] mx-auto gap-8 '>


            <Input
              labelPlacement='outside'
              value={nome}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setNome}
              label="Nome"
            />
            <Input
              labelPlacement='outside'
              value={email}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setEmail}
              label="Email"
            />
 

            <Autocomplete
                label="Método Pagamento $"
                placeholder="EX:PIX"
                
                className=" w-[250px]  border-1 border-black rounded-md shadow-sm shadow-black h-14  "
                value={metodoPagamento}
                onSelectionChange={setMetodoPagamento}
                allowsCustomValue
                defaultSelectedKey={metodoPagamento}
              >

              {funcoesUsuario.map((item:any) => (

                  <AutocompleteItem
                  key={item}
                  aria-label='teste'
                    value={metodoPagamento}
                    >
                    {item}
                  </AutocompleteItem>
                ))}
                </Autocomplete>


          <Button  onPress={createUser} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl shadow-lg '>
                Criar usuário
          </Button>

          

          <Button  onPress={getMaterial} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl shadow-lg '>
                Buscar Material
          </Button>
          </div>



        </div>
   
<Snackbar
            open={openSnackBar}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
            autoHideDuration={2000}
            onClose={(e) => setOpenSnackBar(false)}
          >
            <MuiAlert
              onClose={(e) => setOpenSnackBar(false)}
              severity={severidadeAlert}
              sx={{ width: "100%" }}
            >
              {messageAlert}
            </MuiAlert>
          </Snackbar>


     </>
)



}
