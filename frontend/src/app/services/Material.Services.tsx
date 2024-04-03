import axios from "axios";
import { url } from "../api/webApiUrl";
import { authHeader } from "../_helpers/auth_headers";
import IMaterial from "../interfaces/IMaterial";
import { createInventario } from "./Inventario.Services";



   export const getMaterialById = async(id:number)=>{

      return await axios.get(`${url}/Materiais/${id}`,{headers:authHeader()}).then(r=>{

         return r.data
 
  })
   }


   export const searchByDescription = async (descricao:string) => {

     if(descricao.length){

        return await axios
       .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao.split("#").join(".")}`,{headers:authHeader()})
       .then( (r)=> {
   
        return r.data
        
       })

    }

   }
 
    
    export const searchByFabricanteCode = async (codigo:string) => {

 
       return await axios
        .get(`${url}/Inventarios/buscaCodigoFabricante?codigo=${codigo}`,{headers:authHeader()})
        .then( (r)=> {
         return r.data
       
      })

     

   }
   
   export const createMaterial = async(model:IMaterial)=>
   {
// o regex esta para remover os espaços extras entre palavras,deixando somente um espaço entre palavras
 
   const material = {
  codigoFabricante: model.codigoFabricante.trim().replace(/\s\s+/g, " "),
  descricao: model.descricao.trim().replace(/\s\s+/g, " "),
  categoria: "",
  marca: model.marca.trim().replace(/\s\s+/g, " "),
  corrente: model.corrente.trim().replace(/\s\s+/g, " "),
  unidade: model.unidade.trim().replace(/\s\s+/g, " "),
  tensao: model.tensao.trim().replace(/\s\s+/g, " "),
  localizacao: model.localizacao.trim().replace(/\s\s+/g, " "),
  dataEntradaNF: model.dataEntradaNF,
  precoCusto:model.precoCusto,
  markup:model.markup == ""?null:model.markup,
  
};

const materialCriado = await axios
  .post(`${url}/Materiais`, material)
  .then((r) => {
    createInventario(r.data.id)
    return r.data
  })
  .catch((e) => {
    console.log(e.response.data.message);
  
    
  });

  return materialCriado

   }


   export const updateMaterial = async(material:IMaterial,idMaterial:number)=>
   {

      return  await axios.put(`${url}/Materiais/${idMaterial}`,material)
      .then(r=>{
         return r.data
      })



   }