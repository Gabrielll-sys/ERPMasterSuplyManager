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
import { createTarefaUsuario, deleteTarefaUsuario, getUserTasksByDate, updateTarefaUsuario } from "../services/TarefasUsuarios.Services";
import dayjs from "dayjs";
import {today, getLocalTimeZone} from "@internationalized/date"
import IconPlus from "../assets/icons/IconPlus";
import { deleteImagemAtividadeRd } from "../services/ImagensAtividadeRd.Service";
import { Flex, Text } from "@radix-ui/themes";
import { useMutation, useQuery } from "react-query";


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
      
      setTaskHighPriority(listHighPriority)
      setTaskMidPriority(listMidPriority)
      setTaskLowPriority(listLowPriority)
      setFinishedsTask(listTasksFinisheds)

    }


    useEffect(() => {

     getTasksByDate(date.toDateString())
     setDiaSemana(semana[date.getDay()])
        }, []);

    
        const handleDate = (value:DateValue)=>{
 
    setDiaSemana(semana[value.toDate(getLocalTimeZone()).getDay()])

        }

    const updateTarefa = async(model:ITarefaUsuario)=>{

      console.log(finishedsTask.includes(model))
      const list = finishedsTask.find((x)=>x.id == model.id)
      let novaTarefaUsuario: ITarefaUsuario[] = []
      let index : number = 0;
      model.isFinished = !model.isFinished


      if(list)
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

  
      console.log(index)
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

const deletarTarefaMutation = useMutation({
  mutationFn:(id:number)=>deleteTarefaUsuario(id),
  onSuccess:()=>{
    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Tarefa Atualizada");
    getTasksByDate(date.toDateString())
  }
})
    const deleteTarefa = async(id:number) =>{

     deletarTarefaMutation.mutate(id)
    }


return(
    <>
 <div className=" flex flex-row  w-[60%] justify-between">
   <Calendar aria-label="Date (Uncontrolled)" className="mb-4" onChange={(e) =>{getTasksByDate(e.toString()),setDateTask(e),handleDate(e) } } autoFocus />
   
   <h1 className="text-2xl mt-20 h-4 mx-auto">Minhas Tarefas de {diaSemana} - {dayjs(dateTasks).format("DD/MM/YYYY").toString()}</h1>
 </div>
            

                  <Flex direction="row" justify="center" gap="6" >

                  
                    <Flex  direction="column" gap="3"  className="w-[300px]  ">
                        <Text className="bg-[#ACF2CA] p-[6px] font-bold rounded-sm text-center shadow-sm shadow-black w-full">Tarefas Concluídas </Text>
                        {finishedsTask?.map((task)=>(
                        <TaskUser onDeleteTarefa={deleteTarefa} tarefa={task} key={task.id}  onUpdateTarefa={updateTarefa} />
                          ))}
                       
                        </Flex>
         

                  <Flex direction="column" gap="3">

                    <Text  className="bg-[#F2C9E4] p-[6px] font-bold rounded-sm text-center shadow-sm shadow-black w-full">Alta Prioridade </Text>

                    {tasksHighPriority?.map((task)=>(
          
                     <TaskUser onDeleteTarefa={deleteTarefa} tarefa={task} key={task.id}  onUpdateTarefa={updateTarefa} />
          
                       ))}
                   <div className="flex flex-row items-center gap-2">
                    <IconPlus onClick={createHighPriorityTask} height={"1.7em"} width={"1.7em"} color="grey"/> 
                  <p> Adicionar Nova Tarefa</p>
                    </div>
                   
                  </Flex>

                  <Flex direction="column" gap="3">

                  <Text className=" p-[6px] rounded-sm font-bold text-center shadow-sm shadow-black w-full ">Média Prioridade </Text>
                  {tasksMidPriority?.map((task)=>(
          
                   <TaskUser tarefa={task} onDeleteTarefa={deleteTarefa} key={task.id}   onUpdateTarefa={updateTarefa} />

                   ))}
                   <div className="flex flex-row items-center gap-2">
                    <IconPlus  onClick={createMidPriorityTask} height={"1.7em"} width={"1.7em"} color="grey"/> 
                  <p > Adicionar Nova Tarefa</p>
                    </div>

                  </Flex>

                  <Flex direction="column" gap="3">

                  <Text className="bg-[#FDE68A] p-[6px] font-bold rounded-sm text-center shadow-sm shadow-black w-full">Baixa Prioridade</Text>
                  {tasksLowPriority?.map((task)=>(
                    
                    <TaskUser tarefa={task}  key={task.id} onDeleteTarefa={deleteTarefa}  onUpdateTarefa={updateTarefa} />

                    ))}
                    <div className="flex flex-row gap-2">
                    <IconPlus onClick={createLowPriorityTask} height={"1.7em"} width={"1.7em"} color="grey" /> 
                  
                    <p> Adicionar Nova Tarefa</p>
                    
                    </div>

                  </Flex>
                  </Flex>
        
 
         


      

   


   
   
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
