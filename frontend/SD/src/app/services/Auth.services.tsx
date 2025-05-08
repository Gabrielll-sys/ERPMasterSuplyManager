"use client"
import axios from 'axios';
import { url } from '../api/webApiUrl';
import { authHeader } from '../_helpers/auth_headers';
import {jwtDecode} from "jwt-decode";


export const register = async (param:any) => {
  try{
    return await axios.post(`${url}/Usuarios`, param,
    {headers:authHeader()})
    .then( 
      response => {
        return response;
      },
      error =>{
        return  null;
      }
    );
  }catch(error){
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




export const authenticate = async (param:any) => {   

    return await axios.post(`${url}/Usuarios/authenticate`, param)
  .then(response => {
    console.log(response)
    if (response.status == 200 && response.data) {

      gravaUserLogadoLocalStorage(response.data.jwtToken, response.data.userId,response.data.userName,response.data.role);

    }
    
    return response.status
  })
  .catch(error => {        
    return null;
  });

}
export const isTokenValid = (token:any) =>{
    if(token){
      
        const decodedToken = jwtDecode(token)

        const currentDate = Date.now()/1000

        return decodedToken.exp?  decodedToken.exp > currentDate  : false;
    }
}









