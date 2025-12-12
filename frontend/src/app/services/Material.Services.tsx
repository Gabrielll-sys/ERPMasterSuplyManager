import { fetcher, poster, putter } from "../lib/api";
import { url } from "../api/webApiUrl";
import IMaterial from "../interfaces/IMaterial";
import { createInventario } from "./Inventario.Services";



export const getMaterialById = async (id: number) => {
  return fetcher<IMaterial>(`${url}/Materiais/${id}`);
}

export const searchByDescription = async (descricao: string) => {
  if (descricao.length) {
    return fetcher<any[]>(`${url}/Inventarios/buscaDescricaoInventario?descricao=${descricao.split("#").join(".")}`);
  }
}
 
    
export const searchByFabricanteCode = async (codigo: string) => {
  return fetcher<any[]>(`${url}/Inventarios/buscaCodigoFabricante?codigo=${codigo}`);
}
   
export const createMaterial = async (model: IMaterial) => {
  // O regex está para remover os espaços extras entre palavras, deixando somente um espaço entre palavras
  const material = {
    codigoInterno: "",
    codigoFabricante: model.codigoFabricante.trim().replace(/\s\s+/g, " "),
    descricao: model.descricao.trim().replace(/\s\s+/g, " "),
    categoria: "",
    marca: model.marca.trim().replace(/\s\s+/g, " "),
    corrente: model.corrente.trim().replace(/\s\s+/g, " "),
    unidade: model.unidade.trim().replace(/\s\s+/g, " "),
    tensao: model.tensao.trim().replace(/\s\s+/g, " "),
    localizacao: model.localizacao.trim().replace(/\s\s+/g, " "),
    dataEntradaNF: null,
    precoCusto: model.precoCusto,
    markup: model.markup == "" ? null : model.markup,
  };

  try {
    const data = await poster<{ id: number }>(`${url}/Materiais`, material);
    const res = await createInventario(data.id);
    return res;
  } catch (error) {
    // Error já é tratado pelo interceptor do API helper
    throw error;
  }
}


export const updateMaterial = async (material: IMaterial) => {
  await putter(`${url}/Materiais/${material.id}`, material);
  return 200; // Se chegou aqui, foi sucesso
}