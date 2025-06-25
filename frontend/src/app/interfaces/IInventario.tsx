import { IMaterial } from "@/app/interfaces";

export interface IInventario {
  id: number;
  dataAlteracao: string;
  materialId: number;
  razao: string;
  estoque: number;
  movimentacao: number;
  saldoFinal: number;
  responsavel: string;
  material: IMaterial;
  quantidadeMaterial: number;
}