"use client"
import { authHeader } from '@/app/_helpers/auth_headers';
import { url } from '@/app/api/webApiUrl';
import ArrowLeft from '@/app/assets/icons/ArrowLeft';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconFileEarmarkPdf from '@/app/assets/icons/IconFileEarmarkPdf';
import { SearchIcon } from '@/app/assets/icons/SearchIcon';
import OrcamentoPDF from '@/app/componentes/OrcamentoPDF';
import { IInventario } from '@/app/interfaces/IInventarios';
import { IItem } from '@/app/interfaces/IItem';
import { IOrcamento } from '@/app/interfaces/IOrcamento';
import { searchByDescription } from '@/app/services/Material.Services';
import { getOrcamentoById } from '@/app/services/Orcamentos.Service';
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react';
import { Button, Flex, TextArea, TextField } from '@radix-ui/themes';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios, { AxiosResponse } from "axios";
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import Excel from 'exceljs';
import { Table } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from 'react-query';



export default function ManageBudges({params}:any){
  const route = useRouter()
  const { data: session } = useSession();

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()

  const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()
  const [currentUser, setCurrentUser] = useState<any>(null);


  const[nomeOrçamento,setNomeOrçamento] = useState<string>("DF")

  const[inventarioDialog,setInventarioDialog] = useState<IInventario>()

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

const[precoCustoTotalOrcamento,setPrecoCustoTotalOrcamento] = useState<number >();
const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();
const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>("")
const[isEditingOs,setIsEditingOs] = useState<boolean>(false)
const[materiaisOrcamento,setMateriaisOrcamento] = useState<any>([])
const[precoVendaComDesconto,setPrecoVendaComDesconto] = useState<any>(null)
const[openDialogPreco,setOpenDialogPreco] = useState<boolean>(false)
const[descricao,setDescricao] = useState<string>("")

const [haveNoEstoque,setHaveNoEstoque] = useState<boolean>(false)

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
      
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("currentUser"));
    if(user != null)
    {
        setCurrentUser(user)

    }
    
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


  const buscarDescricao = async(descricao:string)=>
  {
    setDescricao(descricao)
      if(descricao.length>3)
      {
        try{
  
          const res =  await searchByDescription(descricao)
          setMateriais(res)
        }
      catch(e)
      {
        console.log(e)
      }
      
      }
  
  
  }
  const handleNomeCliente = async(value:any)=>{
    setNomeCliente(value)
    
        await axios.get(`${url}/Orcamentos/buscaCliente?cliente=${value?.trim()}`,{headers:authHeader()}).then((r:AxiosResponse)=>{
          console.log(r.data)
         
           setCpfOrCnpj(r.data.cpfOrCnpj)
           setTelefone(r.data.telefone)
           setEndereco(r.data.endereco)
           setEmailCliente(r.data.emailCliente)
        
          
        }).catch(e=>console.log(e))
      }
    
  const getAllMateriaisInOrcamento = async(id:number)=>{

      const res = await axios.get(`${url}/ItensOrcamento/GetAllMateriaisOrcamento/${id}`,{headers:authHeader()}).then((r)=>{

      setMateriaisOrcamento(r.data)
       
        return r.data

      }).catch(e=>console.log(e))

      //Itera sobre os materiais,caso o item com id do material tenha um valor de preco de venda que foi alterado para orçamento,então passará a ser o o pre
      // o preço de venda do material no array mostrado da page
      for(let item of res)
        {

        const estoque = await getEstoqueMaterial(item.materialId);
        item.estoque = estoque.saldoFinal
        
        if(item.precoItemOrcamento != null)

        {

          item.material.precoVenda = item.precoItemOrcamento

         

          if(estoque.saldoFinal == null || estoque.saldoFinal == 0)
            {
            setHaveNoEstoque(true)
          }
        
      }

    
      }

  }
  const getAllItensOrcamento = async(id:number)=>{

    const res = await axios.get(`${url}/ItensOrcamento/GetAllItensOrcamento/${id}`,{headers:authHeader()}).then((r)=>{
      console.log(r.data)
    return r.data

    }).catch(e=>console.log(e))



}

