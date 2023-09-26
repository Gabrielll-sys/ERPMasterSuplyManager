
import { Button } from "primereact/button";
import { useNavigate ,useRoutes} from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import searchInventory from "../style/searchInventory.module.css"
import { url } from "../contetxs/webApiUrl";
import CreateIcon from "@mui/icons-material/Create";
import "dayjs/locale/pt-br";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiAlert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import SearchIcon from '@mui/icons-material/Search';
const SearchInventory = () => {
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [codigoInterno,setCodigoInterno] = useState("")
  const [codigoFabricante,setCodigoFabricante] = useState("")
  const [estoque, setEstoque] = useState(0);
  const[storeAllInventory,setStoreAllInventory] = useState()


  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
  const [showAll,setShowAll] = useState(false)
  
  
  const [inventarios, setInventarios] = useState([]);


  
  useEffect(()=>{

    const searchInternCode = sessionStorage.getItem("buscaCodigoInterno")
    const searchFabricanteCode = sessionStorage.getItem("buscaCodigoFabricante")
    console.log(searchInternCode)
    if(searchInternCode) 
    {
      setCodigoInterno(searchInternCode)
    }

  },[])
  

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  o código tiver  caracteres
 
    if (codigoInterno.length) {
      try{

        searchByInternCode().then().catch();
      }
      catch(e){
        console.log(e)


      }
    }
    setInventarios([])

  }, [codigoInterno]);

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  o código tiver 3 caracteres
    //Para impedir da busca pelos dois campos,reseta o valor de codigo de fabricante

    if (codigoFabricante.length>=3) {
      try{

        searchByFabricanteCode().then().catch();
      }
      catch(e){
        console.log(e)


      }
    }
    setInventarios([])

  }, [codigoFabricante]);

  const handleChangePageUpdate = (id)=>{

    sessionStorage.setItem("buscaCodigoInterno",codigoInterno)
    sessionStorage.setItem("buscaCodigoFabricante",codigoFabricante)

    navigate("/updateInventory", { state: id })



  }
  
  const searchByDescription = async () => {


    try{

      

    }
    catch(e){
      console.log(e)
      if(e.message =="Network Error")
      setOpenSnackBar(true);
      setSeveridadeAlert("error");
      setMessageAlert("Sem conexão com o servidor");
      
    }
  
};

const handleShowAll = ()=>{

if(showAll)
{
setShowAll(false)




}
else{

  setShowAll(true)
  setInventarios(storeAllInventory)

}

  
}


const searchByInternCode = async () => {

  try{

  const res = await axios
    .get(`${url}/Inventarios/buscaCodigoInventario/${codigoInterno}`)
    .then( (r)=> {

     return r.data
     
    })
    .catch();


setInventarios(res)



}
catch(e){

  console.log(e)
}
};

const searchByFabricanteCode = async () => {
  try{

  const res = await axios
    .get(`${url}/Materiais/buscaCodigoFabricante?codigo=${codigoFabricante}`)
    .then( (r)=> {

     return r.data
   
     
    })
    .catch();
    
setInventarios(res)
}
catch(e){

  console.log(e)
}
};




 



  return (
    <>
      <Header />
      <div className={searchInventory.container_navigation}>

<Fab onClick={()=>navigate("/createMaterial")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

</div>
      <h1 className={searchInventory.h1}>Procurar no inventário</h1>
    

      <div className={searchInventory.container_inputs}>
      

      <TextField
        
          value={codigoInterno}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="inputs"
          onChange={(e) => setCodigoInterno(e.target.value)}
          label="Código Interno"
          required
        />

<TextField
          
          value={codigoFabricante}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="inputs"
          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Código Fabricante"
          required
        />

        {/* <TextField
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"420px"}}
          className="inputs"
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição Item"
        />
 */}

     
      </div>
    
        <div className={searchInventory.card_table}>
          <TableContainer component={Paper}>
            <Table
              sx={{ width: "97vw", margin: "auto" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Codigo Interno</TableCell>
                  <TableCell align="center">Cod Fabricante</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center" size="small">Estoque</TableCell>
                  <TableCell align="center" size="small">Movimentação</TableCell>
                  <TableCell align="center" size="small">Saldo Final</TableCell>
                  <TableCell align="center">Razão</TableCell>
                  <TableCell align="center">Data </TableCell>
                  <TableCell align="center">Usuario</TableCell>
                  <TableCell align="center" size="small"> 
                  
                {showAll? <Button style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll(inventarios)}><VisibilityIcon/></Button>:
                <Button style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll(inventarios)}><VisibilityOffIcon/></Button>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { inventarios.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                    <TableCell align="center" size="medium">{row.material.id}</TableCell>
                    <TableCell align="center" size="medium">{row.material.codigoFabricante}</TableCell>
                    
                    <TableCell align="center" size="medium">{row.material.descricao}</TableCell>
                    <TableCell align="center" size="small">{row.estoque==null?"Ainda não registrado":row.estoque}</TableCell>
                    <TableCell align="center" size="small">{row.movimentacao==null?"Ainda não registrado":row.movimentacao}</TableCell>
                    <TableCell align="center" size="small">{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +` ${row.material.unidade}`}</TableCell>
                    <TableCell align="center" >{row.razao}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.dataAlteracao).format(`[${row.movimentacao==null &&row.estoque==0?" Material Criado as " :"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                    <TableCell align="center">
                      {console.log(row.length)} 
                    </TableCell>
                    <TableCell align="center" size ="small">{row.responsavel}</TableCell>

                    
                    {/* Caso o o item da linha seja o ultimo listado da sequencia de edições do inventário,então permitirá a edição,isso impede de editar estoque e edições passadas */}
                    <Button
                    
                    disabled={inventarios[inventarios.length-1].id==row.id?false:true}
                    style={{backgroundColor:'white',marginTop:"13px",borderWidth:"0px"}}
                      onClick={(x) =>
                        handleChangePageUpdate(row.material.id)
                        
                      }
                    >
                      <CreateIcon />
                    </Button>
                
                  </TableRow>
                  
                ))}
 {/* { inventarios.length==1 && !showAll && (
                  <TableRow
                    key={inventarios[0].id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                    <TableCell align="center" size="medium">{inventarios[0].categoria}</TableCell>
                    <TableCell align="center">{inventarios[0].id}</TableCell>
                    <TableCell align="center">{inventarios[0].codigoFabricante}</TableCell>
                    <TableCell align="center">{inventarios[0].descricao}</TableCell>
                    <TableCell align="center">{inventarios[0].marca}</TableCell>
                    <TableCell align="center" size ="small">{inventarios[0].tensao}</TableCell>
                    <TableCell align="center" size ="small">{inventarios[0].unidade}</TableCell>
                    <TableCell align="center" size ="small">{inventarios[0].localizacao}</TableCell>
               
                    <Button
                    style={{backgroundColor:'white',marginTop:"7px"}}
                      onClick={(x) =>
                        handleChangePageUpdate(inventarios[0].id)
                      }
                    >
                      <CreateIcon />
                    </Button>
                
                  </TableRow>
                )} */}

              </TableBody>
            </Table>
          </TableContainer>
         
          <Snackbar
            open={openSnackBar}
            autoHideDuration={3000}
            onClose={(e) => setOpenSnackBar(false)}
          >
            <MuiAlert
              onClose={(e) => setOpenSnackBar(false)}
              severity={severidadeAlert}
              sx={{ width: "100%" }}
            >
              {messageAlert}
            </MuiAlert>
          </Snackbar>
        </div>
     
    </>
  );
};

export default SearchInventory;
