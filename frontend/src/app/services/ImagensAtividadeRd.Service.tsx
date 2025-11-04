import { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { IImagemAtividadeRd } from "../interfaces/IImagemAtividadeRd";
import { deleteAllImagesFromAtividadeFromAzure } from "./Images.Services";

export const getAllImagensInAtividade = async (id: number | undefined) => {
  return fetcher<IImagemAtividadeRd[]>(`${url}/ImagensAtividadesRd/getImagesInAtividade/${id}`);
}

export const addImagemAtividadeRd = async (model: IImagemAtividadeRd) => {
  const imagemAtividade: IImagemAtividadeRd = {
    urlImagem: model.urlImagem,
    descricao: model.descricao,
    atividadeRdId: model.atividadeRdId,
    atividadeRd: {
      relatorioDiario: {}
    },
  };

  await poster(`${url}/ImagensAtividadesRd`, imagemAtividade);
  return 200; // Sucesso
}

export const updateImagemAtividadeRd = async (model: IImagemAtividadeRd) => {
  const imagemAtividade: IImagemAtividadeRd = {
    id: model.id,
    descricao: model.descricao,
    atividadeRdId: model.atividadeRdId
  };

  await putter(`${url}/ImagensAtividadesRd/${model.id}`, imagemAtividade);
}

export const deleteImagemAtividadeRd = async (id: number | undefined) => {
  await deleter(`${url}/ImagensAtividadesRd/${id}`);
}
