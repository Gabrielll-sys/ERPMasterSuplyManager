using System.Text.Json;
using Microsoft.Extensions.Logging;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MasterErp.Services.Pdf;

/// <summary>
/// Serviço responsável por gerar PDFs de checklists de inspeção.
/// Suporta os tipos: 'montagem', 'teste' e 'instalacao'.
/// </summary>
/// <remarks>
/// O JSON do checklist é armazenado no campo ConteudoJson da entidade ChecklistInspecao.
/// O campo 'tipo' no JSON determina qual layout será renderizado no PDF.
/// </remarks>
public class ChecklistInspecaoPdfService : IChecklistInspecaoPdfService, IScopedService
{
    private readonly ILogger<ChecklistInspecaoPdfService> _logger;

    public ChecklistInspecaoPdfService(ILogger<ChecklistInspecaoPdfService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Gera o PDF do checklist a partir do JSON salvo.
    /// </summary>
    /// <param name="checklist">Entidade do checklist com ConteudoJson preenchido</param>
    /// <returns>Array de bytes do PDF gerado</returns>
    public Task<byte[]> GenerateAsync(ChecklistInspecao checklist)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        var data = ChecklistInspecaoData.FromJson(checklist.ConteudoJson);
        try
        {
            var document = new ChecklistInspecaoPdfDocument(checklist, data);
            return Task.FromResult(document.GeneratePdf());
        }
        catch (Exception ex)
        {
            // Em caso de erro, gera um PDF simples de fallback
            _logger.LogError(ex, "Erro ao gerar PDF do checklist. Id={ChecklistId}", checklist.Id);
            var fallback = new ChecklistInspecaoFallbackPdf(checklist);
            return Task.FromResult(fallback.GeneratePdf());
        }
    }
}

/// <summary>
/// Documento QuestPDF para renderização do checklist com identidade visual profissional.
/// Usa a mesma paleta de cores do PDF de APR para manutenção da identidade visual.
/// </summary>
internal sealed class ChecklistInspecaoPdfDocument : IDocument
{
    // ========================================
    // PALETA DE CORES (mesma da APR)
    // Para alterar cores, modifique estas constantes
    // ========================================
    private static readonly string Primary = "#1a1a2e";   // Azul escuro - títulos e cabeçalhos
    private static readonly string Accent = "#f2c301";    // Amarelo - destaques e barras laterais
    private static readonly string Gray50 = "#f9fafb";    // Cinza claro - fundos
    private static readonly string Gray200 = "#e5e7eb";   // Cinza - bordas
    private static readonly string Gray400 = "#9ca3af";   // Cinza médio - textos secundários
    private static readonly string Gray500 = "#6b7280";   // Cinza - labels
    private static readonly string Gray700 = "#374151";   // Cinza escuro - textos
    private static readonly string Gray800 = "#1f2937";   // Quase preto - texto principal
    private static readonly string Success = "#22c55e";   // Verde - itens concluídos
    private static readonly string Pending = "#ef4444";   // Vermelho - itens pendentes

    private readonly ChecklistInspecao _checklist;
    private readonly ChecklistInspecaoData _data;

    public ChecklistInspecaoPdfDocument(ChecklistInspecao checklist, ChecklistInspecaoData data)
    {
        _checklist = checklist;
        _data = data;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(24);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontFamily("Helvetica").FontSize(8.5f).FontColor(Gray800));

            page.Content().Column(column =>
            {
                column.Item().Element(ComposeHeader);
                column.Item().PaddingTop(10).Element(ComposeContent);
            });

