import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { url } from "../contetxs/webApiUrl";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import "dayjs/locale/pt-br";

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
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
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
  const [localizacao, setLocalizacao] = useState("");
  const [corrente, setCorrente] = useState("");
  const [unidade, setUnidade] = useState("UN");
  const [dataentrada, setDataentrada] = useState(undefined);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
 const[precoCusto,setPrecoCusto] = useState()
 const[markup,setMarkup] = useState()

  const [materiais, setMateriais] = useState([]);

  const unidadeMaterial = ["UN", "RL", "MT", "P"];
  const tensoes = ["","12V","24V","127V","220V","380V","440V","660V"]



useEffect(()=>{

const description = sessionStorage.getItem("description")

if(description) setDescricao(description)
getAllMaterials().then().catch()

},[])

  useEffect(() => {
    //Irá começar a realizar a busca somente quando  a descrição tiver 3 caracteres
    if (descricao.length>=3) {
     searchByDescription().then().catch();

    }
    setMateriais([])

  }, [descricao]);

  useEffect(() => {
        //Irá começar a realizar a busca somente quando  a categoria tiver 3 caracteres
    if (codigoFabricante.length>=4) {
      
      searchByFabricanteCode().then().catch();

    }
    setMateriais([])

  }, [codigoFabricante]);

  const searchByFabricanteCode = async () => {

    try{
     const res = await axios
     .get(`${url}/Inventarios/buscaCodigoFabricante?codigo=${codigoFabricante}`)
     .then( (r)=> {
       
      return r.data
      
     })
     .catch();
    
     setMateriais(res)
 
 
    }
    catch(e) 
    
    { 
 console.log(e)
    }
   
 };


  const searchByDescription = async () => {

   try{
    const res = await axios
    .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao}`)
    .then( (r)=> {
      
     return r.data
     
    })
    .catch();

    setMateriais(res)

   }
   catch(e) 
   
   { 
console.log(e)
   }
  
};

  const searchByCategory = async () => {
    try{
      const res = await axios
      .get(`${url}/Materiais/buscaCategoria?categoria=${categoria}`)
      .then((r) => {
        return r.data
      }).catch();


 

 setMateriais(res)


    }
   catch(e){

    console.log(e)
   }


  };
  const handleChangeUpdatePage = async (id) => {
   
    sessionStorage.setItem("description",descricao)

    navigate("/updateMaterial", { state: id })


      
  };

  const createInventario = async (idMaterial) => {
    
    
    const invetario = {
      materialId: idMaterial,
      estoque:0,
      material: {},
    };
    try{
      await axios
      .post(`${url}/Inventarios`, invetario)
      .then((r) => {
        return r.data
      })
      .catch();
  }
  catch(e){
    console.log(e)

  }
    }
  
  const handleCreateMaterial = async () => {


    if (!descricao || !unidade) {
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Prencha todas as informações necessárias");
    } else {

      // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras

      const material = {
        codigoInterno: codigoInterno.trim().replace(/\s\s+/g, " "),
        codigoFabricante: codigoFabricante.trim().replace(/\s\s+/g, " "),
        descricao: descricao.trim().replace(/\s\s+/g, " "),
        categoria: "",
        marca: marca.trim().replace(/\s\s+/g, " "),
        corrente: corrente.trim().replace(/\s\s+/g, " "),
        unidade: unidade.trim().replace(/\s\s+/g, " "),
        tensao: tensao.trim().replace(/\s\s+/g, " "),
        localizacao: localizacao.trim().replace(/\s\s+/g, " "),
        corrente: corrente.trim().replace(/\s\s+/g, " "),
        dataEntradaNF: dataentrada,
        precoCusto:precoCusto,
        markup:markup
      };

      const materialCriado = await axios
        .post(`${url}/Materiais`, material)
        .then((r) => {
          createInventario(r.data.id);
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Criado com sucesso");
          console.log(r.data.dataEntradaNF)
          return r.data
        })
        .catch((e) => {
          console.log(e.response.data.message[0].errorMessage);
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
        });
        console.log(materialCriado)
        //Quando criar o material.atualizara a  lista de materias que estao a amostra
        // e se somente o material ter sido criado
       if(materialCriado)
       {
        setMateriais(materialCriado)

       }




    }
  };

  const getAllMaterials =  async ()=>{


    const res =  await axios
    .get(`${url}/Materiais`)
    .then((r)=> {
      
      
     return r.data
     
    })
    .catch();

    
  res.forEach(x=>{

    if(x.descricao.includes("CAIXA")){
      console.log(x.descricao)
    }
    
  })
  
  }


  return (
    <>
      <Header />
      <div className={createMaterial.container_navigation}>
      
<Fab onClick={()=>navigate("/")} sx={{backgroundColor:"#FCDD74"}}  aria-label="add">
  <AddIcon />

</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/searchInventory")}>
  <SearchIcon sx={{color:"black"}} />
</Fab>

<Fab  sx={{backgroundColor:"#FCDD74"}}onClick={()=>navigate("/osManagement")}>
  <BorderColorTwoToneIcon sx={{color:"black"}} />
</Fab>

</div>
      <h1 className={createMaterial.h1}>Criação de Material</h1>

      <div className={createMaterial.container_inputs}>
        {/* <TextField
          error={
            severidadeAlert != "warning" || categoria.length ? false : true
          }
          value={categoria}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setCategoria(e.target.value)}
          label="Categoria"
          required
        /> */}

       

        <TextField
        
          value={codigoFabricante}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          
          error={severidadeAlert != "warning" || !messageAlert=="Já existe um material com este mesmo código de fabricante" ? false : true}

          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Cód Fabricante"
          
        />

        <TextField
          error={
            severidadeAlert != "warning" || descricao.length ? false : true
          }
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px",width:"320px" }}
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
        <TextField
          value={localizacao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setLocalizacao(e.target.value)}
          label="Localização"
        />
        <TextField
        value={precoCusto}
        style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
        className={createMaterial.inputs}
        onChange={(e) => setPrecoCusto(e.target.value)}
        label="Preço Custo"
      />
      <TextField
          value={markup}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className={createMaterial.inputs}
          onChange={(e) => setMarkup(e.target.value)}
          label="Markup"
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
            stickyHeader
              sx={{ width: "100vw",  }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {/* <TableCell align="center"
                          sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"  }} >Categoria</TableCell> */}
                  <TableCell align="center"
                   sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Cod.Interno</TableCell>
                  <TableCell align="center"
                   sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Cod.Fabricante</TableCell>
                  <TableCell align="center"
                   sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Descrição</TableCell>
                  <TableCell align="center"
                   sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Marca</TableCell>
                  <TableCell align="center"
                   sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Tensão</TableCell>
     
                  <TableCell align="center"
                  sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Estoque</TableCell>

                  <TableCell align="center"
                  sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Localização</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Preço Custo</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>Preço venda</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}></TableCell>
                  {/* <TableCell align="center">DataEntradaNF</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                { materiais.length>=1 && materiais.map((row) => (
                  <TableRow
                    key={row.material.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                {/* <TableCell align="center" size="medium"
                sx={{ borderWidth:1,fontSize:"15px",borderColor:"black"   }}>{row.material.categoria==undefined?"Ainda Não Registrado":row.material.categoria}</TableCell> */}
        
                    <TableCell align="center"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.material.id}</TableCell>
                    <TableCell align="center" sx={{ borderWidth:1,fontSize:"16px",borderColor:"black"   }}>{row.material.codigoFabricante}</TableCell>
                    <TableCell align="center" sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }} onClick={(x)=>setDescricao(row.material.descricao)}>{row.material.descricao}</TableCell>
                    <TableCell align="center" sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.material.marca}</TableCell>
                    <TableCell align="center" size ="small" sx={{ borderWidth:1,fontSize:"15px",borderColor:"black"   }}>{row.material.tensao}</TableCell>
  
                    <TableCell align="center" size ="small"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +" "+row.material.unidade}</TableCell>
                    <TableCell align="center" size ="small"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.material.localizacao}</TableCell>
                    <TableCell align="center" size ="small"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.material.precoCusto==null?"Ainda não registrado":"R$ "+row.material.precoCusto.toFixed(2)}</TableCell>
                    <TableCell align="center" size ="small"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>{row.material.precoVenda==null?"Ainda não registrado":"R$ "+row.material.precoVenda.toFixed(2)}</TableCell>
                     <TableCell align="center" size ="small"
                    sx={{ borderWidth:1,fontSize:"20px",borderColor:"black"   }}>      <Button
                    style={{backgroundColor:'white',marginTop:"7px",marginRight:"15px"}}
                    
                      onClick={(x) =>
                        handleChangeUpdatePage(row.material.id)
                      }
                    >
                      <EditTwoToneIcon />
                    </Button>
                    </TableCell>
              
                    {/* <Button
                    disabled={true}
                      style={{ marginLeft: "15px" ,backgroundColor:'white'}}
                      onClick={(x) => deleteMaterial(row.material.id)}
                    >
                      <DeleteIcon />
                    </Button> */}
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
