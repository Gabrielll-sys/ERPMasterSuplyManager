"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";

import { useSession } from 'next-auth/react';
import MuiAlert, {AlertColor} from "@mui/material/Alert";


import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';

import {getUserById, updateInfosUser} from "@/app/services/User.Services";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {IUsuario} from "@/app/interfaces/IUsuario";



export default function MyAccount({params}:any){
    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[nomeUsuario,setNomeUsuario] = useState<string>()
    const[emailUsuario,setEmailUsuario] = useState<string>()
    const[senha,setSenha] = useState<string>()
    const[usuario,setUsuario] = useState<IUsuario>()

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const [currentUser, setCurrentUser] = useState<any>(null);
 
  
  

    useEffect(() => {
             //@ts-ignore
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(user != null)
    {
        setCurrentUser(user)
  
    }
    
        getInfosUser()
    }, []);


    const getInfosUser = async ()=>{
        //@ts-ignore
        const user = JSON.parse(localStorage.getItem("currentUser"));

        setNomeUsuario(user.nome)
        setEmailUsuario(user.email)

        setUsuario(user)
    }


  
  const handleNomeCliente = async(value:any)=>{

  }


  const updateUser = async ()=>
  {
  const user: IUsuario =
      {
        id:usuario?.id,
          nome:nomeUsuario,
          email:emailUsuario,
          senha:senha
      }

      const res = await updateInfosUser(user)
      if (res == 200) {
        setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Suas informações foram atualizadas");
      }

  }

   

return(
    <>

        <div className="justify-center flex flex-col h-[65vh] gap-4">
            <h1 className='text-center max-sm:text-[20px]  md:text-2xl mt-4'>Minhas Informações</h1>
            <div className='flex md:flex-row max-sm:flex-col items-center justify-center  text-center mx-auto md:w-[800px] max-sm:w-[300px] gap-4'>

                <Input
                    label="Nome"
                    labelPlacement='outside'
                    value={nomeUsuario}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 max-sm:w-[220px] md:w-[320px] "
                    onValueChange={(x) => handleNomeCliente(x)}
                />

                <Input
                    label="Email"
                    labelPlacement='outside'
                    value={emailUsuario}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 max-sm:w-[220px] md:w-[320px]"
                    onValueChange={setEmailUsuario}

                />
               
                <Input
                    labelPlacement='outside'
                    value={senha}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 max-sm:w-[220px] md:w-[320px]"
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

            </div>

            <div className='flex flex-row justify-center mt-4'>
                <Button isDisabled={!nomeUsuario}
                        onPress={updateUser}
                        className='bg-master_black text-white p-5 rounded-md font-bold md:text-2xl max-sm:text-base shadow-lg  '>
                    Atualizar
                </Button>
            </div>


        </div>
        <Snackbar
            open={openSnackBar}
            autoHideDuration={2000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
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
