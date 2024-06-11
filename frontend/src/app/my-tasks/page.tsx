"use client"
import { getUserLocalStorage, isTokenValid } from "@/app/services/Auth.services";
import MuiAlert from "@mui/material/Alert";
import { Button, Input } from '@nextui-org/react';
import { AlertColor, Snackbar } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import {Calendar, DateValue} from "@nextui-org/calendar";
import {parseDate} from "@internationalized/date";
import MailIcon from "@/app/assets/icons/MailIcon";
import { authenticate } from "@/app/services/Auth.services";
import TaskUser from "../componentes/TaskUser";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
import { getUserTasksByDate, updateTarefaUsuario } from "../services/TarefasUsuarios.Services";
import dayjs from "dayjs";
import {today, getLocalTimeZone} from "@internationalized/date"


export default function MyTasks(){

    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[dateTasks,setDateTask] = useState<any>()
    const[tarefasDia,setTarefaDia] = useState<ITarefaUsuario[]>([])
    const [diaSemana,setDiaSemana] = useState<string>("")
    const date = new Date()
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const getTasksByDate = async(data:any)=>{

      const res : ITarefaUsuario[] = await getUserTasksByDate(data)
      setTarefaDia(res);

    }


    useEffect(() => {

     getTasksByDate(date.toDateString())
     setDiaSemana(semana[date.getDay()])
     console.log(date.getDay())
        }, []);

    
        const handleDate = (value:DateValue)=>{
 
    setDiaSemana(semana[value.toDate(getLocalTimeZone()).getDay()])

        }

    const updateTarefa = async(model:ITarefaUsuario)=>{
      
      const novaTarefaUsuario: ITarefaUsuario[] = [...tarefasDia]
      const index = tarefasDia.findIndex(x=>x.id==model.id)
  
      novaTarefaUsuario[index].isFinished = model.isFinished ;
      novaTarefaUsuario[index].prioridade = model.prioridade;
      novaTarefaUsuario[index].nomeTarefa = model.nomeTarefa;
      novaTarefaUsuario[index].isFinished = model.isFinished;
      console.log(novaTarefaUsuario[index])
      const res = await updateTarefaUsuario(novaTarefaUsuario[index])

      if( res == 200)
      {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Atividade Atualizada");
        getTasksByDate(date.toDateString())

      }
    }




return(
    <>
 <div className=" flex flex-row  w-[60%] justify-between">
   <Calendar aria-label="Date (Uncontrolled)" onChange={(e) =>{getTasksByDate(e.toString()),setDateTask(e),handleDate(e) } } autoFocus />
   
   <h1 className="text-2xl mt-20">Minhas Tarefas de {diaSemana} - {dayjs(dateTasks).format("DD/MM/YYYY").toString()}</h1>
 </div>
                 <div className=" flex flex-col gap-4">
        {tarefasDia?.map((task)=>(
          
          <TaskUser tarefa={task}   onUpdateTarefa={updateTarefa} />
          
        ))}
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
