import {currentUser} from "@/app/services/Auth.services";

export function authHeader() {

    const user : any = currentUser
    console.log(user.token)
    if (user && user.token) 
    { 
        return { Authorization: `Bearer ${user.token}`,
                 'Content-Type': 'application/json' };

    } 
    else {
        return {};
    }
}