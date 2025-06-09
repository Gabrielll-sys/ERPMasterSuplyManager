export interface IOrdemServico 
{
    id:number,
    descricao?: string,
    isAuthorized?: boolean,
    responsavelAbertura?: string,
    responsaveisExecucao?: string,
    responsavelAutorizacao?: string,
    observacoes?: string,
    dataAutorizacao?: any,
    dataAbertura?: any,
    dataFechamento?: any,
    numeroOs?: string,
    precoVendaTotalOs?: number
    precoCustoTotalOs?: number




}