"use client"
import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import EditIcon from '@mui/icons-material/Edit';
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import { CardActionArea, CardActions } from '@mui/material';
import { AvatarIcon, Button } from "@nextui-org/react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import createMaterial from "../style/createMaterial.module.css"
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { url } from "../api/webApiUrl";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";

import NavBar from "../componentes/NavBar"
import { useSession } from "next-auth/react";
export default function OsManagement(){
   
    type Os = {
      id:number,
      numeroOs?:number,
      descricao?:string,
      responsavel?:string,
      isAuthorized?:boolean,
      dataAutorizacao?:any,
    }
  
  
    const route = useRouter()
    const { data: session } = useSession();
  
    const [ordemServicos,setOrdemServicos] = useState([])
    const [descricaoOs, setDescricaoOs] = useState<string>("");
    const [numeroOs,setNumeroOs] = useState<number>()
    const [prefixoOs,setPrefixoOs] = useState<any>(["ME","BR"])
    const [resposavel,setResposavel] = useState<string>()
  
    const [messageAlert, setMessageAlert] = useState();
    
  
    const prefixos = ["ME","BR"]
  
  useEffect(()=>
  {
  getAllOs()
    
  },[])
    const handleChangeUpdatePage = async (id:number) => {
     
      
    route.push(`/including-materialOs/${id}`)
        
     
  
  
        
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
  
  const OS =
  {
    
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
  

  <div>
      
      <NavBar/>
      
      </div>
  <h1 className='text-center font-bold text-2xl mt-6' >Gerenciamento de OS</h1>
  
  <div className=' w-full flex flex-row justify-center mt-6 '>
   
  
         
  
    <TextField
    
      value={descricaoOs}
      style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
    
      
    
  
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
    <MenuItem key={x} value={x}>{x}</MenuItem>
    
  ))}
  
  </Select>
  
 
  { prefixoOs=="BR" && (
    <TextField
    value = {numeroOs}
    style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px",width:"200px" }}
    
    
    
  
    onChange={(e) => setNumeroOs(Number(e.target.value))}
    label="Numero OS"
    
  />
    )}
  </div>
  <div className='text-center mt-8 '>
      <Button  onPress={handleCreateOs} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '>
        Cria OS
      </Button>
      </div>
     <div className=" flex flex-row flex-wrap" >
  {  ordemServicos!=undefined && ordemServicos.map((os:Os)=>(
   
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
  
   <Button size="sm" color="primary" onClick={x=>handleChangeUpdatePage(os.id)} style={{backgroundColor:'white',borderWidth:"0px"}} >
       <VisibilityTwoToneIcon  />
     </Button>
  ):
  <Button size="sm" color="primary" onClick={x=>handleChangeUpdatePage(os.id)} style={{backgroundColor:'white',marginTop:"13px",borderWidth:"0px"}}>
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


