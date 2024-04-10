"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import MuiAlert from "@mui/material/Alert";
import {currentUser} from "@/app/services/Auth.services";

import  { AlertColor, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";


import { useEffect, useRef, useState } from "react";

import "dayjs/locale/pt-br";

import { useSession } from 'next-auth/react';


import axios from 'axios';
import { authenticate, logoutUser, register } from '@/app/services/Auth.services';
import { getMaterialById } from '@/app/services/Material.Services';
import {jwtDecode} from "jwt-decode";



export default function Login({params}:any){
    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const [openDialog,setOpenDialog] = useState<boolean>(false)
    const[senha,setSenha] = useState<string>("1234")
    const[email,setEmail] = useState<string>("gabrielpuneco@gmail.com")
    const[userRole,setUserRole] = useState<string>()


    const funcoesUsuario : string[] = ["Administrador", "Usuário","Personalizado", ];




    const loginUser = async()=>{

      const user = {
        email:email,
        senha:senha
      }
      const res = await authenticate(user)
      if(res)
      {
      route.push("create-material")
      }
      else
      {
          setOpenSnackBar(true);
          setSeveridadeAlert("warning");
          setMessageAlert("Email ou Senha incorretas");
      }


    }

   const see = async()=>{



   }
      



return(
    <>


      
        
          <div className=' justify-center flex flex-col h-screen '>

    
            <h1 className='text-center text-2xl mt-4'>Informações Do usuario</h1>

          <div className=' flex flex-col  items-center  text-center mx-auto rounded-md shadow-md shadow-black border-1 border-black p-8 w-[400px] gap-3 '>


            <Input
              labelPlacement='outside'
              value={email}
              className="border-1 border-black justify-center rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setEmail}
              label="Email"
            />
            <Input
              labelPlacement='outside'
              value={senha}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[200px]"
              onValueChange={setSenha}
              label="Senha"
            />


          <Button  onPress={loginUser} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl shadow-lg '>
                Entrar
          </Button>
              <Button  onPress={see} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl shadow-lg '>
                  see
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
