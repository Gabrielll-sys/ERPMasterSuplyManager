import axios from "axios";
import { url } from "../api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";




export const createInventario = async (idMaterial:number) => {
    
    
    const inventario = {
      materialId: idMaterial,
      estoque:0,
      material: {},
    };
   
      await axios
      .post(`${url}/Inventarios`, inventario,{headers:authHeader()})
      .then((r) => {
        return r.data
      })
      .catch();
  
  
    }

//Busca o histórico de inventário pelo id do material
 export const searchByInternCode = async (id:number) => {

    try{

        return await axios
            .get(`${url}/Inventarios/buscaCodigoInventario/${id}`,{headers:authHeader()})
            .then( (r)=> {

                return r.data
            })
            .catch();

    }
    catch(e){

        console.log(e)
    }
};