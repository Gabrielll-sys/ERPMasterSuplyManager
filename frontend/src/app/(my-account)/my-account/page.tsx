"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Textarea } from 'flowbite-react';
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateInventory.module.css";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IMaterial from '@/app/interfaces/IMaterial';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
import imagem from '/src/app/assets/logo.png'
import { useReactToPrint } from 'react-to-print';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IFilterMaterial } from '@/app/interfaces/IFilterMaterial';
import { IOrderServico } from '@/app/interfaces/IOrderServico';
import { useSession } from 'next-auth/react';
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IItem } from '@/app/interfaces/IItem';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import dayjs from 'dayjs';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import {currentUser} from "@/app/services/Auth.services";
import {getUserById, updateInfosUser} from "@/app/services/User.Services";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {IUsuario} from "@/app/interfaces/IUsuario";



export default function MyAccount({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  
    const[nomeUsuario,setNomeUsuario] = useState<string>()
    const[emailUsuario,setEmailUsuario] = useState<string>()
    const[senha,setSenha] = useState<string>()
    const[usuario,setUsuario] = useState<IUsuario>()

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        getInfosUser()
    }, []);


    const getInfosUser = async ()=>{

        const user = await getUserById(currentUser.userId)
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

      await updateInfosUser(user)

  }

   

return(
    <>

        <div className="justify-center flex flex-col h-[65vh] gap-4">
            <h1 className='text-center text-2xl mt-4'>Minhas Informações</h1>
            <div className='flex flex-row items-center  text-center mx-auto w-[600px] gap-w'>

                <Input
                    label="Nome"
                    labelPlacement='outside'
                    value={nomeUsuario}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[280px] "
                    onValueChange={(x) => handleNomeCliente(x)}
                />

                <Input
                    label="Email"
                    labelPlacement='outside'
                    value={emailUsuario}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[280px]"
                    onValueChange={setEmailUsuario}

                />
                <Input
                    type = "file"
                    labelPlacement='outside'
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[280px]"
                    onValueChange={setEmailUsuario}

                />
                <Input
                    labelPlacement='outside'
                    value={senha}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[280px]"
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
                />

            </div>

            <div className='flex flex-row justify-center mt-16'>
                <Button isDisabled={!nomeUsuario}
                        onPress={updateUser}
                        className='bg-master_black text-white p-5 rounded-md font-bold text-2xl shadow-lg  '>
                    Atualizar
                </Button>
            </div>


        </div>
    </>
)


}
