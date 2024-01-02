"use client";

import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";

import Link from "next/link";
import { url } from "../api/webApiUrl";
import Header from "../componentes/Header";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import "dayjs/locale/pt-br";
import { InputAdornment, Snackbar, TableFooter, TablePagination } from '@mui/material';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { 
  Spinner,
  Avatar,
  Input
 } from '@nextui-org/react';
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
import { useReactToPrint } from 'react-to-print';

import Select from '@mui/material/Select';
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import GoogleIcon from "../assets/icons/GoogleIcon";
import SpinnerForButton from "../componentes/SpinnerButton";

export default function CreateMaterial(){
  const route = useRouter()


  const [loadingButton,setLoadingButton] = useState<boolean>(false)  
  const [loadingMateriais,setLoadingMateriais] = useState<boolean>(false)  
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
 const[precoCusto,setPrecoCusto] = useState< string>()
  const[markup,setMarkup] = useState<string>("")
  const [precoVenda,setPrecoVenda] = useState< string>()
  const [materiais, setMateriais] = useState([]);

  const unidadeMaterial : string[] = ["UN", "RL", "MT", "P"];
  const tensoes :string[]= ["","12V","24V","127V","220V","380V","440V","660V"]
  const { data: session } = useSession();
  
  const componentRef: any = useRef();

  const handlePrint = useReactToPrint({
   content: () => componentRef.current,
   documentTitle: 'Visitor Pass',
   onAfterPrint: () => console.log('Printed PDF successfully!'),
  });
    



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
        //Irá começar a realizar a busca somente quando  a categoria tiver 4 caracteres
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
    
    setLoadingMateriais(true)

   try{
    const res = await axios
    .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao}`)
    .then( (r)=> {
      setLoadingMateriais(false)
     return r.data
     
    })
    .catch();
    console.log(res)

    setMateriais(res)

   }
   catch(e) 
   
   { 
    setLoadingMateriais(false)

console.log(e)
   }
  
};


  const handleChangeUpdatePage = async (id:number) => {
   
    sessionStorage.setItem("description",descricao)


    route.push(`update-material/${id}`)
    
    
      
  };

  const createInventario = async (idMaterial:number) => {
    
    
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
    setMateriais([])


    if (!descricao || !unidade) {
      setOpenSnackBar(true);
      setSeveridadeAlert("warning");
      setMessageAlert("Prencha todas as informações necessárias");
    } else {

      // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
      setLoadingButton(true)
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
        markup:markup == "0 "?null:markup,
        
      };

      const materialCriado = await axios
        .post(`${url}/Materiais`, material)
        .then((r) => {
          createInventario(r.data.id);
          setLoadingButton(false)
          setOpenSnackBar(true);
          setSeveridadeAlert("success");
          setMessageAlert("Material Criado com sucesso");
         setDescricao(r.data.descricao)
 
      
          return r.data
        })
        .catch((e) => {
          console.log(e.response.data.message);
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

       

          
        
      
        //Quando criar o material.atualizara a  lista de materias que estao a amostra
        // e se somente o material ter sido criado
       
       





    }
  };

  
    return(
       
      <>
   
      <div>
      
<NavBar/>

</div>


 
      <div className=' w-full flex flex-row flex-wrap justify-center mt-6 '>

       
        <Input
          value={codigoFabricante}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Cód Fabricante"
          
        />

        <Input
    
          value={descricao}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[400px]"
          onValueChange={setDescricao}
          label="Descrição"
          required
        />
 
        <Input
          value={marca}

  
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setMarca}
          label="Marca"
        />
        <Input
          value={localizacao}
          className=" border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px]"
          onValueChange={setLocalizacao}
          label="Localização"
        />
          </div>
      <div className=' w-full flex flex-row flex-wrap justify-center'>

        <Input
        
        value={precoCusto}
        style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
        className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setPrecoCusto}
        label="Preço Custo"
       
      />
      <Input
 
  

          value={markup}
          style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setMarkup}
          label="Markup"
        
        />
 
 <Autocomplete
       label="Unidade "
       placeholder="EX:127V"
       className="max-w-[180px] border-1 border-black rounded-xl shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
        
     >
     
     {tensoes.map((item:any) => (
      
        <AutocompleteItem
         key={item.id} 
         aria-label='teste'
        
        
         
      
          value={item}
          >
          {item}
        </AutocompleteItem>
      ))}
      </Autocomplete>

        <Input
          value={corrente}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setCorrente}
          label="Corrente"
        />

     

  
    <Autocomplete
       label="Unidade "
       placeholder="EX:MT"
       className="max-w-[180px] border-1 border-black rounded-xl shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
        
     >
     
     {unidadeMaterial.map((item:any) => (
      
        <AutocompleteItem
         key={item.id} 
         aria-label='teste'
        
        
         
      
          value={item}
          >
          {item}
        </AutocompleteItem>
      ))}
      </Autocomplete>

  
        <div style={{ marginTop: "40px", width: "190px",marginLeft:"20px" }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label="Data Entrada NF"
              className="shadow-lg"
              value={dataentrada}
              onChange={(e) => setDataentrada(e)}
              slotProps={{ textField: { variant: 'filled' }}}
            />
          </LocalizationProvider>
        </div>
      </div>

        {session &&(
<>
      <div className='text-center mt-8 '>
      <Button  onPress={handleCreateMaterial} className='bg-master_black text-white p-7 rounded-lg font-bold text-2xl shadow-lg '>
          {loadingButton?<Spinner size="md" color="warning"/>:"Criar Material"}
      </Button>
      <Button className="text-white bg-master_black p-4 font-bold ml-5" onClick={()=>handlePrint()}>
      Limpar
      </Button>
     
      </div>
      </>
        )}
 

   
        <div className='mt-16 flex '  ref={componentRef}>
       


          {materiais.length>0?
          <>
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
                 {session && (

                <TableCell align="center"
                className="text-xl "></TableCell>
                 )}
              </TableRow>
            </TableHead>
            <TableBody>
              { materiais.length>=1 && materiais.map((row:any) => (
                <TableRow
                  key={row.material.id}
                 className=""
                >
              
             
                  <TableCell 
                  
                  align="center"
                  className="text-base hover:border-1 hover:border-black hover:font-bold hover:shadow-xl hover:rounded-lg"
                  >{row.material.id}</TableCell>
                  <TableCell align="center" className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.codigoFabricante}</TableCell>
                  <TableCell align="center" className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg" onClick={(x)=>setDescricao(row.material.descricao)}>{row.material.descricao}</TableCell>
                  <TableCell align="center" className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.marca}</TableCell>
                  <TableCell align="center" size ="small" className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.tensao}</TableCell>

                  <TableCell align="center" size ="small"
                  className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +" "+row.material.unidade}</TableCell>
                  <TableCell align="center" size ="small"
                  className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.localizacao}</TableCell>
                  <TableCell align="center" size ="small"
                  className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</TableCell>
                  <TableCell align="center" size ="small"
                  className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}</TableCell>
                  <TableCell align="center" size ="small"
                  className="text-base hover:border-1 hover:border-black hover:font-bold rounded-lg">{row.material.precoVenda==null?"Sem registro":"R$ "+(row.material.precoCusto*row.saldoFinal).toFixed(2).toString().replace(".",",")}</TableCell>
                  
                  {session && (
                   <TableCell align="center" size ="small"
                 className="text-base hover:border-1 ">      <Button
                  style={{backgroundColor:'white',marginTop:"7px",marginRight:"15px"}}
                  
                    onClick={(x) =>
                      handleChangeUpdatePage(row.material.id)
                    }
                  >
                    <EditTwoToneIcon />
                  </Button>
                  </TableCell>
                  )}
            
                 
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
        </>
          
          
          :  
          loadingMateriais &&(

            <div className="w-full flex flex-row justify-center mt-16">
              <Spinner size="lg"/>
            </div>
          )
          }
          
        </div>
        
    </>



    )
}