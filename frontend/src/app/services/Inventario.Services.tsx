import { fetcher, poster } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IInventario } from "../interfaces/IInventarios";

export const createInventario = async (idMaterial: number) => {
  const inventario = {
    materialId: idMaterial,
    estoque: 0,
    material: {},
  };

  return poster(`${url}/Inventarios`, inventario);
};

export const filterMateriais = async (filtro: any) => {
  return poster<IInventario[]>(`${url}/Inventarios/filter-material`, filtro);
}

/**
 * Busca o histórico de inventário pelo id do material
 */
export const searchByInternCode = async (id: number) => {
  try {
    return fetcher<IInventario[]>(`${url}/Inventarios/buscaCodigoInventario/${id}`);
  } catch (e) {
    // Error já é tratado pelo interceptor
    throw e;
  }
};

export const getLastRegisterInventario = async (id: number) => {
  try {
    return fetcher(`${url}/Inventarios/getLastRegister/${id}`);
  } catch (e) {
    // Error já é tratado pelo interceptor
    throw e;
  }
};
