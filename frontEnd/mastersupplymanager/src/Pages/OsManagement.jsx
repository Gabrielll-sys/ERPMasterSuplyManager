import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import EditIcon from '@mui/icons-material/Edit';
import  osManagement from "../style/osManagement.module.css"
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { url } from "../contetxs/webApiUrl";

const OsManagement = ()=>{
    const navigate = useNavigate();
    
  const [descricaoOs, setDescricaoOs] = useState("");
    
  const [prefixoOs,setPrefixoOs] = useState(["ME","BR"])
  const [resposavel,setResposavel] = useState()

  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();



const handleCreateOs = async()=>{

const OS ={
descricao:prefixoOs+" "

}

const res = axios.post()




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

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/includingMaterialOs")}>
  <EditIcon sx={{color:"black"}} />
</Fab>
</div>

<h1 className={osManagement.h1}>Criação de Material</h1>

<div className={osManagement.container_inputs}>
 
 

  <TextField
  
    value={descricaoOs}
    style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
    className={osManagement.inputs}
    
    error={severidadeAlert != "warning" || !messageAlert=="Já existe um material com este mesmo código de fabricante" ? false : true}

    onChange={(e) => setDescricaoOs(e.target.value)}
    label="Descrição OS"
    
  />
  <TextField
  
    value={resposavel}
    style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
    className={osManagement.inputs}
    
    error={severidadeAlert != "warning" || !messageAlert=="Já existe um material com este mesmo código de fabricante" ? false : true}

    onChange={(e) => setResposavel(e.target.value)}
    label="Responsável"
    
  />



<Select
style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px",height:"55px"}}
labelId="demo-simple-select-label"
value={prefixoOs}
label="Prefixo Da OS"
onChange={x=>setPrefixoOs(x.target.value)}
>
{prefixoOs.map((x)=>(
  <MenuItem value={x}>{x}</MenuItem>
  
))}

</Select>
</div>

    </>
)






}

























export default OsManagement;