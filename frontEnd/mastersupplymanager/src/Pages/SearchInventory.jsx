
import { Button } from "primereact/button";
import { useNavigate ,useRoutes} from "react-router-dom";
import Header from "../componentes/Header";
import { Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import searchInventory from "../style/searchInventory.module.css"
import { url } from "../contetxs/webApiUrl";
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import "dayjs/locale/pt-br";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import MuiAlert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';

import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

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
  const [onlyOneItem,setOnlyOneItem] = useState()
  
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


setOnlyOneItem(res[res.length-1])

console.log(res[res.length-1])

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
      <h1 className={searchInventory.h1}>Gerenciamento de Inventário</h1>
    

      <div className={searchInventory.container_inputs}>
      

      <TextField
        
          value={codigoInterno}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="inputs"
          onChange={(e) => setCodigoInterno(e.target.value)}
          label="Código Interno"
          required
        />



     
      </div>
    
        <div className={searchInventory.card_table}>
          <TableContainer component={Paper}>
            <Table
              sx={{ width: "100vw", margin: "auto" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Cod.Interno</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Cod.Fabricante</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Descrição</TableCell>
                  <TableCell align="center" size="small"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Estoque</TableCell>
                  <TableCell align="center" size="small"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Movimentação</TableCell>
                  <TableCell align="center" size="small"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Saldo Final</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Razão</TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Data </TableCell>
                  <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Usuario</TableCell>
                  <TableCell align="center" size="small"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}> 
                  
                {showAll? <Button style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll(inventarios)}><VisibilityTwoToneIcon/></Button>:
                <Button 
                sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}
                style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll(inventarios)}><VisibilityOffTwoToneIcon/></Button>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { showAll && inventarios.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                    <TableCell align="center" size="medium"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.material.id}</TableCell>
                    <TableCell align="center" size="medium"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.material.codigoFabricante}</TableCell>
                    
                    <TableCell align="center" size="medium"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.material.descricao}</TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.estoque==null?"Ainda não registrado":row.estoque}</TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.movimentacao==null?"Ainda não registrado":row.movimentacao+` ${row.material.unidade}`}</TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +` ${row.material.unidade}`}</TableCell>
                    <TableCell align="center" 
                    sx={{ borderWidth:2,fontSize:"18px",borderColor:"black"   }}>{row.razao}</TableCell>

                    <TableCell align="center"  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>
                      {dayjs(row.dataAlteracao).format(`[${row.movimentacao==null &&row.estoque==0?" Material Criado as " :"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                   
                    <TableCell align="center" size ="small"  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{row.responsavel}</TableCell>
                   

                    
                    {/* Caso o o item da linha seja o ultimo listado da sequencia de edições do inventário,então permitirá a edição,isso impede de editar estoque e edições passadas */}
                    <Button
                    
                    disabled={inventarios[inventarios.length-1].id==row.id?false:true}
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}
                    style={{backgroundColor:'white',marginTop:"13px",borderWidth:"0px"}}
                      onClick={(x) =>
                        handleChangePageUpdate(row.material.id)
                        
                      }
                    >
                      <EditTwoToneIcon />
                    </Button>
                
                  </TableRow>
                  
                ))}
  {!showAll && inventarios.length &&  (
                  <TableRow
                    key={onlyOneItem.material.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                
                <TableCell align="center" size="medium"
                sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.material.id}</TableCell>
                    <TableCell align="center" size="medium"
                    sx={{ borderWidth:2,fontSize:"14px",borderColor:"black"   }}>{onlyOneItem.material.codigoFabricante}</TableCell>
                    
                    <TableCell align="center" size="medium"
                    sx={{ borderWidth:2,fontSize:"14px",borderColor:"black"   }}>{onlyOneItem.material.descricao}</TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.estoque==null?"Ainda não registrado":onlyOneItem.estoque+ ` ${onlyOneItem.material.unidade}`} </TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.movimentacao==null?"Ainda não registrado":onlyOneItem.movimentacao+` ${onlyOneItem.material.unidade}`}</TableCell>
                    <TableCell align="center" size="small"
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.saldoFinal==null?"Ainda não registrado":onlyOneItem.saldoFinal +` ${onlyOneItem.material.unidade}`}</TableCell>
                    <TableCell align="center" 
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.razao}</TableCell>
                    <TableCell align="center"
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>
                      {dayjs(onlyOneItem.dataAlteracao).format(`[${onlyOneItem.movimentacao==null &&onlyOneItem.estoque==0?" Material Criado as " :"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                 
                    <TableCell align="center" size ="small"
                    sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{onlyOneItem.responsavel}</TableCell>
               
                    <Button
                    style={{backgroundColor:'white',marginTop:"13px",borderWidth:"0px"}}
                    
                      onClick={(x) =>
                        handleChangePageUpdate(onlyOneItem.material.id)
                      }
                    >
                      <EditTwoToneIcon />
                    </Button>
                
                  </TableRow>
                )} 

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
