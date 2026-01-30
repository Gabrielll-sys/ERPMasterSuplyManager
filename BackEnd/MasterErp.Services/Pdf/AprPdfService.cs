using System.Globalization;
using System.Text.Json;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MasterErp.Services.Pdf;

/// <summary>
/// Serviço responsável por gerar o PDF da APR usando o QuestPDF.
/// Suporta dois tipos de APR: "completa" e "rapida".
/// </summary>
public class AprPdfService : IAprPdfService, IScopedService
{
    /// <summary>
    /// Gera o PDF da APR a partir do JSON salvo no banco.
    /// Roteia para o documento correto baseado no tipo da APR.
    /// </summary>
    public Task<byte[]> GenerateAsync(Apr apr)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        try
        {
            // Verifica o tipo da APR para escolher o documento correto
            if (apr.Tipo == "rapida")
            {
                var dataRapida = AprRapidaFormData.FromJson(apr.ConteudoJson);
                var docRapida = new AprRapidaPdfDocument(apr, dataRapida);
                return Task.FromResult(docRapida.GeneratePdf());
            }

            // APR Completa (padrão)
            var data = AprFormData.FromJson(apr.ConteudoJson);
            var document = new AprPdfDocument(apr, data);
            return Task.FromResult(document.GeneratePdf());
        }
        catch (QuestPDF.Drawing.Exceptions.DocumentLayoutException ex)
        {
            // Log detalhado do erro de layout
            Console.WriteLine($"[APR PDF ERROR] DocumentLayoutException para APR {apr.Id} (Tipo: {apr.Tipo})");
            Console.WriteLine($"[APR PDF ERROR] Message: {ex.Message}");
            Console.WriteLine($"[APR PDF ERROR] JSON Preview: {apr.ConteudoJson?[..Math.Min(500, apr.ConteudoJson?.Length ?? 0)]}...");
            throw;
        }
    }
}

// Documento do QuestPDF para renderizar a APR.
internal sealed class AprPdfDocument : IDocument
{
    private const string Placeholder = "Não informado";
    private const string Revision = "11/03/2025";
    private const string DocCode = "0001-25";

    private static readonly string Primary = "#1a1a2e";
    private static readonly string Accent = "#f2c301";
    private static readonly string Gray50 = "#f9fafb";
    private static readonly string Gray200 = "#e5e7eb";
    private static readonly string Gray400 = "#9ca3af";
    private static readonly string Gray500 = "#6b7280";
    private static readonly string Gray700 = "#374151";
    private static readonly string Gray800 = "#1f2937";

    // Recomendações de segurança conforme a planilha da APR.
    private static readonly List<string> AlturaRecomendacoes = new()
    {
        "Acesso com auxílio de cordas",
        "Monitoramento de Seg. do Trabalho",
        "Corda Guia",
        "Equipe de Resgate disponível",
        "Proibido trabalhar sozinho / isolado",
        "Sistema de Polias para resgate",
        "Iluminação adicional",
        "Instalar Linha de vida",
        "Isolamento e sinalização de área",
        "Rádios de Comunicação",
        "Check List do cinto seg. e talabarte",
        "Existência de ponto de ancoragem",
        "Foi observado o fator de queda 0,1,2",
        "Foi realizada a PTA ? N°:",
        "Treinamento NR-35 (8h)",
        "Equipamentos para resgate em altura",
        "Proibido trabalhar sob chuvas, raios, etc",
        "Foi realizado travamento da escada",
        "Inspeção prévia",
        "Acompanhamento da Ordem Serviço",
        "Outros:",
        "Outros:"
    };

    private static readonly List<string> EspacoConfinadoRecomendacoes = new()
    {
        "Proibido trabalhar sozinho / isolado",
        "Teste de gás",
        "Teste contínuo de gás",
        "Área livre de inflamáveis",
        "Ventilação / Exaustão natural",
        "Ventilação / Exaustão mecânica",
        "Monitoramento de Seg. do Trabalho",
        "Bloqueio elétrico",
        "Bloqueio mecânico",
        "Isolamento e sinalização de área",
        "Equipamento de exaustão",
        "Realizar ventilação combinada",
        "Rádios de Comunicação",
        "Detector de gases calibrado",
        "Uso de Tripé",
        "Uso de Guincho / Resgatador",
        "Maca SKED / KED para resgate",
        "Sistema de Cordas e Polias",
        "Foi realizada a PET ? N°:__________",
        "Iluminação adicional (Ex)",
        "Lanternas intrisecamente segura",
        "Materiais primeiros Socorros",
        "Purga e/ou Lavagem do local",
        "Treinamento NR-33",
        "Outros:"
    };

    private static readonly List<string> TrabalhoQuenteRecomendacoes = new()
    {
        "Extintores de incêndio",
        "Equipamentos de resgate",
        "Acompanhamento da Ordem Serviço",
        "Provisão de acesso seguro",
        "Rádios de Comunicação",
        "Proibido trabalhar sozinho / isolado",
        "A máquina de solda foi regulada",
        "Manômetros conjunto oxicorte",
        "Máquina solda em perfeito estado",
        "Caneta maçarico em perfeito estado",
        "Foi realizada a PTQ ? N°:__________",
        "Isolamento e sinalização de área",
        "Bloqueio elétrico",
        "Bloqueio mecânico",
        "Aterramento de máquinas solda",
        "Check List Máquina de Solda",
        "Check List Conjunto Oxicorte",
        "Check List Lixadeira",
        "Monitoramento de Seg. do Trabalho",
        "Colaboradores treinados ?"
    };

