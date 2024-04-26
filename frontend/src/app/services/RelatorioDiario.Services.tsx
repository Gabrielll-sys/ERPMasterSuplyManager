import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";



export const getRelatorioDiario = async (id:number) =>{


   return await axios
        .get(`${url}/RelatoriosDiarios/${id}`,{headers:authHeader()})
        .then((r) => {
            console.log(r.data)
            return r.data
        })
        .catch();
}



export const createRelatorioDiario = async (model:IRelatorioDiario)=>{

    return await axios
        .post(`${url}/RelatoriosDiarios`, model,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const updateRelatorioDiario = async (model:IRelatorioDiario)=>{


    await axios
        .put(`${url}/AtividadesRd/${model.id}`, model,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}
