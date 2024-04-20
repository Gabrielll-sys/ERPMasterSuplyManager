import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";

export const createAtividadeRd = async (model:IAtividadeRd)=>{
    const AtividadeRd = {
        descricao: model.descricao,
        relatorioRdId:model.relatorioRdId,
    };

    await axios
        .post(`${url}/AtividadesRd`, AtividadeRd,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const updateAtividadeRd = async (model:IAtividadeRd)=>{

    const AtividadeRd = {
        id:model.id,
        descricao: model.descricao,
        status:model.status,
        observacoes:model,
    };

    await axios
        .put(`${url}/AtividadesRd/${model.id}`, AtividadeRd,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


















