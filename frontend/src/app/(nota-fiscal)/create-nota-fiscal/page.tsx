"use client";

import { useRouter } from "next/navigation";

import { Button } from "@nextui-org/react";

import { url } from "@/app/api/webApiUrl";
import { DatePicker } from "@mui/x-date-pickers";
import { useRef, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Input
} from '@nextui-org/react';
import "dayjs/locale/pt-br";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";



import { useSession } from "next-auth/react";


export default function CreateNotaFiscal(){
  const route = useRouter()
  const [numeroNF, setNumeroNF] = useState<string>("");
  const [frete, setFrete] = useState<string>("");

  const [valorICMS, setValorICMS] = useState<number>();
  const [CFOP, setCFOP] = useState<string>("");
  const [dataEmissaoNF, setDataEmissaoNF] = useState<any>();


  
  const componentRef: any = useRef();

  const handleCreateNF = async ()=>{
    const fornecedor = {
      numeroNF:numeroNF,
      frete:frete,
      CFOP:CFOP,
    }

    const res = await axios.post(`${url}/Materiais`, fornecedor).then(r=>{


      return  r.data;


    }).catch(e=>console.log(e))

    console.log




  }
  






    return(
       
      <>
   



 
      <div className=' w-full flex flex-row flex-wrap justify-center mt-6 '>

       
        <Input
          value={numeroNF}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onChange={(e) => setNumeroNF(e.target.value)}
          label="Número NF"
          
        />

        <Input
        type="number"
          value={frete}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[400px]"
          onValueChange={setFrete}
          label="Frete"
          required
        />
 
          <Input
            value={CFOP}
            className=" border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px]"
            onValueChange={setCFOP}
            label="Localização"
          />
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label="Data Entrada NF"
              className="shadow-lg"
              value={dataEmissaoNF}
              onChange={(e) => setDataEmissaoNF(e)}
              slotProps={{ textField: { variant: 'filled' }}}
            />
          </LocalizationProvider>
          </div>
  
     
 


     
        
    </>



    )
}