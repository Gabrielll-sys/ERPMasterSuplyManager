using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

/// <summary>
/// Representa uma solicitação de serviço no sistema.
/// </summary>
[Table("SolicitacoesServico")]
public class SolicitacaoServico
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Descrição do serviço solicitado
    /// </summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Nome do cliente que solicita o serviço
    /// </summary>
    public string? NomeCliente { get; set; }

    /// <summary>
    /// Data e hora em que a solicitação foi criada
    /// </summary>
    public DateTime DataSolicitacao { get; set; }

    /// <summary>
    /// Nome do usuário que aceitou a solicitação
    /// </summary>
    public string? UsuarioAceite { get; set; }

    /// <summary>
    /// Data e hora em que a solicitação foi aceita
    /// </summary>
    public DateTime? DataAceite { get; set; }

    /// <summary>
    /// Data e hora em que o serviço foi concluído
    /// </summary>
    public DateTime? DataConclusao { get; set; }

    /// <summary>
    /// Lista de usuários responsáveis pela conclusão (armazenado como JSON)
    /// </summary>
    public string? UsuariosConclusao { get; set; }

    /// <summary>
    /// Usuários designados para realizar o serviço (escolhidos na criação)
    /// </summary>
    public string? UsuariosDesignados { get; set; }

    /// <summary>
    /// Status da solicitação: 0 = Pendente, 1 = Aceita, 2 = Concluída
    /// </summary>
    public int Status { get; set; } = 0;

    // Métodos auxiliares

    /// <summary>
    /// Aceita a solicitação registrando o usuário e a data/hora
    /// </summary>
    public void Aceitar(string nomeUsuario)
    {
        UsuarioAceite = nomeUsuario;
        DataAceite = DateTime.UtcNow.AddHours(-3); // Horário de Brasília
        Status = 1;
    }

    /// <summary>
    /// Conclui a solicitação registrando os usuários responsáveis e a data/hora
    /// </summary>
    public void Concluir(List<string> usuarios)
    {
        UsuariosConclusao = System.Text.Json.JsonSerializer.Serialize(usuarios);
        DataConclusao = DateTime.UtcNow.AddHours(-3); // Horário de Brasília
        Status = 2;
    }
}
