using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

[Table("Aprs")]
/// <summary>
/// Modelo de APR - Análise Preliminar de Riscos.
/// Suporta dois tipos: "completa" (formulário completo) e "rapida" (formulário simplificado).
/// </summary>
public class Apr
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Título da APR para identificação rápida.
    /// </summary>
    public string? Titulo { get; set; }

    /// <summary>
    /// Data de criação/realização da APR.
    /// </summary>
    public DateTime Data { get; set; }

    /// <summary>
    /// Tipo da APR: "completa" ou "rapida".
    /// Default: "completa" para manter compatibilidade com APRs existentes.
    /// </summary>
    public string Tipo { get; set; } = "completa";

    /// <summary>
    /// Conteúdo do formulário serializado em JSON.
    /// Estrutura varia conforme o tipo da APR.
    /// </summary>
    public string ConteudoJson { get; set; } = "{}";

    /// <summary>
    /// Data de criação do registro.
    /// </summary>
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow.AddHours(-3);

    /// <summary>
    /// Data da última atualização (null se nunca atualizado).
    /// </summary>
    public DateTime? AtualizadoEm { get; set; }

    /// <summary>
    /// Indica se a APR está fechada/concluída.
    /// APRs fechadas só podem ser editadas por Diretor, Administrador ou SuporteTecnico.
    /// </summary>
    public bool Fechada { get; set; } = false;

    /// <summary>
    /// Nome do usuário que fechou a APR (null se não fechada).
    /// </summary>
    public string? FechadaPor { get; set; }

    /// <summary>
    /// Data em que a APR foi fechada (null se não fechada).
    /// </summary>
    public DateTime? FechadaEm { get; set; }
}
