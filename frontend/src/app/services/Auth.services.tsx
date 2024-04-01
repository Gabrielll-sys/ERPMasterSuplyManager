import axios from 'axios';
import { url } from 'inspector';
export const register = async (param:any) => {
  try{
    return await axios.post(`${url}/Usuarios`, param).then( 
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

const gravaUserLogadoLocalStorage = async (token:any, userId:number) => {  
  var usuario = {
    token: token, userId 
  }  
  localStorage.setItem('CD_Usuario', JSON.stringify(usuario));   
} 

export const getUserLocalStorage = async () => {      
    
  var strJSON= JSON.parse(localStorage.getItem('CD_Usuario'));

  if(strJSON != null)
  {      
      return { userId: strJSON["userId"], token: strJSON["token"] };
  }   
} 

export const authenticate = async (param:any) => {   
  return await axios.post(`${url}/Usuarios/login`, param)
  .then(response => {
    if (response && response.data) {
      gravaUserLogadoLocalStorage(response.data.jwtToken, param.id);
      return response.data;
    } else {
      return null;
    }
  })
  .catch(error => {        
    return null;
  });

}

export const getUserById = async (param:any) => {
  try{
    const userLogado = await getUserLocalStorage();
    
    return await axios.get(`${url}/Usuarios/${param}`, 
    { 
      headers: {
        'Authorization': `Bearer ${userLogado?.token}`,
        'Content-Type': 'application/json'
      }
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