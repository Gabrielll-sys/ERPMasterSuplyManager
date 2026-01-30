/**
 * Interface da APR - Análise Preliminar de Riscos.
 * Suporta dois tipos: "completa" e "rapida".
 */
export interface IApr {
  id?: number;
  /** Título para identificação rápida */
  titulo?: string;
  /** Data de realização */
  data?: string;
  /** Tipo: "completa" (padrão) ou "rapida" */
  tipo?: "completa" | "rapida";
  /** Conteúdo do formulário em JSON */
  conteudoJson: string;
  criadoEm?: string;
  atualizadoEm?: string;
  /** Indica se a APR está fechada/concluída */
  fechada?: boolean;
  /** Nome do usuário que fechou a APR */
  fechadaPor?: string;
  /** Data em que a APR foi fechada */
  fechadaEm?: string;
}
