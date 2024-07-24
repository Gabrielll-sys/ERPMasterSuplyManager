import axios, {AxiosResponse} from "axios";
import { url } from "../api/webApiUrl";
import { authHeader } from "../_helpers/auth_headers";
import { IRelatorioDiario } from "../interfaces/IRelatorioDiario";




export const getAllRelatoriosDiarios = async ()  =>{

    return await axios
        .get(`${url}/RelatoriosDiarios`,{headers:authHeader()})
        .then((r) => {

            return r.data
        })
        .catch();
}

export const getEmpresaRelatorioDiario = async (cliente:string)  =>{


    return await axios
         .get(`${url}/RelatoriosDiarios/buscaClienteEmpresa?cliente=${cliente}`,{headers:authHeader()})
         .then((r) => {
             return r.data
         })
         .catch();
 }

export const getRelatorioDiarioById = async (id:number)  =>{


   return await axios
        .get(`${url}/RelatoriosDiarios/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


export const createRelatorioDiario = async () => {
   

         //@ts-ignore
    const user = JSON.parse(localStorage.getItem("currentUser"));
 
    try {
        console.log(authHeader())

        const response = await axios.post(
            `${url}/RelatoriosDiarios`,
            null, // Dados do corpo da requisição (se necessário)
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
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
        .put(`${url}/RelatoriosDiarios/finishRd/${id}`,null,{headers:authHeader()})
        .then((r) => {
            return r.status
        })
        .catch();
}