"use client"
import { Snackbar } from '@mui/material';
import {  Input, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react';
import { useRouter } from "next/navigation";

import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";

import dayjs from 'dayjs';

import IconFileEarmarkPdf from '@/app/assets/icons/IconFileEarmarkPdf';
import IconPlusSquare from '@/app/assets/icons/IconPlus';
import Atividade from '@/app/componentes/Atividade';
import RelatorioDiarioPDF from '@/app/componentes/RelatorioDiarioPDF';
import { IAtividadeRd } from "@/app/interfaces/IAtividadeRd";
import { IImagemAtividadeRd } from '@/app/interfaces/IImagemAtividadeRd';

import { IRelatorioDiario } from "@/app/interfaces/IRelatorioDiario";
import {
    createAtividadeRd,
    deleteAtividadeRd,
    getAllAtivdadesInRd,
    updateAtividadeRd
} from "@/app/services/AtvidadeRd.Service";
import { deleteImagemAtividadeRd, getAllImagensInAtividade } from '@/app/services/ImagensAtividadeRd.Service';
import { deleteAllImagesFromAtividadeFromAzure } from '@/app/services/Images.Services';
import {
    getEmpresaRelatorioDiario,
    getRelatorioDiarioById,
    updateFinishRelatorioDiario,
    updateRelatorioDiario
} from "@/app/services/RelatorioDiario.Services";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ProgressBar } from '@/app/componentes/ProgressBar';
import { Flex, TextField } from '@radix-ui/themes';
import { Button } from '@radix-ui/themes';
import { useMutation, useQuery } from 'react-query';



