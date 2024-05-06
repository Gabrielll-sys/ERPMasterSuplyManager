import axios, {AxiosResponse} from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import {useRouter} from "next/navigation";
import {currentUser} from "@/app/services/Auth.services";


export const getAllRelatoriosDiarios = async ()  =>{


    return await axios
        .get(`${url}/RelatoriosDiarios`,{headers:authHeader()})
        .then((r) => {

            return r.data
        })
        .catch();
}
export const getRelatorioDiario = async (id:number)  =>{


   return await axios
        .get(`${url}/RelatoriosDiarios/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


export const createRelatorioDiario = async () => {
    try {
        const response = await axios.post(
            `${url}/RelatoriosDiarios`,
            null, // Dados do corpo da requisição (se necessário)
            {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Dados do relatório:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar relatório:', error);
        throw error; // Lança o erro para quem chamar essa função
    }
};

export const updateRelatorioDiario = async (model:IRelatorioDiario) : Promise<number>=>{

    console.log(model)
   return  await axios
        .put(`${url}/RelatoriosDiarios/${model.id}`, model,{headers:authHeader()})
        .then((r) => {
            return r.status
        })
        .catch();
}
export const updateFinishRelatorioDiario = async (id:number): Promise<number>=>{

    return await axios
        .put(`${url}/RelatoriosDiarios/finishRd/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.status
        })
        .catch();
}
