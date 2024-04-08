"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import MuiAlert from "@mui/material/Alert";

import  { AlertColor, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Textarea } from 'flowbite-react';
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";

import { useSession } from 'next-auth/react';


import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { Box, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { authenticate, logoutUser, register } from '@/app/services/Auth.services';
import { getMaterialById } from '@/app/services/Material.Services';



export default function Login({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

    const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [openDialog,setOpenDialog] = useState<boolean>(false)
    const[nome,setNome] = useState<string>()
    const[email,setEmail] = useState<string>("")
    const[userRole,setUserRole] = useState<string>()
    const [metodoPagamento,setMetodoPagamento] = useState<any>("")

    const funcoesUsuario : string[] = ["Administrador", "Usuário","Personalizado", ];




    const loginUser = async()=>{
    const see = localStorage.getItem("currentUser")


      const user = {
        email:"gabrielpuneco@gmail.com",
        senha:"1234"
      }
      const res = await authenticate(user)

     console.log(res)

    }

   const getMaterial = async()=>{

await getMaterialById(120)

   }
      



return(
    <>


      
        
          <div className='  justify-center    flex flex-col h-[100vh] bg-gradient-to-t from-light_yellow from-2% via-transparent gap-2 '>

    
            <h1 className='text-center text-2xl mt-4'>Informações Do usuario</h1>

          <div className=' flex flex-col  items-center  text-center mx-auto rounded-md shadow-md shadow-black border-1 border-black p-8 w-[400px] gap-3 '>


            <Input
              labelPlacement='outside'
              value={nome}
              className="border-1 border-black justify-center rounded-md shadow-sm shadow-black  max-w-[200px]"
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
 




          <Button  onPress={loginUser} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl shadow-lg '>
                Entrar
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
