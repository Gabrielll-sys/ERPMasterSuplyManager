using System.Globalization;
using System.Text.Json;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MasterErp.Services.Pdf;

// Serviço responsável por gerar o PDF da APR usando o QuestPDF.
public class AprPdfService : IAprPdfService, IScopedService
{
    // Gera o PDF da APR a partir do JSON salvo no banco.
    public Task<byte[]> GenerateAsync(Apr apr)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        var data = AprFormData.FromJson(apr.ConteudoJson);
        var document = new AprPdfDocument(apr, data);
        return Task.FromResult(document.GeneratePdf());
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
