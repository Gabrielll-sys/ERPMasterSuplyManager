"use client";

import { useRouter } from "next/navigation";

import { Button } from "@nextui-org/react";
import Link from "next/link";


import Header from "../componentes/Header";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import "dayjs/locale/pt-br";
import { Snackbar } from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Input } from '@nextui-org/react';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
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
import NavBar from '../componentes/NavBar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import dayjs from "dayjs";
export default function CreateMaterial(){
  const route = useRouter()

  
  const [categoria, setCategoria] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [codigoInterno, setCodigoInterno] = useState<string>("");
  const [codigoFabricante, setCodigoFabricante] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [tensao, setTensao] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [corrente, setCorrente] = useState<string>("");
  const [unidade, setUnidade] = useState<string>("UN");
  const [dataentrada, setDataentrada] = useState<any>(undefined);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [object,setObject]= useState([])
 const[precoCusto,setPrecoCusto] = useState<number | undefined>()
 const[markup,setMarkup] = useState<number>(0)
const [precoVenda,setPrecoVenda] = useState<number>()
  const [materiais, setMateriais] = useState([]);

  const unidadeMaterial = ["UN", "RL", "MT", "P"];
  const tensoes = ["","12V","24V","127V","220V","380V","440V","660V"]



useEffect(()=>{

const description = sessionStorage.getItem("description")

if(description) setDescricao(description)


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
     .get(`${process.env.URL_API_API}/Inventarios/buscaCodigoFabricante?codigo=${codigoFabricante}`)
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

    console.log("Foi")
   try{
    const res = await axios
    .get(`${process.env.URL_API}/Inventarios/buscaDescricaoInventario?descricao=${descricao}`)
    .then( (r)=> {
      
     return r.data
     
    })
    .catch();
    console.log(res)
     setMateriais(res)

   }
   catch(e) 
   
   { 
console.log(e)
   }
  
};


  const handleChangeUpdatePage = async (id:number) => {
   
    sessionStorage.setItem("description",descricao)

    // navigate("/updateMaterial", { state: id })


      
  };

  const createInventario = async (idMaterial:number) => {
    
    
    const invetario = {
      materialId: idMaterial,
      estoque:0,
      material: {},
    };
    try{
      await axios
      .post(`${process.env.URL_API}/Inventarios`, invetario)
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
        dataEntradaNF: dataentrada,
        precoCusto:precoCusto,
        markup:markup == 0 ?null:markup,
        
      };

      const materialCriado = await axios
        .post(`${process.env.URL_API}/Materiais`, material)
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
         await searchByDescription()
       

       }




    }
  };

  
    return(
       
      <>
   
      <div>
      
<NavBar/>

</div>
      <h1  className='text-center font-bold text-2xl mt-6'>Criação de Material</h1>

      <div className=' w-full flex flex-row justify-center mt-6 '>

       

        <TextField
        
          value={codigoFabricante}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
         
          
          error={severidadeAlert != "warning" ? false : true}

          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Cód Fabricante"
          
        />

        <TextField
          error={
            severidadeAlert != "warning" || descricao.length ? false : true
          }
          value={descricao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px",width:"320px" }}
       
          onChange={(e) => setDescricao(e.target.value)}
          label="Descrição"
          required
        />

        <TextField
          value={marca}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          
          onChange={(e) => setMarca(e.target.value)}
          label="Marca"
        />
        <TextField
          value={localizacao}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
         
          onChange={(e) => setLocalizacao(e.target.value)}
          label="Localização"
        />
          </div>
      <div className=' w-full flex flex-row justify-center'>

        <TextField
        value={precoCusto}
        style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
      
        onChange={(e) => setPrecoCusto(Number(e.target.value))}
        label="Preço Custo"
      />
      <TextField
          value={markup}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          
          onChange={(e) => setMarkup(Number(e.target.value))}
          label="Markup %"
        />
    
      
 <Select
     style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px",height:"55px"}}
     labelId="demo-simple-select-label"
    value={tensao}
    label="Tensao"
    onChange={x=>setTensao(x.target.value)}
  >
      {tensoes.map((x)=>(
        <MenuItem key={x} value={x}>{x}</MenuItem>
        
      ))}
 

  </Select>
        <TextField
          value={corrente}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px"}}
         
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
      {unidadeMaterial.map((x:any)=>(
        <MenuItem  key={x} value={x}>{x}</MenuItem>
        
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

      <div className='text-center mt-8 '>
      <Button  onPress={handleCreateMaterial} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '>
        Criar Material
      </Button>
      </div>

   
        <div className='mt-16' >
          <TableContainer component={Paper} >
            <Table
            stickyHeader
              sx={{ width: "100vw",  }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>

                  <TableCell
                   align="center"
                   className="text-xl ">Cod.Interno</TableCell>
                  <TableCell align="center"
                  className="text-xl">Cod.Fabricante</TableCell>
                  <TableCell align="center"
                  className="text-xl ">Descrição</TableCell>
                  <TableCell align="center"
                   className="text-xl ">Marca</TableCell>
                  <TableCell align="center"
                   className="text-xl ">Tensão</TableCell>
     
                  <TableCell align="center"
                  className="text-xl ">Estoque</TableCell>

                  <TableCell align="center"
                  className="text-xl ">Localização</TableCell>
                  <TableCell align="center"
                  className="text-xl ">Preço Custo</TableCell>
                  <TableCell align="center"
                  className="text-xl ">Preço venda</TableCell>
                   <TableCell align="center" className="text-xl">Preço Total</TableCell> 
                  <TableCell align="center"
                  className="text-xl "></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { materiais.length>=1 && materiais.map((row:any) => (
                  <TableRow
                    key={row.material.id}
                   className="hover:bg-master_yellow border-2 border-black"
                  >
                
               
                    <TableCell align="center"
                    className="text-base"
                    >{row.material.id}</TableCell>
                    <TableCell align="center" className="text-base">{row.material.codigoFabricante}</TableCell>
                    <TableCell align="center" className="text-base" onClick={(x)=>setDescricao(row.material.descricao)}>{row.material.descricao}</TableCell>
                    <TableCell align="center" className="text-base">{row.material.marca}</TableCell>
                    <TableCell align="center" size ="small" className="text-base">{row.material.tensao}</TableCell>
  
                    <TableCell align="center" size ="small"
                    className="text-base">{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +" "+row.material.unidade}</TableCell>
                    <TableCell align="center" size ="small"
                    className="text-base">{row.material.localizacao}</TableCell>
                    <TableCell align="center" size ="small"
                    className="text-base">{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2)}</TableCell>
                    <TableCell align="center" size ="small"
                    className="text-base">{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2)}</TableCell>
                    <TableCell align="center" size ="small"
                    className="text-base">{row.material.precoVenda==null?"Sem registro":"R$ "+(row.material.precoCusto*row.saldoFinal).toFixed(2)}</TableCell>
                     <TableCell align="center" size ="small"
                   className="text-base">      <Button
                    style={{backgroundColor:'white',marginTop:"7px",marginRight:"15px"}}
                    
                      onClick={(x) =>
                        route.push(`update-material/${row.material.id}`)
                      }
                    >
                      <EditTwoToneIcon />
                    </Button>
                    </TableCell>
              
                   
                  </TableRow>
                ))}
                 
              </TableBody>
            </Table>
          </TableContainer>
      
          <Snackbar
            open={openSnackBar}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
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



    )
}