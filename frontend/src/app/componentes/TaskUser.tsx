"use client";
import { useState } from "react";

import { Autocomplete, AutocompleteItem, Checkbox, Input, Slider } from "@nextui-org/react";
import IconPen from "../assets/icons/IconPen";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
import IconBagX from "../assets/icons/IconBagX";
import IconBxTrashAlt from "../assets/icons/IconBxTrashAlt";

// @ts-ignore
export default function TaskUser({tarefa,onUpdateTarefa,onDeleteTarefa}) {
  
  const corPrioridade = tarefa.prioridade == "Altissima"?"text-red-900":"text-red-800"
  const prioridades = ["Baixa","Média","Alta","Altissíma"]
  const [nomeTarefa, setNomeTarefa] = useState<string>(tarefa.nomeTarefa);
  const [prioridadeTarefa,setPrioridadeTarefa] = useState<any>(tarefa.prioridade)
  const [isEditing,setIsEditing] = useState<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(nomeTarefa)

    const task: ITarefaUsuario = {
      id: tarefa.id,
      nomeTarefa: nomeTarefa,
      prioridade: prioridadeTarefa,
      isFinished: tarefa.isFinished,
      usuarioId: tarefa.usuarioId,
      usuario: {}
    }

    
    if (event.key === "Enter") {

      setIsEditing(false);

      onUpdateTarefa(task);

    }
  };

  const handleBlur = () => {
    const task: ITarefaUsuario = {
      id: tarefa.id,
      nomeTarefa: tarefa.nomeTarefa,
      prioridade: prioridadeTarefa,
      isFinished: tarefa.isFinished,
      usuarioId: tarefa.usuarioId,
      usuario: {}
    }
    setIsEditing(false);

    onUpdateTarefa(task);

  };

  const handleUpdateStatus = ()=>{

    const task: ITarefaUsuario = {
      id: tarefa.id,
      nomeTarefa: nomeTarefa,
      prioridade: prioridadeTarefa,
      isFinished: !tarefa.isFinished,
      usuarioId: tarefa.usuarioId,
      usuario: {}
    }

    onUpdateTarefa(task)

  }
  const handleDeleteTarefa = ()=>{

   
    onDeleteTarefa(tarefa.id)

  }
  return (
    <>
    <div className=" flex flex-row items-center text-center">

    <div className=" flex flex-row items-center justify-between gap-6 text-center w-[80%]">
      

    <div className=" border-1 rounded-md border-gray-400 p-2 flex flex-row shadow-sm shadow-black ">
      <Checkbox color="success"
      
              isSelected={tarefa.isFinished}
              onValueChange={handleUpdateStatus}
              
              size="md"
              >
      
      </Checkbox>
        {!isEditing && (
          <>
        <p className="text-base font-extrabold min-w-[290px] max-w-[290px]  "
        onClick={()=>setIsEditing(!isEditing)}
      
        >{nomeTarefa}</p>
        <IconBxTrashAlt onClick={handleDeleteTarefa}/>
        </>
                                                  )}
    </div>   

                                                { isEditing && (

     <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
      value={nomeTarefa}
      onValueChange={setNomeTarefa}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
     
       />
      )}
      
   
    

    </div>
   

 </div>
      </>
  );
}
