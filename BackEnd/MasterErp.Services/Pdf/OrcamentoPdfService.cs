using System.Globalization;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MasterErp.Services.Pdf;

public class OrcamentoPdfService : IOrcamentoPdfService, IScopedService
{
    public Task<byte[]> GenerateAsync(Orcamento orcamento, List<ItemOrcamento> itens, string? nomeUsuario)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        var document = new OrcamentoPdfDocument(orcamento, itens, nomeUsuario);
        return Task.FromResult(document.GeneratePdf());
    }
}

internal class OrcamentoPdfDocument : IDocument
{
    private readonly Orcamento _orcamento;
    private readonly List<ItemOrcamento> _itens;
    private readonly string? _nomeUsuario;
    private readonly CultureInfo _culture = new("pt-BR");
    private const string Placeholder = "Não informado";

    private static readonly string Primary = "#1a1a2e";
    private static readonly string Accent = "#f2c301";
    private static readonly string Gray50 = "#f9fafb";
    private static readonly string Gray100 = "#f3f4f6";
    private static readonly string Gray200 = "#e5e7eb";
    private static readonly string Gray400 = "#9ca3af";
    private static readonly string Gray500 = "#6b7280";
    private static readonly string Gray600 = "#4b5563";
    private static readonly string Gray700 = "#374151";
    private static readonly string Gray800 = "#1f2937";

    public OrcamentoPdfDocument(Orcamento orcamento, List<ItemOrcamento> itens, string? nomeUsuario)
    {
        _orcamento = orcamento;
        _itens = itens;
        _nomeUsuario = nomeUsuario;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(30);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontFamily("Helvetica").FontSize(9).FontColor(Gray800));

            page.Content().Column(column =>
            {
                column.Item().Element(ComposeHeader);
                column.Item().PaddingTop(20).PaddingBottom(20).Element(ComposeTitleSection);
                column.Item().PaddingBottom(15).Element(ComposeClientSection);
                column.Item().Element(ComposeMaterialsSection);
                column.Item().PaddingTop(20).PaddingBottom(15).Element(ComposeSummarySection);
            });

