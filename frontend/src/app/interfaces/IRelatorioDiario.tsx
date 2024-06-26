export interface IRelatorioDiario {

    id?: number;
    responsavelAbertura?: string;
    responsavelFechamento?: string;
    empresa?: string;
    contato?: string;
    horarioAbertura?: Date;
    horarioFechamento?:Date;
    dataRD?: Date;
    isFinished?: boolean;
}