    private static readonly List<string> EletricidadeRecomendacoes = new()
    {
        "Extintores de incêndio",
        "Equipamentos de resgate",
        "Acompanhamento da Ordem Serviço",
        "Provisão de acesso seguro",
        "Rádios de Comunicação",
        "Proibido trabalhar sozinho / isolado",
        "Foi realizada a PTE ? N°:___________",
        "Isolamento e sinalização de área",
        "Ferramentas que possuam isolamento",
        "Etiquetagem / Bloqueio elétrico",
        "Treinamento NR-10",
        "Proibido uso de adornos",
        "Outros:"
    };

    private readonly Apr _apr;
    private readonly AprFormData _data;
    private readonly CultureInfo _culture = new("pt-BR");

    public AprPdfDocument(Apr apr, AprFormData data)
    {
        _apr = apr;
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
                column.Item().PaddingTop(10).Element(ComposeIdentificationSection);
                column.Item().PaddingTop(8).Element(ComposeWorkTypeSection);
                column.Item().PaddingTop(8).Element(ComposeActivitiesSection);
                column.Item().PaddingTop(10).Element(ComposeChecklistSections);
                column.Item().PaddingTop(10).Element(ComposeWorkersSection);
                column.Item().PaddingTop(10).Element(ComposeClosingSection);
            });

            page.Footer().Element(ComposeFooter);
        });
    }

    // Cabeçalho com logo, título e revisão.
    private void ComposeHeader(IContainer container)
    {
        container.BorderBottom(2).BorderColor(Accent).PaddingBottom(8).Row(row =>
        {
            row.ConstantItem(90).AlignLeft().Image(GetLogoBytes()).FitWidth();

            row.RelativeItem().AlignCenter().Column(col =>
            {
                col.Item().Text("APR").FontSize(18).FontColor(Primary).SemiBold();
                col.Item().Text("Análise Preliminar de Riscos").FontSize(9).FontColor(Gray500);
            });

            row.ConstantItem(140).AlignRight().Column(col =>
            {
                var aprNumero = _apr.Id > 0
                    ? $"{_apr.Id:0000}-{_apr.Data.ToString("yy", _culture)}"
                    : DocCode;
                // Exibe o número da APR conforme o modelo da planilha.
                col.Item().AlignRight().Text($"Rev. {Revision}").FontSize(7).FontColor(Gray500);
                col.Item().AlignRight().Text($"APR N°: {WithPlaceholder(aprNumero)}").FontSize(9).FontColor(Gray700).SemiBold();
            });
        });
    }

    // Bloco de identificação da APR.
    private void ComposeIdentificationSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "IDENTIFICAÇÃO"));
            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem(2).Element(c => ComposeFieldBox(c, "Empresa :", _data.Empresa));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "N° O.S:", null));
            });

            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Data:", FormatDate(_data.Data, _apr.Data)));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Hora Início:", _data.HoraInicio));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Hora Fim:", null));
            });
        });
    }

    // Seção de tipo de trabalho com marcação S/N/N/A.
    private void ComposeWorkTypeSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "1- TIPO DE TRABALHO"));
            col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(7);
                    columns.ConstantColumn(18);
                    columns.ConstantColumn(18);
                    columns.ConstantColumn(30);
                    columns.RelativeColumn(3);
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellHeader).Text("Tipo");
                    header.Cell().Element(CellHeaderSmall).AlignCenter().Text("S");
                    header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N");
                    header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N/A");
                    header.Cell().Element(CellHeader).Text("Número");
                });

                AddWorkTypeRow(table, "Trabalho em Altura", _data.TipoTrabalho?.Altura ?? false, _data.TipoTrabalho?.NumeroPta);
                AddWorkTypeRow(table, "Trabalho em Espaço Confinado", _data.TipoTrabalho?.EspacoConfinado ?? false, _data.TipoTrabalho?.NumeroPet);
                AddWorkTypeRow(table, "Trabalho com Eletricidade", _data.TipoTrabalho?.Eletricidade ?? false, _data.TipoTrabalho?.NumeroPte);
                AddWorkTypeRow(table, "Trabalho à Quente", _data.TipoTrabalho?.TrabalhoQuente ?? false, _data.TipoTrabalho?.NumeroPtq);
            });

            col.Item().PaddingTop(6)
                .Text("NR-10.11.1: Os serviços em instalações elétricas devem ser planejados e realizados em conformidade com procedimentos de trabalho específicos, padronizados, com descrição detalhada de cada tarefa, passo a passo, assinados por profissional que atenda ao que estabelece o item 10.8 desta NR.")
                .FontSize(7)
                .FontColor(Gray500);
        });
    }

    // Área de atividades, local, ferramentas e responsáveis.
    private void ComposeActivitiesSection(IContainer container)
    {
        const string nr10Text = "NR-10.11.1: Os serviços em instalações elétricas devem ser planejados e realizados em conformidade com procedimentos de trabalho específicos, padronizados, com descrição detalhada de cada tarefa, passo a passo, assinados por profissional que atenda ao que estabelece o item 10.8 desta NR.";

        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "ATIVIDADES A SEREM REALIZADAS"));
            col.Item().PaddingTop(4).Element(c => ComposeMultilineField(c, "Atividades a serem realizadas", _data.Atividades, nr10Text));
            col.Item().PaddingTop(4).Element(c => ComposeFieldBox(c, "Local / Setor:", _data.LocalSetor));
            col.Item().PaddingTop(4).Element(c => ComposeFieldBox(c, "Ferramentas a serem utilizadas:", _data.Ferramentas));
            col.Item().PaddingTop(4).Element(c => ComposeFieldBox(c, "Colaboradores a serem envolvidos:", _data.Colaboradores));

            col.Item().PaddingTop(6).Row(row =>
            {
                row.RelativeItem(2).Element(c => ComposeFieldBox(c, "Supervisor da área/setor:", _data.Supervisor?.Nome));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Setor:", _data.Supervisor?.Setor));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Assinatura:", null));
            });

            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem(2).Element(c => ComposeFieldBox(c, "Emissor da APR:", _data.Emissor?.Nome));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Setor:", _data.Emissor?.Setor));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Assinatura:", null));
            });
        });
    }

    // Checklists de EPI, riscos e recomendações por categoria.
    private void ComposeChecklistSections(IContainer container)
    {
        // Exibe apenas checklists dos tipos de trabalho selecionados.
        var tipos = _data.TipoTrabalho;
        container.Column(col =>
        {
            if (tipos?.Altura == true)
            {
                col.Item().Element(c => ComposeChecklistSection(
                    c,
                    "TRABALHO EM ALTURA",
                    _data.TrabalhoAltura,
                    "2- PRECAUÇÕES EM TRABALHO EM ALTURA – (Obs: Anexar a PTA)",
                    AlturaRecomendacoes,
                    "É obrigatório o uso e a realização do check list de cinto de segurança tipo paraquedista com 02 (dois) talabartes e/ou Trava quedas para trabalhos acima de 02 metros."
                ));
            }

            if (tipos?.EspacoConfinado == true)
            {
                col.Item().PaddingTop(8).Element(c => ComposeChecklistSection(
                    c,
                    "ESPAÇO CONFINADO",
                    _data.EspacoConfinado,
                    "3- PRECAUÇÕES EM ESPAÇO CONFINADO – (Obs: Anexar a PET)",
                    EspacoConfinadoRecomendacoes,
                    null
                ));
            }

            if (tipos?.TrabalhoQuente == true)
            {
                col.Item().PaddingTop(8).Element(c => ComposeChecklistSection(
                    c,
                    "TRABALHO À QUENTE",
                    _data.TrabalhoQuente,
                    "4- PRECAUÇÕES EM TRABALHO À QUENTE – (Obs: Anexar a PTQ)",
                    TrabalhoQuenteRecomendacoes,
                    null
                ));
            }

            if (tipos?.Eletricidade == true)
            {
                col.Item().PaddingTop(8).Element(c => ComposeChecklistSection(
                    c,
                    "ELETRICIDADE",
                    _data.Eletricidade,
                    "5- PRECAUÇÕES TRABALHO COM ELETRICIDADE – (Obs: Anexar a PTE)",
                    EletricidadeRecomendacoes,
                    null
                ));
            }
        });
    }

    // Monta um bloco completo de checklist e recomendações.
    private void ComposeChecklistSection(
        IContainer container,
        string title,
        AprChecklist? checklist,
        string precautionsTitle,
        List<string> recommendations,
        string? note)
    {
        var safeChecklist = checklist ?? new AprChecklist();

        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, title));
            col.Item().PaddingTop(4).Text(precautionsTitle).FontSize(8).FontColor(Gray700);

            col.Item().PaddingTop(6).Row(row =>
            {
                row.RelativeItem().Element(c => ComposeChecklistTableEpi(c, safeChecklist.Epis));
                row.RelativeItem().Element(c => ComposeChecklistTableRisco(c, safeChecklist.Riscos));
            });

            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Outros EPIs:", safeChecklist.OutrosEpis));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Outros riscos:", safeChecklist.OutrosRiscos));
            });

            col.Item().PaddingTop(6).Element(c => ComposeRecommendations(c, recommendations));

            if (!string.IsNullOrWhiteSpace(note))
            {
                col.Item().PaddingTop(4).Text(note).FontSize(7).FontColor(Gray500);
            }
        });
    }

    // Tabela de EPIs com colunas de status.
    private void ComposeChecklistTableEpi(IContainer container, List<AprChecklistItem> items)
    {
        var safeItems = items ?? new List<AprChecklistItem>();
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(18);
                columns.ConstantColumn(18);
                columns.ConstantColumn(30);
                columns.RelativeColumn(8);
            });

            table.Header(header =>
            {
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("S");
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N");
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N/A");
                header.Cell().Element(CellHeader).Text("EPI's Obrigatórios");
            });

            if (safeItems.Count == 0)
            {
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).Text(Placeholder);
                return;
            }

            foreach (var item in safeItems)
            {
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "S"));
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "N"));
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "NA"));
                table.Cell().Element(CellBody).Text(WithPlaceholder(item.Label));
            }
        });
    }

    // Tabela de riscos com colunas de status.
    private void ComposeChecklistTableRisco(IContainer container, List<AprChecklistItem> items)
    {
        var safeItems = items ?? new List<AprChecklistItem>();
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(8);
                columns.ConstantColumn(18);
                columns.ConstantColumn(18);
                columns.ConstantColumn(30);
            });

            table.Header(header =>
            {
                header.Cell().Element(CellHeader).Text("Riscos / Perigos");
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("S");
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N");
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("N/A");
            });

            if (safeItems.Count == 0)
            {
                table.Cell().Element(CellBody).Text(Placeholder);
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                table.Cell().Element(CellBody).AlignCenter().Text("-");
                return;
            }

            foreach (var item in safeItems)
            {
                table.Cell().Element(CellBody).Text(WithPlaceholder(item.Label));
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "S"));
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "N"));
                table.Cell().Element(CellBody).AlignCenter().Text(MarkStatus(item.Status, "NA"));
            }
        });
    }

    // Lista de recomendações fixas do modelo.
    private void ComposeRecommendations(IContainer container, List<string> recommendations)
    {
        container.Border(1).BorderColor(Gray200).Padding(6).Column(col =>
        {
            col.Item().Text("Recomendações de Segurança").FontSize(8).FontColor(Primary).SemiBold();
            foreach (var item in recommendations)
            {
                col.Item().Text(item).FontSize(7).FontColor(Gray700);
            }
        });
    }

    // Lista de trabalhadores autorizados.
    private void ComposeWorkersSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "TRABALHADORES AUTORIZADOS"));
            col.Item().PaddingTop(4).Text("COLABORADOR ENVOLVIDOS NA ATIVIDADE").FontSize(8).FontColor(Gray500);
            col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(24);
                    columns.RelativeColumn(6);
                    columns.RelativeColumn(4);
                    columns.RelativeColumn(4);
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellHeader).AlignCenter().Text("Nº");
                    header.Cell().Element(CellHeader).Text("Nome");
                    header.Cell().Element(CellHeader).Text("Função");
                    header.Cell().Element(CellHeader).Text("Assinatura");
                });

                var trabalhadores = (_data.Trabalhadores ?? new List<AprWorker>())
                    .Where(worker => !string.IsNullOrWhiteSpace(worker?.Nome) || !string.IsNullOrWhiteSpace(worker?.Funcao))
                    .ToList();

                for (var i = 0; i < trabalhadores.Count; i++)
                {
                    var worker = trabalhadores[i];
                    table.Cell().Element(CellBody).AlignCenter().Text((i + 1).ToString());
                    table.Cell().Element(CellBody).Text(WithPlaceholder(worker?.Nome));
                    table.Cell().Element(CellBody).Text(WithPlaceholder(worker?.Funcao));
                    table.Cell().Element(SignatureLineCell);
                }
            });
        });
    }

    // Encerramento com assinaturas e observações finais.
    private void ComposeClosingSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "ENCERRAMENTO"));
            col.Item().PaddingTop(4)
                .Text("6 – ENCERRAMENTO DA APR: informo que as atividades foram encerradas / interrompidas e que as condições normais foram reestabelecidas.")
                .FontSize(8)
                .FontColor(Gray700);

            col.Item().PaddingTop(6).Element(c => ComposeSignatureTable(
                c,
                "Solicitante da atividade",
                FormatDate(_data.Encerramento?.SolicitanteData, null),
                _data.Encerramento?.SolicitanteNome
            ));

            col.Item().PaddingTop(4).Text("Confirmo que as atividades foram encerradas / interrompidas e que as condições normais foram reestabelecidas").FontSize(7).FontColor(Gray500);

            col.Item().PaddingTop(4).Element(c => ComposeSignatureTable(
                c,
                "Emissor da (APR)",
                FormatDate(_data.Encerramento?.EmissorData, null),
                _data.Encerramento?.EmissorNome
            ));

            col.Item().PaddingTop(6).Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Row(row =>
            {
                row.RelativeItem().Text($"Trabalhos interrompidos: {( _data.Encerramento?.Interrupcoes?.PorRazoesSeguranca == true ? "X" : "" )} Por razões de segurança").FontSize(7).FontColor(Gray700);
                row.RelativeItem().Text($"Os trabalhos irão continuar com a APR Nº: {WithPlaceholder(_data.Encerramento?.Interrupcoes?.AprContinuacao)}").FontSize(7).FontColor(Gray700);
                row.RelativeItem().Text("Trabalho cancelado").FontSize(7).FontColor(Gray700);
            });

            col.Item().PaddingTop(6)
                .Text("Esta APR (Análise Preliminar de Riscos) somente é válida por turno e deverá ser acompanhada das respectivas PT´s (Permissões de Trabalho) de acordo com cada tipo de atividade especificada nesta APR.")
                .FontSize(7)
                .FontColor(Gray500);
        });
    }

    // Tabela reutilizável para blocos de assinatura.
    private void ComposeSignatureTable(IContainer container, string label, string? date, string? name)
    {
        container.Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(3);
                columns.RelativeColumn(1.2f);
                columns.RelativeColumn(3);
                columns.RelativeColumn(2.5f);
            });

            table.Header(header =>
            {
                header.Cell().Element(CellHeader).Text(label);
                header.Cell().Element(CellHeaderSmall).AlignCenter().Text("Data");
                header.Cell().Element(CellHeader).Text("Nome");
                header.Cell().Element(CellHeader).Text("Assinatura");
            });

            table.Cell().Element(CellBody).Text(string.Empty);
            table.Cell().Element(CellBody).AlignCenter().Text(WithPlaceholder(date));
            table.Cell().Element(CellBody).Text(WithPlaceholder(name));
            table.Cell().Element(SignatureLineCell);
        });
    }

    // Rodapé com paginação.
    private void ComposeFooter(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().LineHorizontal(1).LineColor(Accent);
            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Text("Master Elétrica Comércio e Serviço LTDA").FontSize(7).FontColor(Gray500);
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

    // Cabeçalho visual das seções.
    private static void ComposeSectionTitle(IContainer container, string title)
    {
        container.Row(row =>
        {
            row.ConstantItem(20).Height(20).Background(Accent);
            row.AutoItem().PaddingLeft(6).Text(title).FontSize(10.5f).FontColor(Primary).SemiBold();
        });
    }

    // Campo simples de label e valor.
    private static void ComposeFieldBox(IContainer container, string label, string? value)
    {
        container.Background(Gray50)
            .Border(1)
            .BorderColor(Gray200)
            .Padding(6)
            .Column(col =>
            {
                col.Item().Text(label).FontSize(7).FontColor(Gray500);
                if (label.StartsWith("Assinatura", StringComparison.OrdinalIgnoreCase) && string.IsNullOrWhiteSpace(value))
                {
                    col.Item().PaddingTop(16).Element(SignatureLine);
                }
                else
                {
                    col.Item().Text(WithPlaceholder(value)).FontSize(8).FontColor(Gray800);
                }
            });
    }

    // Linha sutil para campos de assinatura.
    private static IContainer SignatureLine(IContainer container)
    {
        return container.Height(1).Background(Gray400);
    }

    private static IContainer SignatureLineCell(IContainer container)
    {
        return CellBody(container).PaddingTop(16).Element(SignatureLine);
    }

    // Campo multiline com nota auxiliar.
    private static void ComposeMultilineField(IContainer container, string label, string? value, string? note)
    {
        container.Background(Gray50)
            .Border(1)
            .BorderColor(Gray200)
            .Padding(6)
            .Column(col =>
            {
                col.Item().Text(label).FontSize(7).FontColor(Gray500);
                if (!string.IsNullOrWhiteSpace(note))
                {
                    col.Item().Text(note).FontSize(6).FontColor(Gray500);
                }
                col.Item().Text(WithPlaceholder(value)).FontSize(8).FontColor(Gray800);
            });
    }

    // Linha da tabela de tipo de trabalho.
    private static void AddWorkTypeRow(TableDescriptor table, string label, bool enabled, string? numero)
    {
        table.Cell().Element(CellBody).Text(label);
        table.Cell().Element(CellBody).AlignCenter().Text(enabled ? "X" : string.Empty);
        table.Cell().Element(CellBody).AlignCenter().Text(!enabled ? "X" : string.Empty);
        table.Cell().Element(CellBody).AlignCenter().Text(string.Empty);
        table.Cell().Element(CellBody).Text(WithPlaceholder(numero));
    }

    // Marca o status correto no checklist.
    private static string MarkStatus(string? status, string match)
    {
        if (string.IsNullOrWhiteSpace(status))
            return string.Empty;

        var normalized = status.Trim().ToUpperInvariant();
        if (normalized == "N/A")
            normalized = "NA";

        return normalized == match ? "X" : string.Empty;
    }

    private static IContainer CellHeader(IContainer container)
    {
        return container.Background(Primary)
            .PaddingVertical(5)
            .PaddingHorizontal(6)
            .DefaultTextStyle(x => x.FontColor(Colors.White).FontSize(7.5f).SemiBold());
    }

    private static IContainer CellHeaderSmall(IContainer container)
    {
        return container.Background(Gray700)
            .PaddingVertical(4)
            .PaddingHorizontal(6)
            .DefaultTextStyle(x => x.FontColor(Colors.White).FontSize(6.5f).SemiBold());
    }

    private static IContainer CellBody(IContainer container)
    {
        return container.BorderBottom(1)
            .BorderColor(Gray200)
            .PaddingVertical(5)
            .PaddingHorizontal(6);
    }

    // Normaliza datas vindas do JSON.
    private string FormatDate(string? dateText, DateTime? fallbackDate)
    {
        if (!string.IsNullOrWhiteSpace(dateText))
        {
            if (DateTime.TryParse(dateText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var parsedInvariant))
            {
                if (dateText.Contains(":"))
                    return parsedInvariant.ToString("dd/MM/yyyy HH:mm", _culture);

                return parsedInvariant.ToString("dd/MM/yyyy", _culture);
            }

            if (DateTime.TryParse(dateText, _culture, DateTimeStyles.AssumeLocal, out var parsedCulture))
            {
                if (dateText.Contains(":"))
                    return parsedCulture.ToString("dd/MM/yyyy HH:mm", _culture);

                return parsedCulture.ToString("dd/MM/yyyy", _culture);
            }
        }

        if (fallbackDate.HasValue)
            return fallbackDate.Value.ToString("dd/MM/yyyy", _culture);

        return Placeholder;
    }

    // Garante placeholder para campos vazios.
    private static string WithPlaceholder(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? Placeholder : value;
    }

    // Logo base64 usado nos PDFs.
    private static byte[] GetLogoBytes()
    {
        var base64 = LogoBase64.Value;
        var commaIndex = base64.IndexOf(',');
        if (commaIndex >= 0)
            base64 = base64[(commaIndex + 1)..];

        return Convert.FromBase64String(base64);
    }
}
// Modelos internos para desserializar o JSON da APR.
internal sealed class AprFormData
{
    public string? Titulo { get; set; }
    public string? Empresa { get; set; }
    public string? Data { get; set; }
    public string? HoraInicio { get; set; }
    public AprWorkType? TipoTrabalho { get; set; }
    public string? Atividades { get; set; }
    public string? LocalSetor { get; set; }
    public string? Ferramentas { get; set; }
    public string? Colaboradores { get; set; }
    public AprPerson? Supervisor { get; set; }
    public AprPerson? Emissor { get; set; }
    public AprChecklist? TrabalhoAltura { get; set; }
    public AprChecklist? EspacoConfinado { get; set; }
    public AprChecklist? TrabalhoQuente { get; set; }
    public AprChecklist? Eletricidade { get; set; }
    public List<AprWorker>? Trabalhadores { get; set; }
    public AprClosing? Encerramento { get; set; }

