"use client";
import { useState } from "react";

import { Slider } from "@nextui-org/react";
import { QRCode } from "react-qrcode-logo";

export default function QrCodeMaterial(props: any) {
  const [size, setSize] = useState<number | undefined>(105);


    const setValue = (value:any)=>{
    setSize(value)
  }
  return (
    <>
 <div className=" flex flex-col items-center text-center">

    <div className=" flex flex-col items-center text-center border-2 border-black shadow-inner">
      
      <QRCode
        
        value={`https://mastererp.vercel.app/qrcode-to-material/${props.material.material.id}`}
        size={size}
        eyeRadius={10}
        quietZone={7}
      />
      <p className="text-base w-44 font-bold ">ID: {props.material.material.id}</p>

      <p className="text-xs w-36 m-2">{props.material.material.descricao}</p>
      <p className="text-xs max-w-xs mt-2 font-bold m-2"> Marca:{props.material.material.marca ==""?"Sem registro":props.material.material.marca}</p>
    </div>
   
     <Slider

       size="md"
       step={5}
       maxValue={250}
       minValue={105}
       value={size}
       onChange={setValue}
       defaultValue={105}
       className="max-w-xs p-2"
     />
 </div>
      </>
  );
}
