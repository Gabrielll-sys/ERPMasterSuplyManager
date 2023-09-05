
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
  const [codigo,setCodigo] = useState("")
  const [estoque, setEstoque] = useState(0);
 
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
 

  const [inventarios, setInventarios] = useState([]);


  
  useEffect(()=>{

    const searchValue = sessionStorage.getItem("busca")

    if(searchValue) 
    {
      setCodigo(searchValue)
    }

  },[])
  
  useEffect(() => {
    //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
    if (descricao.length>=3) {
     searchByDescription().then().catch();

    }
    setInventarios([])

  }, [descricao]);

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  o código tiver 3 caracteres
  
    if (codigo.length>=3) {
      try{

        searchByCode().then().catch();
      }
      catch(e){
        console.log(e)


      }
    }
    setInventarios([])

  }, [codigo]);

  const handleChangePageUpdate = (id)=>{

    sessionStorage.setItem("busca",codigo)

    navigate("/updateInventory", { state: id })



  }
  
  const searchByDescription = async () => {


    try{

      const res = await axios
        .get(`${url}/Materiais/buscaInventario?descricao=${descricao}`)
        .then( (r)=> {
         
         
         return r.data
         
        })
        .catch();
  setInventarios(res)

    }
    catch(e){
      if(e.message =="Network Error")
      setOpenSnackBar(true);
      setSeveridadeAlert("error");
      setMessageAlert("Sem conexão com o servidor");
      
    }
  
};

const searchByCode = async () => {

  try{

  const res = await axios
    .get(`${url}/Materiais/buscaCodigo?codigo=${codigo}`)
    .then( (r)=> {

     return r.data
    setInventarios(r.data)
     
    })
    .catch();
    
setInventarios(res)
}
catch(e){

  console.log(e)
}
};
 
  const getAllMateriais = async () => {
    const res = await axios
      .get(`${url}/Materiai`)
      .then((r) => {
        console.log(r.data);
      }).catch();
      
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
          error={
            severidadeAlert != "warning" || descricao.length ? false : true
          }
          value={codigo}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="inputs"
          onChange={(e) => setCodigo(e.target.value)}
          label="Código"
          required
        />


        <TextField
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"420px"}}
          className="inputs"
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição Item"
        />


     
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
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center" size="small">Estoque</TableCell>
                  <TableCell align="center" size="small">Movimentação</TableCell>
                  <TableCell align="center" size="small">Saldo Final</TableCell>
                  <TableCell align="center">Razão</TableCell>
                  <TableCell align="center">Data </TableCell>
                  <TableCell align="center">Usuario</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {inventarios.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                  
              
                    <TableCell align="center" size="medium">{row.codigoInterno}</TableCell>
                    <TableCell align="center" size="medium">{row.descricao}</TableCell>
                    <TableCell align="center" size="small">{row.estoque}</TableCell>
                    <TableCell align="center" size="small">{row.movimentacao}</TableCell>
                    <TableCell align="center" size="small">{row.saldoFinal}</TableCell>
                    <TableCell align="center" >{row.razao}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.dataAlteracao).format(`[${row.movimentacao==undefined?" Material Criado as ":"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                    <TableCell align="center" size ="small">{row.responsavel}</TableCell>

                    
                    {/* Caso o o item da linha seja o ultimo listado da sequencia de edições do inventário,então permitirá a edição,isso impede de editar estoque e edições passadas */}
                    <Button
                    disabled={inventarios[inventarios.length-1].id==row.id?false:true}
                    style={{backgroundColor:'white',marginTop:"7px"}}
                      onClick={(x) =>
                        handleChangePageUpdate(row.id)
                        
                      }
                    >
                      <CreateIcon />
                    </Button>
                    {/* <Button
                    
                      style={{ marginLeft: "15px" ,backgroundColor:'white'}}
                      onClick={(x) => deleteInventario(row.id)}
                    >
                      <DeleteIcon />
                    </Button> */}
                  </TableRow>
                ))}
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