    // Lê o JSON e aplica defaults para evitar nulls.
    public static AprFormData FromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return new AprFormData();

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<AprFormData>(json, options) ?? new AprFormData();
        }
        catch
        {
            return new AprFormData();
        }
    }
}

internal sealed class AprWorkType
{
    public bool Altura { get; set; }
    public string? NumeroPta { get; set; }
    public bool EspacoConfinado { get; set; }
    public string? NumeroPet { get; set; }
    public bool Eletricidade { get; set; }
    public string? NumeroPte { get; set; }
    public bool TrabalhoQuente { get; set; }
    public string? NumeroPtq { get; set; }
}

internal sealed class AprPerson
{
    public string? Nome { get; set; }
    public string? Setor { get; set; }
}

internal sealed class AprChecklist
{
    public List<AprChecklistItem> Epis { get; set; } = new();
    public List<AprChecklistItem> Riscos { get; set; } = new();
    public string? OutrosEpis { get; set; }
    public string? OutrosRiscos { get; set; }
}

internal sealed class AprChecklistItem
{
    public string? Label { get; set; }
    public string? Status { get; set; }
}

internal sealed class AprWorker
{
    public string? Nome { get; set; }
    public string? Funcao { get; set; }
}

internal sealed class AprClosing
{
    public string? SolicitanteNome { get; set; }
    public string? SolicitanteData { get; set; }
    public string? EmissorNome { get; set; }
    public string? EmissorData { get; set; }
    public AprClosingInterruption? Interrupcoes { get; set; }
}

