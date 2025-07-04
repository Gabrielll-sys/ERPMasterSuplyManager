import axios from "axios";
import { url } from "../api/webApiUrl";
import { authHeader } from "../_helpers/auth_headers";
import { IInventario } from "../interfaces";

export const createInventario = async (idMaterial: number) => {
  const inventario = {
    materialId: idMaterial,
    estoque: 0,
    material: {},
  };

  return await axios
    .post(`${url}/Inventarios`, inventario, { headers: authHeader() })
    .then((r) => {
      
      return r.data;
    })
    .catch();
};

export const filterMateriais = async(filtro:any)=>{
 return await axios
  .post(`${url}/Inventarios/filter-material`,filtro)
  .then((r) : IInventario []=> {
    return r.data
  })
}

//Busca o histórico de inventário pelo id do material
export const searchByInternCode = async (id: number) => {
  try {
    return await axios
      .get(`${url}/Inventarios/buscaCodigoInventario/${id}`, {
        headers: authHeader(),
      })
      .then((r) => {
        return r.data;
      })
      .catch();
  } catch (e) {
    console.log(e);
  }
};
export const getLastRegisterInventario = async (id: number) => {
  try {
    return await axios
      .get(`${url}/Inventarios/getLastRegister/${id}`, {
        headers: authHeader(),
      })
      .then((r) => {
        return r.data;
      })
      .catch();
  } catch (e) {
    console.log(e);
  }
};
