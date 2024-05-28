"use client";
import { useState } from "react";

import { Autocomplete, AutocompleteItem, Checkbox, Input, Slider } from "@nextui-org/react";
import IconPen from "../assets/icons/IconPen";
// @ts-ignore
export default function ProgressBar({tarefa,status,prioridade,onStatusChange,onUpdateDescricaoTarefa}) {
  
  const corPrioridade = prioridade == "Altissima"?"text-red-900":"text-red-800"
  const prioridades = ["Baixa","Média","Alta","Altissíma"]
  const [descricao, setDescricao] = useState<string>(tarefa);

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
  return (
    <>
    <div className=" flex flex-col items-center text-center">

    <div className=" flex flex-row items-center justify-between gap-6 text-center w-[30%]">
      
    <Checkbox color="success"
            isSelected={status}
            onValueChange={() => onStatusChange()}>

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
      autoFocus
       />
      )}

<Autocomplete
         label="Tensão"
         placeholder="EX:127V"
         className="max-w-[180px]  rounded-md shadow-sm mt-10 shadow-black  "
       
          
             >
             
             {tensoes.map((item:any) => (
        
          <AutocompleteItem
           key={item.id}
           aria-label='teste'
        
            value={item}
            >
            {item}
          </AutocompleteItem>
        ))}
        </Autocomplete>

      <p className={`text-base font-extrabold  ${corPrioridade} `}>{prioridade}</p>
      
 <IconPen onClick={()=>setIsEditing(!isEditing)}/>
    </div>
   

 </div>
      </>
  );
}
