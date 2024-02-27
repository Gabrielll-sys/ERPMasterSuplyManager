"use client"
import {Link, Button,Autocomplete, AutocompleteItem, Input,Textarea, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";

import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateInventory.module.css";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IMaterial from '@/app/interfaces/IMaterial';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import imagem from '/src/app/assets/logo.png'
import { useReactToPrint } from 'react-to-print';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import { IFilterMaterial } from '@/app/interfaces/IFilterMaterial';
import { IOrderServico } from '@/app/interfaces/IOrderServico';
import { useSession } from 'next-auth/react';
import { IInventario } from '@/app/interfaces/IInventarios';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IItem } from '@/app/interfaces/IItem';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import dayjs from 'dayjs';
import { logoBase64 } from '../assets/base64Logo';
import { get } from 'http';
import OrcamentoPDF from '../componentes/OrcamentoPDF';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';


export default function BudgeManagement({params}:any){
    const route = useRouter()
    const { data: session } = useSession();
  
    const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()


    const[nomeOrçamento,setNomeOrçamento] = useState<string>("")

    const[inventarioDialog,setInventarioDialog] = useState<IInventario>()

    const [materiais,setMateriais]= useState<IInventario[] >([])

    const [openDialog,setOpenDialog] = useState<boolean>(false)

  const [openList,setOpenList] = useState<boolean>(false)
  const[precoCustoTotalOrcamento,setPrecoCustoTotalOrcamento] = useState<number >();
  const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();
  const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>()
  const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
  const[materiaisOrcamento,setMateriaisOrcamento] = useState<IInventario[]>([])
  const doc = new jsPDF()
    let date = dayjs()
  const letraPlanilha : string[] = ['A','B','C','D','E']

    const bordas:any= {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }


    useEffect(()=>{

        getAllMaterial()
  
  
       },[])
    useEffect(()=>{

      calcPrecoVenda()
      calcPrecoCusto()
    },[materiaisOrcamento])

    const getAllMaterial = async()=>{

        const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
         
         return r.data
        
    })

    for(let i=50; i<100;i++)
      {
        console.log(materiaisWithInvetory[i].material.precoVenda!=null )
              
                setMateriaisOrcamento(current=>[...current,materiaisWithInvetory[i]])
                materiaisWithInvetory[i].quantidadeMaterial=500;
              
            
        }    
        setMateriais(materiaisWithInvetory)
      }
      const handleOpenDialog =  (item:any)=>{

        setInventarioDialog(item)
        setOpenDialog(true)
      
      }
      const handleCloseDialog = ()=>{

        if(isEditingOs) setIsEditingOs(false)
      
        setOpenDialog(false)
        setQuantidadeMaterial("")
        setInventarioDialog(undefined)
      }
      const handleAddMaterialOrcamento = (item?:any)=>{

      let a = Object.assign(item)
      let material = {...a,quantidadeMaterial:quantidadeMaterial}
        setMateriaisOrcamento(current =>[...current,material])
        handleCloseDialog()
      }

      const handleUpdateItem = (item?:IInventario) =>{
    

      }
      const handleDelete = (material:IInventario) =>{
        const newList: IInventario[]   = materiaisOrcamento.filter(x=>x!=material)

      setMateriaisOrcamento(newList)
      }

      const calcPrecoVenda = () =>{

        let custoTotal:number | undefined = 0

        for(let item of materiaisOrcamento){
          
            custoTotal+=item.material.precoVenda*item.quantidadeMaterial
        

        }
        setPrecoVendaTotalOrcamento(Number(custoTotal.toFixed(2)))
    

      }
      const calcPrecoCusto = () =>{
   
        let custoTotal:number | undefined = 0

          for(let item of materiaisOrcamento){
       
              custoTotal+=item.material.precoCusto*item.quantidadeMaterial

          }
          setPrecoCustoTotalOrcamento(Number(custoTotal.toFixed(2)))
          

      }
      const isNullIsZero = (value:number)=>{

        return value==null?0:"R$"+value.toFixed(2).toString().replace('.',',')
      }
      const createXlsxPlanilha = async (workbook:Excel.Workbook)=>{

        let buffer = await workbook.xlsx.writeBuffer();
        let blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        // Cria um objeto URL a partir do Blob
        let url = URL.createObjectURL(blob);

        // Cria um link de download e clica nele
        console.log(url)
        let a = document.createElement('a');
        a.href = url;
        a.download = `${nomeOrçamento}.xlsx`
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




        ws.getCell('A2').value = "Id"
        ws.getCell('A2').border = bordas
        ws.getCell('B2').value = "Descrição Material"
        ws.getCell('B2').border = bordas
        ws.getCell('C2').value = "Preço Custo"
        ws.getCell('C2').border = bordas
        ws.getCell('D2').value = "Preço Venda"
        ws.getCell('D2').border = bordas
        ws.getCell('E2').value = "Quantidade"
        ws.getCell('E2').border = bordas

        ws.mergeCells('A1','B1')
        ws.mergeCells('C1','E1')

        ws.getRow(1).height=80

        ws.getColumn(1).width=5
        ws.getColumn(2).width=70
        ws.getColumn(3).width=15
        ws.getColumn(4).width=15
        ws.getColumn(5).width=12

        ws.getCell('B1').value=nomeOrçamento
        
        ws.getCell('B1').alignment={vertical:'middle',horizontal:'center'}
        ws.getCell('B1').font = {size:18}

   
        ws.getCell('E1').value="Data Orçamento:"+" "+dayjs(date).format("DD/MM/YYYY").toString()
        ws.getCell('E1').style.alignment={'vertical':"middle",'horizontal':"center"}
        ws.getCell('E1').font = {size:16}
        
      }
      
      



      const generatePlanilha = async ()=>{
        
        /*
           Itera sobre a lista de materiais escolhidas no orçamento e poe numa respectiva célula,aonde cada iteração somara 3
           por que os itens de cada linha começa a partir da 3 linha,pois antes vem o cabeçalho e o título de cada item da linha
   
        */

        const workbook : Excel.Workbook = new Excel.Workbook();
        
        const ws :Excel.Worksheet = workbook.addWorksheet(nomeOrçamento)
       
        cabecalhoPlanilha(ws,workbook)
        

        for(let i in materiaisOrcamento)
        {
      
          let precoCusto = isNullIsZero(materiaisOrcamento[Number(i)].material.precoCusto)
          let precoVenda = isNullIsZero(materiaisOrcamento[Number(i)].material.precoVenda)

          ws.getCell(letraPlanilha[0]+(Number(i)+3)).value = materiaisOrcamento[Number(i)].material.id
          includeBorderCell(ws,letraPlanilha[0]+(Number(i)+3))

          ws.getCell(letraPlanilha[1]+(Number(i)+3)).value = materiaisOrcamento[Number(i)].material.descricao
          includeBorderCell(ws,letraPlanilha[1]+(Number(i)+3))

          ws.getCell(letraPlanilha[2]+(Number(i)+3)).value ="R$"+ precoCusto
          includeBorderCell(ws,letraPlanilha[2]+Number(i))

          ws.getCell(letraPlanilha[3]+(Number(i)+3)).value = "R$" + precoVenda
          includeBorderCell(ws,letraPlanilha[3]+(Number(i)+3))

          ws.getCell(letraPlanilha[4]+(Number(i)+3)).value = materiaisOrcamento[Number(i)].quantidadeMaterial+" "+materiaisOrcamento[Number(i)].material.unidade
          includeBorderCell(ws,letraPlanilha[4]+(Number(i)+3))


      }

    ws.getRow(materiaisOrcamento.length+3).height=50
    

    const colC= ws.getColumn('C')
    colC.width= 30;

    ws.getCell(`B${materiaisOrcamento.length+3}`).value= `Quantidade De Materias No Orçamento:${materiaisOrcamento.length}`
    ws.getCell(`B${materiaisOrcamento.length+3}`).alignment={vertical:'middle',horizontal:'center'}
    ws.getCell(`B${materiaisOrcamento.length+3}`).border=bordas

    ws.getCell(`C${materiaisOrcamento.length+3}`).value= `Preço Custo Total:R$${precoCustoTotalOrcamento?.toFixed(2)}`
    ws.getCell(`C${materiaisOrcamento.length+3}`).alignment={vertical:'middle',horizontal:'center'}
    ws.getCell(`C${materiaisOrcamento.length+3}`).border=bordas

    ws.getCell(`D${materiaisOrcamento.length+3}`).value= `Preço Venda Total:R$${precoVendaTotalOrcamento?.toFixed(2)}`
    ws.getCell(`D${materiaisOrcamento.length+3}`).alignment={vertical:'middle',horizontal:'center'}
    ws.getCell(`D${materiaisOrcamento.length+3}`).border=bordas

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
    <div className='flex flex-col  mt-10  justify-center text-center '>
     <Autocomplete
           label="Material"
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="max-w-[600px]  self-center border-1 border-black rounded-xl shadow-sm shadow-black"
         >

         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material.marca}</p>
              { !materiaisOrcamento.includes(item) &&
              <IconPlus  onClick={()=>handleOpenDialog(item)} />
              }
     
             </>
             }
             startContent={<p>{item.material.id} -</p>}
              value={item.material.descricao}
              >
              {item.material.descricao}
            </AutocompleteItem>
          ))}
          </Autocomplete>
          <div className='flex flex-row justify-between w-[430px]'>
          <Input
        value={nomeOrçamento}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setNomeOrçamento}
        label="Nome Orçamento" 
      />
      <Button 
      isDisabled={!nomeOrçamento?.length}
        className="bg-master_black text-white p-7 rounded-lg font-bold text-lg shadow-lg mt-10 "
      onPress={generatePlanilha}>Gerar Planilha</Button>
      </div>
     </div>
     <div className=''>
        <Accordion className="ml-6">
      <AccordionItem key="1" aria-label="`Materias do Orçamento" subtitle="Pressione para expandir" title={`Materias do Orçamento ${materiaisOrcamento?.length}`}>
        {materiaisOrcamento.map(x=>(
           
           <div className='flex flex-row justify-between w-[800px] '>
            <p className='m-4 max-w-[250px]'>{x.material.id}- {x.material.descricao}</p>
            <p >{x.quantidadeMaterial} {x.material.unidade}</p>
    
  
  <IconBxTrashAlt onClick={()=>handleDelete(x)} />




           </div>
        ))}
      </AccordionItem>
   
    </Accordion>
        <div className='flex flex-col ml-8 gap-2'>
          <p className='mt-5 font-bold text-lg'>Preço Custo Total:R$ {precoCustoTotalOrcamento?.toString().replace('.',',')}</p>
          <p  className='mt-5 font-bold  text-lg'>Preço Venda Total:R$ {precoVendaTotalOrcamento?.toString().replace('.',',')}</p>

          
          <PDFDownloadLink document={   <OrcamentoPDF 
          materiaisOrcamento ={materiaisOrcamento} 
          nomeOrçamento={nomeOrçamento}
          nomeUsuario={session?.user?.name}
          
          />} fileName={nomeOrçamento+".pdf"}>
              {({ blob, url, loading, error }) => (loading ? 'Carregando documento...' : 'Abrir PDF em nova aba')}
            </PDFDownloadLink>
        </div>
     </div>
     <Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}>{isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material.descricao}</DialogTitle>
    <DialogContent >

      <p className='text-center'>
        Estoque: {inventarioDialog?.saldoFinal == 0 || null?0:inventarioDialog?.saldoFinal} {inventarioDialog?.material.unidade} 
          </p>
      <div className=' flex flex-row justify-center'>
        <Input
          type='number'
          autoFocus
          className="border-1   border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px] max-h-14"
          endContent={<p>{isEditingOs? itemToBeUpdated?.material.unidade:inventarioDialog?.material.unidade}</p>}
          onValueChange={setQuantidadeMaterial}
        
          value={quantidadeMaterial}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onPress={handleCloseDialog}>Fechar</Button>
       
        <Button  onPress={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>
     </>
)



}