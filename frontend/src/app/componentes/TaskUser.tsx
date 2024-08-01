"use client";
import { useState } from "react";

import { Autocomplete, AutocompleteItem, Checkbox, Input, Slider } from "@nextui-org/react";
import IconPen from "../assets/icons/IconPen";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
import IconBagX from "../assets/icons/IconBagX";
import IconBxTrashAlt from "../assets/icons/IconBxTrashAlt";
import { Flex, Text } from "@radix-ui/themes";

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


    <Flex className=" flex flex-row items-center justify-between gap-6 text-center w-[40%]">
      

    <Flex direction="row" justify="start" gap = "3" className=" border-1 rounded-sm border-gray-400 p-2  shadow-sm shadow-black ">
      <Flex direction="row" gap="2" className="w-[300px]" >

        <Checkbox color="success"
                radius="none"
                isSelected={tarefa.isFinished}
                onValueChange={handleUpdateStatus}
        
                size="md"
                >
        
        </Checkbox>
          {!isEditing && (
            <>
          <Text className="text-base   "
          onClick={()=>setIsEditing(!isEditing)}
        
          >{nomeTarefa}</Text>
          {!tarefa.isFinished && (
          <IconBxTrashAlt onClick={handleDeleteTarefa}/>
          )}
          </>
                                                    )}
      </Flex>
    </Flex>   

                                                { isEditing && (

     <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
      value={nomeTarefa}
      onValueChange={setNomeTarefa}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
     
       />
      )}
      
   
    

    </Flex>
   


      </>
  );
}
