"use client";
import api, { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IChecklistInspecao } from "../interfaces/IChecklistInspecao";

// Busca historico de checklists.
export const getAllChecklistsInspecao = async () => {
  return fetcher<IChecklistInspecao[]>(`${url}/ChecklistsInspecao`);
};

// Busca checklist por id.
export const getChecklistInspecaoById = async (id: number) => {
  return fetcher<IChecklistInspecao>(`${url}/ChecklistsInspecao/${id}`);
};

// Cria checklist.
export const createChecklistInspecao = async (model: IChecklistInspecao) => {
  return poster<IChecklistInspecao>(`${url}/ChecklistsInspecao`, model);
};

// Atualiza checklist.
export const updateChecklistInspecao = async (model: IChecklistInspecao) => {
  if (!model.id) throw new Error("ID do checklist e obrigatorio para atualizar.");
  return putter<IChecklistInspecao>(`${url}/ChecklistsInspecao/${model.id}`, model);
};

// Exclui checklist.
export const deleteChecklistInspecao = async (id: number) => {
  return deleter<void>(`${url}/ChecklistsInspecao/${id}`);
};

// Faz download do PDF.
export const downloadChecklistInspecaoPdf = async (id: number) => {
  const response = await api.get(`${url}/ChecklistsInspecao/${id}/pdf`, {
    responseType: "blob",
  });
  return response.data as Blob;
};
