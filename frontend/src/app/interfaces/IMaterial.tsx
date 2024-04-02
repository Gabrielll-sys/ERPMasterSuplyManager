export default interface IMaterial {
id?:number,
categoria: string
codigoFabricante: string
corrente:string,
dataEntradaNF : Date,
descricao: string,
localizacao: string,
marca: string,
markup?: string| number | null ,
precoCusto?: number | string,
precoVenda?: number | string,
tensao: string,
unidade: string
}



