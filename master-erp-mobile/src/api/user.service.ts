import api from './client';

export interface ChangePasswordPayload {
    senhaAtual: string;
    novaSenha: string;
}

export const userService = {
    /**
     * Troca a senha do usuário autenticado
     */
    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
        await api.put('/Usuarios/change-password', payload);
    },
};
