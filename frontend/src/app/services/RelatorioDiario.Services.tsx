import { fetcher, poster, putter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IRelatorioDiario } from "../interfaces/IRelatorioDiario";

export const getAllRelatoriosDiarios = async () => {
  console.log(url);
  return fetcher<IRelatorioDiario[]>(`${url}/RelatoriosDiarios`);
}

export const getEmpresaRelatorioDiario = async (cliente: string) => {
  return fetcher<IRelatorioDiario>(`${url}/RelatoriosDiarios/buscaClienteEmpresa?cliente=${cliente}`);
}

export const getRelatorioDiarioById = async (id: number) => {
  return fetcher<IRelatorioDiario>(`${url}/RelatoriosDiarios/${id}`);
}

export const createRelatorioDiario = async () => {
  try {
    const data = await poster<IRelatorioDiario>(`${url}/RelatoriosDiarios`, null);
    return data;
  } catch (error) {
    // Error já é tratado pelo interceptor
    throw error;
  }
};

export const updateRelatorioDiario = async (model: IRelatorioDiario): Promise<number> => {
  await putter(`${url}/RelatoriosDiarios/${model.id}`, model);
  return 200; // Sucesso
}

export const updateFinishRelatorioDiario = async (id: number): Promise<number> => {
  await putter(`${url}/RelatoriosDiarios/finishRd/${id}`, null);
  return 200; // Sucesso
}