
import { Button } from "primereact/button";
import { useNavigate ,useRoutes} from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";

import { url } from "../contetxs/webApiUrl";
import CreateIcon from "@mui/icons-material/Create";
import "dayjs/locale/pt-br";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../style/searchInventory.css";
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


  useEffect(() => {
    //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
    if (descricao.length>=3) {
     searchByDescription().then().catch();

    }
    setInventarios([])

  }, [descricao]);

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  o código tiver 3 caracteres
    console.log(codigo)
    if (descricao.length>=3) {
     searchByCode().then().catch();

    }
    setInventarios([])

  }, [codigo]);
  const searchByDescription = async () => {

    const res = await axios
      .get(`${url}/Materiais/buscaInventario?descricao=${descricao}`)
      .then( (r)=> {
       
       
       return r.data
       
      })
      .catch();
      

      for( let i of res){

        console.log(i.dataAlteracao==undefined) 
      }
  setInventarios(res)
  
};
const searchByCode = async () => {

  const res = await axios
    .get(`${url}/Materiais/buscaCodigo?codigo=${codigo}`)
    .then( (r)=> {

     return r.data
     
    })
    .catch();
    
setInventarios(res)

};
 
  const getAllMateriais = async () => {
    const res = await axios
      .get(`${url}/Materiai`)
      .then((r) => {
        console.log(r.data);
      }).catch(e=>console.log(e));
      
  };


 

  const deleteInventario = async (id) => {

    await axios
      .delete(`${url}/Materiais/${id}`)
      .then((r) => {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Material excluído com sucesso");
        //realiza um filtro na lista de materias que esta sendo mostrada,para remover o item que acabou de ser excluido, e assim a atualizar os materias que estão a amostra
        const a = inventarios.filter(x=> x.id!=id)
        setInventarios(a)
      })
      .catch((e) => console.log(e));
  };


  return (
    <>
      <Header />
      <div className="container-navigation">

<Fab onClick={()=>navigate("/createMaterial")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

</div>
      <h1>Procurar no inventário</h1>
    

      <div className="container-inputs">
      

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
    
        <div className="card-table">
          <TableContainer component={Paper}>
            <Table
              sx={{ width: "100vw", margin: "auto" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Data </TableCell>
                  <TableCell align="center">Codigo </TableCell>
                  <TableCell align="center">Descricação</TableCell>
                  <TableCell align="center">Estoque</TableCell>
                  <TableCell align="center">Movimentação</TableCell>
                  <TableCell align="center">Saldo Final</TableCell>
                  <TableCell align="center">Razão</TableCell>
                  <TableCell align="center">Usuario</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {inventarios.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                  
                <TableCell align="center">
                      {dayjs(row.dataAlteracao).format(`[${row.movimentacao==undefined?" Inventário Criado as ":"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                    <TableCell align="center" size="medium">{row.codigo}</TableCell>
                    <TableCell align="center" size="medium">{row.descricao}</TableCell>
                    <TableCell align="center" size="small">{row.estoque}</TableCell>
                    <TableCell align="center" size="small">{row.movimentacao}</TableCell>
                    <TableCell align="center" size="small">{row.saldoFinal}</TableCell>
                    <TableCell align="center" >{row.razao}</TableCell>
                    <TableCell align="center" size ="small">{row.responsavel}</TableCell>

                    
               
                    <Button
                    style={{backgroundColor:'white',marginTop:"7px"}}
                      onClick={(x) =>
                        navigate("/updateInventory", { state: row.id })
                      }
                    >
                      <CreateIcon />
                    </Button>
                    <Button
                      style={{ marginLeft: "15px" ,backgroundColor:'white'}}
                      onClick={(x) => deleteInventario(row.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
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
