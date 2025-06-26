export interface IOrdemSeparacao {
  id: number;
  descricao?: string;
  isAuthorized?: boolean;
  responsavel?: string;
  observacoes?: string;
  dataAutorizacao?: string;
  dataAbertura?: string;
  dataFechamento?: string;
  precoVendaTotalOs?: number;
  precoCustoTotalOs?: number;
  baixaSolicitada?: boolean;
}