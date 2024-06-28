export interface IRelatorioDiario {

    id?: number;
    responsavelAbertura?: string;
    responsavelFechamento?: string;
    empresa?: string;
    contato?: string;
    cnpj?:string;
    endereco?:string;
    telefone?:string;
    horarioAbertura?: Date;
    horarioFechamento?:Date;
    dataRD?: Date;
    isFinished?: boolean;
}