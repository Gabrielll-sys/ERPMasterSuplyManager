
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
 const[estoque,setEstoque] = useState()
const [categoria,setCategoria] = useState("")
 const[dataentrada,setDataentrada] = useState()
 const [openSnackBar,setOpenSnackBar]= useState(false)
 const [ messageAlert,setMessageAlert] = useState();
 const [ severidadeAlert,setSeveridadeAlert] = useState()


useEffect(()=>{

getItemInventory(idInventario.state).then().catch()

},[])


 
const getItemInventory = async (id) => {
console.log(id)
  try{

  const res = await axios
    .get(`${url}/Inventarios/buscaCodigoInventario/${id}`)
    .then( (r)=> {

     return r.data
     
    })
    .catch();
    
    setDescricao(res[res.length-1].material.descricao)
    setCategoria(res[res.length-1].material.categoria)
    setCodigoInterno(res[res.length-1].material.id)
    setMovimento(res[res.length-1].saldoFinal==undefined?0:res[res.length-1].saldoFinal)
    setEstoque(res[res.length-1].saldoFinal)
    setDataentrada(res[res.length-1].dataAlteracao)

}
catch(e){

  console.log(e)
}
};
const updateInventario=  async ()=>{

if( !razao){

  setOpenSnackBar(true)
  setSeveridadeAlert("warning")
  setMessageAlert("É necessário informar a razão")

}
else{

  // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
const inventario = {
    razao:razao.trim().replace(/\s\s+/g, ' '),
    saldoFinal:movimento,
    estoque:estoque,
    materialId:codigoInterno,
    material:{}
    }

   

try{

  const inventarioAtualizado =  await axios.post(`${url}/Inventarios`,inventario)
  .then(r=>
    {
      setOpenSnackBar(true)
      setSeveridadeAlert("success")
      setMessageAlert("Inventário Atualizado com sucesso")
      return r.data
}).catch()



}
catch(e){

  console.log(e)
}
}

}


  return (
    <>

  <Header/>

    <h1 className={updateInventory.h1}>Editando inventário de {categoria} {descricao} (Codigo interno: {codigoInterno}) </h1>
  
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
