import axios from "axios";
import { url } from "../api/webApiUrl";




export const createInventario = async (idMaterial:number) => {
    
    
    const inventario = {
      materialId: idMaterial,
      estoque:0,
      material: {},
    };
   
      await axios
      .post(`${url}/Inventarios`, inventario)
      .then((r) => {
        return r.data
      })
      .catch();
  
  
    }