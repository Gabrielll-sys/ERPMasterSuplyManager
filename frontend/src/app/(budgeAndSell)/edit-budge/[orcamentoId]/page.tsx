"use client"
import {Link, Button,Autocomplete,Textarea, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import DocumentViewer, { PDFViewer } from "@react-pdf/renderer"


import { Card, Dropdown, Table} from 'flowbite-react';
import { use, useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from '@/app/api/webApiUrl';

import MuiAlert, { AlertColor } from "@mui/material/Alert";
import IMaterial from '@/app/interfaces/IMaterial';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios, { AxiosResponse } from "axios";
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


import dayjs from 'dayjs';
import { logoBase64 } from '@/app/assets/base64Logo';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrcamentoPDF from '@/app/componentes/OrcamentoPDF';
import IconEdit from '@/app/assets/icons/IconEdit';
import { SearchIcon } from '@/app/assets/icons/SearchIcon';



export default function ManageBudges({params}:any){
  const route = useRouter()
  const { data: session } = useSession();

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()

  const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()


  const[nomeOrçamento,setNomeOrçamento] = useState<string>("DF")

  const[inventarioDialog,setInventarioDialog] = useState<IInventario>()
  const [orcamento,setOrcamento]= useState<any>()

  const [materiais,setMateriais]= useState<IInventario[] >([])
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [precoVendaNovoMaterial,setPrecoVendaNovoMaterial] = useState<string>("")
  const [descricaoOs,setDescricaoOs] = useState<string>()
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [openDialog,setOpenDialog] = useState<boolean>(false)
  const[nomeCliente,setNomeCliente] = useState<string>()
  const[emailCliente,setEmailCliente] = useState<string>()
  const[telefone,setTelefone] = useState<string>()
  const[endereco,setEndereco] = useState<string>()


  const[cpfOrCnpj,setCpfOrCnpj] = useState<string>("")
  const[empresa,setEmpresa] = useState<string>()
  const [metodoPagamento,setMetodoPagamento] = useState<any>("")
  const [desconto,setDesconto] = useState<string>("")
  const [acrescimo,setAcrescimo] = useState<string>("")
  const [observacoes,setObservacoes] = useState<string>("")

  const [itensOrcamento,setItensOrcamento]= useState<any[]>([])

const[precoCustoTotalOrcamento,setPrecoCustoTotalOrcamento] = useState<number >();
const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();
const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>("")
const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
const[materiaisOrcamento,setMateriaisOrcamento] = useState<any>([])
const[precoVendaComDesconto,setPrecoVendaComDesconto] = useState<any>(null)
const[openDialogPreco,setOpenDialogPreco] = useState<boolean>(false)
const[descricao,setDescricao] = useState<string>("")

const [loading, setLoading] = useState(false);

const doc = new jsPDF()
  let date = dayjs()
const letraPlanilha : string[] = ['A','B','C','D','E']
const formasPagamento : string[] = ["Boleto", "PIX", "Cartão De Crédito", "Cartão De Débito"];

  const bordas:any= {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
  }
   
    useEffect(()=>{

      getAllItensOrcamento(params.orcamentoId)
      getAllMateriaisInOrcamento(params.orcamentoId)
      // getAllMaterial()
      getInfosBudge()
    
     },[])
  useEffect(()=>{

    calcPrecoVenda()
    calcPrecoCusto()
  },[materiaisOrcamento])

  useEffect(()=>{
    calcPrecoVenda()

  },[desconto])

  useEffect(()=>{
    calcPrecoVenda()

  },[materiaisOrcamento])

  useEffect(()=>{
    searchByDescription()

  },[descricao])

  const searchByDescription = async () => {



   try{
    if(descricao.length){

      const res = await axios
      .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao.split("#").join(".")}`)
      .then( (r)=> {
  
       return r.data
       
      })
      .catch();
      console.log(res)
  
      setMateriais(res)
    }

   }
   catch(e) 
   
   { 
   

console.log(e)
   }
  
};
  const getAllMateriaisInOrcamento = async(id:number)=>{

      const res = await axios.get(`${url}/ItensOrcamento/GetAllMateriaisOrcamento/${id}`).then((r)=>{
        console.log(r.data)
        setMateriaisOrcamento(r.data)
        return r.data

      }).catch(e=>console.log(e))

      //Itera sobre os materiais,caso o item com id do material tenha um valor de preco de venda que foi alterado para orçamento,então passará a ser o o pre
      // o preço de venda do material no array mostrado da page
      for(let item of res){
        
        if(item.precoItemOrcamento != null)
        item.material.precoVenda = item.precoItemOrcamento

      }

  }
  const getAllItensOrcamento = async(id:number)=>{

    const res = await axios.get(`${url}/ItensOrcamento/GetAllItensOrcamento/${id}`).then((r)=>{
      console.log(r.data)
      setItensOrcamento(r.data)
    return r.data

    }).catch(e=>console.log(e))



}

//Função criada para pegar o ultimo registro de movimentação de um determinado material presente na tabela do orçamento,para parecer a o estoque quando for editar a quantidade
// presente na tabela do orçamento,para parecer a o estoque quando for editar a quantidade
const getEstoqueMaterial =  async (id:number)=>{

  const res =  await axios.get(`${url}/Inventarios/GetLastRegister/${id}`).then((r)=>{
 console.log(r.data)
    setInventarioDialog(r.data[0])
   
  return r.data

  }).catch(e=>console.log(e))
console.log(res)
}
  
const handleUpdateOrcamento = async()=>{
  
  console.log(metodoPagamento)
  const budge = {
    id:orcamento.id,
    desconto:Number(desconto),
    tipoPagamento:metodoPagamento,
    nomeCliente:nomeCliente,
    empresa:empresa,
    emailCliente:emailCliente,
    telefone:telefone,
    endereco:endereco,
    CPFOrCNPJ:cpfOrCnpj,
    acrescimo:Number(acrescimo),
    observacoes:observacoes,
    responsavelOrcamento:session?.user?.name,



  }

  const res = await axios.put(`${url}/Orcamentos/${orcamento.id}`,budge).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Orcamento Atualizado com sucesso");
    getInfosBudge()


  }).catch(e=>console.log(e))

}
const handleUpdateOrcamentoToSell = async()=>{
  
 
  const budge = {
    id:orcamento.id,
    desconto:Number(desconto),
    tipoPagamento:metodoPagamento,
    nomeCliente:nomeCliente,
    empresa:empresa,
    emailCliente:emailCliente,
    telefone:telefone,
    endereco:endereco,
    CPFOrCNPJ:cpfOrCnpj,
    acrescimo:Number(acrescimo),
    observacoes:observacoes,
    responsavelVenda:session?.user?.name,
    precoVendaTotal:precoVendaTotalOrcamento,
    precoVendaComDesconto:precoVendaComDesconto,



  }

  const res = await axios.put(`${url}/Orcamentos/sellUpdate/${orcamento.id}`,budge).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Orcamento Atualizado com sucesso");
    getInfosBudge()


  }).catch(e=>console.log(e))

}
    const handleOpenDialog =  (item:any)=>{
      console.log(materiaisOrcamento.includes(item))
      setInventarioDialog(item)
      setOpenDialog(true)
    
    }
    const handleCloseDialog = ()=>{

      if(isEditingOs) setIsEditingOs(false)
    
      setOpenDialog(false)
      setQuantidadeMaterial("")
      setInventarioDialog(undefined)
    }
    const handleCloseDialogPreco = ()=>{

   
    
      setOpenDialogPreco(false)
      setPrecoVendaNovoMaterial("")
      setInventarioDialog(undefined)
    }
    const handleAddMaterialOrcamento = async (item?:any)=>{

      console.log(item)
    const itemOrcamento = {
      materialId:item.materialId,
      material:{},
      quantidadeMaterial:quantidadeMaterial==""?null:Number(quantidadeMaterial),
      precoItemOrcamento:precoVendaNovoMaterial==""?null:Number(precoVendaNovoMaterial),
      orcamentoId:Number(params.orcamentoId),
      orcamento:{},
    }

   

    const res = await axios.post(`${url}/ItensOrcamento/CreateItemOrcamento`,itemOrcamento).then(r=>{

      setOpenSnackBar(true);
      setSeveridadeAlert("success");
      setMessageAlert("Material Adicionado Ao Orçamento");
      getAllMateriaisInOrcamento(params.orcamentoId)

    }).catch(e=>console.log(e))


      handleCloseDialog()
    }
    const getInfosBudge =  async()=>{
      await axios.get(`${url}/Orcamentos/${params.orcamentoId}`).then(r=>{

        console.log(r.data.tipoPagamento)
        setOrcamento(r.data)
        setEndereco(r.data.endereco)
        setAcrescimo(r.data.acrescimo)
        setNomeCliente(r.data.nomeCliente)
        setEmailCliente(r.data.emailCliente)
        setEmpresa(r.data.empresa)
        setTelefone(r.data.telefone)
        setDesconto(r.data.desconto)
        setCpfOrCnpj(r.data.cpfOrCnpj)
        setMetodoPagamento(r.data.tipoPagamento)
        setObservacoes(r.data.observacoes)
        setMetodoPagamento(r.data.tipoPagamento)

      // if(r.data.precoVendaTotal !=null && r.data.precoVendaTotal>0)  setPrecoVendaTotalOrcamento(Number(r.data.precoVendaTotal))
      // if(r.data.precoVendaComDesconto !=null && r.data.precoVendaComDesconto>0)  setPrecoVendaComDesconto(Number(r.data.precoVendaComDesconto))

        

      })
    }
    const handleUpdateItem = async (item?:any) =>{

console.log(item.quantidadeMaterial)

  let itemOrcamento = {}
      if(item.precoItemOrcamento != null) {

        itemOrcamento = {
          id:item.id,
          materialId:item.materialId,
          material:{},
          quantidadeMaterial:quantidadeMaterial == "" && item.quantidadeMaterial!= null? item.quantidadeMaterial :Number(quantidadeMaterial),
          orcamentoId:Number(params.orcamentoId),
          orcamento:{},
          precoItemOrcamento: item.precoItemOrcamemento!= item.material.precoVenda && precoVendaNovoMaterial!=""?precoVendaNovoMaterial:item.material.precoVenda,
        }


      }

      else{


        itemOrcamento = {
          id:item.id,
          materialId:item.materialId,
          material:{},
          quantidadeMaterial:Number(quantidadeMaterial),
          orcamentoId:Number(params.orcamentoId),
          orcamento:{},
          precoItemOrcamento:item.precoItemOrcamemento!= item.material.precoVenda && precoVendaNovoMaterial!=""?precoVendaNovoMaterial:item.material.precoVenda
        }
      }
      console.log(itemOrcamento)
      const res = await axios.put(`${url}/ItensOrcamento/${item.id}`,itemOrcamento).then(r=>{

        setOpenSnackBar(true);
        setSeveridadeAlert("success");
       quantidadeMaterial!="" ? setMessageAlert("Quantidade Atualizada Com Sucesso"):setMessageAlert("Preço de Venda Atualizado com Sucesso");

          
        
      
        getAllMateriaisInOrcamento(params.orcamentoId)
        calcPrecoVenda()
        handleCloseDialog()
        handleCloseDialogPreco()

  
      }).catch(e=>console.log(e))
  
  

    }
    const handleUpdatePrecoItem = async (item?:any) =>{


      
      item.material.precoVenda
              const itemOrcamento = {
                id:item.id,
                materialId:item.materialId,
                material:{},
                quantidadeMaterial:item.quantidadeMaterial,
                orcamentoId:Number(params.orcamentoId),
                orcamento:{},
                precoItemOrcamento: (item.precoItemOrcamemento!= item.material.precoVenda && precoVendaNovoMaterial!="") || item.material.precoVenda == null?precoVendaNovoMaterial:item.material.precoVenda,
              }
              console.log(itemOrcamento)
              
            const res = await axios.put(`${url}/ItensOrcamento/${item.id}`,itemOrcamento).then(r=>{
      
              setOpenSnackBar(true);
              setSeveridadeAlert("success");
              quantidadeMaterial!="" ? setMessageAlert("Quantidade Atualizada Com Sucesso"):setMessageAlert("Preço de Venda Atualizado com Sucesso");

            
              getAllMateriaisInOrcamento(params.orcamentoId)
              calcPrecoVenda()
              handleCloseDialog()
              handleCloseDialogPreco()
      
        
            }).catch(e=>console.log(e))
        
        
      
          }
    const handleDelete =async  (id:number) =>{
      const res = await axios.delete(`${url}/ItensOrcamento/${id}`).then(r=>{
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Removido do Orçamento");
          getAllMateriaisInOrcamento(params.orcamentoId)
      }).catch(e=>console.log(e))
      
    }


    const hasMaterial = (x:any)=>{

      for( let item of materiaisOrcamento)
      {
        if(item.material.id == x.material?.id) return true

      }

    }

   

  
    const findInventory = (id:number)=>{
      console.log(id)
      const inventoryFinded : IInventario | undefined = materiaisOrcamento.find((x:any)=>x.materialId==id)
      console.log(inventoryFinded)
      setInventarioDialog(inventoryFinded)
     }
    const calcPrecoVenda = () =>{

      let custoTotal:number | undefined = 0

      for(let item of materiaisOrcamento){
        if(item.material?.precoVenda!=null){

          custoTotal+=item.material?.precoVenda.toFixed(2)*item.quantidadeMaterial
          
        }
      

      }

      if(precoVendaTotalOrcamento!=undefined &&  Number(desconto)>0) {

        const descontoCalculado = precoVendaTotalOrcamento - (Number(desconto.toString().replace(",","."))/100) * precoVendaTotalOrcamento
        setPrecoVendaComDesconto(descontoCalculado.toFixed(2).toString().replace('.',','))
      }
      if(Number(desconto)==0) setPrecoVendaComDesconto(0)
    
      setPrecoVendaTotalOrcamento(Number(custoTotal.toFixed(2)))

    }
    const calcPrecoCusto = () =>{
 
      let custoTotal:number | undefined = 0

        for(let item of materiaisOrcamento){
     
          if(item.material?.precoCusto!=null){
          
            custoTotal+=item.material?.precoCusto.toFixed(2)*item.quantidadeMaterial
            
          }
            

        }
        setPrecoCustoTotalOrcamento(Number(custoTotal.toFixed(2)))
        

    }
    const isNullIsZero = (value:number)=>{

      return value==null?0:"R$"+value.toFixed(2).toString().replace('.',',')
    }

    const handleInputQuantidade = (value:any)=>{
      console.log(value)
      setQuantidadeMaterial(value.toString())
      if(value<1) setQuantidadeMaterial("1")
      if( inventarioDialog?.saldoFinal!=undefined && value>inventarioDialog?.saldoFinal) setQuantidadeMaterial(inventarioDialog?.saldoFinal.toString())


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
  <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Retornar
      </Link>

      <h1 className='text-center text-2xl mt-8'>Orçamento Nº {orcamento?.id}</h1>
      <div className='flex flex-col  mt-10  gap-3 justify-center text-center   '>

      <div className='flex flex-col self-center max-w-[1200px] gap-7 '>
              <div className='flex flex-row  justify-between w-[800px]'>
                <Input
                              value={nomeCliente}
                              className=" border-1 border-black rounded-md shadow-sm shadow-black max-w-[354px]  min-w-[354px]"
                              onValueChange={setNomeCliente}
                              placeholder='99283-4235'
                              label="Nome do Cliente"
                            />
                                <Input
                              value={endereco}
                              className=" border-1 border-black rounded-md shadow-sm shadow-black  max-w-[354px]  min-w-[354px]"
                              onValueChange={setEndereco}
                              placeholder='Rua Numero e Bairro'
                              label="Endereço"
                              />
                     
              </div>
                    <div className='flex flex-row justify-between w-[800px]'>
                      <Input
                              value={emailCliente}
                              className=" border-1 border-black rounded-md shadow-sm shadow-black  max-w-[354px]  min-w-[354px]"
                              onValueChange={setEmailCliente}
                              placeholder='abcde@gmail.com'
                              label="Email"
                            />
                             <Input
                             
                                  value={cpfOrCnpj}
                                  className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[354px]  min-w-[354px]"
                                  onValueChange={setCpfOrCnpj}
                                  placeholder='99283-4235'
                                  label="CPF OU CNPJ"
                                />  
                      
                    </div>
                         <div className=' flex flex-row w-[800px] justify-between '>
                       
                         <Input
                             
                              value={telefone}
                              className="border-1 border-black rounded-md shadow-sm shadow-black  max-w-[354px]  min-w-[354px]"
                              onValueChange={setTelefone}
                              placeholder='99283-4235'
                              label="Telefone"
                            />              

                <Input
                        value={desconto}
                        className="  border-1 border-black rounded-md shadow-sm shadow-black  max-w-[354px]  min-w-[354px]"
                        onValueChange={setDesconto}
                        isReadOnly = {orcamento?.isPayed}
                        label="Desconto %"
                        endContent={<span>%</span>}
                      />
                         </div>
                      
                      <Textarea
                                            label="Observações sobre este Orçamento"
                                            placeholder="Observações"
                                            className="max-w-lg border-1 ml-5 mt-3 mb-3 border-black rounded-md min-w-[210px] max-h-[320px]  shadow-sm shadow-black self-center "
                                            
                                            maxRows={14}
                                            value={observacoes}
                                            onValueChange={setObservacoes}
                                        
                                          />
                                     
                <div className=' self-center max-w-[384px]  min-w-[384px]'>
                  {metodoPagamento && (

                  <Autocomplete
                      label="Método Pagamento $"
                      placeholder="EX:PIX"
                      className=" w-[250px]  shadow-sm shadow-black h-14  ml-5 mr-5 w"
                      value={metodoPagamento}
                      onSelectionChange={setMetodoPagamento}
                      allowsCustomValue
                      defaultSelectedKey={metodoPagamento}
                    >
  
                    {formasPagamento.map((item:any) => (
  
                        <AutocompleteItem
                        key={item}
                        aria-label='teste'
                          value={metodoPagamento}
                          >
                          {item}
                        </AutocompleteItem>
                      ))}
                      </Autocomplete>
  
                  )}
                </div>
      </div>

             {orcamento?.isPayed ? (
                  <div className='flex flex-row gap-5 mt-4 self-center'>
                  <Button  className='bg-master_black max-w-[200px] text-white p-5 ml-10 rounded-lg font-bold text-lg shadow-lg ' onPress={()=> handleUpdateOrcamento()}>Atualizar Orçamento</Button>
              
                </div>
             ):
             <div className='flex flex-row gap-5 mt-4 self-center'>
             <Button  className='bg-master_black max-w-[200px] text-white p-5 ml-10 rounded-lg font-bold text-lg shadow-lg ' onPress={()=> handleUpdateOrcamento()}>Atualizar Orçamento</Button>
             <Button  className='bg-master_black max-w-[200px] text-white p-5 ml-10 rounded-lg font-bold text-lg ' onPress={onOpen}>
                        Autorizar Orçamento
                       </Button>
           </div>
             }
            
              
                                       
        
    <div className='flex flex-row  gap-4 self-center mt-5 max-w-[1200px]'>
  
              {!orcamento?.isPayed && (
  
            <Autocomplete
             label="Material"
             isDisabled={!materiais}
             placeholder="Procure um material"
             startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
             allowsCustomValue
            value={descricao}
            onValueChange={(x:any)=>setDescricao(x)}
             className="max-w-[450px] min-w-[400px] ml-6 self-center border-1 border-black rounded-xl shadow-sm shadow-black"
           >
  
           {materiais.map((item:IInventario) => (
  
              <AutocompleteItem
               key={item.id}
               aria-label='teste'
               endContent={
               <>
  
               <p className='text-xs'>{item.material?.marca}</p>
                {!hasMaterial(item) &&
                <IconPlus  height="1.3em" width="1.3em" onClick={()=>handleOpenDialog(item)} />
                }
  
               </>
               }
               startContent={<p>{item.material?.id} -</p>}
                value={item.material?.descricao}
                >
                {item.material?.descricao}
              </AutocompleteItem>
            ))}
            </Autocomplete>
              )}
              
     
         <Button 
      isDisabled={!nomeOrçamento?.length}
        className="bg-master_black text-white w-[330px] p-3 my-auto rounded-lg font-bold text-base shadow-lg ml-10 "
        >
   

          <PDFDownloadLink document={   <OrcamentoPDF 
          materiaisOrcamento ={materiaisOrcamento} 
          nomeUsuario={session?.user?.name}
          orcamento={orcamento}
          desconto = {precoVendaComDesconto}
          
          />} fileName={"Orçamento Nº"+ orcamento?.id+ " Para "+ orcamento?.nomeCliente +".pdf"}>
               {orcamento?.isPayed ?"Gerar PDF de Venda":"Gerar PDF De Orçamento"}
           
            </PDFDownloadLink>
        
          </Button> 
  </div>

           <Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}> {isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material?.descricao}</DialogTitle>
    <DialogContent className='flex flex-col justify-center' >

      <p className='text-center' onClick={()=>console.log(inventarioDialog)}>
        Estoque Disponível: {inventarioDialog?.saldoFinal == 0 || null?0:inventarioDialog?.saldoFinal} {inventarioDialog?.material.unidade}
    
          </p>
      <div className=' flex flex-row justify-center'>
        <Input
          type='number'
          autoFocus
          label="Insira a Quantidade"
          className="border-1   border-black rounded-xl shadow-sm shadow-black mt-7 ml-5 mr-5 w-[150px] max-h-14"
          onValueChange={(x:any)=>handleInputQuantidade(x)}
        
          value={quantidadeMaterial}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onPress={handleCloseDialog}>Fechar</Button>
       
        <Button  onPress={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>
        




           <Dialog open={openDialogPreco} onClose={handleCloseDialogPreco} >
    <DialogTitle sx={{textAlign:"center"}}>Novo Preço de Venda</DialogTitle>
    <DialogContent >

      <div className=' flex flex-row justify-center'>
        <Input
          type='number'
          autoFocus
          className="border-1   border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px] max-h-14 "
          endContent={<p>R$</p>}
          onValueChange={(x:any)=>setPrecoVendaNovoMaterial(x)}
        
          value={precoVendaNovoMaterial}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onPress={handleCloseDialogPreco}>Fechar</Button>
       
        <Button  onPress={()=> handleUpdatePrecoItem(itemToBeUpdated)}>Atualizar Preço</Button>
    </DialogActions>
  </Dialog>



      <div className='flex flex-row justify-between self-center mt-4'>
        <div className='flex flex-col self-center'>
          <p className='font-bold text-lg'>Materiais No Orçamento:{materiaisOrcamento.length}</p>
          
              <div className="overflow-x-auto self-center w-[100%] mt-5 ml-5 ">
      <Table  hoverable striped className="w-[100%] ">
        <Table.Head className="border-1 border-black">
          <Table.HeadCell className="text-center border-1 border-black text-sm max-w-[140px] " >Cod.Interno</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Descricao</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Qntd</Table.HeadCell>

          
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Custo</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Venda</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Total </Table.HeadCell>
      
      
        </Table.Head>
        <Table.Body className="divide-y">
          
        { materiaisOrcamento.length>=1 && materiaisOrcamento.map((row:any) => (
          <Table.Row  key={row.material.id} className=" dark:border-gray-700 dark:bg-gray-800 ">
          <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
          {row.material.id}
          </Table.Cell>
          <Table.Cell className="text-center text-black" >{row.material.descricao}</Table.Cell>
            {orcamento?.isPayed ?(
          <Table.Cell className="text-center text-black" >{row.quantidadeMaterial}</Table.Cell>

            )
            :
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>{getEstoqueMaterial(row.material.id),setItemToBeUpdated(row),setIsEditingOs(true),setOpenDialog(true)}} >{row.quantidadeMaterial}</Table.Cell>

          }
          <Table.Cell className="text-center text-black " >{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</Table.Cell>
           
            {orcamento?.isPayed ?(
          <Table.Cell className="text-center text-black"  >{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}  </Table.Cell>
              
            ):
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>{ setItemToBeUpdated(row),setIsEditingOs(true),setOpenDialogPreco(true),findInventory(row.material.id)}} >{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}  </Table.Cell>
            
            }
          <Table.Cell className="text-center text-black"  >{row.material.precoVenda && "R$"}{row.material.precoVenda!=null? (row.material.precoVenda*row.quantidadeMaterial).toFixed(2).toString().replace(".",","):"Falta Preço De Venda"}  </Table.Cell>

          <Table.Cell>
            {!orcamento.isPayed && (

              <div className='text-center'>
                <IconBxTrashAlt onClick={()=>handleDelete(row.id)} />
              </div>
            )}
          </Table.Cell>
        </Table.Row>


              ))}
          
         
         
        </Table.Body>
      </Table>
    </div>
              <p className='mt-16 font-bold text-lg'>Preço Custo Total:R$ {precoCustoTotalOrcamento?.toString().replace('.',',')}</p>
              <p  className='mt-5 font-bold  text-lg' onClick={()=>setOpenDialogPreco(true)}>Preço Venda Total:R$ {precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</p>
              {precoVendaComDesconto>0 && (

              <p  className='mt-5 font-bold  text-lg'>Preço Venda com Desconto:R$ {precoVendaComDesconto?.toString().replace('.',',')}</p>
              )}
        </div>
         
        
      </div>

     </div>
 <Snackbar
            open={openSnackBar}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
            autoHideDuration={2000}
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

          <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h2 className=' text-red-950 font-bold text-center mt-4'> 
                  ATENÇÃO
                </h2>
                <p className='text-center font-bold'>
                Após autorizar o Orçamento Nº {orcamento?.id},todos os materiais e suas quantidade serão retirados do estoque e não podera mais incluir ou remover materias no Orçamento
                , pressione o botão AUTORIZAR somente a venda dos materiais estiver concretizada
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
                <Button isDisabled={confirmAuthorizeMessage!="AUTORIZAR"} color="primary" onPress={handleUpdateOrcamentoToSell}>
                  Autorizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
     </>
)



}