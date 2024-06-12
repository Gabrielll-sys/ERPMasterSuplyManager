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
import TaskUser from "../componentes/TaskUser";
import { DragDropContext } from "react-beautiful-dnd";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
import { createTarefaUsuario, getUserTasksByDate, updateTarefaUsuario } from "../services/TarefasUsuarios.Services";
import dayjs from "dayjs";
import {today, getLocalTimeZone} from "@internationalized/date"
import IconPlus from "../assets/icons/IconPlus";


export default function MyTasks(){

    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[dateTasks,setDateTask] = useState<any>()
    const[tarefasDia,setTarefaDia] = useState<ITarefaUsuario[]>([])
    const [diaSemana,setDiaSemana] = useState<string>("")
    const[tasksHighPriority,setTaskHighPriority] = useState<ITarefaUsuario[]>([])
    const[tasksMidPriority,setTaskMidPriority] = useState<ITarefaUsuario[]>([])
    const[tasksLowPriority,setTaskLowPriority] = useState<ITarefaUsuario[]>([])
    const[finishedsTask,setFinishedsTask] = useState<ITarefaUsuario[]>([])
    const date = new Date()
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];



  const createHighPriorityTask = async()=>{
    const tarefa : ITarefaUsuario ={
      prioridade:"Alta",
      nomeTarefa:"Nova Tarefa",
      usuario:{},
    }

    const res = await createTarefaUsuario(tarefa)

    if(res == 200)
      {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Tarefa Criada");
        getTasksByDate(date.toDateString())
    }
  }
  const createMidPriorityTask = async()=>{
    const tarefa : ITarefaUsuario ={
      prioridade:"Média",
      nomeTarefa:"Nova Tarefa",
      usuario:{},
    }

    const res = await createTarefaUsuario(tarefa)

    if(res == 200)
      {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Tarefa Criada");
        getTasksByDate(date.toDateString())
    }
  }
  const createLowPriorityTask = async()=>{
    const tarefa : ITarefaUsuario ={
      prioridade:"Baixa",
      nomeTarefa:"Nova Tarefa",
      usuario:{},
    }

    const res = await createTarefaUsuario(tarefa)

    if(res == 200)
      {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Tarefa Criada");
        getTasksByDate(date.toDateString())
    }
  }

    const getTasksByDate = async(data:any)=>{

       const listHighPriority : ITarefaUsuario [] = []

       const listMidPriority : ITarefaUsuario [] = []

       const listLowPriority : ITarefaUsuario [] = []

       const listTasksFinisheds : ITarefaUsuario [] = []

      const res : ITarefaUsuario[] = await getUserTasksByDate(data)

      res.forEach(tarefa => {

        if(!tarefa.isFinished) 
          {

            if(tarefa.prioridade == "Alta")
            {
              listHighPriority.push(tarefa)
            }
            else if (tarefa.prioridade == "Média") 
            {
              listMidPriority.push(tarefa)
            }
            else if (tarefa.prioridade == "Baixa"){
              listLowPriority.push(tarefa)
            }
         }
         else listTasksFinisheds.push(tarefa)

      });
      console.log(listTasksFinisheds)
      setTaskHighPriority(listHighPriority)
      setTaskMidPriority(listMidPriority)
      setTaskLowPriority(listLowPriority)
      setFinishedsTask(listTasksFinisheds)

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

      let novaTarefaUsuario: ITarefaUsuario[] = []
      let index : number = 0;
      model.isFinished = !model.isFinished
      
      if(finishedsTask.includes(model))
        {

          index = finishedsTask.findIndex(x=>x.id==model.id)
          novaTarefaUsuario = [...finishedsTask]

          }
      else{


         if( model.prioridade == "Alta"){

        index = tasksHighPriority.findIndex(x=>x.id==model.id)
        novaTarefaUsuario = [...tasksHighPriority]
     
      }
      else if (model.prioridade =="Média") 
      {
        console.log("foi")
        index = tasksMidPriority.findIndex(x=>x.id==model.id)
        novaTarefaUsuario = [...tasksMidPriority]

      }
      else{

        index = tasksLowPriority.findIndex(x=>x.id==model.id)
        novaTarefaUsuario = [...tasksLowPriority]

      }
      }

  
      
      novaTarefaUsuario[index].isFinished = !model.isFinished ;
      novaTarefaUsuario[index].prioridade = model.prioridade;
      novaTarefaUsuario[index].nomeTarefa = model.nomeTarefa;
      const res = await updateTarefaUsuario(novaTarefaUsuario[index])

      if( res == 200)
      {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Tarefa Atualizada");
        getTasksByDate(date.toDateString())

      }
    }




return(
    <>
 <div className=" flex flex-row  w-[60%] justify-between">
   <Calendar aria-label="Date (Uncontrolled)" onChange={(e) =>{getTasksByDate(e.toString()),setDateTask(e),handleDate(e) } } autoFocus />
   
   <h1 className="text-2xl mt-20 h-4 mx-auto">Minhas Tarefas de {diaSemana} - {dayjs(dateTasks).format("DD/MM/YYYY").toString()}</h1>
 </div>
                 <div className=" flex flex-col gap-4">

                  <div className="flex flex-row justify-center gap-6">

                  
                    <div className="flex flex-col gap-5">
                        <p className="bg-lime-400 p-2 font-bold rounded-md">Tarefas Concluídas </p>
                        {finishedsTask?.map((task)=>(
                        <TaskUser tarefa={task} key={task.id}  onUpdateTarefa={updateTarefa} />
                          ))}
                       
                        </div>
         

                  <div className="flex flex-col gap-5">

                    <p className="bg-red-300 p-2 font-bold rounded-md">Alta Prioridade </p>
                    {tasksHighPriority?.map((task)=>(
          
                     <TaskUser tarefa={task} key={task.id}  onUpdateTarefa={updateTarefa} />
          
                       ))}
                   <div className="flex flex-row items-center gap-3">
                    <IconPlus onClick={createHighPriorityTask} height={"1.7em"} width={"1.7em"} color="grey"/> 
                  <p> Adicionar Nova Tarefa</p>
                    </div>
                   
                  </div>

                  <div className="flex flex-col gap-5">

                  <p className="bg-orange-400 p-2 rounded-md font-bold">Média Prioridade </p>
                  {tasksMidPriority?.map((task)=>(
          
                   <TaskUser tarefa={task}  key={task.id}   onUpdateTarefa={updateTarefa} />

                   ))}
                   <div className="flex flex-row items-center gap-3">
                    <IconPlus  onClick={createMidPriorityTask} height={"1.7em"} width={"1.7em"} color="grey"/> 
                  <p > Adicionar Nova Tarefa</p>
                    </div>

                  </div>

                  <div className="flex flex-col gap-5">

                  <p className="bg-yellow-300 p-2 font-bold rounded-md">Baixa Prioridade</p>
                  {tasksLowPriority?.map((task)=>(
                    
                    <TaskUser tarefa={task}  key={task.id}   onUpdateTarefa={updateTarefa} />

                    ))}
                    <div className="flex flex-row items-center gap-3">
                    <IconPlus onClick={createLowPriorityTask} height={"1.7em"} width={"1.7em"} color="grey" /> 
                  <p> Adicionar Nova Tarefa</p>
                    </div>

                  </div>
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
