// Interface basica do checklist de inspecao.
export interface IChecklistInspecao {
  id?: number;
  conteudoJson: string;
  criadoEm?: string;
  atualizadoEm?: string | null;
}