export default function Report({params}:any){
    const route = useRouter()
    const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()
    var dataAtual = new Date();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const conditionsRoles = currentUser?.role == "Administrador" || currentUser?.role == "Diretor" || currentUser?.role == "SuporteTecnico"
    const[empresa,setEmpresa] = useState<string>("")
    const [contato, setContato] = useState<string>('');
    const [cnpj, setCnpj] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [endereco, setEndereco] = useState<string>('');
  
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const [atividadesInRd,setAtividadesInRd] = useState<IAtividadeRd[]>([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[delayNovaAtividade,setDelayNovaAtividade] = useState<boolean>()
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

 
  
    useEffect(() => {

     //@ts-ignore
     const user = JSON.parse(localStorage.getItem("currentUser"));
     if(user != null)
     {
         setCurrentUser(user)
   
     }
       
    }, []);


    const {data:relatorioDiario,refetch:refetchRelatorioDiario} = useQuery({
    queryKey:["relatorio-diario",params.reportId],
    queryFn:()=>getRelatorioDiarioById(params.reportId),
    staleTime:72000000,
    cacheTime:72000000,
    onSuccess:(res)=>{
        setEmpresa (res.empresa)
        setContato(res.contato)
        setTelefone(res.telefone)
        setEndereco(res.endereco)
        setCnpj(res.cnpj)
    }
})

const {data:atividades,refetch:refetchAtividades} =useQuery<IAtividadeRd[]>({
    queryKey:["atividades",`atividades-rd-${params.reportId}`],
    queryFn:()=>getAllAtivdadesInRd(params.reportId),
    staleTime:1000*60*60,
    cacheTime:1000*60*60

})


const handleKeyDown =async (event: React.KeyboardEvent<HTMLInputElement>) => {
   
    if (event.key === "Enter") {

      await handleUpdateRelatorioDiario()

    }
  };
  const getInformacoesEmpresaRd = async(empresa:string)=>{

    if(empresa.length){

        const res = await getEmpresaRelatorioDiario(empresa)
        setCnpj(res.cnpj)
        setContato(res.contato)
        setEndereco(res.endereco)
        setTelefone(res.telefone)
        handleUpdateRelatorioDiario()
    }
}
const handleCreateaAtividade = async ()=>{

    setDelayNovaAtividade(true)
        const atividadeRd:IAtividadeRd = {
            descricao:descricaoAtividade,
            relatorioRdId: relatorioDiario.id,
            relatorioDiario : {}
        }
        const res : any = await createAtividadeRd(atividadeRd)
        if (res){
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Adicionada Ao Relatório");
            refetchAtividades()
            setDescricaoAtividade("")
        }
        setTimeout(()=>{
        setDelayNovaAtividade(false)
        },1200)
}


const handleDeleteAtividade = async(id:number)=>{

    const imagens :IImagemAtividadeRd []= await getAllImagensInAtividade(id)
    
    //Caso o usuário deleta a atividade Direto ,sem deletar as imagens,ira iterar sobre todas as imagens daquela atiivdade antes de deletá-la e apagar as imagens do azure

    if(imagens.length > 1 )
    {
   
        await deleteAllImagesFromAtividadeFromAzure(imagens)
         await deleteAtividadeRd(id)

    }
    else{
        
        if(imagens.length) await deleteImagemAtividadeRd(imagens[0].id) 
        const res = await deleteAtividadeRd(id)

        if(res)
        {
            setOpenSnackBar(true);
            setSeveridadeAlert("success");
            setMessageAlert("Atividade Removida ");
        }
    }


    refetchAtividades()

}
const handleUpdateRelatorioDiario = async()=>{

    const rd: IRelatorioDiario = {
        id:relatorioDiario.id,
        empresa:empresa.toUpperCase(),
        contato:contato.toUpperCase(),
        cnpj:cnpj,
        telefone:telefone,
        endereco:endereco,
        responsavelAbertura:relatorioDiario.responsavelAbertura
    }

    const res = await updateRelatorioDiario(rd)

    if (res == 200){
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Relatório Diário Atualizada");
    }

}
const finalizarRelatorioDiario = useMutation({
    mutationKey:[`finalizar-rd`,`finish-relatorio-diario-${params.reportId}`],
    mutationFn:()=>updateFinishRelatorioDiario(params.reportId),
    onSuccess:()=>refetchRelatorioDiario()
})


const atualizarTarefaMutation = useMutation({
    mutationFn:(task:IAtividadeRd)=>updateAtividadeRd(task),
    onSuccess:()=>{

                setOpenSnackBar(true);
                setSeveridadeAlert("success");
                setMessageAlert("Atividade Atualizada");
                refetchAtividades()
            
    }

})

const updateAtividade  = (atividade: IAtividadeRd , status: string | undefined, observacoes: string | undefined ,descricao: string | undefined)=>{

    if(atividades!= undefined){

        const novaAtividade: IAtividadeRd[] = [...atividades]
        const index = atividades.findIndex(x=>x.id==atividade.id)
        novaAtividade[index].status =status ;
        novaAtividade[index].observacoes = observacoes;
        novaAtividade[index].descricao = descricao;
    
        atualizarTarefaMutation.mutate(novaAtividade[index])
    }


}
  

   
    return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center max-sm:text-[21px] md:text-2xl  mt-4 font-bold'>Relatório Diário Nº {relatorioDiario?.id} - Responsável - {relatorioDiario?.responsavelAbertura}</h1>
    <h2 className={`text-center max-sm:text-2xl md:text-2xl font-bold ${relatorioDiario?.isFinished ?"italic":"not-italic"}`  }>Status: {relatorioDiario?.isFinished?"Relatório Concluído":"Relatório Em Análise"}</h2>
    <div className='flex flex-col gap-8 self-center itens-center justify-center  '>

        {/* <ProgressBar progress = {completePercentage}/> */}

    <Flex direction="column" gap="4" className='flex flex-col gap-4 max-sm:w-[280px] max-md:w-[600px]'>
        <div className='flex max-md:flex-row max-sm:flex-col gap-4 max-sm:flex-wrap max-sm:justify-center  w-[100%] '>
           
        <TextField.Root >
                <TextField.Input 
                value={empresa}
                className='w-[250px]'
                variant='classic'
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                onChange={(x)=>{setEmpresa(x.target.value),getInformacoesEmpresaRd(x.target.value)}}
                placeholder='Cliente'>

                </TextField.Input>
            </TextField.Root>
            <TextField.Root >
                <TextField.Input
                className='w-[250px]' 
                value={endereco}
                variant='classic'
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                onChange={(x)=>setEndereco(x.target.value)}
                placeholder='Endereço'>

                </TextField.Input>
            </TextField.Root>
            
        </div>
        <div  className='flex max-md:flex-row max-sm:flex-col gap-4 max-sm:flex-wrap max-sm:justify-center  w-[100%] '>
            
            <TextField.Root  >
                <TextField.Input 
                className='w-[250px]'
                value={cnpj}
                variant='classic'
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                onChange={(x)=>setCnpj(x.target.value)}
                placeholder='CNPJ'>

                </TextField.Input>
            </TextField.Root>
            <TextField.Root >
                <TextField.Input 
                value={telefone}
                className='w-[250px]'
                variant='classic'
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                onChange={(x)=>setTelefone(x.target.value)}
                placeholder='Telefone'>

                </TextField.Input>
            </TextField.Root>
        </div>
    </Flex>

      {relatorioDiario  && (

       <PDFViewer width="1500" height="600">
      <RelatorioDiarioPDF
      atividadesRd={atividadesInRd}
      relatorioDiario = {relatorioDiario}
      />
    </PDFViewer>
      )}
        <div className='flex flex-row justify-center'>

        { conditionsRoles && !relatorioDiario?.isFinished && (

        <Button  onClick={onOpen} >
            Fechar Relatório
        </Button>
        )}
        </div>
    </div>


            <div className="overflow-x-auto flex flex-col self-center max-sm:w-[90%] md:w-[60%]  gap-9 border-1 border-black p-4 rounded-md  ">
                { !relatorioDiario?.isFinished && (
                    <>

                    <div className='flex flex-row items-center justify-center gap-4 max-sm:flex-wrap'>
                    <TextField.Root >
                        <TextField.Input 
                        value={descricaoAtividade}
                        className='w-[250px]'
                        variant='classic'
                        onKeyDown={handleKeyDown}
                        onBlur={handleUpdateRelatorioDiario}
                        onChange={(x)=>setDescricaoAtividade(x.target.value)}
                        placeholder='Atividade'>

                        </TextField.Input>
            </TextField.Root>
                    {!delayNovaAtividade && descricaoAtividade.length != 0 && (

                    <IconPlusSquare   className=' cursor-pointer ' height={"1.5em"} width={"1.5em"} onClick={handleCreateaAtividade} />
                    )}
                    </div>
                    </>
                )}

                {relatorioDiario && atividadesInRd &&  (
                    <Button
                        color='crimson' 
                        variant='outline'
                        highContrast
                        className={`w-[255px] p-3 my-auto max-sm:w-[75%] self-center`}
                        >
                            <PDFDownloadLink document={<RelatorioDiarioPDF
                                relatorioDiario = {relatorioDiario}
                                atividadesRd = {atividadesInRd}
                            />} fileName={`Relatorio Diário Nº${relatorioDiario.id}.pdf`}>
                                <div className='flex flex-row gap-2 max-sm:text-sm'>
                                <IconFileEarmarkPdf  height="1.3em" width="1.3em" />
                                Gerar PDF do Relatório Diário
                                </div>
                            </PDFDownloadLink>
                                
                            </Button>
                )}
        
                        {atividades?.length ?
                            (
                            <>
                                {  atividades?.map((atividade:IAtividadeRd)=>(

                                    <Atividade  key={atividade.id} relatorioDiario = {relatorioDiario} atividade={atividade} onUpdate={updateAtividade} onDelete={handleDeleteAtividade} isFinished={relatorioDiario?.isFinished} />
                                    
                                ))} 

                            </>
                        ):(
                            <div className="flex my-auto mx-auto">

                        <p>Sem Atividades No Momento</p>
                            </div>
                        )
                        }



            </div>

        </div>
        <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody>
                            <h2 className=' text-red-950 font-bold text-center mt-4'>
                                ATENÇÃO
                            </h2>
                            <p className='text-center font-bold'>
                                Finalize o relatório somente quado tiver total certeza
                            </p>
                            <p className='text-center font-bold'>
                                Digite AUTORIZAR
                            </p>
                            <Input

                                className="border-1 self-center border-black rounded-xl shadow-sm shadow-black mt-2 ml-5 mr-5 w-[250px] max-h-16"
                                onValueChange={setconfirmAuthorizeMessage}
                                value={confirmAuthorizeMessage}
                            />
                        </ModalBody>
                        <ModalFooter className='flex fle-row gap-4 '>
                            <Button color="crimson" size='3' variant="solid" className='p-2 ' onClick={onClose}>
                                Fechar
                            </Button>
                            {!relatorioDiario?.isFinished && confirmAuthorizeMessage=="AUTORIZAR"  && (
                            

                            <Button variant='outline' className='p-2' size="3" color='blue'  onClick={()=>finalizarRelatorioDiario.mutate()}>
                                Autorizar
                            </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        <Snackbar
            open={openSnackBar}
            autoHideDuration={2000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            onClose={(e) => setOpenSnackBar(false)}
        >
            <MuiAlert
                onClose={(e) => setOpenSnackBar(false)}
                severity={severidadeAlert}
                sx={{ width: "100%" }}
            >
                {messageAlert}
            </MuiAlert>
        </Snackbar>
     </>
)



}




