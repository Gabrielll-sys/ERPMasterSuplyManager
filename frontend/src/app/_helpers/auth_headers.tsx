"use client"

import { getUserLocalStorage } from "../services/Auth.services";

export function authHeader() {

        const user = getUserLocalStorage()

        if (user && user.token) {
            return {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json'
        }
    }
    
    return {}; // Retorna um cabeçalho vazio se estamos no servidor ou se não há usuário
}