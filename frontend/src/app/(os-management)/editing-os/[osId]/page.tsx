"use client"

import { Autocomplete, AutocompleteItem, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, Textarea, useDisclosure } from '@nextui-org/react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { url } from '@/app/api/webApiUrl';
import IconBxTrashAlt from '@/app/assets/icons/IconBxTrashAlt';
import IconPen from '@/app/assets/icons/IconPencil';
import IconPlus from '@/app/assets/icons/IconPlus';
import { IInventario } from '@/app/interfaces/IInventarios';
import { IItem } from '@/app/interfaces/IItem';
import { IOrderServico } from '@/app/interfaces/IOrderServico';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import axios from "axios";
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from "react";

export default function EditingOs({params}:any){
      const { data: session } = useSession();
      const componentRef: any = useRef();
      const[confirmAuthorizeMessage,setconfirmAuthorizeMessage]= useState<string>()
      const[itemToBeUpdated,setItemToBeUpdated] = useState<IItem>()
      const[inventarioDialog,setInventarioDialog] = useState<IInventario>()
      const[observacao,setObservacao]= useState<string>()
      const [os,setOs] = useState<IOrderServico>()
      const [descricaoOs,setDescricaoOS] = useState<string>()
      const [participantesOs,setParticipantesOs] = useState<string>()
      const[materiaisOs,setMateriaisOs]= useState<any>([])
      const [materiais,setMateriais]= useState<IInventario[] >([])
      const [numeroOs,setNumeroOs]= useState<string>("")
      const [openDialog,setOpenDialog] = useState<boolean>(false)
    const [openDialogAuthorize,setOpenDialogAuthorize] = useState<boolean>(false)
      const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [openList,setOpenList] = useState<boolean>(false)
    const[precoCustoTotalOs,setPrecoCustoTotalOs] = useState<number>();
    const[precoVendaTotalOs,setPrecoVendaTotalOs] = useState<number>();
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[quantidadeMaterial,setQuantidadeMaterial] = useState<string>()
    const[isEditingOs,setIsEditingOs] = useState<boolean>(false)

      const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
      useEffect(()=>{

      getOs(params.osId)
      getMateriasOs(params.osId)
      getAllMaterial()


     },[])
     
     
      const getOs = async(id:number)=>{
      const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
        console.log(r.data)
       return r.data
       
     })
     setNumeroOs(res.numeroOs)
     setOs(res)
     const description :string = res.descricao
     //Para pegar somente a descricao da os eliminando o numero da os e o numero
     const formatedDescription:string = description.split('-')[2]

     setDescricaoOS(formatedDescription)
     setParticipantesOs(res.responsaveisExecucao)
     setObservacao(res.observacoes)
 
   }
   const getAllMaterial = async()=>{

    const materiaisWithInvetory = await axios.get(`${url}/Inventarios`).then(r=>{
     
     return r.data
    
})
    
   setMateriais(materiaisWithInvetory)
  }

   const getMateriasOs = async(id:number)=>{


    //Recebe id da ordem de serviço
        const res = await axios.get(`${url}/Itens/GetAllMateriaisOs/${id}`).then(r=>{
          return r.data
        }).catch(e=>console.log(e))
       
        setPrecoCustoTotalOs(handleCalcCustoTotal(res))
        setPrecoVendaTotalOs(handleCalcVendaTotal(res))
        setMateriaisOs(res)
    
      }
  const handleUpdateOs = async(id:number|undefined)=>{

    const descricaoOsFormated = descricaoOs?.trim().replace(/\s\s+/g, " ")
    const numeroOsFormated = numeroOs?.trim().replace(/\s\s+/g, " ")

      const ordemServico = {
              id:os?.id,
              numeroOs:numeroOsFormated,
              descricao:descricaoOsFormated,
              responsaveisExecucao:participantesOs,
              observacoes:observacao,

          }
          console.log(ordemServico)
            const res = await axios.put(`${url}/OrdemServicos/${id}`,ordemServico).then(r=>{
              setOpenSnackBar(true);
              setSeveridadeAlert("success");
              setMessageAlert("Ordem de serviço atualizada com sucesso");
              getMateriasOs(params.osId)

              return r.data
            }).catch(e=>console.log(e))
            console.log(res)

          }  
