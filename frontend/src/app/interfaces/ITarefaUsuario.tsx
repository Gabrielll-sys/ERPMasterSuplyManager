import { IUsuario } from "./IUsuario";

export interface ITarefaUsuario {
    id?: number;
    nomeTarefa?: string;
    prioridade?: string;
    status?: boolean;
    usuarioId?: number;
    usuario: IUsuario;
  }