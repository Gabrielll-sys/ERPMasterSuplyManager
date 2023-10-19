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
import Divider from '@mui/material/Divider';
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { url } from "../contetxs/webApiUrl";

const OsManagement = ()=>{
    const navigate = useNavigate();
    const[materias,setMateriais] = useState()
  const [descricao, setDescricao] = useState("");
    

  const searchByDescription = async () => {

    try{
     const res = await axios
     .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao}`)
     .then( (r)=> {
       console.log(r.data)
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
useEffect(() => {
  //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
  if (descricao.length>=3) {
   searchByDescription().then().catch();

  }
  setMateriais([])

}, [descricao]);

const getAllMaterials =  async ()=>{


  const res =  await axios
  .get(`${url}/Materiais`)
  .then( (r)=> {
    setMateriais(r.data)
    console.log(r.data)
    
   return r.data
   
  })
  .catch();


}
return(
    <>

<Header/>
<div className={OsManagement.container_navigation}>
    
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
<div>


</div>

    </>
)






}

























export default OsManagement;