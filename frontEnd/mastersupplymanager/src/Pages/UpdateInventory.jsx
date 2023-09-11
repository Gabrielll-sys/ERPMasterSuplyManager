
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "../contetxs/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateInventory from "../style/updateMaterial.module.css";
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
 const [codigoInterno,setCodigoInterno] = useState("")
 const [razao,setRazao] = useState("")
 const [movimento,setMovimento] = useState("")
const [categoria,setCategoria] = useState("")
 const[dataentrada,setDataentrada] = useState()
 const [openSnackBar,setOpenSnackBar]= useState(false)
 const [ messageAlert,setMessageAlert] = useState();
 const [ severidadeAlert,setSeveridadeAlert] = useState()


useEffect(()=>{

getItemInventory(idInventario.state)
getCategoria(idInventario.state)
},[])


 const getItemInventory= async (id)=>{



const item = await axios.get(`${url}/Materiais/${id}`).then(x=>{

getLastMaterial(x.data.codigoInterno)

return  x.data
})



}

const getLastMaterial = async (code)=>{

const material = await axios.get(`${url}/Materiais/buscaCodigo/${code}`).then(x=>{
setDescricao(x.data.descricao)
setCodigoInterno(x.data.codigoInterno)
setMovimento(x.data.saldoFinal==undefined?0:x.data.saldoFinal)
setDataentrada(x.data.dataAlteracao)
return  x.data
})
 console.log(material.estoque)
}

const updateInventario=  async ()=>{

if( !razao){

  setOpenSnackBar(true)
  setSeveridadeAlert("warning")
  setMessageAlert("Prencha todas as informações necessárias")

}
else{

  // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
const inventario = {
    razao:razao.trim().replace(/\s\s+/g, ' '),
    saldoFinal:movimento,
    codigoInterno:codigoInterno,
    }

   

try{

  const inventarioAtualizado =  await axios.post(`${url}/Materiais`,inventario)
  .then(r=>
    {
      setOpenSnackBar(true)
      setSeveridadeAlert("success")
      setMessageAlert("Inventário Atualizado com sucesso")
      return r.data
}).catch()

createCategoria(inventarioAtualizado.id)

}
catch(e){

  console.log(e)
}
}

}

const getCategoria = async(id)=>{

  
  axios.get(`${url}/Categorias/${id}`).then(r=>{
  console.log(r.data.nomeCategoria)
  setCategoria(r.data.nomeCategoria)


  }).catch(e=>console.log(e))

}
const createCategoria = async (idMaterial) => {
  const category = {
    nomeCategoria: categoria,
    materialId: idMaterial,
    material: {},
  };
  await axios
    .post(`${url}/Categorias`, category)
    .then((r) => {
      return r.data
    })
    .catch((e) => console.log(e));
};
  return (
    <>

  <Header/>

    <h1 className={updateInventory.h1}>Editando inventário de {categoria} {descricao} (COD:{codigoInterno}) </h1>
  
    <div className={updateInventory.container_inputs}>


    


    <TextField  disabled={true}   value={codigoInterno} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className={updateInventory.inputs} onChange={e=>setCodigoInterno(e.target.value)} label='Código' required />


    <TextField  disabled={true}   value={categoria} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
    className={updateInventory.inputs} onChange={e=>setCategoria(e.target.value)} label='Categoria' required />

    <TextField  disabled={true}  value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
    className={updateInventory.inputs} onChange={e=>setDescricao(e.target.value)} label='Descrição' required />

<TextField    value={razao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',width:"400px"}}
          error={severidadeAlert != "warning" || razao.length ? false : true}
          className={updateInventory.inputs} onChange={e=>setRazao(e.target.value)} label='Razão' required />

    <TextField   value={movimento} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className={updateInventory.inputs}  onChange={(e) => setMovimento(e.target.value)} label='Estoque' required />


   

    
  
 
    
    </div>
    <div className={updateInventory.container_botoes}>
    <Button  className={updateInventory.botao}label="Atualizar Material" onClick={updateInventario} />
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
