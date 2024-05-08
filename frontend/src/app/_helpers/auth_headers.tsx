

export function authHeader() {
    
    //@ts-ignore
    const user =  JSON.parse(localStorage.getItem("currentUser"));

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