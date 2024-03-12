export interface IItemNotaFiscal {
id:number,
valorUnitario:number,
aliquotaICMS:number,
aliquotaIPI:number,
quantidade:number,
materialId:number,
notaFiscalId:number,
material:{
    id:string | number,
    categoria?: string
    codigoFabricante?: string
    codigoInterno?:number
    corrente?:string,
    dataEntradaNF? : any,
    descricao?: string,
    localizacao?: string,
    marca?: string,
    markup?: number ,
    precoCusto: number,
    precoVenda?: number,
    tensao?: string,
    unidade?: string
}
 notaFiscal:{
    id?:number,
    numeroNF?:string,
    frete?:number,
    baseCalculoICMS?:number,
    valorICMS?:number,
    CFOP?:string,
    dataEmissaoNF?:any,
    }

}