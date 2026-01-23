"use client";
import api, { fetcher, poster, putter, deleter } from '../lib/api';
import { url } from '../api/webApiUrl';
import { IApr } from '../interfaces/IApr';

export const getAllAprs = async () => {
  return fetcher<IApr[]>(`${url}/Aprs`);
};

export const getAprById = async (id: number) => {
  return fetcher<IApr>(`${url}/Aprs/${id}`);
};

export const createApr = async (model: IApr) => {
  return poster<IApr>(`${url}/Aprs`, model);
};

export const updateApr = async (model: IApr) => {
  if (!model.id) throw new Error('ID da APR é obrigatório para atualizar.');
  return putter<IApr>(`${url}/Aprs/${model.id}`, model);
};

export const deleteApr = async (id: number) => {
  return deleter<void>(`${url}/Aprs/${id}`);
};

// Faz o download do PDF da APR como blob para uso no front-end.
export const downloadAprPdf = async (id: number) => {
  const response = await api.get(`${url}/Aprs/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data as Blob;
};
