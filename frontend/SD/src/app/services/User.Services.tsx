import axios from "axios";
import { authHeader } from "../_helpers/auth_headers";
import { IUsuario } from "../interfaces/IUsuario";
import { url } from "../api/webApiUrl";

export const createUser = async (idMaterial:number) => {


    const inventario = {
        materialId: idMaterial,
        estoque:0,
        material: {},
    };

    await axios
        .post(`${url}/Inventarios`, inventario,{headers:authHeader()})
        .then((r) => {
            return r.data
        })
        .catch();

}
export const getUserById = async (id:any) => {


    return await axios.get(`${url}/Usuarios/${id}`,{headers:authHeader()}).then(r=>{
        return r.data
    })
}
export const updateInfosUser = async (model:IUsuario) => {
    try{

        return await axios.put(`${url}/Usuarios/${model.id}`,model,
            {
                headers: authHeader()
            }).then(
            response => {
                return response.status;
            },
            error =>{
                return  null;
            }
        );
    }
    catch(error){
        return null;
    }
}