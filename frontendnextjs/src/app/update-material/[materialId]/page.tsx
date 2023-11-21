"use client"

import { Button } from "@nextui-org/react";

import Header from "../../componentes/Header";
import { Snackbar } from '@mui/material';

import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/pt-br";
import { url } from "../../api/webApiUrl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function UpdateMaterial({params}:any){
    //Variável que é passada pela rota na tela de criar material,aonde quando clicar no icone de editar,passara o id do material
    // const route = useRouter()



  const[categoria,setCategoria]=useState<string>("")
  const [descricao,setDescricao] = useState<string>("")
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState<string>("")
  const [marca,setMarca] = useState<string>("")
  const [ tensao,setTensao] = useState<string>("")
  const [corrente,setCorrente] = useState<string>("")
  const [localizacao,setLocalizacao] = useState<string>("")
  const [ unidade,setUnidade] = useState<string>("")
  const[dataentrada,setDataentrada] = useState<any>(undefined)
  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
   const [idCategoria,setIdCategoria] = useState<number>()
  const[oldCategory,setOldCategory]= useState<string>("")
  const [materiais, setMateriais] = useState<any>([]);
  const[precoCusto,setPrecoCusto] = useState<number>()
  const[markup,setMarkup] = useState<number>(0)
 
  const unidadeMaterial: string[] = ["UN","RL","PC","MT","P"]
  const tensoes : string[] = ["","12V","24V","127V","220V","380V","440V","660V"]
 
 
 
 useEffect(()=>{
 
    console.log(params.materialId)
    getMaterial(params.materialId).then().catch()
     
 
 
 },[])
 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }
 
 
  const getMaterial = async(id:number)=>{
 
  axios.get(`${process.env.URL_API}/Materiais/${id}`).then(r=>{
 console.log(r.data.dataEntradaNF)
  setDataentrada(r.data.dataEntradaNF==undefined?undefined:dayjs(r.data.dataEntradaNF))
 setCodigoInterno(r.data.id)
 setUnidade(verifyNull(r.data.unidade))
 setCodigoFabricante(verifyNull(r.data.codigoFabricante))
 setCorrente(verifyNull(r.data.corrente))
 setMarca(verifyNull(r.data.marca))
 setDescricao(verifyNull(r.data.descricao))
 setOldCategory(verifyNull(r.data.categoria))
 setLocalizacao(verifyNull(r.data.localizacao))
 setPrecoCusto(verifyNull(r.data.precoCusto))
 setMarkup(verifyNull(r.data.markup))
 
 setTensao(verifyNull(tensoes[tensoes.findIndex((x)=>x==r.data.tensao)]))
 
  })
 
  }
 
 
 const handleUpdateMaterial=  async (id:number)=>{
 
 if(precoCusto == undefined && markup==undefined){

   setPrecoCusto(0)
   setMarkup(0)
 }
   // o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
 const material = {
     id:id,
     codigoInterno:"",
     codigoFabricante:codigoFabricante.trim().replace(/\s\s+/g, ' '),
     categoria: oldCategory.trim().replace(/\s\s+/g, " "),
     descricao:descricao.trim().replace(/\s\s+/g, ' '),
     marca:marca.trim().replace(/\s\s+/g, ' '),
     corrente:corrente.trim().replace(/\s\s+/g, ' '),
     unidade:unidade,
     tensao:tensao,
     localizacao:localizacao.trim().replace(/\s\s+/g, ' '),
     dataEntradaNF:dataentrada,
     precoCusto:precoCusto==0?null:precoCusto,
     markup:markup==0?null:markup,
     }
 
 
   const materialAtualizado =  await axios.put(`${process.env.URL_API}/Materiais/${id}`,material)
   .then(r=>
     {  
       console.log(r)
       setOpenSnackBar(true)
       setSeveridadeAlert("success")
       setMessageAlert("Material Atualizado com sucesso")
    
 
 }
     
   ).catch(e=>{
     console.log(e)
  
     
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
 
   })
  
 
 
 }
 
 
 
 
 
 
   return (
     <>
 

 
     <h1  className='text-center font-bold text-2xl mt-6'>Editando {descricao}  (Codigo Interno: {codigoInterno}) </h1>
   
     <div className=' w-full flex flex-row justify-center mt-6 ' >
 
 
     <TextField  value={oldCategory} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}  
   onChange={e=>setOldCategory(e.target.value)} label='Categoria' required/>
     
 
 
     {/* <TextField disabled={true}   value={codigoInterno} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className={updateMaterial.inputs} onChange={e=>setCodigoInterno(e.target.value)} label='Cod Interno'  /> */}
 
     <TextField    value={codigoFabricante} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
      onChange={e=>setCodigoFabricante(e.target.value)} label='Cod Fabricante'  />
 
    
     {/* <InputText className='inputs' value={descricao} onChange={e=>setDescricao(e.target.value)} /> */}
     <TextField   value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
        onChange={(e) => setDescricao(e.target.value)} label='Descrição' required />
 
    
     <TextField   value={marca} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}} 
      onChange={e=>setMarca(e.target.value)}  label='Marca' />
 
       <TextField
           value={localizacao}
           style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
           
           onChange={(e) => setLocalizacao(e.target.value)}
           label="Localização"
         />
   </div>

      <div className=' w-full flex flex-row justify-center mt-6 ' >
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
      style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px"}}
      labelId="demo-simple-select-label"
     value={tensao}
     label="Tensao"
     onChange={x=>setTensao(x.target.value)}
   >
       {tensoes.map((x)=>(
         <MenuItem  key = {x} value={x}>{x}</MenuItem>
         
       ))}
     
   
   </Select>
         <TextField
           value={corrente}
           style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"100px"}}
         
           onChange={(e) => setCorrente(e.target.value)}
           label="Corrente"
         />
 
      
 
   <Select
      style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" ,width:"120px"}}
      labelId="demo-simple-select-label"
     value={unidade}
     label="Unidade"
     onChange={x=>setUnidade(x.target.value)}
   >
       {unidadeMaterial.map((x)=>(
         <MenuItem  key ={x} value={x}>{x}</MenuItem>
         
       ))}
     
   
   </Select>
     <div style={{marginTop:'40px',width:'206px'}}>
 
     <LocalizationProvider   dateAdapter={AdapterDayjs} adapterLocale="pt-br" >
     
         <DatePicker  label="Data Entrada NF"  value={dataentrada} onChange={e=>setDataentrada(e)} />
     
     </LocalizationProvider>
     </div>
     
 
   
     </div>

     <div className='text-center mt-8'>
     <Button  onPress={x=>handleUpdateMaterial(params.materialId)} className='bg-master_black text-white p-4 rounded-lg font-bold text-2xl '>
       Atualizar Material
      </Button>
      </div>
    
     <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={e=>setOpenSnackBar(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
     >
             <MuiAlert onClose={e=>setOpenSnackBar(false)} severity={severidadeAlert} sx={{ width: '100%' }}>
              {messageAlert}
            </MuiAlert>
            </Snackbar>
   
 
     
     </>
     
     
   );
}