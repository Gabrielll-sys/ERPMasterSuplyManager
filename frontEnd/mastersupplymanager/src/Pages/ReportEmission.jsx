import React from "react";
import Header from "../componentes/Header";
import EditIcon from '@mui/icons-material/Edit';
import  reportEmission from "../style/reportEmission.module.css"
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import { useNavigate } from "react-router-dom";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import AddIcon from '@mui/icons-material/Add';


const ReportEmission = ()=>{
    const navigate = useNavigate();

return(
    <>

<Header/>
<div className={reportEmission.container_navigation}>
    
<Fab onClick={()=>navigate("/createMaterial")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/reportEmission")}>
  <EditIcon sx={{color:"black"}} />
</Fab>
</div>


    </>
)






}

























export default ReportEmission;