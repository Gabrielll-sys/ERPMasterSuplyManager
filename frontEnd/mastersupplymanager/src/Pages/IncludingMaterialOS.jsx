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

const IncludingMaterialOS = ()=>{
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openList,setOpenList] = useState(true)
    const [messageAlert, setMessageAlert] = useState();
    const [severidadeAlert, setSeveridadeAlert] = useState();
    const navigate = useNavigate();
    const[materias,setMateriais] = useState()
  const [descricao, setDescricao] = useState("disju");
    let[materialsOs,setMaterialsOs] = useState([])
    const [openDialog,setOpenDialog] = useState(false)
    const [quantidadeMaterial,setQuantidadeMaterial] = useState()
    const [object,setObject] = useState([])
    
    useEffect(() => {
        //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
        if (descricao.length>=3) {
         searchByDescription().then().catch();
      
        }
        setMateriais([])
      
      }, [descricao]);


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


const handleAddMaterial = ()=>{

  
  if(!materialsOs.includes(object)){

          const b =  object.saldoFinal - quantidadeMaterial

          object.saldoFinal = b
      materialsOs.push(object)
      setOpenSnackBar(true);
      setSeveridadeAlert("success");
      setMessageAlert("Material adiciona a lista da OS");
  
  }
  else{
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Este Material Já esta na lista da OS");
  }

    setOpenDialog(false)
    setQuantidadeMaterial()

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
   
    materialsOs.pop()
    setOpenDialog(false)
    setQuantidadeMaterial("")
}

const HandleRemoveItemList = (item)=>{
  
  
 const newArray = materialsOs.filter(x=>!(x.materialId==item.materialId))

 console.log(newArray)
setMaterialsOs(newArray)
setOpenSnackBar(true);
setSeveridadeAlert("success");
setMessageAlert("Material Removido da Lista da Os");

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
<TextField
          
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px",width:"320px" }}
          
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
          required
        />

<div className={includingMaterialOs.container_list}>
  <List
        sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Typography gutterBottom variant="h6" component="div">
          Materias OS-2432
       </Typography>
        }
      >
        <ListItemButton onClick={handleOpenList}>
          <ListItemText primary="Inbox" />
          <ListItemText secondary={`Materias nesta OS: ${materialsOs.length}`} />
          {openList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openList} timeout="auto" unmountOnExit>
              {materialsOs && materialsOs.map(x=>(
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
  
              <ListItemText  primary={x.material.descricao}  secondary={` Quantidade utilizada ${x.saldoFinal} ${x.material.unidade}`}/>
      <DeleteIcon onClick={r=>HandleRemoveItemList(x)}/>
  
            </ListItemButton>
          </List>
              ))}
        </Collapse>
      </List>
</div>


<div className={includingMaterialOs.container_materials}>
  { materias && materias.map(item=>(
 
 <>
 <Card sx={{ maxWidth: 545 ,margin:5,borderRadius:5}}>
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
           {quantidadeMaterial>object.saldoFinal && materialsOs?`A Quantidade escolhida excede o Estoque De ${object.material.descricao}`:`${object.material.descricao}` }
           </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {`Estoque do Material: ${object.saldoFinal} ${object.material.unidade} `}
              </Typography>
          <FilledInput
            error={quantidadeMaterial>object.saldoFinal && materialsOs?true:false}
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
          <Button onClick={x=>handleAddMaterial()} 
          disabled={(quantidadeMaterial>object.saldoFinal && object)|| quantidadeMaterial ==undefined|| quantidadeMaterial==""?true:false}>Adicionar Material</Button>
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