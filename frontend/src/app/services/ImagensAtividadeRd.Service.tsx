import axios from "axios";

import { url } from "../api/webApiUrl";

import { authHeader } from "../_helpers/auth_headers";

import { IImagemAtividadeRd } from "../interfaces/IImagemAtividadeRd";


export const addImagemAtividadeRd = async (model:IImagemAtividadeRd)=>{

    const imagemAtividade: IImagemAtividadeRd = {
        urlImagem: model.urlImagem,
        descricao: model.descricao,
        atividadeRdId: model.atividadeRdId
    };
    await axios
        .post(`${url}/ImagensAtividadeRd`, imagemAtividade,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const updateImagemAtividadeRd = async (model:IImagemAtividadeRd)=>{
    const imagemAtividade: IImagemAtividadeRd  = {
        id: model.id,
        descricao: model.descricao,
        atividadeRdId: model.atividadeRdId
    };
    await axios
        .put(`${url}/ImagensAtividadeRd/${model.id}`,imagemAtividade, {headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}
export const deleteImagemAtividadeRd = async (id:number)=>{

    await axios
        .delete(`${url}/ImagensAtividadeRd/${id}`, {headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}
