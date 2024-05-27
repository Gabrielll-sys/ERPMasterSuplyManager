"use client";
import { useState } from "react";

import { Checkbox, Slider } from "@nextui-org/react";
// @ts-ignore
export default function TaskUser({tarefa,status,onStatusChange}) {
    
  const [size, setSize] = useState<number | undefined>(105);


    const setValue = (value:any)=>{
    setSize(value)
  }
  return (
    <>
 <div className=" flex flex-col items-center text-center">

    <div className=" flex flex-row items-center gap-4 text-center border-2 border-black shadow-inner">
      
    <Checkbox color="success"
            isSelected={status}
            onValueChange={() => onStatusChange()}>
                                                                </Checkbox>
      <p className="text-base w-44 font-bold ">{tarefa}</p>

    </div>
   

 </div>
      </>
  );
}