            page.Footer().Element(ComposeFooter);
        });
    }

    // Cabecalho com logo, titulo e numero do registro
    private void ComposeHeader(IContainer container)
    {
        container.BorderBottom(2).BorderColor(Accent).PaddingBottom(8).Row(row =>
        {
            row.ConstantItem(90).AlignLeft().Image(GetLogoBytes()).FitWidth();

            row.RelativeItem().AlignCenter().Column(col =>
            {
                col.Item().Text(GetHeaderTitle()).FontSize(18).FontColor(Primary).SemiBold();
                col.Item().Text(GetHeaderSubtitle()).FontSize(9).FontColor(Gray500);
            });

            row.ConstantItem(140).AlignRight().Column(col =>
            {
                col.Item().AlignRight().Text($"Registro #{_checklist.Id:0000}").FontSize(9).FontColor(Gray700).SemiBold();
                col.Item().AlignRight().Text($"Data: {_checklist.CriadoEm:dd/MM/yyyy}").FontSize(7).FontColor(Gray500);
            });
        });
    }

    private string GetHeaderTitle()
    {
        if (string.Equals(_data.Tipo, "montagem", StringComparison.OrdinalIgnoreCase))
            return "CHECKLIST DE MONTAGEM";
        if (string.Equals(_data.Tipo, "teste", StringComparison.OrdinalIgnoreCase))
            return "CHECKLIST DE TESTE";
        if (string.Equals(_data.Tipo, "instalacao", StringComparison.OrdinalIgnoreCase))
            return "CHECKLIST INSTALAÇÃO E TESTE";
        return "CHECKLIST DE INSPEÇÃO";
    }

    private string GetHeaderSubtitle()
    {
        if (string.Equals(_data.Tipo, "montagem", StringComparison.OrdinalIgnoreCase))
            return "Inspeção de Identificação, Funcionamento e Aspecto do Painel";
        if (string.Equals(_data.Tipo, "teste", StringComparison.OrdinalIgnoreCase))
            return "Validação de Instalação, Teste e Qualidade do Equipamento";
        if (string.Equals(_data.Tipo, "instalacao", StringComparison.OrdinalIgnoreCase))
            return "Validação de Instalação, Teste e Qualidade do Equipamento";
        return "Montagem/Teste e Instalação/Teste";
    }

    private void ComposeContent(IContainer container)
    {
        container.Column(col =>
        {
            if (string.Equals(_data.Tipo, "montagem", StringComparison.OrdinalIgnoreCase))
            {
                col.Item().Element(c => ComposeMontagemTeste(c, _data.MontagemTeste ?? new MontagemTesteData()));
                return;
            }

            if (string.Equals(_data.Tipo, "teste", StringComparison.OrdinalIgnoreCase))
            {
                col.Item().Element(c => ComposeInstalacaoTeste(c, _data.InstalacaoTeste ?? new InstalacaoTesteData()));
                return;
            }

            if (string.Equals(_data.Tipo, "instalacao", StringComparison.OrdinalIgnoreCase))
            {
                col.Item().Element(c => ComposeInstalacaoTeste(c, _data.InstalacaoTeste ?? new InstalacaoTesteData()));
                return;
            }

            // Fallback: renderiza ambas
            col.Item().Element(c => ComposeMontagemTeste(c, _data.MontagemTeste ?? new MontagemTesteData()));
            col.Item().PaddingTop(16).Element(c => ComposeInstalacaoTeste(c, _data.InstalacaoTeste ?? new InstalacaoTesteData()));
        });
    }

    private void ComposeMontagemTeste(IContainer container, MontagemTesteData data)
    {
        var safe = EnsureMontagem(data);
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "INFORMAÇÕES GERAIS"));
            col.Item().PaddingTop(6).Element(c => ComposeInfoGrid(c, new List<FieldPair>
            {
                new("Nome do Montador", safe.NomeMontador),
                new("Responsável pelo Teste", safe.ResponsavelTeste),
                new("Data", safe.Data),
                new("Ordem de Serviço", safe.Os),
                new("Nome do Equipamento", safe.NomeEquipamento),
            }));

            col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "IDENTIFICAÇÃO"));
            col.Item().PaddingTop(6).Element(c => ComposeChecklistTable(c, safe.Identificacao));

            col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "FUNCIONAMENTO DO PAINEL"));
            col.Item().PaddingTop(6).Element(c => ComposeChecklistTable(c, safe.FuncionamentoPainel));

            col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "ASPECTO DO PAINEL"));
            col.Item().PaddingTop(6).Element(c => ComposeChecklistTable(c, safe.AspectoPainel));

            // Resumo visual
            col.Item().PaddingTop(16).Element(c => ComposeStatusSummary(c, 
                safe.Identificacao.Concat(safe.FuncionamentoPainel).Concat(safe.AspectoPainel).ToList()));
        });
    }

    private void ComposeInstalacaoTeste(IContainer container, InstalacaoTesteData data)
    {
        var safe = EnsureInstalacao(data);
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "INFORMAÇÕES GERAIS"));
            col.Item().PaddingTop(6).Element(c => ComposeInfoGrid(c, new List<FieldPair>
            {
                new("Nome do Instalador", safe.NomeInstalador),
                new("Inspetor de Qualidade", safe.NomeInspetorQualidade),
                new("Data", safe.Data),
                new("Ordem de Serviço", safe.Os),
                new("Nome do Equipamento", safe.NomeEquipamento),
            }));

            col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "INSTALAÇÃO"));
            col.Item().PaddingTop(6).Element(c => ComposeChecklistTable(c, safe.Instalacao));

            col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "TESTES"));
            col.Item().PaddingTop(6).Element(c => ComposeChecklistTable(c, safe.Testes));

            // Observações (se houver)
            if (!string.IsNullOrWhiteSpace(safe.Observacoes))
            {
                col.Item().PaddingTop(12).Element(c => ComposeSectionTitle(c, "ANOMALIAS / PONTOS DE ATENÇÃO"));
                col.Item().PaddingTop(6).Background(Gray50).Border(1).BorderColor(Gray200).Padding(10)
                    .Text(safe.Observacoes).FontSize(9).FontColor(Gray800);
            }

            // Resumo visual
            col.Item().PaddingTop(16).Element(c => ComposeStatusSummary(c, 
                safe.Instalacao.Concat(safe.Testes).ToList()));
        });
    }

    // Titulo de secao com barra visual amarela
    private static void ComposeSectionTitle(IContainer container, string title)
    {
        container.Row(row =>
        {
            row.ConstantItem(4).Height(20).Background(Accent);
            row.AutoItem().PaddingLeft(8).AlignMiddle().Text(title).FontSize(10.5f).FontColor(Primary).SemiBold();
        });
    }

    // Grid de informacoes com campos estilizados
    private void ComposeInfoGrid(IContainer container, List<FieldPair> fields)
    {
        container.Background(Gray50).Border(1).BorderColor(Gray200).Padding(8).Table(table =>
        {
            table.ColumnsDefinition(cols =>
            {
                cols.RelativeColumn();
                cols.RelativeColumn();
                cols.RelativeColumn();
            });

            foreach (var field in fields)
            {
                table.Cell().Padding(4).Column(col =>
                {
                    col.Item().Text(field.Label).FontSize(7).FontColor(Gray500);
                    col.Item().Text(SafeText(field.Value, "Não informado")).FontSize(9).FontColor(Gray800).SemiBold();
                });
            }
        });
    }

    // Tabela de checklist com visual profissional
    private void ComposeChecklistTable(IContainer container, List<ChecklistItemData> items)
    {
        var safeItems = (items ?? new List<ChecklistItemData>()).Where(item => item != null).ToList();

        container.Background(Gray50).Border(1).BorderColor(Gray200).Table(table =>
        {
            table.ColumnsDefinition(cols =>
            {
                cols.ConstantColumn(60);  // Status
                cols.RelativeColumn();     // Item
            });

            // Cabecalho
            table.Header(header =>
            {
                header.Cell().Element(CellHeader).AlignCenter().Text("STATUS");
                header.Cell().Element(CellHeader).Text("ITEM DE VERIFICAÇÃO");
            });

            if (safeItems.Count == 0)
            {
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).Text("Nenhum item cadastrado");
                return;
            }

            foreach (var item in safeItems)
            {
                var isComplete = item?.Feito == true;
                
                table.Cell().Element(CellBody).AlignCenter().Row(row =>
                {
                    row.AutoItem()
                        .Width(24)
                        .Height(12)
                        .Background(isComplete ? Success : Pending)
                        .AlignCenter()
                        .AlignMiddle()
                        .Text(isComplete ? "✓" : "✗")
                        .FontSize(8)
                        .FontColor(Colors.White)
                        .Bold();
                });

                table.Cell().Element(CellBody).Text(SafeText(item?.Item, "Não informado"));
            }
        });
    }

    // Resumo visual do status geral
    private void ComposeStatusSummary(IContainer container, List<ChecklistItemData> allItems)
    {
        var total = allItems.Count;
        var completed = allItems.Count(i => i?.Feito == true);
        var pending = total - completed;
        var percentage = total > 0 ? (completed * 100 / total) : 0;

        container.Background(Primary).Padding(12).Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("RESUMO DA INSPEÇÃO").FontSize(10).FontColor(Colors.White).SemiBold();
                col.Item().PaddingTop(4).Row(r =>
                {
                    r.AutoItem().Text($"Total de itens: {total}").FontSize(8).FontColor(Colors.White);
                    r.ConstantItem(20);
                    r.AutoItem().Text($"Concluídos: {completed}").FontSize(8).FontColor(Success);
                    r.ConstantItem(20);
                    r.AutoItem().Text($"Pendentes: {pending}").FontSize(8).FontColor(pending > 0 ? Pending : Colors.White);
                });
            });

            row.ConstantItem(80).AlignRight().AlignMiddle().Column(col =>
            {
                col.Item().AlignRight().Text($"{percentage}%").FontSize(24).FontColor(Accent).Bold();
                col.Item().AlignRight().Text("Completo").FontSize(7).FontColor(Colors.White);
            });
        });
    }

    // Rodape com paginacao e branding
    private void ComposeFooter(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().LineHorizontal(1).LineColor(Accent);
            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Text("Master Elétrica Comércio e Serviço LTDA").FontSize(7).FontColor(Gray500);
                row.RelativeItem().AlignCenter().Text($"Gerado em {_checklist.CriadoEm:dd/MM/yyyy HH:mm}").FontSize(7).FontColor(Gray400);
                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span("Página ").FontSize(7).FontColor(Gray400);
                    text.CurrentPageNumber().FontSize(7).FontColor(Gray400);
                    text.Span(" de ").FontSize(7).FontColor(Gray400);
                    text.TotalPages().FontSize(7).FontColor(Gray400);
                });
            });
        });
    }

    // Estilos de celulas
    private static IContainer CellHeader(IContainer container)
    {
        return container.Background(Primary)
            .PaddingVertical(6)
            .PaddingHorizontal(8)
            .DefaultTextStyle(x => x.FontColor(Colors.White).FontSize(7.5f).SemiBold());
    }

    private static IContainer CellBody(IContainer container)
    {
        return container.BorderBottom(1)
            .BorderColor(Gray200)
            .PaddingVertical(6)
            .PaddingHorizontal(8);
    }

    private static string SafeText(string? value, string fallback = "-")
    {
        return string.IsNullOrWhiteSpace(value) ? fallback : value;
    }

    private static MontagemTesteData EnsureMontagem(MontagemTesteData? data)
    {
        return new MontagemTesteData
        {
            NomeMontador = SafeText(data?.NomeMontador, "Não informado"),
            ResponsavelTeste = SafeText(data?.ResponsavelTeste, "Não informado"),
            Data = SafeText(data?.Data, "Não informado"),
            Os = SafeText(data?.Os, "Não informado"),
            NomeEquipamento = SafeText(data?.NomeEquipamento, "Não informado"),
            Identificacao = (data?.Identificacao ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            FuncionamentoPainel = (data?.FuncionamentoPainel ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            AspectoPainel = (data?.AspectoPainel ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
        };
    }

    private static InstalacaoTesteData EnsureInstalacao(InstalacaoTesteData? data)
    {
        return new InstalacaoTesteData
        {
            NomeInstalador = SafeText(data?.NomeInstalador, "Não informado"),
            NomeInspetorQualidade = SafeText(data?.NomeInspetorQualidade, "Não informado"),
            Data = SafeText(data?.Data, "Não informado"),
            Os = SafeText(data?.Os, "Não informado"),
            NomeEquipamento = SafeText(data?.NomeEquipamento, "Não informado"),
            ItensInstalacao = (data?.ItensInstalacao ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            ItensTeste = (data?.ItensTeste ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            // Novos campos para o checklist de instalacao
            Instalacao = (data?.Instalacao ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            Testes = (data?.Testes ?? new List<ChecklistItemData>()).Where(item => item != null).ToList(),
            Observacoes = data?.Observacoes ?? "",
        };
    }

    // Logo base64 da empresa
    private static byte[] GetLogoBytes()
    {
        var base64 = LogoBase64.Value;
        var commaIndex = base64.IndexOf(',');
        if (commaIndex >= 0)
            base64 = base64[(commaIndex + 1)..];
        return Convert.FromBase64String(base64);
    }
}

// PDF simples para fallback quando houver erro de renderizacao.
internal sealed class ChecklistInspecaoFallbackPdf : IDocument
{
    private readonly ChecklistInspecao _checklist;

    public ChecklistInspecaoFallbackPdf(ChecklistInspecao checklist)
    {
        _checklist = checklist;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(24);
            page.Size(PageSizes.A4);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontSize(11));

            page.Content().Column(col =>
            {
                col.Item().Text("Checklist de Inspeção").FontSize(16).SemiBold();
                col.Item().PaddingTop(6).Text("Não foi possível renderizar o PDF detalhado.");
                col.Item().PaddingTop(6).Text($"Registro #{_checklist.Id}");
                col.Item().PaddingTop(2).Text($"Criado em {_checklist.CriadoEm:dd/MM/yyyy HH:mm}");
            });
        });
    }
}

// DTO de leitura do JSON de checklist.
internal sealed class ChecklistInspecaoData
{
    public string? Tipo { get; set; }
    public MontagemTesteData? MontagemTeste { get; set; }
    public InstalacaoTesteData? InstalacaoTeste { get; set; }

    public static ChecklistInspecaoData FromJson(string json)
    {
        try
        {
            var data = JsonSerializer.Deserialize<ChecklistInspecaoData>(json, JsonOptions) ?? new ChecklistInspecaoData();
            data.MontagemTeste ??= new MontagemTesteData();
            data.InstalacaoTeste ??= new InstalacaoTesteData();

            if (string.IsNullOrWhiteSpace(data.Tipo))
            {
                if (data.MontagemTeste is not null && data.InstalacaoTeste is null)
                    data.Tipo = "montagem";
                else if (data.InstalacaoTeste is not null && data.MontagemTeste is null)
                    data.Tipo = "teste";
            }

            return data;
        }
        catch
        {
            return new ChecklistInspecaoData
            {
                MontagemTeste = new MontagemTesteData(),
                InstalacaoTeste = new InstalacaoTesteData(),
            };
        }
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };
}

// Secao de montagem/teste.
internal sealed class MontagemTesteData
{
    public string? NomeMontador { get; set; }
    public string? ResponsavelTeste { get; set; }
    public string? Data { get; set; }
    public string? Os { get; set; }
    public string? NomeEquipamento { get; set; }
    public List<ChecklistItemData> Identificacao { get; set; } = new();
    public List<ChecklistItemData> FuncionamentoPainel { get; set; } = new();
    public List<ChecklistItemData> AspectoPainel { get; set; } = new();
}

// Secao de instalacao/teste.
internal sealed class InstalacaoTesteData
{
    public string? NomeInstalador { get; set; }
    public string? NomeInspetorQualidade { get; set; }
    public string? Data { get; set; }
    public string? Os { get; set; }
    public string? NomeEquipamento { get; set; }
    public List<ChecklistItemData> ItensInstalacao { get; set; } = new();
    public List<ChecklistItemData> ItensTeste { get; set; } = new();
    // Novos campos para o checklist de instalacao
    public List<ChecklistItemData> Instalacao { get; set; } = new();
    public List<ChecklistItemData> Testes { get; set; } = new();
    public string? Observacoes { get; set; }
}

// Item de checklist.
internal sealed class ChecklistItemData
{
    public string? Item { get; set; }
    public bool Feito { get; set; }
}

// Par label/valor para campos basicos.
internal sealed record FieldPair(string Label, string? Value);
