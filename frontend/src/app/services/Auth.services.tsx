"use client"
import { poster } from '../lib/api';
import { url } from '../api/webApiUrl';
import {jwtDecode} from "jwt-decode";


export const register = async (param: any) => {
  try {
    const response = await poster(`${url}/Usuarios`, param);
    return response;
  } catch (error) {
    return null;
  }
}

export const getUserLocalStorage = ()=>{
 
  if (typeof window !== 'undefined') { // Verifica se estamos no cliente
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    
    return user
}


}

const gravaUserLogadoLocalStorage = async (token:any, userId:number,name:string,role:string) => {
 
  var usuario = {
    token: token,
    userId:userId,
    userName:name,
    role:role,
  }  
  localStorage.setItem('currentUser', JSON.stringify(usuario));   
}
export const removeUserLocalStorage = async () => {

  localStorage.removeItem("currentUser")
    const res=localStorage.getItem("currentUser")

}




export const authenticate = async (param: any) => {
  try {
    const data = await poster<{
      jwtToken: string;
      userId: number;
      userName: string;
      role: string;
    }>(`${url}/Usuarios/authenticate`, param);

    if (data) {
      gravaUserLogadoLocalStorage(data.jwtToken, data.userId, data.userName, data.role);
      return 200;
    }

    return null;
  } catch (error) {
    return null;
  }
}
export const isTokenValid = (token:any) =>{
    if(token){
      
        const decodedToken = jwtDecode(token)

        const currentDate = Date.now()/1000

        return decodedToken.exp?  decodedToken.exp > currentDate  : false;
    }
}









