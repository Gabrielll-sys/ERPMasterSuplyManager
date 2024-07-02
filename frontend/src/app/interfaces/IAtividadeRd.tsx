import {IRelatorioDiario} from "@/app/interfaces/IRelatorioDiario";
import { IImagemAtividadeRd } from "./IImagemAtividadeRd";

export interface IAtividadeRd {
    id?: number;
    descricao?: string;
    status?: string;
    observacoes?: string;
    numeroAtividade?:number,
    relatorioRdId?: number;
    dataAtividade?:Date;
    relatorioDiario?: IRelatorioDiario;
    imagensAtividades?:IImagemAtividadeRd[];

}