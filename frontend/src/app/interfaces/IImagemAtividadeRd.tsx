import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";

export interface IImagemAtividadeRd {
    id?: number;
    urlImagem?: string;
    descricao?: string;
    dataAdicao?: string;
    atividadeRdId?: number;
    atividadeRd?: IAtividadeRd;
}