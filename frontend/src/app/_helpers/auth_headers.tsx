"use client"

export function authHeader() {
    if (typeof window !== 'undefined') { // Verifica se estamos no cliente
        const user = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (user && user.token) {
            return {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            };
        }
    }
    
    return {}; // Retorna um cabeçalho vazio se estamos no servidor ou se não há usuário
}