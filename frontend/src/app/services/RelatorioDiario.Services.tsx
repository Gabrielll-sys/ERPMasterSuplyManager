import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {useRouter} from "next/navigation";


export const getAllRelatoriosDiarios = async () =>{


    return await axios
        .get(`${url}/RelatoriosDiarios`,{headers:authHeader()})
        .then((r) => {

            return r.data
        })
        .catch();
}
export const getRelatorioDiario = async (id:number) =>{


   return await axios
        .get(`${url}/RelatoriosDiarios/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


export const createRelatorioDiario = async ()=>{

    return await axios
        .post(`${url}/RelatoriosDiarios`,{headers:authHeader()})
        .then((r) => {
            console.log(r.data)
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