//Função criada para pegar o ultimo registro de movimentação de um determinado material presente na tabela do orçamento,para parecer a o estoque quando for editar a quantidade
// presente na tabela do orçamento,para parecer a o estoque quando for editar a quantidade
const getEstoqueMaterial =  async (id:number)=>{

  const res =  await axios.get(`${url}/Inventarios/GetLastRegister/${id}`).then((r)=>{

    setInventarioDialog(r.data)
   
  return r.data

  }).catch(e=>console.log(e))

  return res

}
  
const handleUpdateOrcamento = async()=>{
  

  const budge = {
    id:orcamento?.id,
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
  const res = await axios.put(`${url}/Orcamentos/${orcamento?.id}`,budge,{headers:authHeader()}).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Orcamento Atualizado com sucesso");
    refetchOrcamento()


  }).catch(e=>console.log(e))

}
const handleUpdateOrcamentoToSell = async()=>{
  
  setconfirmAuthorizeMessage("")
 
  const budge = {
    id:orcamento?.id,
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
  console.log(orcamento)

  const res = await axios.put(`${url}/Orcamentos/sellUpdate/${orcamento?.id}`,budge,{headers:authHeader()}).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Orcamento Atualizado com sucesso");
    refetchOrcamento()


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

   

    const res = await axios.post(`${url}/ItensOrcamento/CreateItemOrcamento`,itemOrcamento,{headers:authHeader()}).then(r=>{

      setOpenSnackBar(true);
      setSeveridadeAlert("success");
      setMessageAlert("Material Adicionado Ao Orçamento");
      getAllMateriaisInOrcamento(params.orcamentoId)

    }).catch(e=>console.log(e))

      setMateriais([])
      setDescricao("")
      handleCloseDialog()
    }


    const {data:orcamento,refetch:refetchOrcamento} = useQuery({
      queryKey:['orcamento',params.orcamentoId],
      queryFn:()=>getOrcamentoById(params.orcamentoId),
      staleTime:1*1000*60*60*8,
      cacheTime:1*1000*60*60*8,

      onSuccess:(res)=>{
        setEndereco(res.endereco)
        setAcrescimo(res.acrescimo)
        setNomeCliente(res.nomeCliente)
        setEmailCliente(res.emailCliente)
        setEmpresa(res.empresa)
        setTelefone(res.telefone)
        setDesconto(res.desconto)
        setCpfOrCnpj(res.cpfOrCnpj)
        setMetodoPagamento(res.tipoPagamento)
        setObservacoes(res.observacoes)
        setMetodoPagamento(res.tipoPagamento)
      }


    })
 
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
      const res = await axios.put(`${url}/ItensOrcamento/${item.id}`,itemOrcamento,{headers:authHeader()}).then(r=>{

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
           
              
            const res = await axios.put(`${url}/ItensOrcamento/${item.id}`,itemOrcamento,{headers:authHeader()}).then(r=>{
      
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
      const res = await axios.delete(`${url}/ItensOrcamento/${id}`,{headers:authHeader()}).then(r=>{
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

      const inventoryFinded : IInventario | undefined = materiaisOrcamento.find((x:any)=>x.materialId==id)

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

      <h1 className='text-center text-2xl mt-4'>Orçamento Nº {orcamento?.id}</h1>
      <Flex direction="column" gap="3" className='flex flex-col  mt-10   justify-center text-center   '>

      <div className='flex flex-col self-center max-w-[1200px] gap-7 '>
              <Flex direction='row' justify="center" gap="5" >
              <TextField.Root>
                    <TextField.Input
                      value={nomeCliente}
                      variant='classic'
                      onChange={(x) => handleNomeCliente(x.target.value)}
                      placeholder='Nome Cliente'
                      className='w-[350px]'
                      size="3"
                      onBlur={handleUpdateOrcamento}
                    />
              </TextField.Root>
              <TextField.Root>
                    <TextField.Input
                      value={endereco}
                      variant='classic'
                      onChange={(x) => setEndereco(x.target.value)}
                      placeholder='Endereço'
                       className='w-[350px]'
                      size="3"
                      onBlur={handleUpdateOrcamento}
                    />
              </TextField.Root>
            
                          
                     
              </Flex>
                <Flex direction='row' justify="center" gap="5" >
                    <TextField.Root>
                    <TextField.Input
                      value={emailCliente}
                      variant='classic'
                      onChange={(x) => setEmailCliente(x.target.value)}
                      placeholder='Endereço'
                       className='w-[350px]'
                      size="3"
                      onBlur={handleUpdateOrcamento}
                    />
              </TextField.Root>
                            
              <TextField.Root>
                    <TextField.Input
                      value={cpfOrCnpj}
                      variant='classic'
                      onChange={(x) => setCpfOrCnpj(x.target.value)}
                      placeholder='CPF/CNPJ'
                       className='w-[350px]'
                      size="3"
                      onBlur={handleUpdateOrcamento}
                    />
              </TextField.Root>
                      
                    </Flex>
                         <Flex direction='row' justify="center" gap="5"   >
                       
                         <TextField.Root>
                          <TextField.Input
                            value={telefone}
                            variant='classic'
                            onChange={(x) => setTelefone(x.target.value)}
                            placeholder='Telefone'
                             className='w-[350px]'
                            size="3"
                            onBlur={handleUpdateOrcamento}
                          />
              </TextField.Root>             

              <TextField.Root>
                    <TextField.Input
                      value={desconto}
                      variant='classic'
                      onChange={(x) => setDesconto(x.target.value)}
                      placeholder='Endereço'
                       className='w-[350px]'
                      size="3"
                      onBlur={handleUpdateOrcamento}
                    />
              </TextField.Root>
                         </Flex>
                      
                      <TextArea              
                            placeholder="Observações"
                            size="3"
                            value={observacoes}
                            onChange={(x)=>setObservacoes(x.target.value)}
                            onBlur={handleUpdateOrcamento}
                                        
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
                  <div className='flex flex-row mt-4 self-center'>
                  <Button  className='bg-master_black max-w-[200px]  text-white p-5 mx-auto rounded-lg font-bold text-lg shadow-lg ' onClick={()=> handleUpdateOrcamento()}>Atualizar Orçamento</Button>
              
                </div>
             ):
             <Flex className='flex md:flex-row  max-sm:flex-col gap-5 mt-4 self-center'>
            
             <Button  className=' text-white    font-bold text-lg ' onClick={onOpen}>
                        Autorizar Orçamento
                       </Button>
           </Flex>
             }
            
              
                                       
        
    <div className='flex md:flex-row max-sm:flex-col  gap-4 self-center mt-5 max-w-[1200px]'>
  
              {!orcamento?.isPayed && (
  
            <Autocomplete
             label="Material"
             isDisabled={!materiais}
             placeholder="Procure um material"
             startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
             value={descricao}
             onValueChange={(x:any)=>buscarDescricao(x)}
             className=" md:min-w-[500px] max-sm:w-[350px]  self-center "
           >
  
           {materiais.map((item:IInventario) => (
  
              <AutocompleteItem
               key={item.id}
               onClick={()=>!hasMaterial(item) && handleOpenDialog(item) }

               aria-label='teste'
               endContent={
               <>
  
               <p className='text-xs'>{item.material?.marca}</p>
                {hasMaterial(item) &&
              
                 <p>Já Presente Na Lista</p>

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
              
   

            <div className='flex md:flex-row max-sm:flex-col items-center'>
           <Button
           color='red' 
           variant='outline'
           
           className={`  ${orcamento?.isPayed?"w-[225px]":"w-[255px]"} p-3 my-auto max-sm:w-[60%] `}
          >
            <PDFDownloadLink document={   <OrcamentoPDF
            materiaisOrcamento ={materiaisOrcamento}
            nomeUsuario={currentUser?.userName}
n            orcamento={orcamento}
            desconto = {precoVendaComDesconto}
       
            />} fileName={"Orçamento Nº"+ orcamento?.id+ " Para "+ orcamento?.nomeCliente +".pdf"}>
                <div className='flex flex-row gap-2'>
                  <IconFileEarmarkPdf  height="1.3em" width="1.3em" />
                  Gerar PDF De Orçamento
                </div>
              </PDFDownloadLink>
       
            </Button>
          
        
      </div>
  </div>

           <Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}> {isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material?.descricao}</DialogTitle>
    <DialogContent className='flex flex-col justify-center' >

      <p className='text-center' onClick={()=>console.log(inventarioDialog)}>
        Estoque Disponível: {inventarioDialog?.saldoFinal == 0 || null?0:inventarioDialog?.saldoFinal} {inventarioDialog?.material?.unidade}
    
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
      <Button onClick={handleCloseDialog}>Fechar</Button>
       
        <Button  onClick={()=> !isEditingOs ?handleAddMaterialOrcamento(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
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
      <Button onClick={handleCloseDialogPreco} color="crimson" size='3' variant="solid" className='p-2 '>Fechar</Button>
       
        <Button className='p-2' size="3" variant='solid' color='blue' onClick={()=> handleUpdatePrecoItem(itemToBeUpdated)}>Atualizar Preço</Button>
    </DialogActions>
  </Dialog>



      <div className='flex flex-row justify-between self-center mt-4'>
        <div className='flex flex-col self-center'>
          <p className='font-bold text-lg'>Materiais No Orçamento:{materiaisOrcamento.length}</p>
          
              <div className="overflow-x-auto self-center w-[100%] mt-5 ml-5 ">
      <Table  hoverable striped className="w-[100%] ">
        <Table.Head className="border-1 border-black">
          <Table.HeadCell className="text-center border-1 border-black text-sm max-w-[170px] " >Cod.Interno</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Descricao</Table.HeadCell>
          {/* <Table.HeadCell className="text-center border-1 border-black text-sm">Estoque</Table.HeadCell> */}
          <Table.HeadCell className="text-center border-1 border-black text-sm">Qntd</Table.HeadCell>
         
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Custo</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Venda</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Total </Table.HeadCell>
      
      
        </Table.Head>
        <Table.Body className="divide-y">
          
        { materiaisOrcamento.length>=1 && materiaisOrcamento.map((row:any) => (
          <Table.Row onClick={()=>console.log(row)} key={row.material.id} className=" dark:border-gray-700 dark:bg-gray-800 ">
          <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
          {row.material.id}
          </Table.Cell>
          <Table.Cell className="text-left text-black" >{row.material.descricao}</Table.Cell>
          {/* <Table.Cell className="text-left text-black" >{row.material.}</Table.Cell> */}
            {orcamento?.isPayed ?(
          <Table.Cell className="text-center text-black" >{row.quantidadeMaterial}</Table.Cell>

            )
            :
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>{getEstoqueMaterial(row.material.id),setItemToBeUpdated(row),setIsEditingOs(true),setOpenDialog(true)}} >{row.quantidadeMaterial}</Table.Cell>

          }

          {/* <Table.Cell className="text-center text-black "  >{row.estoque} {row.material.unidade}</Table.Cell> */}

          <Table.Cell className="text-center text-black " >{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</Table.Cell>
           
            {orcamento?.isPayed ?(
          <Table.Cell className="text-center text-black"  >{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}  </Table.Cell>
              
            ):
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>{ setItemToBeUpdated(row),setIsEditingOs(true),setOpenDialogPreco(true),findInventory(row.material.id)}} >{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}  </Table.Cell>
            
            }
          <Table.Cell className="text-center text-black"  >{row.material.precoVenda && "R$"}{row.material.precoVenda!=null? (row.material.precoVenda*row.quantidadeMaterial).toFixed(2).toString().replace(".",","):"Falta Preço De Venda"}  </Table.Cell>

          <Table.Cell>
            {!orcamento?.isPayed && (

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

     </Flex>
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
                <Button color="crimson" size='3' variant="solid" className='p-2 '  onClick={onClose}>
                  Fechar
                </Button>

                {confirmAuthorizeMessage==="AUTORIZAR"|| haveNoEstoque && (
                <Button className='p-2' size="3" variant='solid' color='blue' onClick={handleUpdateOrcamentoToSell}>
                  Autorizar
                </Button>

                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
     </>
)



}