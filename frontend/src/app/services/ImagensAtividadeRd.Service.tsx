import axios from "axios";

import { url } from "../api/webApiUrl";

import { authHeader } from "../_helpers/auth_headers";

import { IImagemAtividadeRd } from "../interfaces/IImagemAtividadeRd";
import { deleteAllImagesFromAtividadeFromAzure } from "./Images.Services";



export const getAllImagensInAtividade = async(id:number | undefined) =>{

   return await axios.get(`${url}/ImagensAtividadesRd/getImagesInAtividade/${id}`)
            .then((r)=>{
            return r.data

            })
            .catch();
}

export const addImagemAtividadeRd = async (model:IImagemAtividadeRd)=>{

    const imagemAtividade: IImagemAtividadeRd = {
        urlImagem: model.urlImagem,
        descricao: model.descricao,
        atividadeRdId: model.atividadeRdId,
        atividadeRd:{
            relatorioDiario:{}
        },
    };

    console.log(imagemAtividade)
   return  await axios
        .post(`${url}/ImagensAtividadesRd`, imagemAtividade,{headers:authHeader()})
        .then((r) => {
            return r.status
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
        .put(`${url}/ImagensAtividadesRd/${model.id}`,imagemAtividade, {headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}
export const deleteImagemAtividadeRd = async (id:number| undefined)=>{
    console.log(id)
    await axios
        .delete(`${url}/ImagensAtividadesRd/${id}`, {headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}
