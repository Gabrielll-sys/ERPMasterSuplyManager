import { fetcher, poster, putter } from "../lib/api";
import { IUsuario } from "../interfaces/IUsuario";
import { url } from "../api/webApiUrl";

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

  return poster(`${url}/Inventarios`, inventario);
}

export const getUserById = async (id: number) => {
  return fetcher<IUsuario>(`${url}/Usuarios/${id}`);
}

export const updateInfosUser = async (model: IUsuario) => {
  try {
    await putter(`${url}/Usuarios/${model.id}`, model);
    return 200; // Sucesso
  } catch (error) {
    return null;
  }
}