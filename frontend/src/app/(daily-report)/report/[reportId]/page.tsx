"use client"
import { Snackbar } from '@mui/material';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react';
import { useRouter } from "next/navigation";

import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";

import dayjs from 'dayjs';

import { logoComEnderecoBase64 } from '@/app/assets/base64Logo';
import IconExcel from '@/app/assets/icons/IconExcel';
import Atividade from '@/app/componentes/Atividade';
import { IAtividadeRd } from "@/app/interfaces/IAtividadeRd";
import { IRelatorioDiario } from "@/app/interfaces/IRelatorioDiario";
import {
    createAtividadeRd,
    deleteAtividadeRd,
    getAllAtivdadesInRd,
    updateAtividadeRd
} from "@/app/services/AtvidadeRd.Service";
import {
    getRelatorioDiario,
    updateFinishRelatorioDiario,
    updateRelatorioDiario
} from "@/app/services/RelatorioDiario.Services";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Excel from "exceljs";



export default function Report({params}:any){
    const route = useRouter()
    const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()
    var dataAtual = new Date();
    const [imageModal,setImageModal] = useState<any>()
    const [currentUser, setCurrentUser] = useState<any>(null);
    const conditionsRoles = currentUser?.role == "Administrador" || currentUser?.role == "Diretor" || currentUser?.role == "SuporteTecnico"
    const[contato,setContato] = useState<string>("")
    const [descricaoAtividade,setDescricaoAtividade] = useState<string>("");
    const [atividadesInRd,setAtividadesInRd] = useState<IAtividadeRd[]>([])
    const status : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [image,setImage] = useState<File[]>([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const [relatorioDiario,setRelatorioDiario] =  useState<IRelatorioDiario | any>()
    const [atividadeRdEditing,setAtividadeRdEditing] = useState<IAtividadeRd>()
    const letraPlanilha : string[] = ['A','B','C','D','E']
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
 
  
  
   
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
        const res = await getRelatorioDiario(id)
        console.log(res)
        setContato (res.contato)
        setRelatorioDiario(res)
    }
const getAtividades = async(id:number)=>{
    const res = await getAllAtivdadesInRd(id)
    console.log(res)
    setAtividadesInRd(res)
}

const finalizarRelatorioDiario = async() =>{

    const res = await updateFinishRelatorioDiario(params.reportId)

    if ( res == 200) {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Relatório Diário Fechado");
    }

}

const handleCreateaAtividade = async ()=>{

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
}

const handleDeleteAtividade = async(id:number)=>{

    const res = await deleteAtividadeRd(id)

    if(res)
    {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Atividade Removida ");
    }

    getAtividades(params.reportId)

}
const handleUpdateRelatorioDiario = async()=>{

    const rd: IRelatorioDiario = {
        id:relatorioDiario.id,
        contato:contato,
        responsavelAbertura:relatorioDiario.responsavelAbertura
    }
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
    const handleImageChange =  async (event :any) => {
        const selectedImage: File = event.target.files[0];

        const reader = new FileReader();

        reader.onloadend = async () => {
            // O resultado será um Blob representando a imagem
            const imgBlob = reader.result as string;
            // Agora você pode enviar esse Blob para o Azure Blob Storage
          // await uploadImageToAzure(imgBlob,selectedImage.name);
        };
        reader.readAsDataURL(selectedImage);

        if(selectedImage !=undefined){


        setImage(current=>[...current,selectedImage]);
        }
    };

    const createXlsxPlanilha = async (workbook:Excel.Workbook)=>{

        let buffer = await workbook.xlsx.writeBuffer();
        let blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        // Cria um objeto URL a partir do Blob
        let url = URL.createObjectURL(blob);

        // Cria um link de download e clica nele
        console.log(url)
        let a = document.createElement('a');
        a.href = url;
        a.download = `Relatório Diário Nº${relatorioDiario.id}.xlsx`
        a.click();

    }

    const includeBorderCell = (ws:Excel.Worksheet,celula:string)=>{

        ws.getCell(celula).border=bordas
        ws.getCell(celula).alignment={vertical:'middle',horizontal:'left'}

    }

    const cabecalhoPlanilha = (ws:Excel.Worksheet,wb:Excel.Workbook )=>{

        ws.mergeCells('A1','C1')


        ws.getRow(2).height=20


        ws.getCell(`B1`).border= bordas
        ws.getCell(`C1`).border= bordas
        ws.getCell(`D2`).border= bordas
        
        // CELULAS DE NUMERO DO RELATÓRIO E DO RESPOSNAVEL
        ws.mergeCells('A2','C2')
        ws.getCell(`A2`).border= bordas
        ws.getCell('A2').style.alignment={'vertical':"middle",'horizontal':"center"}
        ws.getCell('A2').font = {size:16}

        ws.mergeCells('A3','B3')

        ws.getCell('B3').value = " Atividade"
        ws.getCell('B3').alignment={vertical:'middle',horizontal:'center'}
        ws.getCell('B3').font = {size:14}

        ws.getRow(3).height=20

        ws.getCell('B3').border = bordas

        ws.getCell('C3').value = " Status"
        ws.getCell('C3').alignment={vertical:'middle',horizontal:'center'}
        ws.getCell('C3').border = bordas
        ws.getCell('C3').font = {size:14}



        ws.mergeCells('D1','E1')
        ws.mergeCells('C3','E3')
        ws.getCell('A2').value=`Relatório Diário Nº ${relatorioDiario.id}`

        ws.mergeCells('D2','E2')
        ws.getCell('D2').value=`Responsável: ${relatorioDiario.responsavelAbertura}\n Contratante/Contato: ${relatorioDiario.contato}`
        ws.getCell('D2').font = {size:14}
        ws.getCell('D2').alignment={vertical:'middle',horizontal:'center'}


        ws.getRow(1).height=80
        ws.getRow(2).height=40

        ws.getColumn(1).width=5
        ws.getColumn(2).width=70
        ws.getColumn(3).width=15
        ws.getColumn(4).width=15
        ws.getColumn(5).width=12


        ws.getCell('B1').alignment={vertical:'middle',horizontal:'center'}
        ws.getCell('B1').font = {size:16}

        ws.getCell('E1').value=`Data Relatório: ${dayjs(relatorioDiario.dataAbertura).format("DD/MM/YYYY").toString()}\n ${semana[dataAtual.getDay()]}`
        ws.getCell('E1').style.alignment={'vertical':"middle",'horizontal':"center"}
        ws.getCell('E1').font = {size:16}
        ws.getCell('E1').border = bordas




    }
    const generatePlanilha = async ()=>{

        /*
           Itera sobre a lista de materiais escolhidas no orçamento e poe numa respectiva célula,aonde cada iteração somara 3
           por que os itens de cada linha começa a partir da 3 linha,pois antes vem o cabeçalho e o título de cada item da linha

        */

        let atividadesConcluidas = 0;

         atividadesInRd.forEach((x)=>{
            if(x.status == "Concluída") atividadesConcluidas++;
         })

        const totalConcluidas = (atividadesConcluidas/ atividadesInRd.length) * 100

        const workbook : Excel.Workbook = new Excel.Workbook();

        const ws :Excel.Worksheet = workbook.addWorksheet(`Relatório Diário Nº${relatorioDiario.id}`)
        // ws.mergeCells("B1","C1")

        cabecalhoPlanilha(ws,workbook)


        for(let i in atividadesInRd)
        {


            const observacoes = atividadesInRd[i].observacoes==null || atividadesInRd[i].observacoes ==""?" Sem observações no momento":atividadesInRd[i].observacoes

            ws.getRow(Number(i)+4).height=30


            ws.mergeCells(`C${Number(i)+4}`,`E${Number(i)+4}`)
            ws.mergeCells(`A${Number(i)+4}`,`B${Number(i)+4}`)


            ws.getCell(letraPlanilha[1]+(Number(i)+4)).value = ` ${atividadesInRd[Number(i)].numeroAtividade} - ${atividadesInRd[Number(i)].descricao} \n${observacoes} `
            includeBorderCell(ws,letraPlanilha[1]+(Number(i)+4))

            ws.getCell(letraPlanilha[2]+(Number(i)+4)).value = atividadesInRd[Number(i)].status
            includeBorderCell(ws,letraPlanilha[2]+(Number(i)+4))
            ws.getCell(letraPlanilha[2]+(Number(i)+4)).style.alignment={'vertical':"middle",'horizontal':"center"}


            if(atividadesInRd[Number(i)].status == "Concluída"){

            ws.getCell(letraPlanilha[2]+(Number(i)+4)).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }, // Verde
            };
            }



        }

        ws.getRow(atividadesInRd.length+4).height=50


        const colC= ws.getColumn('C')
        colC.width= 10;

        const colB= ws.getColumn('B')
        colB.width= 50;

        ws.mergeCells(`A${atividadesInRd.length+4}`,`B${atividadesInRd.length+4}`)

        ws.getCell(`A${atividadesInRd.length+4}`).value= `Status Relátorio: ${relatorioDiario.isFinished ? `Relatório Concluído ${dayjs(relatorioDiario?.dataFechamento).format(`DD/MM/YYYY [as] HH:mm:ss`)} ` :"Em Análise"} `
        ws.getCell(`A${atividadesInRd.length+4}`).alignment={vertical:'middle',horizontal:'center'}
        ws.getCell(`A${atividadesInRd.length+4}`).border=bordas
        ws.getCell(`A${atividadesInRd.length+4}`).font = {size:11}

        ws.mergeCells(`C${atividadesInRd.length+4}`,`E${atividadesInRd.length+4}`)
        ws.getCell(`C${atividadesInRd.length+4}`).style.alignment={'vertical':"middle",'horizontal':"center"}

        ws.getCell(`E${atividadesInRd.length+4}`).font = {size:12}
        ws.getCell(`E${atividadesInRd.length+4}`).value= `% Atividades Concluída: ${totalConcluidas.toFixed(2)}%`
        ws.getCell(`B${atividadesInRd.length+4}`).alignment={vertical:'middle',horizontal:'center'}
        ws.getCell(`B${atividadesInRd.length+4}`).border=bordas

        const colD= ws.getColumn('D')
        colD.width= 30;


        const logo = workbook.addImage({
            base64: logoComEnderecoBase64,
            extension: 'png',
        })


        ws.addImage(logo, {
            tl: { col: 0.3, row: 0.1 },
            ext: { width: 440, height: 90 }
        });



         await createXlsxPlanilha(workbook)


    }
    return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center max-sm:text-base md:text-2xl mt-4'>Relatório Diário Nº {relatorioDiario?.id} - Responsável : {relatorioDiario?.responsavelAbertura}</h1>
    <h2 className='text-center max-sm:text-base md:text-2xl '>Status: {relatorioDiario?.isFinished?"Relatório Concluído":"Relatório Em Análise"}</h2>
    <div className='flex flex-col gap-8 self-center itens-center justify-center  '>


    <Input
         label = "Contato"
        labelPlacement='outside'
        value={contato}
        className="border-1 border-black rounded-md shadow-sm shadow-black  w-[200px] self-center"
        onValueChange={setContato}

      />
        <div className='flex flex-row gap-4'>
        <Button  onPress={handleUpdateRelatorioDiario} className='bg-master_black max-sm:w-[70%] md:w-[80%] mx-auto text-white rounded-md font-bold text-base  '>
            Atualizar Relatório
        </Button>
        { !relatorioDiario?.isFinished && (

        <Button  onPress={onOpen} className='bg-master_black max-sm:w-[50%] md:w-[80%] mx-auto text-white rounded-md font-bold text-base  '>
            Fechar Relatório
        </Button>
        )}
        </div>
    </div>


            <div className="overflow-x-auto flex flex-col self-center max-sm:w-[90%] md:w-[60%]  gap-9 border-1 border-black p-4  ">
                { !relatorioDiario?.isFinished && (
                    <>

                <Input
                    label = "Atividade"
                    labelPlacement='outside'
                    value={descricaoAtividade}
                    className="border-1 border-black rounded-md shadow-sm shadow-black mx-auto w-[200px]"
                    onValueChange={setDescricaoAtividade}

                />
                <Button  isDisabled={!descricaoAtividade} onPress={handleCreateaAtividade} className='bg-master_black max-sm:w-[50%] md:w-[20%] mx-auto text-white rounded-md font-bold text-base  '>
                    Adicionar Atividade
                </Button>
                    </>
                )}

                <Button className='max-sm:w-[50%] self-center'  color='success' variant='ghost'  onPress={generatePlanilha} >
                    <IconExcel/>
                Criar Relatório
            </Button>
                        {atividadesInRd?.length ?
                            (
                            <>
                                {atividadesInRd.map((atividade:IAtividadeRd)=>(

                                    <Atividade  key={atividade.id} atividade={atividade}onUpdate={updateAtividade} onDelete={handleDeleteAtividade} isFinished={relatorioDiario?.isFinished} />
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