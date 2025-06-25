import { IMaterial, IOrcamento } from "@/app/interfaces";

 export interface IItemOrcamento {
    id: number;
    quantidadeMaterial: number;
    dataAdicaoItem: Date;
    precoItemOrcamento?: number;
    materialId: number;
    material?: IMaterial; 
    orcamentoId: number;
    orcamento?: IOrcamento;
    precoVenda?: number;
  }