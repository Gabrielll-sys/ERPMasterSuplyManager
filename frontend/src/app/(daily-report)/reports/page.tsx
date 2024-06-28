"use client"
import { Button } from '@nextui-org/react';
import "dayjs/locale/pt-br";
import { Card } from 'flowbite-react';
import { useRouter } from "next/navigation";
import { useEffect,useState } from 'react';
import { IRelatorioDiario } from '@/app/interfaces/IRelatorioDiario';
import { createRelatorioDiario, getAllRelatoriosDiarios } from "@/app/services/RelatorioDiario.Services";
import dayjs from 'dayjs';



export default function Reports(){
  const[numeroOrcamento,setNumeroOrcamento] = useState<string>("")
  const[relatoriosDiarios,setRelatorioDiarios] = useState<IRelatorioDiario[]>()
  var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  var dataAtual = new Date();
    useEffect(()=>{
        getAll()
    },[])


    const route = useRouter()


const getAll = async ()=>{

    const res: any = await getAllRelatoriosDiarios()

    if(res) setRelatorioDiarios(res)

}
const handleCreateRelatorio = async()=>{
      const res = await createRelatorioDiario();
      if(res) await getAll();
}

return(
    <>
        <div className = "flex flex-col gap-5 justify-center">


      <h1 className='text-center text-2xl mt-4'>Relatórios Diários</h1>
        <Button  onPress={handleCreateRelatorio} className='  bg-master_black max-sm:w-[50%] md:w-[14%] mx-auto text-white rounded-md font-bold text-base  '>
            Criar novo relatório
        </Button>
        </div>
    <div className=' flex flex-row items-center justify-center flex-wrap gap-16 self-center mt-16'>
      
      { relatoriosDiarios!=undefined  && relatoriosDiarios.map((relatorioDiario:IRelatorioDiario)=>(

      <Card key={relatorioDiario.id}  className="min-w-[370px] hover:-translate-y-2 hover:bg-master_yellow transition duration-75  ease-in-out bg-white border-black border-1 shadow-md shadow-black">
      
        <div className="flex flex-col items-center pb-4">
      
          <h5 className="mb-1 text-xl font-xl mt-2 dark:text-white">Relatório Diário Nº {relatorioDiario.id}</h5>
          <span className="text-lg mt-2">Data Abertura:{dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YY")} {semana[dataAtual.getDay()]}</span>
          <span className="text-lg mt-2">Status:{relatorioDiario.isFinished?"Relatório Concluído":"Relatório Em Análise"}</span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <p
              onClick={()=>route.push(`/report/${relatorioDiario.id}`)}
              className="inline-flex hover:underline  text-lg items-center rounded-lg px-4 py-2 text-center  font-medium text-blue-700"
            >
              Editar
            </p>
           
          </div>
        </div>
      </Card>
      ))}



    </div>




     </>
)


}
