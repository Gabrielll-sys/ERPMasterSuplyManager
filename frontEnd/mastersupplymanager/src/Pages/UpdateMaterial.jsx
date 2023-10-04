
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "../contetxs/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import  updateMaterial from"../style/updateMaterial.module.css";
import MuiAlert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const UpdateMaterial = ()=>{
 const navigate = useNavigate()

 //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material
  const idMaterial= useLocation()
 const[categoria,setCategoria]=useState("")
 const [descricao,setDescricao] = useState("")
 const [codigoInterno,setCodigoInterno] = useState("")
 const [codigoFabricante,setCodigoFabricante] = useState("")
 const [marca,setMarca] = useState("")
 const [ tensao,setTensao] = useState("")
 const [corrente,setCorrente] = useState("")
 const [localizacao,setLocalizacao] = useState("")
 const [ unidade,setUnidade] = useState("")
 const[dataentrada,setDataentrada] = useState("")
 const [openSnackBar,setOpenSnackBar]= useState(false)
 const [ messageAlert,setMessageAlert] = useState();
 const [ severidadeAlert,setSeveridadeAlert] = useState()
  const [idCategoria,setIdCategoria] = useState()
 const[oldCategory,setOldCategory]= useState()
 const [materiais, setMateriais] = useState([]);

 const unidadeMaterial = ["UN","RL","PC","MT","P"]
 const tensoes = ["","12V","24V","127V","220V","380V","440V","660V"]



useEffect(()=>{

    getMaterial(idMaterial.state).then().catch()
    


},[])
//esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
//e para realizar a  edição aqui
const verifyNull = (item)=>{

  return item==null?"":item

}


 const getMaterial = async(id)=>{

 axios.get(`${url}/Materiais/${id}`).then(r=>{
console.log(r.data)
setDataentrada(r.data.dataEntradaNF==null?"":dayjs(r.data.dataEntradaNF))
setCodigoInterno(r.data.id)
setUnidade(verifyNull(r.data.unidade))
setCodigoFabricante(verifyNull(r.data.codigoFabricante))
setCorrente(verifyNull(r.data.corrente))
setMarca(verifyNull(r.data.marca))
setDescricao(verifyNull(r.data.descricao))
setOldCategory(verifyNull(r.data.categoria))
setLocalizacao(verifyNull(r.data.localizacao))


setTensao(verifyNull(tensoes[tensoes.findIndex((x)=>x==r.data.tensao)]))

 })

 }


const handleUpdateMaterial=  async (id)=>{



  // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
const material = {
    id:id,
    codigoFabricante:codigoFabricante.trim().replace(/\s\s+/g, ' '),
    codigoInterno:"",
    categoria: oldCategory.trim().replace(/\s\s+/g, " "),
    descricao:descricao.trim().replace(/\s\s+/g, ' '),
    marca:marca.trim().replace(/\s\s+/g, ' '),
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    unidade:unidade,
    tensao:tensao,
    corrente:corrente.trim().replace(/\s\s+/g, ' '),
    localizacao:localizacao.trim().replace(/\s\s+/g, ' '),
    dataEntradaNF:dataentrada,
    }


  const materialAtualizado =  await axios.put(`${url}/Materiais/${id}`,material)
  .then(r=>
    {  

      setOpenSnackBar(true)
      setSeveridadeAlert("success")
      setMessageAlert("Material Atualizado com sucesso")
   

}
    
  ).catch(e=>{
    console.log(e)
 
    
    if (e.response.data.message == "Código interno já existe") {
      setOpenSnackBar(true);
      setSeveridadeAlert("error");
      setMessageAlert("Já existe um material com este mesmo código interno");
    } else if (
      e.response.data.message ==
      "Código de fabricante já existe"
    ) {
      setOpenSnackBar(true);
      setSeveridadeAlert("error");
      setMessageAlert("Já existe um material com este mesmo código de fabricante");
    }

  })
 


}






  return (
    <>

  <Header/>

    <h1 className={updateMaterial.h1}>Editando {descricao}  (Codigo Interno: {codigoInterno}) </h1>
  
    <div className={updateMaterial.container_inputs}>


    <TextField  value={oldCategory} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}  
    className={updateMaterial.inputs} onChange={e=>setOldCategory(e.target.value)} label='Categoria' required/>
    


    <TextField disabled={true}   value={codigoInterno} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className={updateMaterial.inputs} onChange={e=>setCodigoInterno(e.target.value)} label='Cod Interno'  />

    <TextField    value={codigoFabricante} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
    className={updateMaterial.inputs} onChange={e=>setCodigoFabricante(e.target.value)} label='Cod Fabricante'  />

   
    {/* <InputText className='inputs' value={descricao} onChange={e=>setDescricao(e.target.value)} /> */}
    <TextField   value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className={updateMaterial.inputs}  onChange={(e) => setDescricao(e.target.value)} label='Descrição' required />

   
    <TextField   value={marca} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}} 
    className={updateMaterial.inputs} onChange={e=>setMarca(e.target.value)}  label='Marca' />

      <TextField
          value={localizacao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={updateMaterial.inputs}
          onChange={(e) => setLocalizacao(e.target.value)}
          label="Localização"
        />
      
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
          className={updateMaterial.inputs}
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

    <LocalizationProvider   dateAdapter={AdapterDayjs} adapterLocale="pt-br" >
    
        <DatePicker  label="Data Entrada NF"  value={dataentrada} onChange={e=>setDataentrada(e)} />
    
    </LocalizationProvider>
    </div>
    

  
    </div>
    <div className={updateMaterial.container_botoes}>
    <Button  className={updateMaterial.botao}label="Atualizar Material" onClick={x=>handleUpdateMaterial(idMaterial.state)} />
    <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={e=>setOpenSnackBar(false)}>
            <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
             {messageAlert}
           </MuiAlert>
           </Snackbar>
        </div>

    
    </>
    
    
  );
}

export default UpdateMaterial;
