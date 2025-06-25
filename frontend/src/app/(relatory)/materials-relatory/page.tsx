"use client"

import { Button, Input, Link, Spinner } from '@nextui-org/react';

import { useRouter } from "next/navigation";

import { url } from '@/app/api/webApiUrl';
import axios from "axios";
import "dayjs/locale/pt-br";
import { useRef, useState } from "react";


import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IInventario } from '@/app/interfaces';
import { Table } from 'flowbite-react';
import { useReactToPrint } from 'react-to-print';

export default function MaterialRelatory(){
   
    const route = useRouter()
   const componentRef: any = useRef();
   const [loadingMateriais,setLoadingMateriais] = useState<boolean>(false)  

  const [descricao,setDescricao] = useState<string>()
  const [marca,setMarca] = useState<string>()
  const [precoVendaMin,setPrecoVendaMin] = useState<string>()
  const [precoVendaMax,setPrecoVendaMax] = useState<string>()
  const [precoCustoMin,setPrecoCustoMin] = useState<string>()
  const [precoCustoMax,setPrecoCustoMax] = useState<string>()
  const[materiaisFiltros,setMateriaisFiltro] = useState<IInventario[]>()
  const filtrosProntos = ["Materias com maior quantidade em estoque","Materias com maior taxa de saída","Materiais com menor taxa de saída"]

 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Visitor Pass',
  onAfterPrint: () => console.log('Printed PDF successfully!'),
 });

 const verifyNumberIsEmpty = (item:string | undefined)=>{
 
  return !item?.length ? null: Number(item?.replace(',','.')).toFixed(2)

}

const generateRelatory = async()=>{
  setLoadingMateriais(true)

const filtro  = {
    descricao: descricao,
    marca: marca,
    precoVendaMin:verifyNumberIsEmpty(precoVendaMin),
    precoVendaMax:verifyNumberIsEmpty(precoVendaMax),
    precoCustoMin:verifyNumberIsEmpty(precoCustoMin),
    precoCustoMax:verifyNumberIsEmpty(precoCustoMax),



}

  const materiaisFiltrados = await axios
  .post(`${url}/Inventarios/filter-material`,filtro)
  .then((r) : IInventario [] => {
    console.log(r.data)
    return  r.data
  })
  setLoadingMateriais(false)

  setMateriaisFiltro(materiaisFiltrados)
}

    


     return (
      <>

       
       <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Retornar
      </Link>
       <h1 className='text-center font-bold text-2xl mt-4'>Filtragem de Materiais</h1>

   
      
     <div className=' w-full flex flex-row justify-center mt-12 gap-6 items-center '>

     <Input
       
          label="Descricao do Material"
          className="max-w-[500px] border-1 border-black rounded-md shadow-sm shadow-black"
          placeholder="Ex:Inversor Frequência"
          labelPlacement="outside"
          value={descricao}
          onValueChange={setDescricao}
         
        />
     <Input
          label="Marca"
          className="max-w-[128px] border-1 border-black rounded-md shadow-sm shadow-black"
          placeholder="Ex: WEG"
          labelPlacement="outside"
          value={marca}
          onValueChange={setMarca}
         
        />
  

     </div>

       <div className=' w-full flex flex-row justify-center mt-12 gap-4 items-center '>
   
       <Input
          type="number"
          label="Preço custo min"
          className="max-w-[128px] border-1 border-black rounded-md shadow-sm shadow-black"
          value={precoCustoMin}
          onValueChange={setPrecoCustoMin}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />

    <Input
          type="number"
          label="Preço custo max"
          className="max-w-[128px] border-1 border-black rounded-md shadow-sm shadow-black"
          placeholder="0,00"
          labelPlacement="outside"
          value={precoCustoMax}
          onValueChange={setPrecoCustoMax}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
     
       <Input
          type="number"
          label="Preço venda min"
          className="max-w-[188px] border-1 border-black rounded-md shadow-sm shadow-black"
          placeholder="0,00" 
          value={precoVendaMin}
          onValueChange={setPrecoVendaMin}
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
     <Input
          type="number"
          label="Preço venda max"
          className="max-w-[188px] border-1 border-black rounded-md shadow-sm shadow-black"
          value={precoVendaMax}
       
          onValueChange={setPrecoVendaMax}
          placeholder="0,00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-500 text-small">R$</span>
            </div>
          }
        />
   
 
    
       
      
      </div>

   <div className='flex flex-row justify-center mt-10'>
     <Button className="text-white bg-master_black p-4 font-bold ml-5 text-lg" onClick={()=>generateRelatory()}>
     Filtrar
     </Button>
     <Button className="text-white bg-master_black p-4 font-bold ml-5 text-lg" onClick={()=>handlePrint()}>
   Imprimir
     </Button>
   </div>

   <div className='mt-16 flex '  ref={componentRef}>
      

       { materiaisFiltros!=undefined && materiaisFiltros.length>0?
       <>
      <div className="overflow-x-auto self-center w-[100%] ">
      <Table  hoverable striped className="w-[100%] ">
        <Table.Head className="border-1 border-black">
          <Table.HeadCell className="text-center border-1 border-black text-sm max-w-[120px] " >Cod.Interno</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Cod.Fabricante</Table.HeadCell>
          <Table.HeadCell className="text-center text-sm">Descrição</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Marca</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Tensão</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Estoque</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Localização</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Custo</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Venda</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Total</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          
        { materiaisFiltros.length>=1 && materiaisFiltros.map((row:any) => (
          <Table.Row  key={row.material.id} className=" dark:border-gray-700 dark:bg-gray-800 hover:bg-yellow-200">
          <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
          {row.material.id}
          </Table.Cell>
          <Table.Cell className="text-center  text-black ">{row.material.codigoFabricante}</Table.Cell>
          <Table.Cell className="text-center text-black" onClick={(x)=>setDescricao(row.material.descricao)}>{row.material.descricao}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.marca}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.tensao}</Table.Cell>
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>route.push(`/update-inventory/${row.material.id}`)}>{row.saldoFinal==null?"Não registrado":row.saldoFinal +" "+row.material.unidade}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.localizacao}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoVenda==null?"Sem registro":"R$ "+(row.material.precoCusto*row.saldoFinal).toFixed(2).toString().replace(".",",")}</Table.Cell>
          
       
        </Table.Row>


              ))}
          
         
         
        </Table.Body>
      </Table>
    </div>
     </>
     :  
          loadingMateriais &&(

            <div className="w-full flex flex-row justify-center mt-16">
              <Spinner size="lg"/>
            </div>
          )
          }
          </div>
          
              </>
       
     );
}