const handleAuthorizeOs = async  ()=>{
        const ordemServico = {
            id:os?.id,
            descricaoOs:descricaoOs,
            observacoes:observacao,
            responsavelAutorizacao:session?.user?.name,
            precoVendaTotalOs:precoVendaTotalOs?.toFixed(2),
            precoCustoTotalOs:precoCustoTotalOs?.toFixed(2),


        }

        await axios.put(`${url}/OrdemServicos/updateAuhorize/${params.osId}`,ordemServico)
        getOs(params.osId)
      }



 const handleRemoveMaterial =  async (id:number)=>{

    console.log(id)
        await axios.delete(`${url}/Itens/${id}`).then(r=>{
      
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Removido da Lista da Os");
          getMateriasOs(params.osId)
        }).catch(r=>console.log(r))
        
      
      }
    const handleCreateItem = async(inventario:IInventario | undefined)=>
      {
    try{

      const item = {
        materialId:inventario?.material.id,
        responsavelAdicao:session?.user?.name,
        material:null,
        ordemServicoId:os?.id,
        ordemServico:null,
        quantidade:Number(quantidadeMaterial), 
    
      }
    console.log(item)
    
     const res = await axios.post(`${url}/Itens/CreateItem`,item).then(r=>{
       return r.data
    }).catch((e) => {
    console.log(e.code)
    });
    
    if(res){
      getMateriasOs(params.osId)
      setOpenSnackBar(true);
      setSeveridadeAlert("success");
      setMessageAlert("Material adiciona a lista da OS");
      handleCloseDialog()
    
    }
    }
    catch(error){
    
      console.log()
    }
    
      }     
 const handleUpdateItem =  async (item:IItem | undefined)=>{
console.log(item)

        const itemToBeUpdated = {
    id:item?.id,      
    materialId:item?.material.id,
    material:{},
    responsavelAdicao:item?.responsavelAdicao,
    responsavelMudanca:session?.user?.name,
    ordemServicoId:os?.id,
    ordemServico:{},
    quantidade:quantidadeMaterial,

  }
  console.log(itemToBeUpdated)
await axios.put(`${url}/Itens/${item?.id}`,itemToBeUpdated).then(r=>{
  getMateriasOs(params.osId)
  setOpenSnackBar(true);
  setSeveridadeAlert("success");
  setMessageAlert("Quantidade atualizar com sucesso");
  handleCloseDialog()

}).catch(r=>console.log(r))
        
      
      }

const handleCalcCustoTotal = (itens:any) :number=>{
  let custoTotalOs:number=0;

  for(let item of itens ){

    custoTotalOs+=item.material.precoCusto * item.quantidade

    }
    return custoTotalOs
  }

