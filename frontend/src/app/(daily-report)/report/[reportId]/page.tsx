"use client"
import {Link, Button,Autocomplete,Textarea, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import {  Snackbar} from '@mui/material';
import { useRouter } from "next/navigation";

import {Table} from 'flowbite-react';
import React, { useEffect, useRef, useState } from "react";
import "dayjs/locale/pt-br";

import dayjs from 'dayjs';

import {
    createAtividadeRd,
    deleteAtividadeRd,
    getAllAtivdadesInRd,
    updateAtividadeRd
} from "@/app/services/AtvidadeRd.Service";
import Image from "next/image";
import {uploadImageToAzure} from "@/app/services/Images.Services";
import MuiAlert, {AlertColor} from "@mui/material/Alert";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {getRelatorioDiario} from "@/app/services/RelatorioDiario.Services";
import Atividade from "@/app/componentes/Atividade";
import Excel from "exceljs";
import {logoBase64} from "@/app/assets/base64Logo";



export default function Report({params}:any){
    const route = useRouter()
  const[inputIsEditable,setInputIsEditable] = useState<boolean>(true)
    const [imageModal,setImageModal] = useState<any>()
    const[observacoesRd,setObservacoesRd] = useState<string>("")
    const[contato,setContato] = useState<string>()
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
    const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];
    let date = dayjs()

    const bordas:any= {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
    }
    useEffect(() => {

         getRelatorioDiarioById(params.reportId)
         getAtividades(params.reportId)
    }, []);


const getRelatorioDiarioById =async (id:number)=>
    {
        const res = await getRelatorioDiario(id)
        setObservacoesRd(res.observacoes)
        setContato (res.contato)
        setRelatorioDiario(res)
    }
const getAtividades = async(id:number)=>{
    const res = await getAllAtivdadesInRd(id)
    console.log(res)
    setAtividadesInRd(res)
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
const updateRelatorioDiario = async()=>{
    const relatorioDiario: IRelatorioDiario = {
        contato:contato,
        observacoes:observacoesRd,

    }
}

const updateAtividade  = async(atividade: IAtividadeRd, status: string, observacoes: string)=>{

    const novaAtividade: IAtividadeRd[] = [...atividadesInRd]
    const index = atividadesInRd.findIndex(x=>x.id==atividade.id)

    novaAtividade[index].status =status ;
    novaAtividade[index].observacoes = observacoes;

     const res = await updateAtividadeRd(novaAtividade[index])

    if(res == 200)
    {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Atividade Atualizada");
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

        ws.getCell(`A1`).border= bordas
        ws.getCell(`B1`).border= bordas
        ws.getCell(`C1`).border= bordas




        ws.getCell('A2').value = "Numero"
        ws.getCell('A2').border = bordas
        ws.getCell('B2').value = "Atividade"
        ws.getCell('B2').border = bordas
        ws.getCell('C2').value = "Status"
        ws.getCell('C2').border = bordas


        ws.mergeCells('A1','B1')
        ws.mergeCells('C1','E1')

        ws.getRow(1).height=80

        ws.getColumn(1).width=5
        ws.getColumn(2).width=70
        ws.getColumn(3).width=15
        ws.getColumn(4).width=15
        ws.getColumn(5).width=12

        // ws.getCell('B1').value=nomeOrçamento

        ws.getCell('B1').alignment={vertical:'middle',horizontal:'center'}
        ws.getCell('B1').font = {size:18}


        ws.getCell('E1').value="Data Relatório:"+" "+dayjs(relatorioDiario.dataAbertura).format("DD/MM/YYYY").toString()
        ws.getCell('E1').style.alignment={'vertical':"middle",'horizontal':"center"}
        ws.getCell('E1').font = {size:16}

    }
    const generatePlanilha = async ()=>{

        /*
           Itera sobre a lista de materiais escolhidas no orçamento e poe numa respectiva célula,aonde cada iteração somara 3
           por que os itens de cada linha começa a partir da 3 linha,pois antes vem o cabeçalho e o título de cada item da linha

        */

        const workbook : Excel.Workbook = new Excel.Workbook();

        const ws :Excel.Worksheet = workbook.addWorksheet(`Relatório Diário Nº${relatorioDiario.id}`)

        cabecalhoPlanilha(ws,workbook)


        for(let i in atividadesInRd)
        {



            ws.getCell(letraPlanilha[0]+(Number(i)+3)).value = atividadesInRd[Number(i)].numeroAtividade
            includeBorderCell(ws,letraPlanilha[0]+(Number(i)+3))

            ws.getCell(letraPlanilha[1]+(Number(i)+3)).value = atividadesInRd[Number(i)].descricao
            includeBorderCell(ws,letraPlanilha[1]+(Number(i)+3))

            ws.getCell(letraPlanilha[1]+(Number(i)+3)).value = atividadesInRd[Number(i)].status
            includeBorderCell(ws,letraPlanilha[2]+(Number(i)+3))

            if(atividadesInRd[Number(i)].status == "Concluída"){

            ws.getCell(letraPlanilha[2]+(Number(i)+3)).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }, // Verde
            };
            }




        }

        ws.getRow(atividadesInRd.length+3).height=50


        const colC= ws.getColumn('C')
        colC.width= 30;

        ws.getCell(`B${atividadesInRd.length+3}`).value= `Observações: ${relatorioDiario.observacoes == null ? "Sem Observações": relatorioDiario.observacoes}`
        ws.getCell(`B${atividadesInRd.length+3}`).alignment={vertical:'middle',horizontal:'center'}
        ws.getCell(`B${atividadesInRd.length+3}`).border=bordas



        const colD= ws.getColumn('D')
        colD.width= 30;


        const logo = workbook.addImage({
            base64: logoBase64,
            extension: 'png',
        })


        ws.addImage(logo, {
            tl: { col: 0.7, row: 0.2 },
            ext: { width: 115, height: 70 }
        });



        createXlsxPlanilha(workbook)


    }
    return(
    <>

        <div className="justify-center flex flex-col  gap-10">
    <h1 className='text-center text-2xl mt-4'>Relatório Diário Nº {relatorioDiario?.id}</h1>
    <div className='flex flex-col gap-4 self-center itens-center justify-center  '>


    <Input
         label = "Contato"
        labelPlacement='outside'
        value={contato}
         isReadOnly={inputIsEditable}
        className="border-1 border-black rounded-md shadow-sm shadow-black  w-[200px]"
        onValueChange={setContato}

      />
        <Textarea
            placeholder="Observaçoes do Relatório Diário"
            className="max-w-[390px] p-3 rounded-base shadow-sm shadow-black"
            rows = {5}
            value={observacoesRd}
            onValueChange = {setObservacoesRd}
        />

    </div>


            <div className="overflow-x-auto flex flex-col self-center max-sm:w-[90%] md:w-[60%]  gap-9   ">
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
                <Button   onPress={generatePlanilha} >
               Gerar Relatório
            </Button>
                        {atividadesInRd?.length ?
                            (
                            <>
                                {atividadesInRd.map((atividade:IAtividadeRd)=>(

                                    <Atividade  key={atividade.id} atividade={atividade}onUpdate={updateAtividade} onDelete={handleDeleteAtividade} />
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

        <Snackbar
            open={openSnackBar}
            autoHideDuration={3000}
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
