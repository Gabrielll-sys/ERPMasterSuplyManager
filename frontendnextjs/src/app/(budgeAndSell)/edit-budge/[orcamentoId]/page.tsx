"use client"
import {Link, Button,Autocomplete,Textarea, AutocompleteItem, Input, useDisclosure, ModalFooter, ModalContent, ModalBody, ModalHeader, Modal, Popover, PopoverTrigger, PopoverContent, Divider, AccordionItem, Accordion, CheckboxGroup, Checkbox } from '@nextui-org/react';
import Excel, { BorderStyle } from 'exceljs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { Card, Dropdown} from 'flowbite-react';
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



export default function ManageBudges({params}:any){
  const route = useRouter()
  const { data: session } = useSession();

  const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()


  const[nomeOrçamento,setNomeOrçamento] = useState<string>("DF")

  const[inventarioDialog,setInventarioDialog] = useState<IInventario>()
  const [orcamento,setOrcamento]= useState<any>()

  const [materiais,setMateriais]= useState<IInventario[] >([])
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [openList,setOpenList] = useState<boolean>(false)
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

const[precoCustoTotalOrcamento,setPrecoCustoTotalOrcamento] = useState<number >();
const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();
const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>()
const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
const[materiaisOrcamento,setMateriaisOrcamento] = useState<any>([])
const[precoComDesconto,setPrecoComDesconto] = useState<any>()
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

      getAllMateriaisInOrcamento(params.orcamentoId)
      getAllMaterial()
      getInfosBudge()
     },[])
  useEffect(()=>{

    calcPrecoVenda()
    calcPrecoCusto()
  },[materiaisOrcamento])

  useEffect(()=>{
    calcPrecoVenda()

  },[desconto])


  const getAllMateriaisInOrcamento = async(id:number)=>{

      await axios.get(`${url}/ItensOrcamento/GetAllMateriaisOrcamento/${id}`).then((r)=>{
      console.log(r.data)
        setMateriaisOrcamento(r.data)

      }).catch(e=>console.log(e))

  }
  const getAllMaterial = async()=>{

     await axios.get(`${url}/Inventarios`).then(r=>{
      
      setMateriais(r.data)
    
})



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



  }
  console.log(budge)
  const res = await axios.put(`${url}/Orcamentos/${orcamento.id}`,budge).then(r=>{

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
    const handleAddMaterialOrcamento = async (item?:any)=>{


    const itemOrcamento = {
      materialId:item.materialId,
      material:{},
      quantidadeMaterial:Number(quantidadeMaterial),
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

      })
    }
    const handleUpdateItem = async (item?:any) =>{
      const itemOrcamento = {
        id:item.id,
        materialId:item.materialId,
        material:{},
        quantidadeMaterial:Number(quantidadeMaterial),
        orcamentoId:Number(params.orcamentoId),
        orcamento:{},
      }
      const res = await axios.put(`${url}/ItensOrcamento/${item.id}`,itemOrcamento).then(r=>{

        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Quantidade Atualizada Com Sucesso");
        getAllMateriaisInOrcamento(params.orcamentoId)
  
      }).catch(e=>console.log(e))
  
  
        handleCloseDialog()

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
      const inventoryFinded : IInventario | undefined = materiais.find(x=>x.materialId==id)
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
        setPrecoComDesconto(descontoCalculado.toFixed(2))
      }
      if(Number(desconto)==0) setPrecoComDesconto(0)
    
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
      setQuantidadeMaterial(value)
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
      <h1 className='text-center text-2xl mt-4'>Orçamento Nº {orcamento?.id}</h1>
      <div className='flex flex-col  mt-10  justify-center text-center '>
   
          <div className='flex flex-row justify-between w-[630px]'>
          <Autocomplete
           label="Material"
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="max-w-[900px] ml-6 self-center border-1 border-black rounded-xl shadow-sm shadow-black"
         >

         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material?.marca}</p>
              { !hasMaterial(item) &&
              <IconPlus  onClick={()=>handleOpenDialog(item)} />
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
     
       <Button 
      isDisabled={!nomeOrçamento?.length}
        className="bg-master_black text-white w-[300px] p-7 rounded-lg font-bold text-lg shadow-lg ml-10 "
      ><PDFDownloadLink document={   <OrcamentoPDF 
        materiaisOrcamento ={materiaisOrcamento} 
        nomeUsuario={session?.user?.name}
        orcamento={orcamento}
        
        />} fileName={"Orçamento Nº"+ orcamento?.id+".pdf"}>
            {({ blob, url, loading, error }) => (loading ? 'Carregando documento...' : 'Gerar Nota de Venda')}
          </PDFDownloadLink>
          </Button>
         
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
          onValueChange={(x)=>handleInputQuantidade(x)}
        
          value={quantidadeMaterial}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onPress={handleCloseDialog}>Fechar</Button>
       
        <Button  onPress={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>
      </div>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col'>
          <Accordion className="ml-6">
          <AccordionItem key="1" aria-label="`Materias Presentes no orçamento" subtitle="Pressione para expandir" title={`Materias Presentes no orçamento: ${materiaisOrcamento?.length}`}>
            {materiaisOrcamento.map((x:any)=>(
          
               <div className='flex flex-row justify-between w-[800px] '>
                <p className='m-4 max-w-[250px] text-base'>{x.material.id}- {x.material.descricao}</p>
                <p  className='text-base'>{x.quantidadeMaterial} {x.material.unidade}</p>
          
           <div className='flex flex-row justify-between gap-3'>
          
             <IconBxTrashAlt onClick={()=>handleDelete(x.id)} />
             <IconEdit onClick={()=>{setItemToBeUpdated(x),setIsEditingOs(true),setOpenDialog(true),findInventory(x.material.id)}} />
           </div>
               </div>
            ))}
          </AccordionItem>
          
              </Accordion>
              <p className='mt-16 font-bold text-lg'>Preço Custo Total:R$ {precoCustoTotalOrcamento?.toString().replace('.',',')}</p>
              <p  className='mt-5 font-bold  text-lg'>Preço Venda Total:R$ {precoVendaTotalOrcamento?.toString().replace('.',',')}</p>
              {precoComDesconto>0 && (

              <p  className='mt-5 font-bold  text-lg'>Preço Venda com Desconto:R$ {precoComDesconto?.toString().replace('.',',')}</p>
              )}
        </div>
         
              <div className='flex flex-col ml-32'>
                        <div className=' flex flex-row justify-center w-[800px]'>
                          <Textarea
                                            label="Observações sobre este Orçamento"
                                            placeholder="Observações"
                                            className="max-w-xl border-1 border-black rounded-xl min-w-[210px] max-h-[320px]  shadow-sm shadow-black "
                                            
                                            maxRows={14}
                                            value={observacoes}
                                            onValueChange={setObservacoes}
                                        
                                          />
                        </div>
                <div className='flex flex-row flex-wrap w-[1150px] '>
                  <Input
                          value={nomeCliente}
                          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                          onValueChange={setNomeCliente}
                          placeholder='99283-4235'
                          label="Nome do Cliente"
                        />
                  <Input
                          value={telefone}
                          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                          onValueChange={setTelefone}
                          placeholder='99283-4235'
                          label="Telefone"
                        />
                  <Input
                          value={emailCliente}
                          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                          onValueChange={setEmailCliente}
                          placeholder='abcde@gmail.com'
                          label="Email"
                        />
                  <Input
                          value={empresa}
                          className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                          onValueChange={setEmpresa}
                          placeholder='Facebook'
                          label="Empresa do Cliente"
                        />
                         <Input
                        value={endereco}
                        className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px] self-center"
                        onValueChange={setEndereco}
                        placeholder='Rua Numero e Bairro'
                        label="Endereço"
                      />
                      <Input
                        value={cpfOrCnpj}
                        className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                        onValueChange={setCpfOrCnpj}
                        placeholder='99283-4235'
                        label="CPF OU CNPJ"
                      />
                </div>
                <div className='flex flex-row flex-wrap'>
               
                <Input
                        value={nomeOrçamento}
                        className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                        onValueChange={setNomeOrçamento}
                        placeholder='99283-4235'
                        label="Telefone"
                      />
                <Input
                        value={desconto}
                        className="border-1 border-black rounded-lg shadow-sm shadow-black mt-10 ml-5 mr-5 w-[250px] max-h-[60px]"
                        onValueChange={setDesconto}
                       
                        label="Desconto %"
                        endContent={<span>%</span>}
                      />
                      

                <Autocomplete
                    label="Método Pagamento $"
                    placeholder="EX:PIX"
                    className=" w-[250px] border-1 border-black rounded-xl shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
                    value={metodoPagamento}
                    onSelectionChange={setMetodoPagamento}
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
                     

              </div>
        <Button  className='bg-master_black max-w-[200px] text-white p-7 ml-10 rounded-lg font-bold text-lg shadow-lg mt-10' onPress={()=> handleUpdateOrcamento()}>Atualizar Orçamento</Button>
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


     </>
)



}