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
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
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
import { Table } from "flowbite-react";

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
 const[precoCusto,setPrecoCusto] = useState<string>()
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
    .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao.split("#").join(".")}`)
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
        markup:markup == ""?null:markup,
        
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
   



 
      <div className=' w-full flex flex-row flex-wrap justify-center mt-6 '>

       
        <Input
          value={codigoFabricante}
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onChange={(e) => setCodigoFabricante(e.target.value)}
          label="Cód Fabricante"
          
        />

        <Input
          value={descricao}
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[400px]"
          onValueChange={setDescricao}
          label="Descrição"
          required
        />
 
        <Input
          value={marca}
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setMarca}
          label="Marca"
        />
        <Input
          value={localizacao}
          className=" border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[150px]"
          onValueChange={setLocalizacao}
          label="Localização"
        />
          </div>
      <div className=' w-full flex flex-row flex-wrap justify-center'>

        <Input
        type="number"
        value={precoCusto}
        className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
        onValueChange={setPrecoCusto}
        label="Preço Custo"
        startContent={
          <span>R$</span>
        }
       
      />
      <Input
          type="number"
          value={markup}
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setMarkup}
          endContent={
            <span>%</span>
          }
          label="Markup"
        
        />
 
 <Autocomplete
       label="Unidade "
       placeholder="EX:127V"
       className="max-w-[180px] border-1 border-black rounded-md shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
       allowsCustomValue
        
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
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
          onValueChange={setCorrente}
          label="Corrente"
        />

     

  
    <Autocomplete
       label="Unidade "
       placeholder="EX:MT"
       className="max-w-[180px] border-1 border-black rounded-md shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
        value={unidade}
        onValueChange={setUnidade}
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

  
        {/* <div style={{ marginTop: "40px", width: "190px",marginLeft:"20px" }}>
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
        </div> */}
      </div>

        {session &&(
<>
      <div className='text-center mt-8 '>
      <Button  onPress={handleCreateMaterial} className='bg-master_black text-white p-7 rounded-lg font-bold text-2xl shadow-lg '>
          {loadingButton?<Spinner size="md" color="warning"/>:"Criar Material"}
      </Button>
     
     
      </div>
      </>
        )}
 

   
        <div className='mt-16 flex '  ref={componentRef}>
       


          {materiais.length>0?
          <>
          <div className="overflow-x-auto self-center w-[100%] ">
      <Table  hoverable striped className="w-[100%] ">
        <Table.Head className="border-1 border-black">
          <Table.HeadCell className="text-center border-1 border-black text-sm  " >Cod.Interno</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Cod.Fabricante</Table.HeadCell>
          <Table.HeadCell className="text-center text-sm">Descrição</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Marca</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Tensão</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Estoque</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Localização</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Custo</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm ">Preço Venda</Table.HeadCell>
          <Table.HeadCell className="text-center border-1 border-black text-sm">Preço Total</Table.HeadCell>
          <Table.HeadCell className="text-center">
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          
        { materiais.length>=1 && materiais.map((row:any) => (
          <Table.Row  key={row.material.id} className=" dark:border-gray-700 dark:bg-gray-800 hover:bg-yellow-200">
          <Table.Cell className="  text-center font-medium text-gray-900 dark:text-white max-w-[120px]">
          {row.material.id}
          </Table.Cell>
          <Table.Cell className="text-center  text-black ">{row.material.codigoFabricante}</Table.Cell>
          <Table.Cell className="text-center text-black" onClick={(x)=>setDescricao(row.material.descricao)}>{row.material.descricao}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.marca}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.tensao}</Table.Cell>
          <Table.Cell className="text-center text-black hover:underline" onClick={()=>route.push(`/update-inventory/${row.material.id}`)}>{row.saldoFinal==null?"Não registrado":row.saldoFinal +" "+row.material.unidade}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.localizacao}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoCusto==null?"Sem Registro":"R$ "+row.material.precoCusto.toFixed(2).toString().replace(".",",")}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoVenda==null?"Sem registro":"R$ "+row.material.precoVenda.toFixed(2).toString().replace(".",",")}</Table.Cell>
          <Table.Cell className="text-center text-black">{row.material.precoVenda==null?"Sem registro":"R$ "+(row.material.precoCusto*row.saldoFinal).toFixed(2).toString().replace(".",",")}</Table.Cell>
          
          <Table.Cell>
            <a  onClick={(x) =>
                      handleChangeUpdatePage(row.material.id)
                    } className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
              Editar
            </a>
          </Table.Cell>
        </Table.Row>


              ))}
          
         
         
        </Table.Body>
      </Table>
    </div>
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