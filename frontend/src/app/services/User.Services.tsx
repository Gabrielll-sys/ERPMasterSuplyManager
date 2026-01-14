import { fetcher, poster, putter } from "../lib/api";
import { IUsuario } from "../interfaces/IUsuario";

/**
 * NOTA: Esta função cria um inventário, não um usuário.
 * Parece ser um erro de nomenclatura, mas mantida para compatibilidade.
 */
export const createUser = async (idMaterial: number) => {
  const inventario = {
    materialId: idMaterial,
    estoque: 0,
    material: {},
  };

  return poster(`/Inventarios`, inventario);
}

export const getUserById = async (id: number) => {
  return fetcher<IUsuario>(`/Usuarios/${id}`);
}

export const updateInfosUser = async (model: IUsuario) => {
  try {
    await putter(`/Usuarios/${model.id}`, model);
    return 200; // Sucesso
  } catch (error) {
    return null;
  }
}

export const getAllUsers = async (): Promise<IUsuario[]> => {
  return fetcher<IUsuario[]>(`/Usuarios`);
}

export const resetUserPassword = async (id: number): Promise<void> => {
  await putter(`/Usuarios/reset-password/${id}`, {});
}

/**
 * Torna um usuário inativo - ele não poderá mais fazer login
 */
export const turnUserInactive = async (id: number): Promise<void> => {
  await putter(`/Usuarios/turn-inactive/${id}`, {});
}

/**
 * Torna um usuário ativo novamente - ele poderá fazer login
 */
export const turnUserActive = async (id: number): Promise<void> => {
  await putter(`/Usuarios/turn-active/${id}`, {});
}