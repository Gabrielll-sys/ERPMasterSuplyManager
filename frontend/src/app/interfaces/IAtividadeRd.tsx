import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";

export interface IAtividadeRd {
    id?: number;
    descricao?: string;
    status?: string;
    observacoes?: string;
    numeroAtividade:number,
    relatorioRdId?: number;
    relatorioDiario?: IRelatorioDiario;
}