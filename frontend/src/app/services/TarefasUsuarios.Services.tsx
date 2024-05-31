import { authHeader } from "../_helpers/auth_headers";

import { url } from "../api/webApiUrl";


import axios from "axios";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";

export const getAllAtivdadesInRd = async (): Promise<ITarefaUsuario[]> => {

    return await  axios.get(`${url}/TarefasUsuarios`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const getUserTasksByDate = async (date:string): Promise<ITarefaUsuario[]> => {

    return await  axios.get(`${url}/TarefasUsuarios/tasks-user-by-date?date=${date}`,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}


export const createTarefaUsuario = async (model:ITarefaUsuario)=>{

    return await axios
        .post(`${url}/TarefasUsuarios`, model,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();
}

export const updateTarefaUsuario = async (model:ITarefaUsuario)=>{

    const TarefaUsuario : ITarefaUsuario = {
        id:model.id,
        nomeTarefa:model.nomeTarefa,
        prioridade:model.prioridade,  
        usuarioId:0,
        usuario:{}
    };
console.log(TarefaUsuario)
   return await axios
        .put(`${url}/TarefasUsuarios/${model.id}`, TarefaUsuario,{headers:authHeader()})
        .then((r) => {
            return r.status

        })
        .catch();
}

export const deleteAtividadeRd = async (id:number)=>{

    return await axios
        .delete(`${url}/TarefasUsuarios/${id}`,{headers:authHeader()})
        .then((r) => {
            return r.status

        })
        .catch();
}

















