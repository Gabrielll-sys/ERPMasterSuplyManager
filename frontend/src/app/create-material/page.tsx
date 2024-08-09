"use client";

import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { HoverCard, Text, TextField } from "@radix-ui/themes";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
 
import { Box, Flex, Table } from "@radix-ui/themes";
import { useMutation } from "react-query";
import LeftSearchParameters from "../componentes/LeftSearchParameters";
import { IInventario } from "../interfaces/IInventarios";
import IMaterial from "../interfaces/IMaterial";
import { createMaterial, searchByDescription, searchByFabricanteCode } from "../services/Material.Services";
import { Button } from '@radix-ui/themes';
import Image from 'next/image';
import { filterMateriais } from '../services/Inventario.Services';




 function CreateMaterial(){
  const route = useRouter()


  const [loadingButton,setLoadingButton] = useState<boolean>(false)  
  const [loadingMateriais,setLoadingMateriais] = useState<boolean>(false)

  const [descricao, setDescricao] = useState<string | undefined>("");
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
  const [materiais, setMateriais] = useState<IInventario[]>([]);

  const unidadeMaterial : string[] = ["UN", "RL", "MT", "P"];
  const tensoes :string[]= ["","12V","24V","127V","220V","380V","440V","660V"]
  const [currentUser, setCurrentUser] = useState<any>(null);
  

  const conditionsRoles = currentUser?.role == "Administrador" || currentUser?.role == "Diretor" || currentUser?.role == "SuporteTecnico"

   
 
  useEffect(()=>{
      //@ts-ignore
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(user != null)
  {
      setCurrentUser(user)

  }
  },[])


useEffect(()=>{

const description = sessionStorage.getItem("description")
//@ts-ignore
const materiais  = JSON.parse(sessionStorage.getItem("materiais"))

if(materiais!=null &&  materiais) setMateriais(materiais)


if(description) setDescricao(description)



},[])


const buscarDescricao = async(descricao:string | undefined)=>
{
setDescricao(descricao)
  if(descricao!= undefined){

    if(descricao.length>3)
    {
      try{

        setLoadingMateriais(true)
        const res =  await searchByDescription(descricao)

        setLoadingMateriais(false)
        setMateriais(res)
      }
    catch(e)
    {
      console.log(e)
    }
    
    }
  }


}

const handleFiltro = async (filtro:any)=>{

  const materiaisFiltrados = await filterMateriais(filtro)
   setMateriais(materiaisFiltrados)
  
}

const buscaCodigoFabricante = async(codigo:string)=>
{
  setCodigoFabricante(codigo)
  if(codigoFabricante.length>3)
    {
      try{
        const res =  await searchByFabricanteCode(codigoFabricante)
        setMateriais(res)
      }
    catch(e)
    {
      console.log(e)
    }
    
    }

}
  
  const handleChangeUpdatePage = async (id:string | number) => {
   
   if(descricao !=undefined){

     sessionStorage.setItem("description",descricao)
 
     sessionStorage.setItem("materiais",JSON.stringify(materiais))
 
     route.push(`update-material/${id}`)
   }
        
  };

  
  const mutationMaterial = useMutation({
    mutationFn: createMaterial,
    onSuccess: (res:IInventario) => {
        setOpenSnackBar(true);
        setSeveridadeAlert("success");
        setMessageAlert("Material Criado com sucesso")
        console.log(res)
      
        
   
    },
  
});

const handleCreateMaterial = () => {

    if (!descricao || !unidade) {
        setOpenSnackBar(true);
        setSeveridadeAlert("warning");
        setMessageAlert("Preencha todas as informações necessárias");
        return; // Yearly return
    }

    // Prepare the material object, removing extra spaces
    const material: IMaterial = {
        codigoFabricante: codigoFabricante.trim().replace(/\s\s+/g, " "),
        descricao: descricao.trim().replace(/\s\s+/g, " "),
        categoria: "",
        marca: marca.trim().replace(/\s\s+/g, " "),
        corrente: corrente.trim().replace(/\s\s+/g, " "),
        unidade: unidade.trim().replace(/\s\s+/g, " "),
        tensao: tensao.trim().replace(/\s\s+/g, " "),
        localizacao: localizacao.trim().replace(/\s\s+/g, " "),
        dataEntradaNF: dataentrada,
        precoCusto: precoCusto,
        markup: markup,
    };

    // Call the mutation to create the material
    mutationMaterial.mutate(material);
};

  
    return(
       
  
    <Flex direction="column"   gap="2" className="mt-7 w-full" >

    

      <Flex  direction="column"  wrap="wrap" gap="3"  >
        <Flex direction="column" justify="center" wrap="wrap" gap="6"   >
        
               <Flex direction="row" gap="6" justify={"center"} >
                 <TextField.Root>
                      <TextField.Input
                        value={codigoFabricante}
                        variant='classic'
                        onChange={(x) => buscaCodigoFabricante(x.target.value)}
                        placeholder='Código Fabricante'
                         className='max-sm:w-[150px] min-md:w-[200px] '
                        size="3"
                      />
                               </TextField.Root>
                 
                               <TextField.Root>
                      <TextField.Input
                        value={descricao}
                        variant='classic'
                        onChange={(x) => buscarDescricao(x.target.value)}
                        placeholder='Descrição'
                         className='w-[400px]'
                        size="3"
                      />
                               </TextField.Root>
                 
                               <TextField.Root>
                      <TextField.Input
                        value={marca}
                        variant='classic'
                        onChange={(x) => setMarca(x.target.value)}
                        placeholder='Marca'
                         className='w-[200px] '
                        size="3"
                      />
                               </TextField.Root>
                 
                               <TextField.Root>
                      <TextField.Input
                        value={localizacao}
                        variant='classic'
                        onChange={(x) => setLocalizacao(x.target.value)}
                        placeholder='Localização'
                         className='w-[200px]'
                        size="3"
                      />
                               </TextField.Root>
               </Flex>

        
              <Flex direction="row" gap="6" justify="center" >
                <TextField.Root>
                
                      <TextField.Input
                        type="number"
                        value={precoCusto}
                        variant='classic'
                        onChange={(x) => setPrecoCusto(x.target.value)}
                        placeholder='Preço Custo  '
                        className='w-[200px] '
                        size="3"
                      />
                
                </TextField.Root>
                
                            <TextField.Root>
                      <TextField.Input
                        value={markup}
                        variant='classic'
                        onChange={(x) => setMarkup(x.target.value)}
                        placeholder='Markup'
                         className='w-[200px]'
                        size="3"
                      />
                </TextField.Root>
                   <TextField.Root>
                      <TextField.Input
                        value={corrente}
                        variant='classic'
                        onChange={(x) => setCorrente(x.target.value)}
                        placeholder='Corrente'
                         className='w-[200px]'
                        size="3"
                      />
                </TextField.Root>
                   <Autocomplete
                label="Tensão"
                placeholder="EX:127V"
                className="max-w-[180px]  rounded-none "
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
                   <Autocomplete
                label="Unidade "
                placeholder="EX:MT"
                className="max-w-[180px]  rounded-none  "
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
              </Flex>
             <Flex justify="center">
               <Button  onClick={handleCreateMaterial}
                        
                           variant='solid'
                           className='  p-2 rounded-md font-bold text-[18px] my-3 w-[150px] '>
               Criar Material
                        </Button>
             </Flex>
         {materiais.length>0 && (

         <Text className='w-full' align="center">Resultados dessa Pesquisa : {materiais.length} Itens </Text>
         )}
        </Flex>
            <Flex direction="column" justify="start" >
          
                         <Table.Root className="" variant="surface"  >
               <Table.Header>
                 <Table.Row  >
                   <Table.ColumnHeaderCell align="center"  >Cód.Interno</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Cod.Fabricante</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Descrição</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Marca</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Tensão</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Estoque</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Localização</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Preço Venda</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell align="center">Preço Total</Table.ColumnHeaderCell>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {materiais.map((inventario:IInventario)=>(
                 <Table.Row key={inventario.material.id} className="hover:bg-master_yellow">
                   <Table.Cell align="center" className="max-w-[80px] " >{inventario.material.id}</Table.Cell>
                   <Table.Cell align="center" className="max-w-[100px] ">{inventario.material.codigoFabricante}</Table.Cell>
              
 <Table.RowHeaderCell className="max-w-[400px] " align="center" onClick={()=>{setDescricao(inventario?.material?.descricao),buscarDescricao(inventario?.material?.descricao)}} >{inventario.material.descricao}</Table.RowHeaderCell>
                   
                   
                   <Table.Cell align="center">{inventario.material.marca}</Table.Cell>
                   <Table.Cell align="center">{inventario.material.tensao}</Table.Cell>
                   <Table.Cell align="center">{inventario.saldoFinal}</Table.Cell>
                   <Table.Cell align="center" className="max-w-[100px] ">{inventario.material.localizacao}</Table.Cell>
                   <Table.Cell align="center">R${inventario.material.precoVenda==null?"0,00":inventario.material.precoVenda.toFixed(2).toString().replace('.',",")}</Table.Cell>
                   <Table.Cell align="center">R${inventario.material.precoVenda==null && inventario.saldoFinal==0?"0,00":(inventario.material.precoVenda * inventario.saldoFinal).toFixed(2).toString().replace('.',",")}</Table.Cell>
                   <Table.Cell align="center"> 
                    <Button
                                        onClick={() => handleChangeUpdatePage(inventario?.material?.id)}
                                        className="text-white text-sm rounded-md hover:underline w-[50px] "
                
                                    >
                                        Editar
                
                                                            </Button>
                                                            </Table.Cell>
                 </Table.Row>
                 ))}
               </Table.Body>
                       </Table.Root>
            </Flex>
        
      </Flex>
        
       
      <Snackbar
            open={openSnackBar}
            autoHideDuration={2000}
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
  
    </Flex>

     



    )
}
export default CreateMaterial;