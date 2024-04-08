"use client"
import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";


import { Datepicker } from "flowbite-react";


import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "@/app/api/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios, {AxiosResponse} from "axios";
import dayjs from "dayjs";

import { getMaterialById, updateMaterial } from "@/app/services/Material.Services";
import {Table} from "flowbite-react";
import IconBxTrashAlt from "@/app/assets/icons/IconBxTrashAlt";
import {authHeader} from "@/app/_helpers/auth_headers";

export default function LogRegister({params}:any){
  const route = useRouter()



  
  const [logs,setLogs] = useState<any>([])
  const [dateLog,setDateLog] = useState<any>()
    type LogAcoesUsuario = {

      id:number,
        acao:string,
      dataAcao:Date,
      responsavel:string
    }
 
 
 useEffect(()=>{
 
getLogs()
     

 },[])




  
 const getLogs = async ()=>{
     console.log(authHeader())

     await axios.get(`${url}/LogAcoesUsuario`).then((r:AxiosResponse)=>{
        setLogs(r.data)
     }).catch(e=>console.log(e))
 
 }
 
const getLogByDate = async(data:any)=>{
        return await axios
            .get(`${url}/LogAcoesUsuario/buscaLogsByDate?date=${data}`,{headers:authHeader()})
            .then( (r)=> {
                console.log(r.data)
                setLogs(r.data)

            })

}
 
 
   return (


             <div className='flex flex-col  mx-auto mt-16 gap-3'>
                 <LocalizationProvider
                     dateAdapter={AdapterDayjs}
                     adapterLocale="pt-br"
                 >
                     <DatePicker
                         label="Dia de Registro de Ações"
                         className="shadow-lg w-[250px] self-center "
                         value={dateLog}
                         onChange={(e) => getLogByDate(e)}
                         slotProps={{ textField: { variant: 'filled' }}}
                     />
                 </LocalizationProvider>
                 <div className="overflow-x-auto self-center w-[90%] mt-5 ">
                     <Table  hoverable striped className="w-[100%] self-center ">
                         <Table.Head className="mx-auto">
                             <Table.HeadCell className="text-center border-1 border-black text-sm min-w-[290px] " >Ação</Table.HeadCell>
                             <Table.HeadCell className="text-center border-1 border-black text-sm min-w-[290px]">Data De Ação</Table.HeadCell>
                             <Table.HeadCell className="text-center border-1 border-black text-sm min-w-[290px]">Responsável</Table.HeadCell>

                         </Table.Head>

                         <Table.Body className="divide-y">

                             { logs.length>=1 && logs.map((row:LogAcoesUsuario) => (
                                 <Table.Row  key={row.id} className=" dark:border-gray-700 dark:bg-gray-800 ">

                                     <Table.Cell className="text-center text-black text-[18px] " >{row.acao}</Table.Cell>


                                     <Table.Cell className="text-center text-black text-[18px] " >{dayjs(row.dataAcao).format("DD/MM/YYYY [as] HH:mm:ss")}</Table.Cell>


                                     <Table.Cell className="text-center text-black text-[18px]"  >{row.responsavel} </Table.Cell>

                                     <Table.Cell>

                                     </Table.Cell>
                                 </Table.Row>


                             ))}


                         </Table.Body>
                     </Table>
                 </div>

             </div>



     
     
   )}
