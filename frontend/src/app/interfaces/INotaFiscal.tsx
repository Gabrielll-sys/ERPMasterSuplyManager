export interface INotaFiscal {
  id: number;
  numeroNF: string;
  frete: number;
  baseCalculoICMS: number;
  valorICMS: number;
  CFOP: string;
  dataEmissaoNF: string;
}