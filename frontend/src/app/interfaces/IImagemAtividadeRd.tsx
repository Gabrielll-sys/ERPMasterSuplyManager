import {IAtividadeRd} from "@/app/interfaces/IAtividadeRd";

export interface IImagemAtividadeRd {
    id?: number;
    urlImagem?: string;
    descricao?: string;
    dataAdicao?: string;
    imageName?:string;
    atividadeRdId?: number;
    width?:number;
    height?:number;
    atividadeRd?: IAtividadeRd;

}