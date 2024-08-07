export interface IItem {

    id:number,
    quantidade:number,
    responsavelAdicao:string,
    responsavelMudanca:string,
    dataAdicaoItem:any,
    material:{
        id:number,
        categoria: string
        codigoFabricante: string
        codigoInterno:number
        corrente:string,
        dataEntradaNF : any,
        descricao: string,
        localizacao: string,
        marca: number,
        markup: number ,
        precoCusto: number,
        precoVenda: number,
        tensao: string,
        unidade: string
    }



}