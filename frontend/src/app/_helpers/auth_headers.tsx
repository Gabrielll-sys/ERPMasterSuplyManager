import { currentUser } from "../services/Auth.Services";

export function authHeader() {
    
    
    const user : any = currentUser

    if (user && user.token) 
    { 
        return { Authorization: `Bearer ${user.token}`,
                 'Content-Type': 'application/json' };

    } 
    else {
        return {};
    }
}