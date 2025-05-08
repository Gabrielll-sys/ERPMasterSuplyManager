"use client"
import { Snackbar } from '@mui/material';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from "next/navigation";

import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";

import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { authHeader } from '@/app/_helpers/auth_headers';
import { url } from '@/app/api/webApiUrl';
import { IUsuario } from "@/app/interfaces/IUsuario";
import { updateInfosUser } from "@/app/services/User.Services";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import axios from 'axios';



export default function MyAccount(){
    const route = useRouter()
 
    const[nomeUsuario,setNomeUsuario] = useState<string>()
    const[emailUsuario,setEmailUsuario] = useState<string>()
    const[senha,setSenha] = useState<string>()
    const[usuario,setUsuario] = useState<IUsuario>()
    const [isVisible, setIsVisible] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [currentUser, setCurrentUser] = useState<any>(null);
 
  
  

    useEffect(() => {
  
        getInfosUser()
    }, []);


    const getInfosUser = async ()=>{
        //@ts-ignore
        const userLc = JSON.parse(localStorage.getItem("currentUser"));
         await axios.get(`${url}/Usuarios/${userLc.userId}`,{headers:authHeader()}).then(r=>{
      
             setNomeUsuario(r.data.nome)
             setEmailUsuario(r.data.email)
     
             setUsuario(r.data)
            return r.data
        })
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
                    onValueChange={setNomeUsuario}
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
