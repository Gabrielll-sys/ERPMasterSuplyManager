import axios from 'axios';
import { url } from '../api/webApiUrl';
import { authHeader } from '../_helpers/auth_headers';


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



const gravaUserLogadoLocalStorage = async (token:any, userId:number,name:string) => {  
 
  var usuario = {
    token: token,
    userId:userId,
    nome:name
  }  
  localStorage.setItem('currentUser', JSON.stringify(usuario));   
} 



export const getUserLocalStorage =  () => {      
    
  const currentUser = localStorage.getItem('currentUser');

  const currentUserSubject = JSON.parse(currentUser || '{}');

  if(currentUser != null)
  {      
      return currentUserSubject
  }   
} 



export const authenticate = async (param:any) => {   


    return await axios.post(`${url}/Usuarios/authenticate`, param)
  .then(response => {

    if (response && response.data) {

      gravaUserLogadoLocalStorage(response.data.jwtToken, response.data.userId,response.data.userName);

      return response.data;
    }
     else {
      return null;
    }
  })
  .catch(error => {        
    return null;
  });

}



export const getUserById = async (param:any) => {
  try{
    const userLogado =  getUserLocalStorage();
    
    return await axios.get(`${url}/Usuarios/${param}`, 
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
  }catch(error){    
    return null;
  }
}

export const logoutUser = ()=>{

  localStorage.removeItem("currentUser")

}

export const currentUser = getUserLocalStorage();