internal sealed class AprClosingInterruption
{
    public bool PorRazoesSeguranca { get; set; }
    public string? AprContinuacao { get; set; }
}

// ============================================
// APR RÁPIDA - DOCUMENTO PDF COMPACTO
// ============================================

/// <summary>
/// Documento PDF para APR Rápida - layout compacto de 1 página.
/// </summary>
internal sealed class AprRapidaPdfDocument : IDocument
{
    private const string Placeholder = "Não informado";

    // Cores do tema amber/laranja para APR Rápida
    private static readonly string Primary = "#1a1a2e";
    private static readonly string Accent = "#f59e0b"; // amber-500
    private static readonly string Gray50 = "#f9fafb";
    private static readonly string Gray200 = "#e5e7eb";
    private static readonly string Gray400 = "#9ca3af";
    private static readonly string Gray500 = "#6b7280";
    private static readonly string Gray700 = "#374151";
    private static readonly string Gray800 = "#1f2937";

    private readonly Apr _apr;
    private readonly AprRapidaFormData _data;
    private readonly CultureInfo _culture = new("pt-BR");

    public AprRapidaPdfDocument(Apr apr, AprRapidaFormData data)
    {
        _apr = apr;
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
            page.DefaultTextStyle(x => x.FontFamily("Helvetica").FontSize(9f).FontColor(Gray800));

            page.Content().Column(column =>
            {
                column.Item().Element(ComposeHeader);
                column.Item().PaddingTop(10).Element(ComposeIdentification);
                column.Item().PaddingTop(10).Element(ComposeChecklists);
                column.Item().PaddingTop(10).Element(ComposeWorkers);
                column.Item().PaddingTop(10).Element(ComposeSignatures);
            });

            page.Footer().Element(ComposeFooter);
        });
    }

    /// <summary>
    /// Cabeçalho profissional com logo, título e referência NR-10.
    /// </summary>
    private void ComposeHeader(IContainer container)
    {
        container.BorderBottom(2).BorderColor(Accent).PaddingBottom(8).Row(row =>
        {
            row.ConstantItem(90).AlignLeft().Image(GetLogoBytes()).FitWidth();

            row.RelativeItem().AlignCenter().Column(col =>
            {
                col.Item().Text("ANÁLISE PRELIMINAR DE RISCOS").FontSize(14).FontColor(Primary).SemiBold();
                col.Item().Text("Trabalho com Eletricidade - NR-10").FontSize(9).FontColor(Gray500);
            });

            row.ConstantItem(140).AlignRight().Column(col =>
            {
                var aprNumero = _apr.Id > 0
                    ? $"{_apr.Id:0000}/{_apr.Data.ToString("yyyy", _culture)}"
                    : "----";
                col.Item().AlignRight().Text($"APR N° {aprNumero}").FontSize(10).FontColor(Primary).SemiBold();
                col.Item().AlignRight().Text($"Data: {FormatDate(_data.Data)}").FontSize(8).FontColor(Gray500);
                col.Item().AlignRight().Text($"Hora: {_data.HoraInicio ?? "--:--"}").FontSize(8).FontColor(Gray500);
            });
        });
    }

    /// <summary>
    /// Bloco de identificação: Local, Atividade, Empresa, Emissor.
    /// </summary>
    private void ComposeIdentification(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "IDENTIFICAÇÃO"));

            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem(2).Element(c => ComposeFieldBox(c, "Local / Setor:", _data.LocalSetor));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Empresa:", _data.Empresa));
            });

            col.Item().PaddingTop(4).Element(c => ComposeFieldBox(c, "Atividade a ser realizada:", _data.Atividade));

            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Emissor:", _data.Emissor));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Supervisor:", _data.Supervisor));
                row.RelativeItem().Element(c => ComposeFieldBox(c, "Hora Início:", _data.HoraInicio));
            });
        });
    }

    /// <summary>
    /// Checklists de EPIs e Riscos lado a lado com layout melhorado.
    /// </summary>
    private void ComposeChecklists(IContainer container)
    {
        var episList = _data.Epis ?? new List<AprRapidaChecklistItem>();
        var riscosList = _data.Riscos ?? new List<AprRapidaChecklistItem>();
        var outrosRiscosValidos = (_data.OutrosRiscos ?? new List<string>())
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .ToList();

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn();
                columns.ConstantColumn(8); // gap
                columns.RelativeColumn();
            });

            // EPIs - NR-10
            table.Cell().Column(col =>
            {
                col.Item().Element(c => ComposeSectionTitle(c, "EPIs OBRIGATÓRIOS (NR-10)"));
                col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(8).Column(items =>
                {
                    if (episList.Count == 0)
                    {
                        items.Item().Text("Nenhum EPI registrado").FontSize(8).FontColor(Gray400).Italic();
                    }
                    else
                    {
                        foreach (var epi in episList)
                        {
                            var checkIcon = epi.Checked ? "☑" : "☐";
                            var checkColor = epi.Checked ? "#059669" : Gray400;
                            items.Item().PaddingBottom(3).Text(text =>
                            {
                                text.Span(checkIcon + " ").FontSize(10).FontColor(checkColor);
                                text.Span(epi.Label ?? "").FontSize(8.5f).FontColor(Gray700);
                            });
                        }
                    }
                });
            });

            // Gap
            table.Cell();

            // Riscos
            table.Cell().Column(col =>
            {
                col.Item().Element(c => ComposeSectionTitle(c, "RISCOS IDENTIFICADOS"));
                col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(8).Column(items =>
                {
                    if (riscosList.Count == 0 && outrosRiscosValidos.Count == 0)
                    {
                        items.Item().Text("Nenhum risco registrado").FontSize(8).FontColor(Gray400).Italic();
                    }
                    else
                    {
                        foreach (var risco in riscosList)
                        {
                            var checkIcon = risco.Checked ? "☑" : "☐";
                            var checkColor = risco.Checked ? "#dc2626" : Gray400;
                            items.Item().PaddingBottom(3).Text(text =>
                            {
                                text.Span(checkIcon + " ").FontSize(10).FontColor(checkColor);
                                text.Span(risco.Label ?? "").FontSize(8.5f).FontColor(Gray700);
                            });
                        }

                        // Exibe outros riscos se houver algum
                        if (outrosRiscosValidos.Count > 0)
                        {
                            items.Item().PaddingTop(6).BorderTop(1).BorderColor(Gray200);
                            items.Item().PaddingTop(4).Text("Outros riscos:").FontSize(7).FontColor(Gray500).Italic();
                            
                            foreach (var outroRisco in outrosRiscosValidos)
                            {
                                items.Item().PaddingTop(2).Text(text =>
                                {
                                    text.Span("• ").FontSize(10).FontColor("#dc2626");
                                    text.Span(outroRisco).FontSize(8.5f).FontColor(Gray700);
                                });
                            }
                        }
                    }
                });
            });
        });

        // Observações
        if (!string.IsNullOrWhiteSpace(_data.Observacoes))
        {
            container.PaddingTop(8).Element(c => ComposeFieldBox(c, "Observações:", _data.Observacoes));
        }
    }

    /// <summary>
    /// Lista de trabalhadores.
    /// </summary>
    private void ComposeWorkers(IContainer container)
    {
        var trabalhadores = (_data.Trabalhadores ?? new List<string>())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .ToList();

        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "TRABALHADORES"));
            col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(24);
                    columns.RelativeColumn(6);
                    columns.RelativeColumn(4);
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellHeader).AlignCenter().Text("Nº");
                    header.Cell().Element(CellHeader).Text("Nome");
                    header.Cell().Element(CellHeader).Text("Assinatura");
                });

                // Se não houver trabalhadores, mostra linha placeholder
                if (trabalhadores.Count == 0)
                {
                    table.Cell().Element(CellBody).AlignCenter().Text("1");
                    table.Cell().Element(CellBody).Text(Placeholder);
                    table.Cell().Element(SignatureLineCell);
                }
                else
                {
                    for (var i = 0; i < trabalhadores.Count; i++)
                    {
                        table.Cell().Element(CellBody).AlignCenter().Text((i + 1).ToString());
                        table.Cell().Element(CellBody).Text(trabalhadores[i] ?? Placeholder);
                        table.Cell().Element(SignatureLineCell);
                    }
                }
            });
        });
    }

    /// <summary>
    /// Área de assinaturas de emissor e supervisor.
    /// </summary>
    private void ComposeSignatures(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Element(c => ComposeSectionTitle(c, "ASSINATURAS"));
            col.Item().PaddingTop(4).Background(Gray50).Border(1).BorderColor(Gray200).Padding(6).Row(row =>
            {
                row.RelativeItem().Column(c =>
                {
                    c.Item().Text("Emissor da APR").FontSize(7).FontColor(Gray500);
                    c.Item().Text(WithPlaceholder(_data.Emissor)).FontSize(8).FontColor(Gray800);
                    c.Item().PaddingTop(20).Element(SignatureLine);
                });

                row.RelativeItem().Column(c =>
                {
                    c.Item().Text("Supervisor da Área").FontSize(7).FontColor(Gray500);
                    c.Item().Text(WithPlaceholder(_data.Supervisor)).FontSize(8).FontColor(Gray800);
                    c.Item().PaddingTop(20).Element(SignatureLine);
                });
            });
        });
    }

    /// <summary>
    /// Rodapé profissional com informações da empresa.
    /// </summary>
    private void ComposeFooter(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().LineHorizontal(1).LineColor(Accent);
            col.Item().PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Column(c =>
                {
                    c.Item().Text("Master Elétrica Comércio e Serviço LTDA").FontSize(7).FontColor(Gray500).SemiBold();
                    c.Item().Text("Documento gerado eletronicamente - APR válida após assinaturas").FontSize(6).FontColor(Gray400);
                });
                row.ConstantItem(80).AlignRight().Text(text =>
                {
                    text.Span("Página ").FontSize(7).FontColor(Gray400);
                    text.CurrentPageNumber().FontSize(7).FontColor(Gray400);
                    text.Span(" de ").FontSize(7).FontColor(Gray400);
                    text.TotalPages().FontSize(7).FontColor(Gray400);
                });
            });
        });
    }

    // ============================================
    // HELPERS
    // ============================================

    private static void ComposeSectionTitle(IContainer container, string title)
    {
        container.Row(row =>
        {
            row.ConstantItem(16).Height(16).Background(Accent);
            row.AutoItem().PaddingLeft(6).Text(title).FontSize(9f).FontColor(Primary).SemiBold();
        });
    }

    private static void ComposeFieldBox(IContainer container, string label, string? value)
    {
        container.Background(Gray50)
            .Border(1)
            .BorderColor(Gray200)
            .Padding(6)
            .Column(col =>
            {
                col.Item().Text(label).FontSize(7).FontColor(Gray500);
                col.Item().Text(WithPlaceholder(value)).FontSize(8).FontColor(Gray800);
            });
    }

    private static IContainer SignatureLine(IContainer container)
    {
        return container.Height(1).Background(Gray400);
    }

    private static IContainer SignatureLineCell(IContainer container)
    {
        return CellBody(container).PaddingTop(12).Element(SignatureLine);
    }

    private static IContainer CellHeader(IContainer container)
    {
        return container.Background(Primary)
            .PaddingVertical(4)
            .PaddingHorizontal(6)
            .DefaultTextStyle(x => x.FontColor(Colors.White).FontSize(7f).SemiBold());
    }

    private static IContainer CellBody(IContainer container)
    {
        return container.BorderBottom(1)
            .BorderColor(Gray200)
            .PaddingVertical(4)
            .PaddingHorizontal(6);
    }

    private string FormatDate(string? dateText)
    {
        if (string.IsNullOrWhiteSpace(dateText)) return Placeholder;
        if (DateTime.TryParse(dateText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var parsed))
            return parsed.ToString("dd/MM/yyyy", _culture);
        return dateText;
    }

    private static string WithPlaceholder(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? Placeholder : value;
    }

    private static byte[] GetLogoBytes()
    {
        var base64 = LogoBase64.Value;
        var commaIndex = base64.IndexOf(',');
        if (commaIndex >= 0)
            base64 = base64[(commaIndex + 1)..];
        return Convert.FromBase64String(base64);
    }
}

