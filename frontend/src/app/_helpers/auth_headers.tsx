import {currentUser, getUserLocalStorage} from "@/app/services/Auth.services";

export function authHeader() {

    const user = currentUser

    console.log(user)
    if (user && user.token) 
    { 
        return { Authorization: `Bearer ${user.token}`,
                 'Content-Type': 'application/json' };

    } 
    else {
        return {};
    }
}