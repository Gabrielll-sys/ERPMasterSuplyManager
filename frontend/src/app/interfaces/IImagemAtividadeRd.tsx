export interface IImagemAtividadeRd {
    id?: number;
    urlImagem?: string;
    descricao?: string;
    dataAdicao?: string;
    atividadeRdId?: number;
    atividadeRd?: AtividadeRd; // Supondo que AtividadeRd seja outra interface que você tenha definido
}