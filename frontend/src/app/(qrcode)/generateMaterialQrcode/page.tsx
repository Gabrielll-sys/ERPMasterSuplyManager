"use client"

import { Autocomplete, AutocompleteItem, Button, Link } from '@nextui-org/react';

import { useRouter } from "next/navigation";

import { url } from '@/app/api/webApiUrl';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconQrCode from '@/app/assets/icons/IconQrCode';
import QrCodeMaterial from '@/app/componentes/QrCodeMaterial';
import { AlertColor } from "@mui/material/Alert";
import axios from "axios";
import "dayjs/locale/pt-br";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from 'react-to-print';

export default function UpdateInventory({params}:any){
    type Inventario = {
      id: number,
      codigoInterno: string,
      codigoFabricante: string,
      categoria: string,
      descricao: string,
      marca: string,
      corrente: string,
      unidade: string,
      tensao: string,
      localizacao: string,
      dataEntradaNF: any,
      precoCusto: number,
      markup: number,
      precoVenda: number
      material:{
        id:string | number,
        categoria?: string
        codigoFabricante?: string
        codigoInterno?:number
        corrente?:string,
        dataEntradaNF? : any,
        descricao?: string,
        localizacao?: string,
        marca?: number,
        markup?: number ,
        precoCusto?: number,
        precoVenda?: number,
        tensao?: string,
        unidade?: string
        

      }
    }

  

    //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material


  const route = useRouter()
    const [qrCodes,setQrcodes] = useState<Inventario[]>([])
    const [ messageAlert,setMessageAlert] = useState<string>();
    const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
   const[stateBotao,setStateBotao] = useState<any>()
   const[descricao,setDescricao] = useState<string>()
   
   const [materiais,setMateriais]= useState<Inventario[] >([])
   const [listQrCodes,setListQrCodes]= useState<Inventario[] >([])
   const componentRef: any = useRef();

 const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: 'Visitor Pass',
  onAfterPrint: () => console.log('Printed PDF successfully!'),
 });
   

  useEffect(()=>{
    
      searchByDescription()
   
      
  },[descricao])

  useEffect(()=>{
    
},[listQrCodes])
const searchByDescription = async () => {



  try{
   const res = await axios
   .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao?.split("#").join(".")}`)
   .then( (r)=> {

    return r.data
    
   })
   .catch();
   console.log(res)

   setMateriais(res)

  }
  catch(e) 
  
  { 
  

console.log(e)
  }
 
};
    const onInputChange = (value:any) => {

        console.log(materiais.includes(value))
      setStateBotao(value)
    };
    const createQrcode = (material:Inventario)=>
    {
      setQrcodes(current=>[...current,material])
      console.log(qrCodes.includes(material))


    }
    const deleteQrcode = (material:Inventario)=>
    {

      const newList: Inventario[]   = qrCodes.filter(x=>x!=material)

      setQrcodes(newList)


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
       <h1 className='text-center font-bold text-2xl mt-16'>Geração QrCode para Materiais </h1>

       <div className=' w-full flex flex-row justify-center mt-12 '>
   
   
         <Autocomplete
         label="Material "
        
         placeholder="Procure um material"
         className="max-w-2xl  border-1 border-black rounded-md shadow-sm shadow-black"
         allowsCustomValue
         onValueChange={setDescricao}
         value={descricao}


         
       >
       
       {materiais.map((item:Inventario) => (
        
          
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
             <p className='text-xs'>{item.material.marca}</p>
              {qrCodes.includes(item)?<IconBxTrashAlt onClick={()=>deleteQrcode(item)} />:<IconQrCode onClick={()=>createQrcode(item)} />}
            
             </>
             }
             startContent={<p>{item.material.id}-</p>}
              value={item.material.descricao}
              >
              {item.material.descricao}
            </AutocompleteItem>
        
        ))}
        </Autocomplete>
   
 
       
   <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>setQrcodes([])}>
Limpar
   </Button>
   <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>handlePrint()}>
Imprimir
   </Button>
     
    
       
       </div>
  
       <div className='flex justify-center mt-12 flex-row flex-wrap gap-12 w-full  ' ref={componentRef}>
    {qrCodes?.map((material:Inventario)=>(
  <div key={material.id} className='flex flex-row'>

<QrCodeMaterial  material={material}/>
<IconBxTrashAlt onClick={()=>deleteQrcode(material)} />
</div>
    ))}

      
      </div>


   
       

              </>
       
     );
}