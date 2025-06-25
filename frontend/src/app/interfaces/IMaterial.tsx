export interface IMaterial {
  id?: number;
  categoria: string;
  codigoFabricante: string;
  codigoInterno?: number;
  corrente: string;
  dataEntradaNF?: Date;
  descricao: string;
  localizacao: string;
  marca: string;
  markup?: number | string | null;
  precoCusto?: number ;
  precoVenda?: number ;
  tensao: string;
  unidade: string;
  urlImage?: string | null;
  quantidade?: number;
}