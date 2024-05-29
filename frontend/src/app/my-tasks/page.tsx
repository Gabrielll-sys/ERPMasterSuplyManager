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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";



export default function MyTasks(){

    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[dateTasks,setDateTask] = useState<Date>()
    const[tarefaDia,setTarefaDia] = useState<ITarefaUsuario[]>()
    

    const getTasksByDate = async(data:any)=>{


    }


    useEffect(() => {


    }, []);

 




return(
    <>

<LocalizationProvider
                     dateAdapter={AdapterDayjs}
                     adapterLocale="pt-br"
                 >
                     <DatePicker
                         label="Dia de Registro de Ações"
                         className="shadow-lg w-[250px] self-center "
                         value={dateTasks}
                         onChange={(e) => getTasksByDate(e)}
                         slotProps={{ textField: { variant: 'filled' }}}
                     />
                 </LocalizationProvider>
      
        
         
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
