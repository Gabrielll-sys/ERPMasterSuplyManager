import IMaterial from "./IMaterial";
import { IOrcamento } from "./IOrcamento";

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