// ============================================
// MODELO DE DADOS - APR RÁPIDA
// ============================================

/// <summary>
/// Dados do formulário de APR Rápida para deserialização do JSON.
/// </summary>
internal sealed class AprRapidaFormData
{
    public string? LocalSetor { get; set; }
    public string? Atividade { get; set; }
    public string? Empresa { get; set; }
    public string? Data { get; set; }
    public string? HoraInicio { get; set; }
    public string? Emissor { get; set; }
    public string? Supervisor { get; set; }
    public string? Observacoes { get; set; }
    public List<AprRapidaChecklistItem>? Epis { get; set; }
    public List<AprRapidaChecklistItem>? Riscos { get; set; }
    /// <summary>Lista de riscos adicionais não listados</summary>
    public List<string>? OutrosRiscos { get; set; }
    public List<string>? Trabalhadores { get; set; }

    public static AprRapidaFormData FromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return new AprRapidaFormData();

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<AprRapidaFormData>(json, options) ?? new AprRapidaFormData();
        }
        catch
        {
            return new AprRapidaFormData();
        }
    }
}

/// <summary>
/// Item de checklist simples (checked/unchecked).
/// </summary>
internal sealed class AprRapidaChecklistItem
{
    public string? Label { get; set; }
    public bool Checked { get; set; }
}