            page.Footer().Element(ComposeFooter);
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.BorderBottom(3).BorderColor(Accent).PaddingBottom(15).Row(row =>
        {
            row.ConstantItem(90).AlignLeft().Image(GetLogoBytes()).FitWidth();

            row.RelativeItem(2).AlignCenter().PaddingLeft(12).Column(col =>
            {
                col.Item().Text("Master Elétrica").FontSize(16).FontColor(Primary).SemiBold();
                col.Item().Text("Comércio e Serviço LTDA").FontSize(10).FontColor(Gray500);
            });

            row.RelativeItem(1).AlignRight().Column(col =>
            {
                col.Item().Text("CNPJ: 35.051.479/0001-70").FontSize(8).FontColor(Gray500);
                col.Item().Text("Av. Das Industrias, 375").FontSize(8).FontColor(Gray500);
                col.Item().Text("Santa Luzia - MG").FontSize(8).FontColor(Gray500);
            });
        });
    }

    private void ComposeTitleSection(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Row(title =>
            {
                title.AutoItem().Text("ORÇAMENTO").FontSize(24).FontColor(Primary).SemiBold();
                title.AutoItem().PaddingLeft(6).Text($"Nº {_orcamento.Id}").FontSize(14).FontColor(Gray500);
            });

            row.ConstantItem(120).Background(Gray100).Padding(10).AlignCenter().Column(col =>
            {
                col.Item().Text("Data de Emissão").FontSize(8).FontColor(Gray500);
                col.Item().Text(FormatDate(_orcamento.DataOrcamento)).FontSize(11).FontColor(Gray700).SemiBold();
            });
        });
    }

    private void ComposeClientSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Row(row =>
            {
                row.ConstantItem(20).Height(20).Background(Accent).AlignCenter().Text("👤").FontSize(10);
                row.AutoItem().PaddingLeft(6).Text("DADOS DO CLIENTE").FontSize(11).FontColor(Primary).SemiBold();
            });

            col.Item().Background(Gray50).Border(1).BorderColor(Gray200).Padding(12).Column(card =>
            {
                card.Item().Row(r =>
                {
                    r.RelativeItem().Column(c =>
                    {
                        c.Item().Text("NOME / RAZÃO SOCIAL").FontSize(7).FontColor(Gray500);
                        c.Item().Text(WithPlaceholder(_orcamento.NomeCliente)).FontSize(10).FontColor(Gray800);
                    });
                    r.ConstantItem(140).Column(c =>
                    {
                        c.Item().Text("CPF / CNPJ").FontSize(7).FontColor(Gray500);
                        c.Item().Text(WithPlaceholder(_orcamento.CpfOrCnpj)).FontSize(10).FontColor(Gray800);
                    });
                });

                card.Item().PaddingTop(6).Column(c =>
                {
                    c.Item().Text("ENDEREÇO").FontSize(7).FontColor(Gray500);
                    c.Item().Text(WithPlaceholder(_orcamento.Endereco)).FontSize(10).FontColor(Gray800);
                });

                card.Item().PaddingTop(6).Row(r =>
                {
                    r.ConstantItem(140).Column(c =>
                    {
                        c.Item().Text("TELEFONE").FontSize(7).FontColor(Gray500);
                        c.Item().Text(WithPlaceholder(_orcamento.Telefone)).FontSize(10).FontColor(Gray800);
                    });
                    r.RelativeItem().Column(c =>
                    {
                        c.Item().Text("E-MAIL").FontSize(7).FontColor(Gray500);
                        c.Item().Text(WithPlaceholder(_orcamento.EmailCliente)).FontSize(10).FontColor(Gray800);
                    });
                });
            });
        });
    }

    private void ComposeMaterialsSection(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Row(row =>
            {
                row.ConstantItem(20).Height(20).Background(Accent).AlignCenter().Text("📦").FontSize(10);
                row.AutoItem().PaddingLeft(6).Text("MATERIAIS").FontSize(11).FontColor(Primary).SemiBold();
                row.RelativeItem().AlignRight().Text($"{_itens.Count} itens").FontSize(9).FontColor(Gray500);
            });

            col.Item().PaddingTop(6).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(8);
                    columns.RelativeColumn(42);
                    columns.RelativeColumn(10);
                    columns.RelativeColumn(10);
                    columns.RelativeColumn(15);
                    columns.RelativeColumn(15);
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellHeader).Text("#");
                    header.Cell().Element(CellHeader).Text("Descrição");
                    header.Cell().Element(CellHeader).AlignCenter().Text("Qtd");
                    header.Cell().Element(CellHeader).AlignCenter().Text("Un");
                    header.Cell().Element(CellHeader).AlignRight().Text("Unitário");
                    header.Cell().Element(CellHeader).AlignRight().Text("Total");
                });

                for (var i = 0; i < _itens.Count; i++)
                {
                    var item = _itens[i];
                    var preco = GetPreco(item);
                    var total = preco * item.QuantidadeMaterial;
                    var isEven = i % 2 == 0;
                    var background = isEven ? Gray50 : "#ffffff";

                    table.Cell().Element(c => CellBody(c, background)).Text($"{i + 1:00}").FontColor(Gray400);
                    table.Cell().Element(c => CellBody(c, background)).Text(WithPlaceholder(item.Material?.Descricao));
                    table.Cell().Element(c => CellBody(c, background)).AlignCenter().Text(FormatQuantity(item.QuantidadeMaterial)).SemiBold();
                    table.Cell().Element(c => CellBody(c, background)).AlignCenter().Text(WithPlaceholder(item.Material?.Unidade)).FontColor(Gray500);
                    table.Cell().Element(c => CellBody(c, background)).AlignRight().Text(FormatCurrency(preco));
                    table.Cell().Element(c => CellBody(c, background)).AlignRight().Text(FormatCurrency(total)).SemiBold();
                }
            });
        });
    }

    private void ComposeSummarySection(IContainer container)
    {
        var subtotal = _itens.Sum(item => GetPreco(item) * item.QuantidadeMaterial);
        var descontoPercentual = (double)(_orcamento.Desconto ?? 0);
        var descontoPercentualTexto = descontoPercentual.ToString("0.##", _culture);
        var valorDoDesconto = subtotal * (decimal)(descontoPercentual / 100d);
        var totalFinal = subtotal - valorDoDesconto;

        var quantitiesByUnit = _itens
            .GroupBy(item => item.Material?.Unidade ?? "UN")
            .Select(group => $"{FormatQuantity(group.Sum(i => i.QuantidadeMaterial))} {group.Key}");
        var quantitySummary = string.Join(" + ", quantitiesByUnit);
        if (string.IsNullOrWhiteSpace(quantitySummary))
            quantitySummary = Placeholder;

        container.Row(row =>
        {
            row.RelativeItem(1).Column(left =>
            {
                left.Item().Background(Gray100).Padding(12).Column(box =>
                {
                    box.Item().Text("Forma de Pagamento").FontSize(8).FontColor(Gray500);
                    box.Item().Text(WithPlaceholder(_orcamento.TipoPagamento)).FontSize(12).FontColor(Gray800).SemiBold();
                });

                left.Item().PaddingTop(8).Background("#fffbeb").BorderLeft(3).BorderColor(Accent).Padding(10).Column(obs =>
                {
                    obs.Item().Text("Observações:").FontSize(8).FontColor(Gray600).SemiBold();
                    obs.Item().Text(WithPlaceholder(_orcamento.Observacoes)).FontSize(9).FontColor(Gray600);
                });
            });

            row.RelativeItem(0.9f).Column(right =>
            {
                right.Item().Background(Gray50).Border(2).BorderColor(Gray200).Padding(12).Column(card =>
                {
                    card.Item().Row(r =>
                    {
                        r.RelativeItem().Text($"Subtotal ({_itens.Count} itens)").FontColor(Gray600);
                        r.ConstantItem(90).AlignRight().Text(FormatCurrency(subtotal)).FontColor(Gray700);
                    });
                    card.Item().PaddingTop(2).Text($"Quantidades: {quantitySummary}").FontSize(8).FontColor(Gray500).Italic();

                    if (descontoPercentual > 0)
                    {
                        card.Item().PaddingTop(4).Row(r =>
                        {
                            r.RelativeItem().Text($"Desconto ({descontoPercentualTexto}%)").FontColor("#059669");
                            r.ConstantItem(90).AlignRight().Text($"- {FormatCurrency(valorDoDesconto)}").FontColor("#059669");
                        });
                    }

                    card.Item().PaddingTop(6).BorderTop(2).BorderColor(Primary).PaddingTop(8).Row(r =>
                    {
                        r.RelativeItem().Text("TOTAL").FontSize(12).FontColor(Primary).SemiBold();
                        r.ConstantItem(90).AlignRight().Text(FormatCurrency(totalFinal)).FontSize(16).FontColor(Primary).SemiBold();
                    });
                });
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().LineHorizontal(2).LineColor(Accent);
            col.Item().PaddingTop(10).Row(row =>
            {
                row.RelativeItem().Column(left =>
                {
                    left.Item().Text("Master Elétrica Comércio e Serviço LTDA").FontSize(10).FontColor(Gray600).SemiBold();
                    left.Item().Text("(31) 98664-3242").FontSize(10).FontColor(Gray500);
                });
                row.RelativeItem().AlignCenter().Text("Gerando melhorias, desenvolvendo soluções!").FontSize(12).FontColor(Gray500).Italic();
                row.RelativeItem().AlignRight().Column(right =>
                {
                    var responsavel = FirstNonEmpty(_nomeUsuario, _orcamento.ResponsavelOrcamento);
                    right.Item().Text($"Responsável: {responsavel}").FontSize(12).FontColor(Gray600);
                    right.Item().Text(text =>
                    {
                        text.Span("Página ").FontSize(8).FontColor(Gray400);
                        text.CurrentPageNumber().FontSize(8).FontColor(Gray400);
                        text.Span(" de ").FontSize(8).FontColor(Gray400);
                        text.TotalPages().FontSize(8).FontColor(Gray400);
                    });
                });
            });
        });
    }

    private IContainer CellHeader(IContainer container)
    {
        return container.Background(Primary)
            .PaddingVertical(8)
            .PaddingHorizontal(8)
            .DefaultTextStyle(x => x.FontColor(Colors.White).FontSize(8).SemiBold());
    }

    private IContainer CellBody(IContainer container, string background)
    {
        return container.Background(background)
            .BorderBottom(1)
            .BorderColor(Gray100)
            .PaddingVertical(8)
            .PaddingHorizontal(8);
    }

    private string FormatCurrency(decimal value) => value.ToString("C", _culture);

    private string FormatQuantity(decimal value) => value.ToString("G29", _culture);

    private string FormatDate(DateTime? date) => (date ?? DateTime.Now).ToString("dd/MM/yyyy", _culture);

    private static string WithPlaceholder(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? Placeholder : value;
    }

    private static string FirstNonEmpty(params string?[] values)
    {
        foreach (var value in values)
        {
            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        return Placeholder;
    }

    private static decimal GetPreco(ItemOrcamento item)
    {
        if (item.PrecoItemOrcamento.HasValue && item.PrecoItemOrcamento.Value > 0)
            return item.PrecoItemOrcamento.Value;

        var precoVenda = item.Material?.PrecoVenda;
        return precoVenda.HasValue ? Convert.ToDecimal(precoVenda.Value) : 0m;
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
