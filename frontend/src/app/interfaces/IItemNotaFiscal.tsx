import { IMaterial, INotaFiscal } from "@/app/interfaces";

export interface IItemNotaFiscal {
  id: number;
  valorUnitario: number;
  aliquotaICMS: number;
  aliquotaIPI: number;
  quantidade: number;
  materialId: number;
  notaFiscalId: number;
  material: IMaterial;
  notaFiscal: INotaFiscal;
}