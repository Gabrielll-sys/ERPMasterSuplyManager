import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import EditIcon from '@mui/icons-material/Edit';
import  osManagement from "../style/osManagement.module.css"
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import { CardActionArea, CardActions } from '@mui/material';
import { Button } from "primereact/button";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import createMaterial from "../style/createMaterial.module.css"
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { url } from "../contetxs/webApiUrl";
import IncludingMaterialOS from "./IncludingMaterialOS";
import dayjs from "dayjs";

const OsManagement = ()=>{
    const navigate = useNavigate();
  const [ordemServicos,setOrdemServicos] = useState([])
  const [descricaoOs, setDescricaoOs] = useState("");
  const [numeroOs,setNumeroOs] = useState()
  const [prefixoOs,setPrefixoOs] = useState(["ME","BR"])
  const [resposavel,setResposavel] = useState()

  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();

  const prefixos = ["ME","BR"]

useEffect(()=>
{
getAllOs()
  
},[])
  const handleChangeUpdatePage = async (id) => {
   
    

    navigate("/includingMaterialOs", { state: id })


      
  };

const getAllOs= async()=>{

const res = await axios.get(`${url}/OrdemServicos`).then(r=>{
  return r.data
}).catch()
console.log(res)
setOrdemServicos(res)




}

const handleCreateOs = async()=>{

const descricaoOsFormated = descricaoOs.trim().replace(/\s\s+/g, " ")
const reponsavelFormated = resposavel==undefined?"":resposavel.trim().replace(/\s\s+/g, " ")

const OS ={
descricao:`${prefixoOs}-${descricaoOsFormated}`,
resposavel:reponsavelFormated,
numeroOs:numeroOs,
}



 const res = await axios.post(`${url}/OrdemServicos`,OS).then(x=>{

  return x.data
 }).catch()
console.log(res)


  getAllOs()

}

return(
    <>

<Header/>
<div className={osManagement.container_navigation}>
    
<Fab onClick={()=>navigate("/")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/searchInventory")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/osManagement")}>
<BorderColorTwoToneIcon sx={{color:"black"}} />

</Fab>

</div>

<h1 className={osManagement.h1}>Gerenciamento de OS</h1>

<div className={osManagement.container_inputs}>
 

       

  <TextField
  
    value={descricaoOs}
    style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
    className={osManagement.inputs}
    
    error={severidadeAlert != "warning" || !messageAlert=="Já existe um material com este mesmo código de fabricante" ? false : true}

    onChange={(e) => setDescricaoOs(e.target.value)}
    label="Descrição OS"
    
  />
 
 

<Select
style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px",height:"55px"}}
labelId="demo-simple-select-label"
value={prefixoOs}
label="Prefixo Da OS"
onChange={x=>setPrefixoOs(x.target.value)}
>
{prefixos.map((x)=>(
  <MenuItem value={x}>{x}</MenuItem>
  
))}

</Select>
{ prefixoOs=="BR" && (
  <TextField
  value = {numeroOs}
  style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px",width:"200px" }}
  className={osManagement.inputs}
  
  error={severidadeAlert != "warning" || ! messageAlert=="Já existe um material com este mesmo código de fabricante" ? false : true}

  onChange={(e) => setNumeroOs(e.target.value)}
  label="Numero OS"
  
/>
  )}
</div>
<div className={osManagement.container_botoes}>
<Button
          className={osManagement.botao}
          label="Criar OS"
          onClick={handleCreateOs}
        />

       
   </div>

   <div className={osManagement.container_os}>
{  ordemServicos!=undefined && ordemServicos.map(os=>(
 
 <>
 <Card sx={{ maxWidth: 545 ,margin:5,borderRadius:5}}>
 <CardActionArea>
  
   <CardContent sx={{padding:2}} >
     <Typography variant="h6" color="text.primary" sx={{ maxWidth: 350,minWidth:350,textAlign:"center",fontWeight:"bold"}}>
     OS-{os.numeroOs?os.numeroOs:os.id}-{os.descricao}
     </Typography>
     
     <Typography gutterBottom variant="h6" component="div" sx={{textAlign:"center",}}>
       Status: {!os. isAuthorized?"Pendente":`Autorizada ${dayjs(os.dataAutorizacao).format("DD/MM/YYYY [as] HH:mm:ss")}`}
     </Typography>
     {os.isAuthorized &&(

     <Typography gutterBottom variant="h6" component="div" sx={{textAlign:"center"}}>
      Autorizada por {os.responsavel}
     </Typography>
     )}
   </CardContent>
 </CardActionArea>
 <CardActions>

{os.isAuthorized ?(

 <Button size="small" color="primary" onClick={x=>handleChangeUpdatePage(os.id)} style={{backgroundColor:'white',borderWidth:"0px"}} >
     <VisibilityTwoToneIcon  />
   </Button>
):
<Button size="small" color="primary" onClick={x=>handleChangeUpdatePage(os.id)} style={{backgroundColor:'white',marginTop:"13px",borderWidth:"0px"}}>
<CreateIcon />
</Button>}
   
 </CardActions>
</Card>
</>
  ))}
  </div>


    </>
)






}

























export default OsManagement;