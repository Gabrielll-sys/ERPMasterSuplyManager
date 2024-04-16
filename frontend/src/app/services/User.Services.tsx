import axios from "axios";
import {url} from "@/app/api/webApiUrl";
import {authHeader} from "@/app/_helpers/auth_headers";
import {IUsuario} from "@/app/interfaces/IUsuario";

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
    try{

        return await axios.get(`${url}/Usuarios/${id}`,
            {
                headers: authHeader()

            }).then(
            response => {
                return response.data;
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
export const updateInfosUser = async (model:IUsuario) => {
    try{

        return await axios.put(`${url}/Usuarios/${model.id}`,model,
            {
                headers: authHeader()
            }).then(
            response => {
                return response.data;
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