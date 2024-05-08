
import axios, {AxiosResponse} from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import { IOrcamento } from "../interfaces/IOrcamento";

    export const getOrcamentoById = async(id:number)=>{


    return await axios.get(`${url}/Orcamentos/${id}`,{headers:authHeader()}).then((r:AxiosResponse)=>{
        return r.data
    }).catch(e=>console.log(e))

    }

    export const getAllOrcamentos = async()=>{


    return await axios.get(`${url}/Orcamentos`,{headers:authHeader()}).then((r:AxiosResponse)=>{
        return r.data
      }).catch(e=>console.log(e))
    
    }
    
    export const createOrcamento = async(model:IOrcamento)=>{


        return await axios.post(`${url}/Orcamentos`,model,{headers:authHeader()}).then((r:AxiosResponse)=>{
            return r.data
          }).catch(e=>console.log(e))
        
        }

        export const updateOrcamento = async(model:IOrcamento)=>{


            return await axios.put(`${url}/Orcamentos/${model.id}`,model,{headers:authHeader()}).then((r:AxiosResponse)=>{
                return r.data
              }).catch(e=>console.log(e))
            
            }

