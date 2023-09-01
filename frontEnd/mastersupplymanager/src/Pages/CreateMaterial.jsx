import { useQuery } from "@tanstack/react-query";
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
import  createMaterial from "../style/createMaterial.module.css"
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
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import UpdateMaterial from "./UpdateMaterial";
const CreateMaterial = () => {
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [codigoInterno, setCodigoInterno] = useState("");
  const [codigoFabricante, setCodigoFabricante] = useState("");
  const [marca, setMarca] = useState("");
  const [tensao, setTensao] = useState("");
  const [corrente, setCorrente] = useState("");
  const [unidade, setUnidade] = useState("UN");
  const [dataentrada, setDataentrada] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
 

  const [materiais, setMateriais] = useState([]);

  const unidadeMaterial = ["UN", "RL", "PÇ", "MT", "P"];
  const tensoes = ["","12V","24V","127V","220V","380V","440V","660V"]

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
    if (descricao.length>=3) {
     searchByDescription().then().catch();

    }
    setMateriais([])

  }, [descricao]);

  useEffect(() => {
        //Irá começar a realizar a busca somente quando  a categoria tiver 3 caracteres
    if (categoria.length>=3) {
      
      searchByCategory().then().catch();

    }
    setMateriais([])

  }, [categoria]);

  const searchByDescription = async () => {

   
    const res = await axios
      .get(`${url}/Materiais/buscaDescricao?descricao=${descricao}`)
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
  setMateriais(object)
  
};

  const searchByCategory = async () => {
    
    const res = await axios
      .get(`${url}/Categorias/busca?categoria=${categoria}`)
      .then((r) => {
        return r.data
      }).catch(e=>console.log(e));

      const materialsWithCategory = [];

      for (let i of res) {
       
        axios.get(`${url}/Categorias/${i.id}`).then(r=>{
        
         materialsWithCategory.push({...i,nomeCategoria:r.data.nomeCategoria})
      
        })
 };

 setObject(materialsWithCategory)
 setMateriais(object)

  };
  const getAllMateriais = async () => {
    const res = await axios
      .get(`${url}/Materiai`)
      .then((r) => {
        console.log(r.data);
      }).catch(e=>console.log(e));
      
  };

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
  const handleCreateMaterial = async () => {
    



    if (!categoria || !descricao || !unidade || !codigoInterno) {
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Prencha todas as informações necessárias");
    } else {
      // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
      const material = {
        codigoInterno: codigoInterno.trim().replace(/\s\s+/g, " "),
        codigoFabricante: codigoFabricante.trim().replace(/\s\s+/g, " "),
        descricao: descricao.trim().replace(/\s\s+/g, " "),
        marca: marca.trim().replace(/\s\s+/g, " "),
        corrente: corrente.trim().replace(/\s\s+/g, " "),
        unidade: unidade.trim().replace(/\s\s+/g, " "),
        tensao: tensao.trim().replace(/\s\s+/g, " "),
        corrente: corrente.trim().replace(/\s\s+/g, " "),
        estoque:0,
        dataEntradaNF: dataentrada,
      };

      const materialCriado = await axios
        .post(`${url}/Materiais`, material)
        .then((r) => {
          createCategoria(r.data.id);
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
            setMessageAlert("Já existe um material com este mesmo código interno");
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
        // e se somente o material ter sido criado
       if(materialCriado)
       {
        materiais.push({...materialCriado,nomeCategoria:categoria.toUpperCase()})

       }

      //Quando criar o material,chamara o metodo para atualizar os dados da tabela

    }
  };

  const deleteMaterial = async (id) => {

    await axios
      .delete(`${url}/Materiais/${id}`)
      .then((r) => {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Material excluído com sucesso");
        //realiza um filtro na lista de materias que esta sendo mostrada,para remover o item que acabou de ser excluido, e assim a atualizar os materias que estão a amostra
        const a = materiais.filter(x=> x.id!=id)
        setMateriais(a)
      })
      .catch((e) => console.log(e));
  };
  const getCategoria = async (id) => {

    const res = await axios
      .get(`${url}/Categorias/${id}`)
      .then(async(r) => {
        return await r.data
      });

    
  };

  return (
    <>
      <Header />
      <div className={createMaterial.container_navigation}>
      
<Fab onClick={()=>navigate("/createMaterial")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

</div>
      <h1 className={createMaterial.h1}>Criação de Material</h1>

      <div className={createMaterial.container_inputs}>
        <TextField
          error={
            severidadeAlert != "warning" || categoria.length ? false : true
          }
          value={categoria}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setCategoria(e.target.value)}
          label="Categoria"
          required
        />

        <TextField
          error={severidadeAlert != "warning" || codigoInterno.length ? false : true}
          value={codigoInterno}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setCodigoInterno(e.target.value)}
          label="Cod Interno"
          required
        />

        <TextField
        
          value={codigoFabricante}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Cód Fabricante"
          
        />

        <TextField
          error={
            severidadeAlert != "warning" || descricao.length ? false : true
          }
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
          required
        />

        <TextField
          value={marca}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setMarca(e.target.value)}
          label="Marca"
        />

      
 <Select
     style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px",height:"55px"}}
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
          className={createMaterial.inputs}
          onChange={(e) => setCorrente(e.target.value)}
          label="Corrente"
        />

     

  <Select
     style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"120px",height:"55px"}}
     labelId="demo-simple-select-label"
    value={unidade}
    label="Unidade"
    onChange={x=>setUnidade(x.target.value)}
  >
      {unidadeMaterial.map((x)=>(
        <MenuItem value={x}>{x}</MenuItem>
        
      ))}
    
  
  </Select>
        <div style={{ marginTop: "40px", width: "170px",marginLeft:"20px" }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label="Data Entrada NF"
              value={dataentrada}
              onChange={(e) => setDataentrada(e)}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className={createMaterial.container_botoes}>
        <Button
          className={createMaterial.botao}
          label="Criar Material"
          onClick={handleCreateMaterial}
        />
       
        <div className={createMaterial.card_table}>
          <TableContainer component={Paper} >
            <Table
              sx={{ width: "100vw",  }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Categoria</TableCell>
                  <TableCell align="center">Codigo Interno</TableCell>
                  <TableCell align="center">Descrição</TableCell>
                  <TableCell align="center">Marca</TableCell>
                  <TableCell align="center">Tensão</TableCell>
                  <TableCell align="center">Unidade</TableCell>
                  <TableCell align="center">Corrente</TableCell>
                  <TableCell align="center">DataEntradaNF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materiais.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                    <TableCell align="center" size="medium">{row.nomeCategoria}</TableCell>
                    <TableCell align="center">{row.codigoInterno}</TableCell>
                    <TableCell align="center">{row.descricao}</TableCell>
                    <TableCell align="center">{row.marca}</TableCell>
                    <TableCell align="center" size ="small">{row.tensao}</TableCell>
                    <TableCell align="center" size ="small">{row.unidade}</TableCell>
                    <TableCell align="center" size ="small">{row.corrente}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.dataEntradaNF).format("DD/MM/YYYY")}
                    </TableCell>

                    {/* <TableCell align="center">    <Button  className="botao"label="Criar Material"onClick={x=>navigate("/updateMaterial",{state:row.id})} />
</TableCell> */}
                    <Button
                    style={{backgroundColor:'white',marginTop:"7px"}}
                      onClick={(x) =>
                        navigate("/updateMaterial", { state: row.id })
                      }
                    >
                      <CreateIcon />
                    </Button>
                    <Button
                      style={{ marginLeft: "15px" ,backgroundColor:'white'}}
                      onClick={(x) => deleteMaterial(row.id)}
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

export default CreateMaterial;
