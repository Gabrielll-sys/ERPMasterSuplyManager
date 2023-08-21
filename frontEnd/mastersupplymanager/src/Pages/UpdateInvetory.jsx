
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
  const idMaterial= useLocation()
 const[categoria,setCategoria]=useState("")
 const [descricao,setDescricao] = useState("")
 const [codigo,setCodigo] = useState("")
 const [marca,setMarca] = useState("")
 const [ tensao,setTensao] = useState("")
 const [corrente,setCorrente] = useState("")
 const [ unidade,setUnidade] = useState("")
 const[dataentrada,setDataentrada] = useState()
 const [openSnackBar,setOpenSnackBar]= useState(false)
 const [ messageAlert,setMessageAlert] = useState();
 const [ severidadeAlert,setSeveridadeAlert] = useState()

 
 const [materiais, setMateriais] = useState([]);

 const unidadeMaterial = ["UN","RL","PÇ","M","P"]
 const tensoes = ["127V","220V","380V","440V","660V"]


useEffect(()=>{

  if(descricao.length) {
  searchByDescription().then().catch()

}
setMateriais([])


},[descricao])
useEffect(()=>{

    getMaterial(idMaterial.state).then().catch()
    getCategoria(idMaterial.state).then().catch()

},[])
const searchByDescription = async () =>{
console.log(descricao)
const res = await axios.get(`${url}/Materiais/busca?descricao=${descricao}`).then(
r=>{

  
  setMateriais(r.data)

}

).catch()


}
  const updateCategoria = async(id)=>{

  const category = {
    id:id,
    nomeCategoria :categoria,
    materialId:id,
    material:{}

  }
   await axios.put(`${url}/api/Categorias/${29}`,category).then(r=>navigate('/')).catch(e=>console.log(e))
   

}
 const getMaterial = async(id)=>{

 axios.get(`${url}/Materiais/${id}`).then(r=>{
  setDataentrada(dayjs(r.data.dataEntradaNF))

setUnidade(r.data.unidade)
setCodigo(r.data.codigo)
setCorrente(r.data.corrente)
setMarca(r.data.marca)
setDescricao(r.data.descricao)



setTensao(tensoes[tensoes.findIndex((x)=>x==r.data.tensao)])

 })

 }

  const getCategoria = async(id)=>{

  
    await axios.get(`${url}/api/Categorias/${id}`).then(r=>{
    console.log(r.data.nomeCategoria)
    setCategoria(r.data.nomeCategoria)


    }).catch(e=>console.log(e))

}
const updateMaterial=  async (id)=>{

if(!categoria || !descricao || !unidade){

  setOpenSnackBar(true)
  setSeveridadeAlert("warning")
  setMessageAlert("Prencha todas as informações necessárias")

}
else{

  // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
const material = {
    id:id,
    codigo:codigo.trim().replace(/\s\s+/g, ' '),
    descricao:descricao.trim().replace(/\s\s+/g, ' '),
    marca:marca.trim().replace(/\s\s+/g, ' '),
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    unidade:unidade.trim().replace(/\s\s+/g, ' '),
    tensao:tensao.trim().replace(/\s\s+/g, ' '),
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    dataEntradaNF:dataentrada,
    }

    console.log(id)


  const materialAtualizado =  await axios.put(`${url}/Materiais/${id}`,material)
  .then(r=>
    {  
      console.log(r)
      updateCategoria(idMaterial.state)
      setOpenSnackBar(true)
      setSeveridadeAlert("success")
      setMessageAlert("Material Atualizado com sucesso")
      // setInterval(()=>{
      //   navigate('/')
      // },2000)

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





  return (
    <>

  <Header/>

    <h1>Editando {categoria} {descricao}</h1>
  
    <div className="container-inputs">


    <TextField  value={categoria} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}  
    className='inputs' onChange={e=>setCategoria(e.target.value)} label='Categoria' required/>
    


    <TextField    value={codigo} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className='inputs' onChange={e=>setCodigo(e.target.value)} label='Código' required />

   
    {/* <InputText className='inputs' value={descricao} onChange={e=>setDescricao(e.target.value)} /> */}
    <TextField   value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className='inputs'  onChange={(e) => setDescricao(e.target.value)} label='Descrição' required />

   
    <TextField   value={marca} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}} 
    className='inputs' onChange={e=>setMarca(e.target.value)}  label='Marca' />
   
      
   <Select
     style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px"}}
     labelId="demo-simple-select-label"
    value={tensao}
    label="Tensao"
    onChange={x=>setTensao(x.target.value)}
  >
      {tensoes.map((x)=>(
        <MenuItem value={x}>{x}</MenuItem>
        
      ))}
    
  
  </Select>
        <TextField
          value={corrente}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px"}}
          className="inputs"
          onChange={(e) => setCorrente(e.target.value)}
          label="Corrente"
        />

     

  <Select
     style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"120px"}}
     labelId="demo-simple-select-label"
    value={unidade}
    label="Unidade"
    onChange={x=>setUnidade(x.target.value)}
  >
      {unidadeMaterial.map((x)=>(
        <MenuItem value={x}>{x}</MenuItem>
        
      ))}
    
  
  </Select>

    <div style={{marginTop:'40px',width:'206px'}}>

    <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="pt-br" >
    
        <DatePicker  label="Data Entrada NF"  value={dataentrada} onChange={e=>setDataentrada(e)} />
    
    </LocalizationProvider>
    </div>
    

  
    </div>
    <div className='container-botoes'>
    <Button  className="botao"label="Atualizar Material" onClick={x=>updateMaterial(idMaterial.state)} />
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
