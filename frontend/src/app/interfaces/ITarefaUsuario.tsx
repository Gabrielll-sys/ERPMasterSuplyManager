import { IUsuario } from "@/app/interfaces";

export interface ITarefaUsuario {
    id?: number;
    nomeTarefa?: string;
    prioridade?: string;
    isFinished?: boolean;
    usuarioId?: number;
    usuario: IUsuario;
  }