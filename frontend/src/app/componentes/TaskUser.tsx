"use client";
import { useState } from "react";

import { Autocomplete, AutocompleteItem, Checkbox, Input, Slider } from "@nextui-org/react";
import IconPen from "../assets/icons/IconPen";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";
// @ts-ignore
export default function TaskUser({tarefa,status,prioridade,onUpdateTarefa}) {
  
  const corPrioridade = prioridade == "Altissima"?"text-red-900":"text-red-800"
  const prioridades = ["Baixa","Média","Alta","Altissíma"]
  const [descricao, setDescricao] = useState<string>(tarefa);
  const [prioridadeTarefa,setPrioridadeTarefa] = useState<any>(prioridade)
  const [isEditing,setIsEditing] = useState<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === "Enter") {

      setIsEditing(false);

      onUpdateDescricaoTarefa(descricao);

    }
  };

  const handleBlur = () => {

    setIsEditing(false);

    onUpdateDescricaoTarefa(descricao);

  };

  const handleUpdateTarefa = ()=>{

    const tarefa: ITarefaUsuario = {
      id:
    }

    onUpdateTarefa()

  }
  return (
    <>
    <div className=" flex flex-col items-center text-center">

    <div className=" flex flex-row items-center justify-between gap-6 text-center w-[40%]">
      
    <Checkbox color="success"
            isSelected={status}
            onValueChange={() => onUpdateTarefa()}>

    </Checkbox>

      {!isEditing && (
      <p className="text-base font-extrabold">{descricao}</p>
                                                )}
      { isEditing && (

     <Input className='bg-transparent max-sm:w-[200px] md:w-[250px]'
      value={descricao}
      onValueChange={setDescricao}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
     
       />
      )}
      
      {isEditing && (

      <Autocomplete
              label="Tensão"
              placeholder="EX:127V"
              className="bg-transparent max-sm:w-[200px] md:w-[250px] "
              value={prioridade}
              onBlur={handleBlur}
              onSelectionChange={(x)=>{setPrioridadeTarefa(x),setIsEditing(false)}}
                  >
                  
                  {prioridades.map((item:any) => (
              
                <AutocompleteItem
                key={item.id}
                aria-label='teste'
                
                  value={item}
                  >
                  {item}
                </AutocompleteItem>
              ))}
              </Autocomplete>
      )}
      {!isEditing && (

            <p className={`text-base font-extrabold  ${corPrioridade} `}>{prioridade}</p>
      )}
      
 <IconPen className="hover:bg-yellow-100" onClick={()=>setIsEditing(!isEditing)}/>
    </div>
   

 </div>
      </>
  );
}
