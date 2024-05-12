"use client"
import { useRouter } from "next/navigation";

import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";


import { Snackbar } from '@mui/material';

import { url } from "@/app/api/webApiUrl";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";

import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";

export default function UpdateFornecedor({params}:any){
  const route = useRouter()

  const[categoria,setCategoria]=useState<string>("")
  const [descricao,setDescricao] = useState<string>("")
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState<string>("")
  const [marca,setMarca] = useState<string>("")
  const [ tensao,setTensao] = useState<any>("")
  const [corrente,setCorrente] = useState<string>("")
  const [localizacao,setLocalizacao] = useState<string>("")
  const [ unidade,setUnidade] = useState<any>("")
  const[dataentrada,setDataentrada] = useState<any>(undefined)
  const [openSnackBar,setOpenSnackBar]= useState(false)
  const [ messageAlert,setMessageAlert] = useState<string>();
  const [ severidadeAlert,setSeveridadeAlert] = useState<AlertColor>()
   const [idCategoria,setIdCategoria] = useState<number>()
  const[oldCategory,setOldCategory]= useState<string>("")
  const [materiais, setMateriais] = useState<any>([]);
  const[precoCusto,setPrecoCusto] = useState<string >()
  const[precoVenda,setPrecoVenda] = useState<string>()
  const[markup,setMarkup] = useState< string>()
  
  const [unidadeMaterial,setUnidadeMaterial] = useState<any>(["UN","RL","PC","MT","P"])
  // const unidadeMaterial: string[] = ["UN","RL","PC","MT","P"]
  const tensoes : string[] = ["12V","24V","127V","220V","380V","440V","660V"]
  const [descricaoMaterial,setDescricaoMaterial] = useState<string>()
 
 
 useEffect(()=>{
 
    console.log(params.materialId)
    getMaterial(params.materialId).then().catch()
     

 },[])

 useEffect(()=>{

  if(precoCusto!="")
  {
  
    let markupCalculado = calcularMarkup(precoVenda ,precoCusto)
    
    if(Number.isNaN(markupCalculado)|| precoVenda =="")
    {
    
     setMarkup("")

    }
    else{

      setMarkup(markupCalculado.toFixed(2).toString().toString().replace('.',','))
    }

  }

 },[precoVenda])


 //Função para calcular o markup ja trocando as virgulas por pontos,pois a variável é string,para permitir usar , ao invés de .
 const  calcularMarkup= (x:string |undefined | null, y: string | undefined |null )=>
 {

  return Number((Number(x?.toString().replace(`,`,`.`))/Number(y?.toString().replace(`,`,`.`))-1).toFixed(4))*100

 }
 const  calcularPrecoVenda= ()=>
 {
  let percentage = (Number(markup)/100)+1
  const a =  Number((Number(precoCusto?.toString().replace(`,`,`.`))*Number(percentage?.toString().replace(`,`,`.`))-1)+1)
  console.log(a)

 }
 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }

  const getMaterial = async(id:number)=>{
    axios.get(`${url}/Materiais/${id}`).then(r=>{
 
  setDataentrada(r.data.dataEntradaNF==undefined?undefined:dayjs(r.data.dataEntradaNF))
 setCodigoInterno(r.data.id)
 setUnidade(r.data.unidade)
 setCodigoFabricante(verifyNull(r.data.codigoFabricante))
 setCorrente(verifyNull(r.data.corrente))
 setMarca(verifyNull(r.data.marca))
  setDescricaoMaterial(r.data.descricao)
  setDescricao(r.data.descricao)
 setOldCategory(verifyNull(r.data.categoria))
 setLocalizacao(verifyNull(r.data.localizacao))
 setPrecoCusto(verifyNull(r.data.precoCusto))
 setPrecoVenda(r.data.precoVenda == null?"0":r.data.precoVenda.toFixed(2))
 setMarkup(verifyNull(r.data.markup))
 
 setTensao(r.data.tensao)
})
 
  }
 
 
 const handleUpdateMaterial=  async (id:number)=>{
 
 if(precoCusto == "" && markup==""){

   setPrecoCusto("0")
   setMarkup("0")
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
     precoCusto:Number(precoCusto)==0?0:Number(precoCusto?.toString().replace(',','.')),
     precoVenda:Number(precoVenda)==0?0:Number(precoVenda?.toString().replace(',','.')),
     markup:Number(markup)==0?null:Number(markup?.toString().replace(',','.')),
     }
console.log(material)
 
   const materialAtualizado =  await axios.put(`${url}/Materiais/${id}`,material)
   .then(r=>
     {  
       console.log(r)
       setOpenSnackBar(true)
       setSeveridadeAlert("success")
       setMessageAlert("Material Atualizado com sucesso")
       //Contará um tempo depois que atualizar o material e voltara para a tela de materias
      setTimeout(()=>{
        route.back()
      },1200)
 
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
 

 
     <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.back()}
      >
        <ArrowLeft /> Retornar
      </Link>
     <h1  className='text-center font-bold text-2xl mt-10'>Editando {descricaoMaterial}  (Codigo Interno: {codigoInterno}) </h1>
   
     <div className=' w-full flex flex-row justify-center mt-10 ' >
 
 
     <Input 
     
     value={oldCategory} 
     className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
      onValueChange={setOldCategory} label='Categoria' required/>
     
 
 
     {/* <TextField disabled={true}   value={codigoInterno} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
     className={updateMaterial.inputs} onChange={e=>setCodigoInterno(e.target.value)} label='Cod Interno'  /> */}
 
     <Input   
      value={codigoFabricante} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px'}}
      className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
    
         onValueChange={setCodigoFabricante}  label='Cod Fabricante'  />
 
    
     {/* <InputText className='inputs' value={descricao} onChange={e=>setDescricao(e.target.value)} /> */}
     <Input   value={descricao} style={{marginTop:'40px',marginLeft:'20px',marginRight:'20px',}}
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[400px]"
         onValueChange={setDescricao} label='Descrição'  required />
 
    
     <Input   
     
     value={marca}     
     className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
      onValueChange={setMarca}  label='Marca' />
      
 
       <Input
           value={localizacao}
           className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           
           onValueChange={setLocalizacao}
           label="Localização"
         />
   </div>

      <div className=' w-full flex flex-row justify-center mt-6 ' >

           <Input
          type="number"
          className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"

         value={precoCusto}
         startContent={
          <span>R$</span>
        }
        
         onValueChange={setPrecoCusto}
         label="Preço Custo"

         
      
       />
       <Input
        
           value={markup}
           className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           onValueChange={setMarkup}
           label="Markup "
           endContent={
            <span>%</span>
          }
          
         />
       <Input
           value={precoVenda}
           onValueChange={setPrecoVenda}
           label="Preço Venda"
           startContent={
            <span>R$</span>
          }
           className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
         />
         {tensao && (
            <Autocomplete
            label="Tensão "
            className="max-w-[180px] border-1 border-black rounded-xl shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
            allowsCustomValue
            value={tensao}
            onSelectionChange={setTensao}
            defaultSelectedKey={tensao}
            >

            {tensoes.map((item:any) => (

              <AutocompleteItem
              key={item} 
              aria-label=''

                value={tensao}
                >
                {item}
              </AutocompleteItem>
            ))}
            </Autocomplete>
         )}
   
         <Input
           value={corrente}
           className="border-1 border-black rounded-xl shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           onValueChange={setCorrente}
           label="Corrente"
         />
 
      {unidade && (

 <Autocomplete
       label="Unidade "
       placeholder="EX:MT"
       className="max-w-[180px] border-1 border-black rounded-xl shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
        value={unidadeMaterial}
        onSelectionChange={setUnidade}
        allowsCustomValue
        defaultSelectedKey={unidade==""?"":unidade}
     >
     
     {unidadeMaterial.map((item:any) => (
      
        <AutocompleteItem
         key={item} 
         aria-label='teste'
      
          value={unidade}
          >
          {item}
        </AutocompleteItem>
      ))}
      </Autocomplete>
      )}
     <div style={{marginTop:'40px',width:'206px'}}>
 
     <LocalizationProvider 
        dateAdapter={AdapterDayjs} adapterLocale="pt-br" >
     
         <DatePicker  
         slotProps={{ textField: { variant: 'filled' }}}
         label="Data Entrada NF"  
         value={dataentrada} 
         onChange={e=>setDataentrada(e)} />
     
     </LocalizationProvider>
     </div>
     
 
   
     </div>

     <div className='text-center mt-12'>
     <Button  onPress={x=>handleUpdateMaterial(params.materialId)} className='bg-master_black text-white p-6 rounded-lg font-bold text-2xl  '>
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