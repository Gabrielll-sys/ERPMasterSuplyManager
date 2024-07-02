"use client"
import { Snackbar } from '@mui/material';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react';
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
    getRelatorioDiario,
    updateFinishRelatorioDiario,
    updateRelatorioDiario
} from "@/app/services/RelatorioDiario.Services";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ProgressBar } from '@/app/componentes/ProgressBar';




export default function Report({params}:any){
    const route = useRouter()
    const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()
    var dataAtual = new Date();
    const [imageModal,setImageModal] = useState<any>()
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
    const [relatorioDiario,setRelatorioDiario] =  useState<IRelatorioDiario | any>()
    const[delayNovaAtividade,setDelayNovaAtividade] = useState<boolean>()
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

    const completePercentage =30
  
   
    let date = dayjs()

    const bordas:any= {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
    }
    useEffect(() => {

     //@ts-ignore
     const user = JSON.parse(localStorage.getItem("currentUser"));
     if(user != null)
     {
         setCurrentUser(user)
   
     }
         getRelatorioDiarioById(params.reportId)
         getAtividades(params.reportId)
    }, []);


const getRelatorioDiarioById =async (id:number)=>
    {
        const res  = await getRelatorioDiario(id)
        setEmpresa (res.empresa)
        setContato(res.contato)
        setTelefone(res.telefone)
        setEndereco(res.endereco)
        setCnpj(res.cnpj)
        setRelatorioDiario(res)
    }
const getAtividades = async(id:number)=>{
    const res = await getAllAtivdadesInRd(id)
    setAtividadesInRd(res)
}

const handleKeyDown =async (event: React.KeyboardEvent<HTMLInputElement>) => {
   
    if (event.key === "Enter") {

      await handleUpdateRelatorioDiario()

    }
  };
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
            await getAtividades(relatorioDiario.id)
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


    getAtividades(params.reportId)

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
console.log(rd)
    const res = await updateRelatorioDiario(rd)

    if (res == 200){
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Relatório Diário Atualizada");
    }

}
const handleFinishRelatorioDiario = async () =>{

    const res = await updateFinishRelatorioDiario(params.reportId)
    getRelatorioDiarioById(params.reportId)

}

const updateAtividade  = async(atividade: IAtividadeRd, status: string, observacoes: string,descricao:string)=>{

    const novaAtividade: IAtividadeRd[] = [...atividadesInRd]
    const index = atividadesInRd.findIndex(x=>x.id==atividade.id)

    novaAtividade[index].status =status ;
    novaAtividade[index].observacoes = observacoes;
    novaAtividade[index].descricao = descricao;
     const res = await updateAtividadeRd(novaAtividade[index])

    if(res == 200)
    {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Atividade Atualizada");
        getAtividades(relatorioDiario.id)
    }

}
  

   
    return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center max-sm:text-[21px] md:text-2xl  mt-4 font-bold'>Relatório Diário Nº {relatorioDiario?.id} - Responsável - {relatorioDiario?.responsavelAbertura}</h1>
    <h2 className={`text-center max-sm:text-2xl md:text-2xl font-bold ${relatorioDiario?.isFinished ?"italic":"not-italic"}`  }>Status: {relatorioDiario?.isFinished?"Relatório Concluído":"Relatório Em Análise"}</h2>
    <div className='flex flex-col gap-8 self-center itens-center justify-center  '>

        {/* <ProgressBar progress = {completePercentage}/> */}

    <div className='flex flex-col gap-4 w-[600px]'>
        <div className='flex flex-row gap-4 max-sm:flex-wrap max-sm:justify-center w-[100%] '>
            <Input
                 label = "Cliente"
                labelPlacement='outside'
                value={empresa}
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                className="border-1 border-black rounded-md shadow-sm shadow-black max-md:w-[280px] max-sm:w-[300px]  self-center"
                onValueChange={setEmpresa}
              />
            <Input
                 label = "Endereço"
                labelPlacement='outside'
                value={endereco}
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                className="border-1 border-black rounded-md shadow-sm shadow-black  max-md:w-[250px] max-sm:w-[300px] self-center"
                onValueChange={setEndereco}
              />
        </div>
        <div className='flex flex-row max-sm:flex-wrap gap-4 max-sm:justify-center'>
            <Input
                 label = "CNPJ"
                labelPlacement='outside'
                value={cnpj}
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                className="border-1 border-black rounded-md shadow-sm shadow-black  max-md:w-[250px] max-sm:w-[300px] self-center"
                onValueChange={setCnpj}
              />
            <Input
                 label = "Telefone"
                labelPlacement='outside'
                value={telefone}
                onKeyDown={handleKeyDown}
                onBlur={handleUpdateRelatorioDiario}
                className="border-1 border-black rounded-md shadow-sm shadow-black  max-md:w-[250px] max-sm:w-[300px] self-center"
                onValueChange={setTelefone}
              />
        </div>
    </div>

      {/* {relatorioDiario  && (

       <PDFViewer width="1500" height="600">
      <RelatorioDiarioPDF
      relatorioDiario = {relatorioDiario}
      />
    </PDFViewer>
      )} */}
        <div className='flex flex-row justify-center'>

        { conditionsRoles && !relatorioDiario?.isFinished && (

        <Button  onPress={onOpen} className='bg-master_black max-sm:w-[60%] md:w-[30%] mx-auto text-white rounded-md font-bold text-base  '>
            Fechar Relatório
        </Button>
        )}
        </div>
    </div>


            <div className="overflow-x-auto flex flex-col self-center max-sm:w-[90%] md:w-[60%]  gap-9 border-1 border-black p-4 rounded-md  ">
                { !relatorioDiario?.isFinished && (
                    <>

                    <div className='flex flex-row items-center justify-center gap-4 max-sm:flex-wrap'>
                    <Input
                        label="Atividade"
                        labelPlacement='outside'
                        value={descricaoAtividade}
                        className="border-1 border-black rounded-md shadow-sm shadow-black w-[250px]"
                        onValueChange={setDescricaoAtividade}
                    />
                    {!delayNovaAtividade && descricaoAtividade.length != 0 && (

                    <IconPlusSquare   className=' cursor-pointer mt-6' height={"1.5em"} width={"1.5em"} onClick={handleCreateaAtividade} />
                    )}
                    </div>
                    </>
                )}

                {relatorioDiario && (
                    <Button
                        color='danger' 
                        variant='ghost'
                        
                        className={`w-[225px] p-3 my-auto max-sm:w-[70%] self-center`}
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
        
                        {atividadesInRd?.length ?
                            (
                            <>
                                {atividadesInRd.map((atividade:IAtividadeRd)=>(

                                    <Atividade  key={atividade.id} relatorioDiario = {relatorioDiario} atividade={atividade}onUpdate={updateAtividade} onDelete={handleDeleteAtividade} isFinished={relatorioDiario?.isFinished} />
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
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fechar
                            </Button>
                            {!relatorioDiario?.isFinished && (

                            <Button isDisabled={confirmAuthorizeMessage!="AUTORIZAR"} color="primary" onPress={handleFinishRelatorioDiario}>
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




