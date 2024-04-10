export interface IUsuario {
    Id?: number;
    Nome?: string;
    Email?: string;
    Senha?: string;
    Cargo: string;
    isActive: boolean;
    DataCadastro?: Date;
}