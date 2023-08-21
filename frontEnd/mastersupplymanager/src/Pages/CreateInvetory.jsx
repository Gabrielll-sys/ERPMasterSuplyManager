
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { url } from "../contetxs/webApiUrl";
import CreateIcon from "@mui/icons-material/Create";
import "dayjs/locale/pt-br";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../style/createMaterial.css";
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
const CreateInvetory = () => {
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [estoque, setEstoque] = useState(0);
 
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
 

  const [invetarios, setInventarios] = useState([]);

  const unidadeMaterial = ["UN", "RL", "PÇ", "MT", "P"];
  const tensoes = ["","127V","220V","380V","440V","660V"]

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
    if (descricao.length>=3) {
     searchByDescription().then().catch();

    }
    setInventarios([])

  }, [descricao]);

 
  const searchByDescription = async () => {

   
    const res = await axios
      .get(`${url}/Inventarios/busca?descricao=${descricao}`)
      .then( (r)=> {
       return r.data
       
      })
      .catch();
      const materialsWithCategory = [];

       for (let i of res) {
        
         axios.get(`${url}/Categorias/${i.id}`).then(r=>{
         
          materialsWithCategory.push({...i,nomeCategoria:r.data.nomeCategoria})
       
         })
  };
  setObject(materialsWithCategory)
  setInventarios(object)
  
};

 
  const getAllMateriais = async () => {
    const res = await axios
      .get(`${url}/Materiai`)
      .then((r) => {
        console.log(r.data);
      }).catch(e=>console.log(e));
      
  };


  const CreateInventory = async () => {
    
    // navigate("/updateMaterial")


    if (!descricao) {
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Prencha todas as informações necessárias");
    } else {
      // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
      const material = {
        descricao: descricao.trim().replace(/\s\s+/g, " "),
        estoque: estoque.trim().replace(/\s\s+/g, " "),
        
      };

      const invetarioCriado = await axios
        .post(`${url}/Inventarios`, material)
        .then((r) => {
         
      
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Criado com sucesso");
          return r.data
        })
        .catch((e) => {
          console.log(e.response.data.message[0].errorMessage);
          if (e.response.data.message == "Código já existe") {
            setOpenSnackBar(true);
            setSeveridadeAlert("error");
            setMessageAlert("Já existe um material com este código");
          } else if (
            e.response.data.message ==
            "Um material com essa descrição já existe"
          ) {
            setOpenSnackBar(true);
            setSeveridadeAlert("error");
            setMessageAlert("Um matérial com esta descrição já existe");
          }
        });
        //Quando criar o material.atualizara a  lista de materias que estao a amostra
        invetarios.push(invetarioCriado)

      //Quando criar o material,chamara o metodo para atualizar os dados da tabela

    }
  };

  const deleteInventario = async (id) => {

    await axios
      .delete(`${url}/Materiais/${id}`)
      .then((r) => {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Material excluído com sucesso");
        //realiza um filtro na lista de materias que esta sendo mostrada,para remover o item que acabou de ser excluido, e assim a atualizar os materias que estão a amostra
        const a = invetarios.filter(x=> x.id!=id)
        setInventarios(a)
      })
      .catch((e) => console.log(e));
  };


  return (
    <>
      <Header />

      <h1>Criação de Inventário</h1>

      <div className="container-inputs">
       

      

        <TextField
          error={
            severidadeAlert != "warning" || descricao.length ? false : true
          }
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="inputs"
          onChange={(e) => setEstoque(e.target.value)}
          label="Quantidade em Estoque"
          required
        />

    

        <TextField
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"420px"}}
          className="inputs"
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
        />


     
      </div>
      <div className="container-botoes">
        <Button
          className="botao"
          label="Criar Material"
          onClick={CreateInventory}
        />
       
        <div className="card-table">
          <TableContainer component={Paper}>
            <Table
              sx={{ width: "100vw", margin: "auto" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Data Modificação</TableCell>
                  <TableCell align="center">Descricação</TableCell>
                  <TableCell align="center">Estoque</TableCell>
                  <TableCell align="center">Movimentação</TableCell>
                  <TableCell align="center">Saldo Final</TableCell>
                  <TableCell align="center">Razão</TableCell>
                  <TableCell align="center">Usuario</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {invetarios.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                <TableCell align="center">
                      {dayjs(row.dataAlteracao).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center" size="medium">{row.descricao}</TableCell>
                    <TableCell align="center">{row.estoque}</TableCell>
                    <TableCell align="center">{row.movimentacao}</TableCell>
                    <TableCell align="center">{row.saldoFinal}</TableCell>
                    <TableCell align="center">{row.razao}</TableCell>
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
      </div>
    </>
  );
};

export default CreateInvetory;
