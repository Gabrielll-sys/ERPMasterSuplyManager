"use client";

import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";

import Link from "next/link";
import { url } from "@/app/api/webApiUrl";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";

import "dayjs/locale/pt-br";
import { InputAdornment, Snackbar, TableFooter, TablePagination } from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { 
  Spinner,
  Avatar,
  Input
 } from '@nextui-org/react';
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import { useReactToPrint } from 'react-to-print';

import Select from '@mui/material/Select';
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import NavBar from "@/app/componentes/NavBar";


export default function CreateMaterial(){
  const route = useRouter()

  const [numeroNF, setNumeroNF] = useState<string>("");
  const [frete, setFrete] = useState<string>("");

  const [valorICMS, setValorICMS] = useState<number>();
  const [CFOP, setCFOP] = useState<string>("");
  const [dataEmissaoNF, setDataEmissaoNF] = useState<any>();

  const { data: session } = useSession();
  
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
  
        {session &&(
<>
      <div className='text-center mt-8 '>
      <Button  onPress={handleCreateNF} className='bg-master_black text-white p-7 rounded-lg font-bold text-2xl shadow-lg '>
         Criar Material
      </Button>
     
     
      </div>
      </>
        )}
 

   
     
          
     
        
    </>



    )
}