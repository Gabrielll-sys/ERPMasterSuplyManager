"use client"
import { useRouter } from "next/navigation";
import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";
import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { getMaterialById,updateMaterial } from "@/app/services/Material.Services";
import dayjs from "dayjs";
import { IMotor } from "../interfaces/IMotor";
import { Flex, Table } from "@radix-ui/themes";

export default function CurrentMotorWeg({params}:any){
  interface Inversor {
    modelo: string;
    tensao: string;
    potenciaNominalMotorKW: number; // Potência Nominal do Motor
    correnteNominalSaida: number; // Corrente Nominal de Saída
    diametroCabosPotencia: number; // Corrente Nominal de Saída
  }


  const [motor,setMotor] = useState<IMotor>()
  const [potencia,setPotencia] = useState<string>()
  const[inversor,setInversor] = useState<string>()
  const[contator,setContator] = useState<string>()
 
  const searchCorrenteMotor = (potencia:string)=>
  {
    const result :IMotor[]= motores.filter(x=>x.potencia==Number(potencia));
    setMotor(result[0])


  }

  const inversores: Inversor[] = [
    { modelo: 'CFW500A01P6B2',tensao:"220V", potenciaNominalMotorKW: 0.18, correnteNominalSaida: 1.6,diametroCabosPotencia:1.5 },
    { modelo: 'CFW500A02P6B2',tensao:"220V", potenciaNominalMotorKW: 0.37, correnteNominalSaida: 2.6,diametroCabosPotencia:1.5 },
    { modelo: 'CFW500A04P3B2',tensao:"220V", potenciaNominalMotorKW: 0.75, correnteNominalSaida: 4.3,diametroCabosPotencia:1.5 },
    { modelo: 'CFW500B07P3B2',tensao:"220V", potenciaNominalMotorKW: 1.5, correnteNominalSaida: 7.3,diametroCabosPotencia:1.5 },
    { modelo: 'CFW500B10P0B2',tensao:"220V", potenciaNominalMotorKW: 2.2, correnteNominalSaida: 10.0,diametroCabosPotencia:2.5 },
    // Adicione mais inversores conforme necessário
  ];


  const motores: IMotor[] = [
    { potencia: 0.16, correntes: { '220V': 0.86, '380V': 0.50, '440V': 0.43 } },
    { potencia: 0.25, correntes: { '220V': 1.13, '380V': 0.65, '440V': 0.57 } },
    { potencia: 0.33, correntes: { '220V': 1.47, '380V': 0.85, '440V': 0.74 } },
    { potencia: 0.5, correntes: { '220V': 2.07, '380V': 1.20, '440V': 1.04 } },
    { potencia: 0.75 ,correntes: { '220V': 2.83, '380V': 1.64, '440V': 1.42 } },
    { potencia: 1, correntes: { '220V': 2.98, '380V': 1.73, '440V': 1.49 } },
    { potencia: 1.5, correntes: { '220V': 4.42, '380V': 2.56, '440V': 2.21 } },
    { potencia: 2, correntes: { '220V': 6.2, '380V': 3.56, '440V': 3.08 } },
    { potencia: 3, correntes: { '220V': 8.3, '380V': 4.79, '440V': 4.14 } },
    { potencia: 4, correntes: { '220V': 11, '380V': 6.43, '440V': 5.55 } },
    { potencia: 5, correntes: { '220V': 14, '380V': 7.99, '440V': 6.90 } },
    { potencia: 6, correntes: { '220V': 16, '380V': 9.49, '440V': 8.20 } },
    { potencia: 7.5, correntes: { '220V': 20, '380V': 11.58, '440V': 10 } },
    { potencia: 10, correntes: { '220V': 26.4, '380V': 15.28, '440V': 13.20 } },
    { potencia: 12.5, correntes: { '220V': 32, '380V': 18.53, '440V': 16 } },
    { potencia: 15, correntes: { '220V': 38.6, '380V': 22.35, '440V': 19.30 } },
    { potencia: 20, correntes: { '220V': 53.3, '380V': 30.86, '440V': 26.65 } },
    { potencia: 25, correntes: { '220V': 64.7 , '380V': 37.46, '440V': 32.35 } },
    { potencia: 30, correntes: { '220V': 73.9 , '380V': 42.78, '440V': 36.95 } },
    { potencia: 40, correntes: { '220V': 99.6 , '380V': 57.66, '440V': 49.80 } },
    { potencia: 60, correntes: { '220V': 146 , '380V': 84.53, '440V': 73 } },
    { potencia: 75, correntes: { '220V': 174 , '380V': 100.74, '440V': 87 } },
    { potencia: 100, correntes: { '220V': 245 , '380V': 141.84, '440V': 122.50 } },
    { potencia: 125, correntes: { '220V': 292 , '380V': 169.05, '440V': 146 } },
    { potencia: 150, correntes: { '220V': 353 , '380V': 204.37, '440V': 176.50 } },
    { potencia: 175, correntes: { '220V': 418 , '380V': 242, '440V': 209 } },
    { potencia: 200, correntes: { '220V': 474 , '380V': 274.42, '440V': 237 } },
    { potencia: 200, correntes: { '220V': 591 , '380V': 342.16, '440V': 295.50 } },
    { potencia: 300, correntes: { '220V': 691 , '380V': 400.05, '440V': 345.50 } },
    { potencia: 350, correntes: { '220V': 817 , '380V': 473, '440V': 408.50 } },
    { potencia: 400, correntes: { '220V': 930 , '380V': 538.42, '440V': 465 } },
    { potencia: 450, correntes: { '220V': 1020 , '380V': 590.53, '440V': 510 } },
    { potencia: 500, correntes: { '220V': 1140 , '380V': 660, '440V': 570 } },
    { potencia: 500, correntes: { '220V': 1140 , '380V': 660, '440V': 570 } },
  ];


   return (
     <>
     <h1 className="text-center text-2xl text-bold mt-10">Corrente de Motor(WEG) por Potência</h1>

 <div className="flex flex-row justify-center mt-20">
   <Input className='bg-transparent self-center max-sm:w-[200px] text-2xl md:w-[250px]'
        value={potencia}
        type="number"
        placeholder="Potência do Motor em CV"
        onValueChange={(x)=>searchCorrenteMotor(x)}
                                />
 </div>
 <Flex direction="column" justify="start" >
          
          <Table.Root className="" variant="surface"  >
<Table.Header>
  <Table.Row  >
    <Table.ColumnHeaderCell align="center"  >Potência Motor</Table.ColumnHeaderCell>
    <Table.ColumnHeaderCell align="center">Inversor De Frequência</Table.ColumnHeaderCell>
    <Table.ColumnHeaderCell align="center">Contator(PARTIDA DIRETA)</Table.ColumnHeaderCell>
    <Table.ColumnHeaderCell align="center">Disjuntor(WEG)</Table.ColumnHeaderCell>
   
  </Table.Row>
</Table.Header>

<Table.Body>
  
  <Table.Row className="hover:bg-master_yellow">
    <Table.Cell align="center" className="max-w-[80px] " >{}</Table.Cell>
    <Table.Cell align="center" className="max-w-[100px] ">{}</Table.Cell>


    
    
    <Table.Cell align="center">{}</Table.Cell>
    <Table.Cell align="center">{}</Table.Cell>
    <Table.Cell align="center">R${}</Table.Cell>

     
  </Table.Row>

</Table.Body>
        </Table.Root>
</Flex>


      {/* <div className=" flex flex-row  justify-center text-center items-center gap-6 mt-20">
        <div className="flex flex-col gap-5   justify-around self-center">
        <p className="font-bold text-2xl p-2 bg-blue-300 w-[180px]">Potência(CV)</p>
        <p className="font-bold text-2xl p-2 bg-blue-300 w-[180px]">(A) Em 220V</p>
        <p className="font-bold text-2xl p-2 bg-blue-300 w-[180px]">(A) Em 380V</p>
        <p className="font-bold text-2xl p-2 bg-blue-300 w-[180px]">(A) Em 440V</p>
        </div>
        <div className="flex flex-col gap-5 justify-center">
        <p className="font-bold text-2xl p-2 bg-blue-100 w-[180px]">{motor?.potencia} CV</p>
        <p className="font-bold text-2xl p-2 bg-blue-100 w-[180px]">{motor?.correntes["220V"]} A</p>
        <p className="font-bold text-2xl p-2 bg-blue-100 w-[180px]">{motor?.correntes["380V"]} A</p>
        <p className="font-bold text-2xl p-2 bg-blue-100 w-[180px]">{motor?.correntes["440V"]} A</p>
        </div>
      </div> */}
     
     
     </>
     
     
   );
}