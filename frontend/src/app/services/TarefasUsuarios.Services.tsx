import { fetcher, poster, putter, deleter } from "../lib/api";
import { url } from "../api/webApiUrl";
import { ITarefaUsuario } from "../interfaces/ITarefaUsuario";

export const getAllAtivdadesInRd = async (): Promise<ITarefaUsuario[]> => {
  return fetcher<ITarefaUsuario[]>(`${url}/TarefasUsuarios`);
}

export const getUserTasksByDate = async (date: string): Promise<ITarefaUsuario[]> => {
  return fetcher<ITarefaUsuario[]>(`${url}/TarefasUsuarios/tasks-user-by-date?date=${date}`);
}

export const createTarefaUsuario = async (model: ITarefaUsuario) => {
  await poster(`${url}/TarefasUsuarios`, model);
  return 200; // Sucesso
}

export const updateTarefaUsuario = async (model: ITarefaUsuario) => {
  const TarefaUsuario: ITarefaUsuario = {
    id: model.id,
    nomeTarefa: model.nomeTarefa,
    prioridade: model.prioridade,
    usuarioId: model.usuarioId,
    isFinished: model.isFinished,
    usuario: {}
  };

  await putter(`${url}/TarefasUsuarios/${model.id}`, TarefaUsuario);
  return 200; // Sucesso
}

export const deleteTarefaUsuario = async (id: number) => {
  await deleter(`${url}/TarefasUsuarios/${id}`);
  return 200; // Sucesso
}

















