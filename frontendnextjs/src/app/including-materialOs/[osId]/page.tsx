"use client"
import React, { useEffect, useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

import EditIcon from '@mui/icons-material/Edit';

import SearchIcon from '@mui/icons-material/Search';
import dayjs from "dayjs";
import Fab from '@mui/material/Fab';
import { useRouter } from "next/navigation";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import { Button } from "@nextui-org/react";
import { Snackbar } from '@mui/material';
import { FilledInput } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import { url } from "@/app/api/webApiUrl";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


export default function IncludingMaterialOs({params}:any){



    type item = 
    {
      id:number,
      quantidade:number,
      
      material:{
        descricao:string,
        unidade:string,
      }

    }





    const route = useRouter()
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [openList,setOpenList] = useState<boolean>(false)
    const [descricaoOs,setDescricaoOs] = useState<string>()
    const [messageAlert, setMessageAlert] = useState<string>();
    const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
    const[materias,setMateriais] = useState<any>()
    const [descricao, setDescricao] = useState<string>("disju");
    const[materiaisOs,setMateriaisOs] = useState<any>([])
    const [openDialogUpdateQuantity,setOpenDialogUpdateQuantity] = useState<boolean>(false)
    const [openDialog,setOpenDialog] = useState<boolean>(false)
    const [openDialogAuthorize,setOpenDialogAuthorize] = useState<boolean>(false)
    const [responsavel,setResponsavel] = useState<string>()
    const [quantidadeMaterial,setQuantidadeMaterial] = useState<number | undefined>()
    const [object,setObject] = useState<any>([])
    const [os,setOs] = useState<any>("")

  useEffect(()=>{
getOs(params.osId)
getMateriasOs(params.osId)
  },[])


    
    useEffect(() => {
        //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
        if (descricao.length>=3) {
         searchByDescription().then().catch();
      
        }
        setMateriais([])
      
      }, [descricao]);
     
  const getOs = async(id:number)=>{
    
         const res = await axios.get(`${url}/OrdemServicos/${id}`).then(r=>{
          return r.data
          
        })
        setOs(res)

    
      }
      const searchByDescription = async () => {

        try{
         const res = await axios
         .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao}`)
         .then( (r)=> {
          
          return r.data
          
         })
         .catch();
     
         setMateriais(res)
     
        }
        catch(e) 
        
        { 
     console.log(e)
        }
       
     };
  const getMateriasOs = async(id:number)=>{
//Recebe id da ordem de serviço
    const res = await axios.get(`${url}/Itens/GetAllMateriaisOs/${id}`).then(r=>{
      return r.data
    }).catch(e=>console.log(e))

    setMateriaisOs(res)

  }
  
  const handleCreateItem = async(id:number)=>
  {

    const item = {
      materialId:id,
      material:{},
      ordemServicoId:params.osId,
      ordemServico:{},
      quantidade:quantidadeMaterial,

    }


const res = await axios.post(`${url}/Itens/CreateItem`,item).then(r=>{
  return r.data
}).catch(e=>console.log(e))

console.log(res)
setOpenDialog(false)
setQuantidadeMaterial(0)

if(res){
  
  setOpenSnackBar(true);
  setSeveridadeAlert("success");
  setMessageAlert("Material adiciona a lista da OS");
  getMateriasOs(params.osId)
}



  }        
  
const handleAuthorizeOs = async ()=>{


const ordemServico = {
  id:params.osId,
  responsavel:responsavel
}

 await axios.put(`${url}/OrdemServicos/updateAuhorize/${params.osId}`,ordemServico)
  getOs(params.osId)
  handleCloseDialogAuthorize()
  setResponsavel("")

}

const handleEditQuantidade = async (item:any)=>{
console.log(item)
//   const item = {
//     materialId:item.id,
//     material:{},
//     ordemServicoId:idOs.state,
//     ordemServico:{},
//     quantidade:quantidadeMaterial,

//   }
// await axios.put(`${url}/Itens/${id}`,item)


setOpenDialogUpdateQuantity(false)
setQuantidadeMaterial(0)
getOs(params.osId)


}

const handleRemoveMaterial =  async (id:number)=>{

    

  await axios.delete(`${url}/Itens/${id}`).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Material Removido da Lista da Os");
    getMateriasOs(params.osId)
  }).catch(r=>console.log(r))
  

}
const handleOpenDialog =  (item:any)=>{
 
  //Esta linha serve para criar uma copia do objeto,pois se eu pegar o item do paramametro direto,esta alterando o objeto da listad e materias
  // Que é uma lista diferente,e consequentemente alterando o objeto original
  const a = Object.assign({},item)
  setObject(a)
  setOpenDialog(true)

}
const handleOpenDialogAuthorize = ()=>{

setOpenDialogAuthorize(true)

}
const handleOpenDialogEditQuantity = ()=>{

  setOpenDialogUpdateQuantity(true)

  
  }
  const handleCloseDialogEditQuantity = ()=>{

    setOpenDialogUpdateQuantity(false)
    
    
    }
const handleOpenList = (item:any)=>{

setOpenList(!openList)



}
const handleCloseDialog = ()=>{
    setOpenDialog(false)
    setQuantidadeMaterial(0)
}
const handleCloseDialogAuthorize = ()=>{
    setOpenDialogAuthorize(false)
    
}


return(
    <>



<div className=' w-full flex flex-col justify-center mt-6 text-center ' >
<>
<Typography gutterBottom variant="h6" component="div">
        
        Materias na OS-{os.numeroOs && os!=undefined ?os.numeroOs:os.id}-{os!=undefined?os.descricao:""} 
        
       
       </Typography>
</>

{os!=undefined && !os.isAuthorized ?(

<>
<TextField
          
          value={descricao}
          style={{  margin:"auto",marginTop:"20px",width:"320px" }}
          
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
          required
        />

<div className='text-center mt-8 '>
<Button  onPress={handleOpenDialogAuthorize} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl mt-10 '>
       Autorizar OS
      </Button>
      </div>
    
      </>
): 
<Typography gutterBottom variant="h5" component="div">
        A OS-{os.numeroOs?os.numeroOs:os.id}-{os.descricao} foi autorizada dia {dayjs(os.dataAutorizacao).format("DD/MM/YYYY [as] HH:mm:ss")} por {os.responsavel}

</Typography>}
</div>

<div className=" ml-96">
  <List
        sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        
        
      >
        <ListItemButton onClick={handleOpenList}>
          <ListItemText primary="Materiais" />
          <ListItemText secondary={`Materias nesta OS: ${materiaisOs!=undefined?materiaisOs.length:0}`} />
         
          {openList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openList} timeout="auto" unmountOnExit>
              {materiaisOs && materiaisOs.map((x:item)=>(
          <List key={x.id} component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} >
              <ListItemIcon >
                <StarBorder />
              </ListItemIcon>
  
              <ListItemText  primary={x.material.descricao}  secondary={` Quantidade utilizada ${x.quantidade} ${x.material.unidade}`}/>
              {!os.isAuthorized && (

                <DeleteTwoToneIcon onClick={r=>handleRemoveMaterial(x.id)}/>
                )}
                  
            </ListItemButton>
          </List>
              ))}
        </Collapse>
      </List>
</div>


<div className="  flex flex-row flex-wrap">
  {os!=undefined &&  materias  &&!os.isAuthorized &&  materias.map((item:any)=>(
 
 <>
 <Card sx={{ maxWidth: 545 ,margin:4,borderRadius:5}}>
 <CardActionArea>
  
   <CardContent sx={{padding:2}} >
     <Typography variant="h6" color="text.primary" sx={{ maxWidth: 350,minWidth:350}}>
{item.material.descricao}
     </Typography>
     <Typography gutterBottom variant="body1" component="div">
        Código Interno: {item.material.id}
     </Typography>
     <Typography gutterBottom variant="body1" component="div">
       Estoque: {item.saldoFinal==null?"Ainda não registrado":`${item.saldoFinal} ${item.material.unidade}`}
     </Typography>
   </CardContent>
 </CardActionArea>
 <CardActions>

  {item.saldoFinal==null || item.saldoFinal == 0 ?<Typography gutterBottom variant="body1" component="div">
        Não há disponível deste material no estoque
     </Typography>:
     <Button size="sm" color="primary" onClick={x=>handleOpenDialog(item)}   style={{backgroundColor:'white',borderWidth:"0px"}}>
     <AddIcon />
   </Button>}
   
  {/* {materialsOs.includes(item)  && !openDialog &&(

   <Button size="small" color="primary" onClick={x=>HandleRemoveItemList(item)}>
    <DeleteIcon/>
   </Button>

  )} */}
 </CardActions>
</Card>

</>
  ))}

 {object!=""&& quantidadeMaterial!=undefined && (

    <Dialog open={openDialog} onClose={handleCloseDialog} >
        <DialogTitle sx={{textAlign:"center"}}>Adicionando Quantidade</DialogTitle>
        <DialogContent >
        <Typography gutterBottom variant="h7" component="div">
           {quantidadeMaterial>object.saldoFinal && materiaisOs?`A Quantidade escolhida excede o Estoque De ${object.material.descricao}`:`${object.material.descricao}` }
           </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {`Estoque do Material: ${object.saldoFinal} ${object.material.unidade} `}
              </Typography>
          <FilledInput
            error={quantidadeMaterial>object.saldoFinal && materiaisOs?true:false}
            autoFocus
            endAdornment={<InputAdornment position="end">{object.material.unidade}</InputAdornment>}
            onChange={x=>setQuantidadeMaterial(Number(x.target.value))}
            margin="dense"
            id="name"
            label="Quantidade de Material"
            type="email"
            fullWidth
            variant="standard"
            value={quantidadeMaterial}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
           
            <Button onClick={x=>handleCreateItem(object.material.id)} 
         
          disabled={(quantidadeMaterial > object.saldoFinal && object)|| quantidadeMaterial ==undefined || quantidadeMaterial==0 || quantidadeMaterial==0?true:false}>Adicionar Material</Button>
        </DialogActions>
      </Dialog>
 )}
   <Dialog open={openDialogAuthorize} onClose={handleCloseDialog} >
        <DialogTitle sx={{textAlign:"center",fontWeight:"bold"}}>Autorização da OS-{os.numeroOs && os!=undefined ?os.numeroOs:os.id}-{os!=undefined?os.descricao:""} </DialogTitle>
        <DialogContent >
        <Typography gutterBottom variant="h5" component="div" sx={{color:"red",textAlign:"center",fontWeight:"bold"}} >
          ATENÇÃO
           </Typography>
           <Typography gutterBottom variant="h5" component="div" sx={{fontWeight:"bold",textAlign:"center"}} >
           Após autorizar a OS,o ato NÃO podera ser revertido
           </Typography>
          <Typography gutterBottom variant="h6" component="div">
          
              </Typography>
          <FilledInput
            autoFocus            
            onChange={x=>setResponsavel(x.target.value)}
            margin="dense"
            id="name"
            label="Responsável pela OS"
            type="email"
            fullWidth
            variant="standard"
            value={responsavel}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogAuthorize}>Fechar</Button>
           
            <Button onClick={handleAuthorizeOs} 
         
          disabled={!responsavel || materiaisOs.length==0}>Autorizar OS</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogUpdateQuantity} onClose={handleCloseDialogEditQuantity} >
        <DialogTitle sx={{textAlign:"center",fontWeight:"bold"}}>Autorização da OS-{os.numeroOs && os!=undefined ?os.numeroOs:os.id}-{os!=undefined?os.descricao:""} </DialogTitle>
        <DialogContent >
        <Typography gutterBottom variant="h5" component="div" sx={{textAlign:"center",fontWeight:"bold"}} >
         Alteração de quantidade
           </Typography>
           <Typography gutterBottom variant="h5" component="div" sx={{fontWeight:"bold",textAlign:"center"}} >
          Digite a nova quantidade do material
           </Typography>
          <Typography gutterBottom variant="h6" component="div">
          
              </Typography>
          <FilledInput
            autoFocus            
            onChange={x=>setQuantidadeMaterial(Number(x.target.value))}
            margin="dense"
            id="name"
            label="Responsável pela OS"
            type="email"
            fullWidth
            variant="standard"
            value={quantidadeMaterial}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogEditQuantity}>Fechar</Button>
           
            <Button onClick={handleEditQuantidade} 
         
          disabled={!quantidadeMaterial || materiaisOs.length==0}>Editar quantidade</Button>
        </DialogActions>
      </Dialog>



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
</div>

    </>
)

}