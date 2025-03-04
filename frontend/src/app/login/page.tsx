"use client"
import { isTokenValid } from "@/app/services/Auth.services";
import MuiAlert from "@mui/material/Alert";
import { Button, Input } from '@nextui-org/react';
import { AlertColor, Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";

import MailIcon from "@/app/assets/icons/MailIcon";
import { authenticate } from "@/app/services/Auth.services";



export default function Login(){

    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[senha,setSenha] = useState<string>()
    const[email,setEmail] = useState<string>()

    const [isVisible, setIsVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const toggleVisibility = () => setIsVisible(!isVisible);



    useEffect(() => {

        //@ts-ignore
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
        console.log(user?.token)
        if (isTokenValid(user?.token) && user!= null){
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
      if(res == 200)
      {
          setTimeout(()=>{
              route.push("reports")

          },1800)
      }
      else if (res == 401)
      {
          setOpenSnackBar(true);
          setSeveridadeAlert("warning");
          setMessageAlert("Email ou Senha incorretas");
      }

      else if( res == 403){
          setOpenSnackBar(true);
          setSeveridadeAlert("warning");
          setMessageAlert("Você Não possui mais permissão de acesso");
      }


    }





return(
    <>


      
        
          <div className=' justify-center flex flex-col h-[85vh] max-sm:h-[75vh] '>


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
