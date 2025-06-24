export interface IOrdemSeparacao
{
    id:number,
    descricao?: string,
    isAuthorized?: boolean,
    responsavel?: string,
    observacoes?: string,
    dataAutorizacao?: any,
    dataAbertura?: any,
    dataFechamento?: any,
    precoVendaTotalOs?: number
    precoCustoTotalOs?: number


}