const handleCalcVendaTotal = (itens:any) :number=>{
  let custoTotalOs:number=0;

  for(let item of itens ){

    custoTotalOs+=item.material.precoVenda * item.quantidade

    }
    return custoTotalOs
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
const handleCloseDialogAuthorize = ()=>{
  setOpenDialogAuthorize(false)
  
}
 const findInventory = (id:number)=>{
  const inventoryFinded : IInventario | undefined = materiais.find(x=>x.materialId==id)
  console.log(inventoryFinded)
  setInventarioDialog(inventoryFinded)
 }

return (
      <>

      
   <h1 className='text-center mt-8 text-lg'>{os?.descricao}</h1>
   {os?.isAuthorized ?<h1 className='text-center font-bold mt-2 text-lg'>OS Fechada</h1>:""}
  
   <div className='flex flex-row  justify-between '>
     <div className='flex flex-row  mt-10 border-2 border-black  max-h-[480px] p-4 shadow-sm shadow-black ml-4 rounded-md'>
      <div className='flex flex-col justify-center gap-8'>
      
      <Input
        label="Numero Os"
        className="border-1 self-center  border-black rounded-md shadow-sm shadow-black  ml-5 mr-5 w-[150px] max-h-14"
        onValueChange={setNumeroOs}
        value={numeroOs}
        />
        <Input
        label="Ordem de Serviço"
        className="border-1 border-black rounded-md shadow-sm shadow-black ml-5 mr-5 w-[300px] max-h-14"
          onValueChange={setDescricaoOS}
        value={descricaoOs}
        />
        <Input
        label="Resposáveis Execução"
        className="border-1 border-black rounded-md shadow-sm shadow-black  ml-5 mr-5 w-[300px] max-h-14"
          onValueChange={setParticipantesOs}
        value={participantesOs}
        />
           {!os?.isAuthorized ?(

<div className=' flex flex-row justify-center p-3 mt-10 gap-8 '>

<Button  
className='bg-master_black text-white p-4 rounded-md font-bold text-2xl '
disabled={!descricaoOs}
onPress={()=>handleUpdateOs(os?.id)}
 >
                   Atualizar OS
    </Button>
<Button  className='bg-master_black text-white p-4 rounded-md font-bold text-2xl ' onPress={onOpen}>
                   Autorizar
                  </Button>
</div>
):
<div className=' flex flex-row justify-center mt-5 '>
  <Button  
  className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '
  disabled={!descricaoOs}
   onPress={()=>handleUpdateOs(os?.id)}>
                     Atualizar OS
      </Button>
</div>
}

      </div>
     <Textarea
        label="Observações sobre a OS"
        placeholder={`Escreva detalhes sobre a execução da ${os?.descricao}`}
        className="max-w-xl border-1 border-black rounded-md min-w-[470px] max-h-[280px]   shadow-sm shadow-black"
        
        maxRows={14}
        value={observacao}
        onValueChange={setObservacao}
     
      />
     
     </div>
    

     <div className='flex flex-col  mt-10 mr-24'>

      {!os?.isAuthorized && (

     <Autocomplete
           label="Material "
           isDisabled={!materiais}
           isLoading={!materiais.length}
           placeholder="Procure um material"
           className="min-w-[600px]  border-1 border-black rounded-md shadow-sm shadow-black"
         >

         {materiais.map((item:IInventario) => (
     
            <AutocompleteItem
             key={item.id}
             aria-label='teste'
             endContent={
             <>
     
             <p className='text-xs'>{item.material.marca}</p>
              { !os?.isAuthorized &&
              item.saldoFinal!=null && item.saldoFinal>0 &&
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
      )}
     {materiaisOs?.map((item:IItem)=>(
      <>
      <div  key ={item.id} className=' flex flex-row justify-between mt-2 '>
  
        <p className=' text-sm p-1 h-5'>{item.material.id} - {item.material.descricao}</p>

      </div>
     <div className=' flex flex-row justify-between mt-3 '>
       
        <p className=' text-sm mt-1 ml-2 max-w-[400px]' >Adicionado por: {item.responsavelAdicao} {dayjs(item.dataAdicaoItem).format("DD/MM/YYYY [as] HH:mm:ss")}</p>
        <p className=' text-sm mt-1 ml-2' >{item.quantidade} {item.material.unidade}</p>
     </div>

       {!os?.isAuthorized &&(
      <div className=' flex flex-row mt-2  w-14 justify-between max-w-[200px] '>

      <Button  className="p-0 bg-white" onPress={()=>{setItemToBeUpdated(item),setIsEditingOs(true),setOpenDialog(true),findInventory(item.material.id)}} >
        <IconPen />
      </Button>
<Button className="p-0 bg-white" onPress={()=>handleRemoveMaterial(item.id)}>
  
        <IconBxTrashAlt />
</Button>
      </div>
       )}

      <Divider className="bg-black mt-2"/>

      </> 
      ))}
      <p className='text-base text-center p-2'>Quantidade de Materias: {materiaisOs.length}</p>
      <p className='text-base text-center p-2'>Preço de Custo Total:R${precoCustoTotalOs?.toFixed(2).toString().replace('.',",")}  ,Preço Venda Total: R${precoVendaTotalOs?.toFixed(2).toString().replace('.',",")}</p>
      <p className='text-base text-center p-2'></p>
     </div>
   </div>

 

<Dialog open={openDialog} onClose={handleCloseDialog} >
    <DialogTitle sx={{textAlign:"center"}}>{isEditingOs?itemToBeUpdated?.material.descricao:inventarioDialog?.material.descricao}</DialogTitle>
    <DialogContent >

      <p className='text-center'>
        Estoque do Material: {inventarioDialog?.saldoFinal} {inventarioDialog?.material.unidade} 
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
       
        <Button isDisabled={inventarioDialog!= undefined && Number(quantidadeMaterial) > inventarioDialog.saldoFinal}  onPress={()=> !isEditingOs ?handleCreateItem(inventarioDialog):handleUpdateItem(itemToBeUpdated)}>{isEditingOs?"Atualizar Quantidade":"Adicionar material"}</Button>
    </DialogActions>
  </Dialog>



<Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h2 className=' text-red-950 font-bold text-center mt-4'> 
                  ATENÇÃO
                </h2>
                <p className='text-center font-bold'>
                Após autorizar a {os?.descricao},todos os materiais e suas quantidade serão retirados do estoque e não podera mais incluir ou remover materias da os
                , pressione o botão AUTORIZAR somente se tiver certeza
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
                <Button isDisabled={confirmAuthorizeMessage!="AUTORIZAR"} color="primary" onPress={handleAuthorizeOs}>
                  Autorizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
       
     );
}