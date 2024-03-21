import axios from "axios";
import { url } from "../api/webApiUrl";

 export const searchByDescription = async (descricao:string) => {

     if(descricao.length){
 
        return await axios
       .get(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao.split("#").join(".")}`)
       .then( (r)=> {
   
        return r.data
        
       })

      
   
    }

}
 
    
export const searchByFabricanteCode = async (codigo:string) => {

 
       return await axios
      .get(`${url}/Inventarios/buscaCodigoFabricante?codigo=${codigo}`)
      .then( (r)=> {
       return r.data
       
      })

     
  

}
   
 