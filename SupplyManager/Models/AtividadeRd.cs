using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models;

public class AtividadeRd
{
    [Key]
    public int? Id { get; set; }

    public string? Descricao { get; set; }

    //Concluida,Em Andamento e Não Iniciada
    public string? Status  { get; set; }
    
    public string? Observacoes { get; set; }

    //Para não precisar criar outra tabela intermediaria intermediaria de fotos,todas as urls estarao em uma string,ficando divididas por
    public string? UrlsFotos { get; set; }
    
    
    
}