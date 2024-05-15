"use client"
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import MuiAlert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { TableRow } from "@mui/material";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { searchByInternCode } from "../services/Inventario.Services";
import Snackbar from "@mui/material/Snackbar";
import { useSession } from "next-auth/react";
export default function SearchInvetory(){
    

  type Inventario = {
    id:number,
    movimentacao:number,
    estoque:number,
    saldoFinal:number,
    razao:string,
    dataAlteracao:any,
    material:{
      id:number,
      codigoFabricante:number,
      descricao:string,
      unidade:string,
    }




  }



    const route = useRouter()

    const { data: session } = useSession();

  const [descricao, setDescricao] = useState("");
  const [codigoInterno,setCodigoInterno] = useState<string>("")
  const [codigoFabricante,setCodigoFabricante] = useState("")
  const [estoque, setEstoque] = useState(0);
  const[storeAllInventory,setStoreAllInventory] = useState()


  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageAlert, setMessageAlert] = useState();
  const [severidadeAlert, setSeveridadeAlert] = useState();
  const [object,setObject]= useState([])
  const [showAll,setShowAll] = useState(false)
  const [onlyOneItem,setOnlyOneItem] = useState<any|undefined>()
  
  const [inventarios, setInventarios] = useState<Inventario[]>([]);


  useEffect(() => {
    //Irá começar a realizar a busca somente quando  o código tiver  caracteres
 
    if (codigoInterno.length) {
      try{

        searchMaterialInventario().then().catch();
      }
      catch(e){
        console.log(e)

      }
    }
    setInventarios([])

  }, [codigoInterno]);


  const handleChangePageUpdate = (id:number)=>{


    route.push(`/update-inventory/${id}`)

  }
  

const handleShowAll = ()=>{

    showAll?setShowAll(false):setShowAll(true)

}

const searchMaterialInventario = async () => {

  try{

  const res = await searchByInternCode(Number(codigoInterno))
console.log(res)


setOnlyOneItem(res[res.length-1])

setInventarios(res)

}
catch(e){

  console.log(e)
}
};


    return(
        <>

      <h1  className="text-center mt-14 text-2xl">Gestão de Inventário</h1>
   
      <div className=" text-center mt-11" >
      

      <Input

          value={codigoInterno}
          className='w-[120px] max-sm:mx-auto border-1 border-black rounded-md shadow-sm shadow-black mx-auto'
          onValueChange={setCodigoInterno}
          label="Código Interno"
          autoFocus
    
        />


      </div>
    
        <div >
          <TableContainer component={Paper}>
            <Table
             className="mt-24"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" className="text-base"
                  >Cod.Interno</TableCell>
                  <TableCell align="center" className="text-base"
                  >Cod.Fabricante</TableCell>
                  <TableCell align="center" className="text-base"
                  >Descrição</TableCell>
                  <TableCell align="center" size="small" className="text-base"
                  >Estoque</TableCell>
                  <TableCell align="center" size="small" className="text-base"
                  >Movimentação</TableCell>
                  <TableCell align="center" size="small" className="text-base"
                  >Saldo Final</TableCell>
                  <TableCell align="center" className="text-base"
                  >Razão</TableCell>
                  <TableCell align="center" className="text-base"
                  >Data </TableCell>
                  {/* <TableCell align="center"
                  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>Usuario</TableCell> */}
                  <TableCell align="center" size="small" className="text-base"
                  > 
                  
                {showAll? <Button style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll()}><VisibilityTwoToneIcon/></Button>:
                <Button 
              
                style={{borderWidth:0,backgroundColor:"white",marginTop:"10px"}}  onClick={x=>handleShowAll()}><VisibilityOffTwoToneIcon/></Button>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { showAll && inventarios.map((row :Inventario) => (
                  <TableRow
                    key={row.id}
                  
                  >
                
                    <TableCell align="center" size="medium"
                    >{row.material.id}</TableCell>
                    <TableCell align="center" size="medium"
                  >{row.material.codigoFabricante}</TableCell>
                    
                    <TableCell align="center" size="medium"
                   >{row.material.descricao}</TableCell>
                    <TableCell align="center" size="small"
                    >{row.estoque==null?"Ainda não registrado":row.estoque}</TableCell>
                    <TableCell align="center" size="small"
                    >{row.movimentacao==null?"Ainda não registrado":row.movimentacao+` ${row.material.unidade}`}</TableCell>
                    <TableCell align="center" size="small"
                  >{row.saldoFinal==null?"Ainda não registrado":row.saldoFinal +` ${row.material.unidade}`}</TableCell>
                    <TableCell align="center" 
                   >{row.razao}</TableCell>

                    <TableCell align="center" >
                      {dayjs(row.dataAlteracao).format(`[${row.movimentacao==null &&row.estoque==0?" Material Criado as " :"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                   
                    {/* <TableCell align="center" size ="small"  sx={{ borderWidth:2,fontSize:"16px",borderColor:"black"   }}>{row.responsavel}</TableCell> */}
                   

                    <TableCell align="center" size ="small" >

 {/* Caso o o item da linha seja o ultimo listado da sequencia de edições do inventário,então permitirá a edição,isso impede de editar estoque e edições passadas */}
                    {inventarios[inventarios.length-1].id==row.id && (

                    <Button  
      
                    onClick={(x) =>
                    handleChangePageUpdate(row.material.id)
                    }>
                    <EditTwoToneIcon />
                    </Button>
)}

                    </TableCell>
                    
                
                
                  </TableRow>
                  
                ))}
  {!showAll && inventarios.length &&  (
                  <TableRow
                    key={onlyOneItem.material.id}
                 
                  >
                
                <TableCell align="center" size="medium"
                >{onlyOneItem.material.id}</TableCell>
                    <TableCell align="center" size="medium"
                    >{onlyOneItem.material.codigoFabricante}</TableCell>
                    
                    <TableCell align="center" size="medium"
                    >{onlyOneItem.material.descricao}</TableCell>
                    <TableCell align="center" size="small"
                  >{onlyOneItem.estoque==null?"Ainda não registrado":onlyOneItem.estoque+ ` ${onlyOneItem.material.unidade}`} </TableCell>
                    <TableCell align="center" size="small"
                   >{onlyOneItem.movimentacao==null?"Ainda não registrado":onlyOneItem.movimentacao+` ${onlyOneItem.material.unidade}`}</TableCell>
                    <TableCell align="center" size="small"
                    >{onlyOneItem.saldoFinal==null?"Ainda não registrado":onlyOneItem.saldoFinal +` ${onlyOneItem.material.unidade}`}</TableCell>
                    <TableCell align="center" 
                   >{onlyOneItem.razao}</TableCell>
                    <TableCell align="center"
                   >
                      {dayjs(onlyOneItem.dataAlteracao).format(`[${onlyOneItem.movimentacao==null &&onlyOneItem.estoque==0?" Material Criado as " :"Inventário Editado as "}]DD/MM/YYYY [as] HH:mm:ss`)} 
                    </TableCell>
                 
                    <TableCell align="center" size ="small"
                    >{onlyOneItem.responsavel}</TableCell>
               
                    <Button
                                
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
    )
}