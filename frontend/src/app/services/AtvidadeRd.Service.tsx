import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";

export const getAllAtivdadesInRd = async (id:number): Promise<IAtividadeRd[]> => {

    return await  axios.get(`${url}/AtividadesRd/AtividadesInRd/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


export const createAtividadeRd = async (model:IAtividadeRd)=>{

    return await axios
        .post(`${url}/AtividadesRd`, model,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const updateAtividadeRd = async (model:IAtividadeRd)=>{

    const AtividadeRd = {
        id:model.id,
        relatorioRdId:model.relatorioRdId,
        descricao: model.descricao,
        numeroAtividade: model.numeroAtividade,
        status:model.status,
        observacoes:model.observacoes,
        relatorioDiario:{}
    };
console.log(AtividadeRd)
   return await axios
        .put(`${url}/AtividadesRd/${model.id}`, AtividadeRd,{headers:authHeader()})
        .then((r) => {
            return r.status

        })
        .catch();
}
export const deleteAtividadeRd = async (id:number)=>{


    await axios
        .delete(`${url}/AtividadesRd/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.status

        })
        .catch();
}

















