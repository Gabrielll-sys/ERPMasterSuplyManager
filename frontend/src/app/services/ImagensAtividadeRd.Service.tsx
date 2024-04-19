import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";


export const addImagemAtividadeRd = async (model:any)=>{

    return await axios.post(`${url}/ImagensAtividadeRd`,model,
        {headers:authHeader()}).then(r=>{

        return r.data

}