
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "../contetxs/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../style/updateMaterial.css";
import MuiAlert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const UpdateInventory = ()=>{
 const navigate = useNavigate()

 //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material
  const idInventario= useLocation()

 const [descricao,setDescricao] = useState("")
 const [codigo,setCodigo] = useState("")
 const [razao,setRazao] = useState("")
 const [movimento,setMovimento] = useState("")
const [categoria,setCategoria] = useState("")
 const[dataentrada,setDataentrada] = useState()
 const [openSnackBar,setOpenSnackBar]= useState(false)
 const [ messageAlert,setMessageAlert] = useState();
 const [ severidadeAlert,setSeveridadeAlert] = useState()


useEffect(()=>{
console.log(idInventario.state)
getItemInventory(idInventario.state)
getCategoria(idInventario.state)
},[])

 const getItemInventory= async (id)=>{

const item = await axios.get(`${url}/Materiais/${id}`).then(x=>{
setDescricao(x.data.descricao)
setCodigo(x.data.codigo)
setMovimento(x.data.saldoFinal==undefined?0:x.data.saldoFinal)
setDataentrada(x.data.dataAlteracao)
return  x.data
})





}



 


const updateInventario=  async ()=>{

if( !descricao || !movimento){

  setOpenSnackBar(true)
  setSeveridadeAlert("warning")
  setMessageAlert("Prencha todas as informações necessárias")

}
else{

  // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
const inventario = {
    codigo:codigo.trim().replace(/\s\s+/g, ' '),
    descricao:descricao.trim().replace(/\s\s+/g, ' '),
    razao:razao.trim().replace(/\s\s+/g, ' '),
    estoque:movimento,
    }

   


  const inventarioAtualizado =  await axios.post(`${url}/Inventarios`,inventario)
  .then(r=>
    {  

      setOpenSnackBar(true)
      setSeveridadeAlert("success")
      setMessageAlert("Inventário Atualizado com sucesso")
    

}
    
  ).catch(e=>{
    console.log(e)
    // console.log(e.response.data.message[0].errorMessage)
    if(e.response.data.message=="Código já existe")
    {
      setOpenSnackBar(true)
      setSeveridadeAlert("error")
      setMessageAlert("Já existe um material com este código")
    }
     else if(e.response.data.message=="Um material com essa descrição já existe"){
      setOpenSnackBar(true)
      setSeveridadeAlert("error")
      setMessageAlert("Um matérial com esta descrição já existe")
     }
    

  })
 

}
}

const getCategoria = async(id)=>{


  await axios.get(`${url}/api/Categorias/${id}`).then(r=>{
  console.log(r.data.nomeCategoria)
  setCategoria(r.data.nomeCategoria)
    

  }).catch(e=>console.log(e))

}



  return (
    <>

  <Header/>

    <h1>Editando inventário de {categoria} {descricao} </h1>
  
    <div className="container-inputs">


    


    <TextField  disabled={true}   value={codigo} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className='inputs' onChange={e=>setCodigo(e.target.value)} label='Código' required />

    <TextField  disabled={true}   value={categoria} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className='inputs' onChange={e=>setCategoria(e.target.value)} label='Categoria' required />

    <TextField    value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className='inputs' onChange={e=>setDescricao(e.target.value)} label='Descrição' required />

<TextField    value={razao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className='inputs' onChange={e=>setRazao(e.target.value)} label='Razão' required />

    <TextField   value={movimento} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className='inputs'  onChange={(e) => setMovimento(e.target.value)} label='Estoque' required />


   

    
  
 
    
    </div>
    <div className='container-botoes'>
    <Button  className="botao"label="Atualizar Material" onClick={updateInventario} />
    <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={e=>setOpenSnackBar(false)}>
            <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
             {messageAlert}
           </MuiAlert>
           </Snackbar>
        </div>

    
    </>
    
    
  );
}

export default UpdateInventory;
