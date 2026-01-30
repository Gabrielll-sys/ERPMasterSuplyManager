// Interface de imagem vinculada ao checklist de inspecao.
export interface IChecklistInspecaoImagem {
  id?: number;
  checklistInspecaoId?: number;
  imageUrl: string;
  imageKey: string;
  criadoEm?: string;
}
