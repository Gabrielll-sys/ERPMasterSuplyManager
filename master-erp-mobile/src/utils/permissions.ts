/**
 * Utilitários para verificação de permissões baseadas em roles
 */

export const ROLES = {
    ADMINISTRADOR: 'Administrador',
    DIRETOR: 'Diretor',
    SUPORTE_TECNICO: 'SuporteTecnico',
    SUPORTE_TECNICO_ACENTO: 'SuporteTécnico',
} as const;

/**
 * Verifica se o usuário pode editar solicitações
 */
export const canEditSolicitacao = (userRole?: string): boolean => {
    if (!userRole) return false;

    const allowedRoles: string[] = [
        ROLES.ADMINISTRADOR,
        ROLES.DIRETOR,
        ROLES.SUPORTE_TECNICO,
        ROLES.SUPORTE_TECNICO_ACENTO,
    ];

    return allowedRoles.includes(userRole);
};

/**
 * Verifica se o usuário pode excluir solicitações
 */
export const canDeleteSolicitacao = (userRole?: string): boolean => {
    return canEditSolicitacao(userRole);
};

/**
 * Verifica se o usuário é administrador
 */
export const isAdmin = (userRole?: string): boolean => {
    return userRole === ROLES.ADMINISTRADOR;
};

/**
 * Verifica se o usuário é diretor
 */
export const isDiretor = (userRole?: string): boolean => {
    return userRole === ROLES.DIRETOR;
};
