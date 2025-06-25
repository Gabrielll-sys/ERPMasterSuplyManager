import { IMaterial } from "@/app/interfaces";

export interface IItem {
  id: number;
  quantidade: number;
  responsavelAdicao: string;
  materialId: number;
  responsavelMudanca: string;
  dataAdicaoItem: string;
  descricaoNaoCadastrado: string;
  material: IMaterial;
}