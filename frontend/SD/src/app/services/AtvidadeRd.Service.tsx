import { authHeader } from "../_helpers/auth_headers";

import { url } from "../api/webApiUrl";

import { IAtividadeRd } from "../interfaces/IAtividadeRd";

import axios from "axios";

export const getAllAtivdadesInRd = async (
  id: number | undefined
): Promise<IAtividadeRd[]> => {
  return await axios
    .get(`${url}/AtividadesRd/AtividadesInRd/${id}`, { headers: authHeader() })
    .then((r) => {
      return r.data;
    })
    .catch();
};

export const createAtividadeRd = async (model: IAtividadeRd) => {
  return await axios
    .post(`${url}/AtividadesRd`, model, { headers: authHeader() })
    .then((r) => {
      return r.data;
    })
    .catch();
};

export const updateAtividadeRd = async (model: IAtividadeRd) => {
  const AtividadeRd = {
    id: model.id,
    relatorioRdId: model.relatorioRdId,
    descricao: model.descricao,
    numeroAtividade: model.numeroAtividade,
    status: model.status,
    observacoes: model.observacoes,
    relatorioDiario: {},
  };
  
  return await axios
    .put(`${url}/AtividadesRd/${model.id}`, AtividadeRd, {
      headers: authHeader(),
    })
    .then((r) => {
      return r.status;
    })
    .catch();
};

export const deleteAtividadeRd = async (id: number) => {
  console.log(id);
  return await axios
    .delete(`${url}/AtividadesRd/${id}`, { headers: authHeader() })
    .then((r) => {
      return r.status;
    })
    .catch();
};
