"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Slider } from "@nextui-org/react";
import { QRCode } from "react-qrcode-logo";



export default function QrCodeMaterial( props : any) {

const [size,setSize] = useState<number| undefined>()

useEffect(()=>{




},[size])
console.log(props)
  return (

      <div className=" ">
   <QRCode

   value={`http://192.168.100.216:3000/update-material/${props.material.id}`}
   size={size}
   eyeRadius={13}
   quietZone={7}
   
   />
    <Slider
    
        size="md"
        step={5} 
        maxValue={250} 
        minValue={150} 
        value={size}
        onChange={setSize}

        defaultValue={150}
        className="max-w-xs p-2" 
      />
<p className="text-xs max-w-xs">{props.material.descricao}</p>

        </div>
       
   
     
   
  );
}