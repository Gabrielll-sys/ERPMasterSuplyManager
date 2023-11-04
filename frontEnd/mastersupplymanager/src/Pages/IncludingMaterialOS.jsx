import React, { useEffect, useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Header from "../componentes/Header";
import EditIcon from '@mui/icons-material/Edit';
import  includingMaterialOs from "../style/includingMaterialOs.module.css"
import SearchIcon from '@mui/icons-material/Search';
import dayjs from "dayjs";
import Fab from '@mui/material/Fab';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { FilledInput, Snackbar } from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import { url } from "../contetxs/webApiUrl";
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from "react-router-dom";

const IncludingMaterialOS = ()=>{
     const idOs= useLocation()

    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openList,setOpenList] = useState(true)
    const [descricaoOs,setDescricaoOs] = useState()
    const [messageAlert, setMessageAlert] = useState();
    const [severidadeAlert, setSeveridadeAlert] = useState();
    const navigate = useNavigate();
    const[materias,setMateriais] = useState()
    const [descricao, setDescricao] = useState("disju");
    const[materiaisOs,setMateriaisOs] = useState([])
    const [openDialog,setOpenDialog] = useState(false)
    const [quantidadeMaterial,setQuantidadeMaterial] = useState()
    const [object,setObject] = useState([])
    const [os,setOs] = useState("")

  useEffect(()=>{
getOs(idOs.state)
getMateriasOs(idOs.state)
  },[])


    
    useEffect(() => {
        //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
        if (descricao.length>=3) {
         searchByDescription().then().catch();
      
        }
        setMateriais([])
      
      }, [descricao]);
     
  const getOs = async(id)=>{
    
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
  const getMateriasOs = async(id)=>{
//Recebe id da ordem de serviço
    const res = await axios.get(`${url}/Itens/GetAllMateriaisOs/${id}`).then(r=>{
      return r.data
    }).catch(e=>console.log(e))

    setMateriaisOs(res)

  }
  
  const handleCreateItem = async(id)=>
  {
    console.log(idOs.state)
    const item = {
      materialId:id,
      material:{},
      ordemServicoId:idOs.state,
      ordemServico:{},
      quantidade:quantidadeMaterial,

    }


const res = await axios.post(`${url}/Itens/CreateItem`,item).then(r=>{
  return r.data
}).catch(e=>console.log(e))

console.log(res)
setOpenDialog(false)
setQuantidadeMaterial()

if(res){
  
  setOpenSnackBar(true);
  setSeveridadeAlert("success");
  setMessageAlert("Material adiciona a lista da OS");
  getMateriasOs(idOs.state)
}



  }        
  
const handleAuthorizeOs = async ()=>{




}


const handleRemoveMaterial =  async (id)=>{

    

  await axios.delete(`${url}/Itens/${id}`).then(r=>{

    setOpenSnackBar(true);
    setSeveridadeAlert("success");
    setMessageAlert("Material Removido da Lista da Os");
    getMateriasOs(idOs.state)
  }).catch(r=>console.log(r))
  

}
const handleOpenDialog =  (item)=>{
 
  //Esta linha serve para criar uma copia do objeto,pois se eu pegar o item do paramametro direto,esta alterando o objeto da listad e materias
  // Que é uma lista diferente,e consequentemente alterando o objeto original
  const a = Object.assign({},item)
  setObject(a)
  setOpenDialog(true)

}
const handleOpenList = (item)=>{

setOpenList(!openList)



}
const handleCloseDialog = ()=>{
    setOpenDialog(false)
    setQuantidadeMaterial()
}



return(
    <>

<Header/>
<div className={includingMaterialOs.container_navigation}>
    
<Fab onClick={()=>navigate("/createMaterial")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/includingMaterialOs")}>
  <EditIcon sx={{color:"black"}} />
</Fab>
</div>
<div className={includingMaterialOs.container_inputs}>
<>
<Typography gutterBottom variant="h6" component="div">
        
        Materias na OS-{os.numeroOs && os!=undefined ?os.numeroOs:os.id}-{os!=undefined?os.descricao:""} 
        
       
       </Typography>
</>

{os!=undefined && !os.isAuthorized ?(


<TextField
          
          value={descricao}
          style={{  margin:"auto",marginTop:"20px",width:"320px" }}
          
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
          required
        />
): 
<Typography gutterBottom variant="h5" component="div">
        A OS-{os.numeroOs?os.numeroOs:os.id}-{os.descricao} foi autorizada {dayjs(os.dataAutorizacao).format("DD/MM/YYYY [as] HH:mm:ss")} por {os.responsavel}

</Typography>}
</div>

<div className={includingMaterialOs.container_list}>
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
              {materiaisOs && materiaisOs.map(x=>(
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
  
              <ListItemText  primary={x.material.descricao}  secondary={` Quantidade utilizada ${x.quantidade} ${x.material.unidade}`}/>
              {!os.isAuthorized && (

                <DeleteIcon onClick={r=>handleRemoveMaterial(x.id)}/>
                )}
                  
            </ListItemButton>
          </List>
              ))}
        </Collapse>
      </List>
</div>


<div className={includingMaterialOs.container_materials}>
  {os!=undefined &&  materias  &&!os.isAuthorized &&  materias.map(item=>(
 
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
     </Typography>:<Button size="small" color="primary" onClick={x=>handleOpenDialog(item)}>
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

 {object!=""&& (

    <Dialog open={openDialog} onClose={handleCloseDialog} >
        <DialogTitle>Adicionando Quantidade</DialogTitle>
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
            onChange={x=>setQuantidadeMaterial(x.target.value)}
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
         
          disabled={(quantidadeMaterial>object.saldoFinal && object)|| quantidadeMaterial ==undefined || quantidadeMaterial=="" || quantidadeMaterial==0?true:false}>Adicionar Material</Button>
        </DialogActions>
      </Dialog>
 )}
  

  <Snackbar
            open={openSnackBar}
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



export default IncludingMaterialOS;