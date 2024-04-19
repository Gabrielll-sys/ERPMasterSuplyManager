"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import MuiAlert from "@mui/material/Alert";
import {currentUser, getUserLocalStorage, isTokenValid} from "@/app/services/Auth.services";

import  { AlertColor, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";


import { useEffect, useRef, useState } from "react";

import "dayjs/locale/pt-br";

import { useSession } from 'next-auth/react';
import {EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {EyeFilledIcon} from "@nextui-org/shared-icons";

import axios from 'axios';
import { authenticate, logoutUser, register } from '@/app/services/Auth.services';
import { getMaterialById } from '@/app/services/Material.Services';
import {jwtDecode} from "jwt-decode";
import MailIcon from "@/app/assets/icons/MailIcon";



export default function Login({params}:any){

    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[senha,setSenha] = useState<string>("1234")
    const[email,setEmail] = useState<string>("bielpuneco@gmail.com")

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const funcoesUsuario : string[] = ["Administrador", "Usuário","Personalizado", ];


    useEffect(() => {
        console.log(currentUser?.token)
        if (isTokenValid(currentUser?.token)){
            route.push("/create-material")
        }

    }, []);

    const loginUser = async()=>{

      const user = {
        email:email,
        senha:senha
      }
      const res = await authenticate(user)
        console.log(res)
      if(res)
      {
          setTimeout(()=>{
              route.push("create-material")

          },1800)
      }
      else
      {
          setOpenSnackBar(true);
          setSeveridadeAlert("warning");
          setMessageAlert("Email ou Senha incorretas");
      }


    }





return(
    <>


      
        
          <div className=' justify-center flex flex-col h-[85vh] '>


          <div className=' flex flex-col  items-center  text-center mx-auto rounded-md shadow-md shadow-black border-1 border-black p-8 w-[320px] gap-8 '>


            <Input
              labelPlacement='outside'
              value={email}
              className="border-1 border-black justify-center rounded-md shadow-sm shadow-black  max-w-3xl"
              onValueChange={setEmail}
              label="Email"
              endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Input
              labelPlacement='outside'
              value={senha}
              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-3xl"
              onValueChange={setSenha}
              label="Senha"
              endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                  </button>
              }
              type={isVisible ? "text" : "password"}
            />

          <Button  onPress={loginUser} className='bg-master_black text-white p-4 rounded-lg font-bold text-base shadow-lg '>
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
