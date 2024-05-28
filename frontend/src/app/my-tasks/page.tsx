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
import TaskUser from "../componentes/TaskUser";



export default function MyTasks(){

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


    }, []);

 




return(
    <>


      
        
         
          <TaskUser prioridade={"Altissíma"} status = {true} tarefa={"Kill Bill"}/>


      

   


   
   
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
