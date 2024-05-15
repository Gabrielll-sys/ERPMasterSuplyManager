"use client"
import { useRouter } from "next/navigation";
import { Autocomplete, AutocompleteItem, Button, Input, Link } from "@nextui-org/react";
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import "dayjs/locale/pt-br";
import { useEffect, useState } from "react";
import ArrowLeft from "@/app/assets/icons/ArrowLeft";
import { getMaterialById,updateMaterial } from "@/app/services/Material.Services";
import dayjs from "dayjs";

export default function UpdateMaterial({params}:any){
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
 
    getMaterial(params.materialId).then().catch()
     console.log("Disparei 1 vez")

 },[])



 //Função para calcular o markup ja trocando as virgulas por pontos,pois a variável é string,para permitir usar , ao invés de .
 const  calcularMarkup= ()=>
 {
  console.log(Number(precoVenda))
  const PRECO_CUSTO = Number(precoCusto)

  const PRECO_VENDA = Number(precoVenda)

  console.log(PRECO_VENDA.toFixed(4))

  let markupCalculado = Number((Number(precoVenda?.toString().replace(`,`,`.`))/Number(precoCusto?.toString().replace(`,`,`.`))-1).toFixed(4))*100

    const positiveNumber = Math.abs(markupCalculado)

    console.log(positiveNumber)

    setMarkup(positiveNumber.toFixed(2).toString().replace('.',','))
    
  if(Number.isNaN(markupCalculado))
  {
  console.log("FOIIII")
   setMarkup("")

  }
  else{

    setMarkup(markupCalculado.toFixed(2).toString().replace('.',','))
  }
  return 

 }
 const  calcularPrecoVenda= ()=>
 {

  let percentage = (Number(markup)/10)+1
  const a =  Number((Number(precoCusto?.toString().replace(`,`,`.`))*Number(percentage?.toString().replace(`,`,`.`))-1)+1).toFixed(2).toString()
  setPrecoVenda(a)
  console.log(a)

 }
 //esta função serve para verificar se o item é nulo,aonde quando importamos os dados do excel os dados vem como nulo
 //e para realizar a  edição aqui
 const verifyNull = (item:any)=>{
 
   return item==null?"":item
 
 }

  const getMaterial = async(id:number)=>{
   const material = await getMaterialById(id)
  console.log(material)
setDataentrada(material.dataEntradaNF==undefined?undefined:dayjs(material.dataEntradaNF))
setCodigoInterno(material.id)
setUnidade(material.unidade)
setCodigoFabricante(verifyNull(material.codigoFabricante))
setCorrente(verifyNull(material.corrente))
setMarca(verifyNull(material.marca))
 setDescricaoMaterial(material.descricao)
 setDescricao(material.descricao)
setOldCategory(verifyNull(material.categoria))
setLocalizacao(verifyNull(material.localizacao))
setPrecoCusto(verifyNull(material.precoCusto))
setPrecoVenda(material.precoVenda == null?"0":material.precoVenda.toFixed(2))
setMarkup(verifyNull(material.markup))

setTensao(material.tensao)
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
     precoCusto:Number(precoCusto)==0?0:Number(precoCusto?.toString().replace(',','.')),
     precoVenda:Number(precoVenda)==0?0:Number(precoVenda?.toString().replace(',','.')),
     markup:Number(markup)==0?null:Number(markup?.toString().replace(',','.')),
     }

     
   const materialAtualizado =  await updateMaterial(material,id)
   
     
   if (materialAtualizado){
       setOpenSnackBar(true)
       setSeveridadeAlert("success")
       setMessageAlert("Material Atualizado com sucesso")
       //Contará um tempo depois que atualizar o material e voltara para a tela de materias
      setTimeout(()=>{
        route.back()
      },1200)
   }
   
   
  
 
 
 }
 

 
 
   return (
     <>
 

 
     <Link
        size="sm"
        as="button"
        className="p-3 mt-4 text-base tracking-wide text-dark hover:text-success border border-transparent hover:border-success transition-all duration-200"
        onClick={() => route.push("/create-material")}
      >
        <ArrowLeft /> Retornar
      </Link>
     <h1  className='text-center font-bold text-2xl mt-10'>Editando {descricaoMaterial}  (Codigo Interno: {codigoInterno}) </h1>
   
     <div className=' w-full flex flex-row justify-center mt-10 ' >
 
 
  
     <Input   
      value={codigoFabricante} 
      className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
      onValueChange={setCodigoFabricante}  label='Cod Fabricante'  />
 
    
     <Input   value={descricao} 
         className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[400px]"
         onValueChange={setDescricao} label='Descrição'  required />
 
    
     <Input   
     value={marca}     
     className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
     onValueChange={setMarca}  label='Marca' />
      
       <Input
           value={localizacao}
           className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           
           onValueChange={setLocalizacao}
           label="Localização"
         />
    </div>

      <div className=' w-full flex flex-row justify-center mt-6 ' >

           <Input
          type="number"
          className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"

         value={precoCusto}
         startContent={
          <span>R$</span>
        }
        
         onValueChange={setPrecoCusto}
         label="Preço Custo"

       />
       <Input
          type="number"
           value={markup}
           className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           onValueChange={(x)=>{setMarkup(x),calcularPrecoVenda()}}
           label="Markup "
           endContent={
            <span>%</span>
          }
          
         />
       <Input
           value={precoVenda}
           onValueChange={(x)=>{setPrecoVenda(x),calcularMarkup()}}
           label="Preço Venda"
           startContent={
            <span>R$</span>
          }
           className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
         />
         {tensao && (
            <Autocomplete
            label="Tensão "
            className="max-w-[180px] border-1 border-black rounded-md shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
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
           className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
           onValueChange={setCorrente}
           label="Corrente"
         />
 
      {unidade && (

 <Autocomplete
       label="Unidade "
       placeholder="EX:MT"
       className="max-w-[180px] border-1 border-black rounded-md shadow-sm shadow-black h-14 mt-10 ml-5 mr-5 w"
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
      
     
   
     </div>

     <div className='text-center mt-12'>
     <Button  onPress={x=>handleUpdateMaterial(params.materialId)} 
      color='primary' 
      variant='ghost' className=' p-6 rounded-lg font-bold text-2xl  '>
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