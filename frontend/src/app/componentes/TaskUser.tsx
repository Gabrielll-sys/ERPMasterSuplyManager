"use client";
import { useState } from "react";

import { Autocomplete, AutocompleteItem, Checkbox, Input, Slider } from "@nextui-org/react";
import IconPen from "../assets/icons/IconPen";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";

// @ts-ignore
export default function TaskUser({tarefa,onUpdateTarefa}) {
  
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

    console.log(task)
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
  console.log(tarefa.prioridade)
  return (
    <>
    <div className=" flex flex-col items-center text-center">

    <div className=" flex flex-row items-center justify-between gap-6 text-center w-[70%]">
      
    <Checkbox color="success"
    className="border-1 border-black "
            isSelected={tarefa.isFinished}
            onValueChange={handleUpdateStatus}>

    </Checkbox>

      {!isEditing && (
      <p className="text-base font-extrabold min-w-[290px] max-w-[290px] ">{nomeTarefa}</p>
                                                )}      { isEditing && (

     <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
      value={nomeTarefa}
      onValueChange={setNomeTarefa}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
     
       />
      )}
      
      {isEditing && tarefa.prioridade && (

      <Autocomplete
              label="Prioridade"
              className="bg-transparent max-sm:w-[200px] md:w-[250px] "
              allowsCustomValue
              value={prioridadeTarefa}
              onBlur={handleBlur}
              defaultSelectedKey={prioridadeTarefa}
              onSelectionChange={setPrioridadeTarefa}
                  >
                  
                  {prioridades.map((item:any) => (
              
                <AutocompleteItem
                key={item}
                aria-label='Prioridade'
                
                  value={prioridadeTarefa}
                  >
                  {item}
                </AutocompleteItem>
              ))}
              </Autocomplete>
      )}
      {!isEditing && (

  
              <p className={`text-base font-extrabold  ${corPrioridade}  `}>{tarefa.prioridade}</p>

      )}
      
 <IconPen className="hover:bg-yellow-100" onClick={()=>setIsEditing(!isEditing)}/>
    </div>
   

 </div>
      </>
  );
}
