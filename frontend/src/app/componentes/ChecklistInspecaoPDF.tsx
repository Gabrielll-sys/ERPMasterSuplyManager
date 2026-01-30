"use client";

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { logoBase64 } from "../assets/base64Logo";
import { IChecklistInspecao } from "../interfaces/IChecklistInspecao";
import { IChecklistInspecaoImagem } from "../interfaces/IChecklistInspecaoImagem";

// Tipos basicos do checklist para renderizacao.
type ChecklistItem = { item?: string; feito?: boolean };
type MontagemTesteData = {
  nomeMontador?: string;
  responsavelTeste?: string;
  data?: string;
  os?: string;
  nomeEquipamento?: string;
  identificacao?: ChecklistItem[];
  funcionamentoPainel?: ChecklistItem[];
  aspectoPainel?: ChecklistItem[];
};
type InstalacaoTesteData = {
  nomeInstalador?: string;
  nomeInspetorQualidade?: string;
  data?: string;
  os?: string;
  nomeEquipamento?: string;
  instalacao?: ChecklistItem[];
  testes?: ChecklistItem[];
  // Campos legados mantidos para compatibilidade.
  itensInstalacao?: ChecklistItem[];
  itensTeste?: ChecklistItem[];
  observacoes?: string;
};
type ChecklistInspecaoData = {
  tipo?: string;
  montagemTeste?: MontagemTesteData;
  instalacaoTeste?: InstalacaoTesteData;
};

// Paleta igual ao PDF do back-end.
const colors = {
  primary: "#1a1a2e",
  accent: "#f2c301",
  gray50: "#f9fafb",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  gray800: "#1f2937",
  success: "#22c55e",
  pending: "#ef4444",
};

// Normaliza texto com fallback.
const safeText = (value?: string, fallback = "-") =>
  value && value.trim().length > 0 ? value : fallback;

// Faz parse seguro do JSON do checklist.
const parseChecklistJson = (json: string): ChecklistInspecaoData => {
  try {
    const parsed = JSON.parse(json) as ChecklistInspecaoData;
    return {
      tipo: parsed.tipo,
      montagemTeste: parsed.montagemTeste ?? {},
      instalacaoTeste: parsed.instalacaoTeste ?? {},
    };
  } catch {
    return { montagemTeste: {}, instalacaoTeste: {} };
  }
};

// Calcula resumo de status.
const getStatusSummary = (items: ChecklistItem[] = []) => {
  const total = items.length;
  const completed = items.filter((i) => i?.feito).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, percent };
};

// Titulo e subtitulo iguais ao back-end.
const getHeaderTitle = (tipo?: string) => {
  if (tipo === "montagem") return "CHECKLIST DE MONTAGEM";
  if (tipo === "teste") return "CHECKLIST DE TESTE";
  if (tipo === "instalacao") return "CHECKLIST INSTALAÇÃO E TESTE";
  return "CHECKLIST DE INSPEÇÃO";
};
const getHeaderSubtitle = (tipo?: string) => {
  if (tipo === "montagem") return "Inspeção de Identificação, Funcionamento e Aspecto do Painel";
  if (tipo === "teste") return "Validação de Instalação, Teste e Qualidade do Equipamento";
  if (tipo === "instalacao") return "Validação de Instalação, Teste e Qualidade do Equipamento";
  return "Montagem/Teste e Instalação/Teste";
};

interface ChecklistInspecaoPDFProps {
  checklist: IChecklistInspecao;
  imagens?: Array<IChecklistInspecaoImagem & { imageBase64?: string | null }>;
}

// PDF do checklist gerado no front-end com layout equivalente ao back-end.
const ChecklistInspecaoPDF = ({ checklist, imagens = [] }: ChecklistInspecaoPDFProps) => {
  const data = parseChecklistJson(checklist.conteudoJson);
  const tipo = data.tipo?.toLowerCase();

  const montagem = data.montagemTeste ?? {};
  const instalacao = data.instalacaoTeste ?? {};
  const instalacaoList = instalacao.instalacao?.length ? instalacao.instalacao : instalacao.itensInstalacao ?? [];
  const testesList = instalacao.testes?.length ? instalacao.testes : instalacao.itensTeste ?? [];

  const montagemItems = [
    ...(montagem.identificacao ?? []),
    ...(montagem.funcionamentoPainel ?? []),
    ...(montagem.aspectoPainel ?? []),
  ];
  const instalacaoItems = [...instalacaoList, ...testesList];

  const summaryMontagem = getStatusSummary(montagemItems);
  const summaryInstalacao = getStatusSummary(instalacaoItems);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logoBase64} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{getHeaderTitle(tipo)}</Text>
            <Text style={styles.headerSubtitle}>{getHeaderSubtitle(tipo)}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightTitle}>Registro #{String(checklist.id ?? 0).padStart(4, "0")}</Text>
            <Text style={styles.headerRightText}>
              Data: {dayjs(checklist.criadoEm ?? new Date()).format("DD/MM/YYYY")}
            </Text>
          </View>
        </View>

        {/* Conteúdo */}
        {tipo === "montagem" && (
          <View style={styles.section}>
            <SectionTitle title="INFORMAÇÕES GERAIS" />
            <InfoGrid
              fields={[
                { label: "Nome do Montador", value: safeText(montagem.nomeMontador, "Não informado") },
                { label: "Responsável pelo Teste", value: safeText(montagem.responsavelTeste, "Não informado") },
                { label: "Data", value: safeText(montagem.data, "Não informado") },
                { label: "Ordem de Serviço", value: safeText(montagem.os, "Não informado") },
                { label: "Nome do Equipamento", value: safeText(montagem.nomeEquipamento, "Não informado") },
              ]}
            />

            <SectionTitle title="IDENTIFICAÇÃO" />
            <ChecklistTable items={montagem.identificacao ?? []} />

            <SectionTitle title="FUNCIONAMENTO DO PAINEL" />
            <ChecklistTable items={montagem.funcionamentoPainel ?? []} />

            <SectionTitle title="ASPECTO DO PAINEL" />
            <ChecklistTable items={montagem.aspectoPainel ?? []} />

            <SummaryBox summary={summaryMontagem} />
          </View>
        )}

        {(tipo === "instalacao" || tipo === "teste") && (
          <View style={styles.section}>
            <SectionTitle title="INFORMAÇÕES GERAIS" />
            <InfoGrid
              fields={[
                { label: "Nome do Instalador", value: safeText(instalacao.nomeInstalador, "Não informado") },
                { label: "Inspetor de Qualidade", value: safeText(instalacao.nomeInspetorQualidade, "Não informado") },
                { label: "Data", value: safeText(instalacao.data, "Não informado") },
                { label: "Ordem de Serviço", value: safeText(instalacao.os, "Não informado") },
                { label: "Nome do Equipamento", value: safeText(instalacao.nomeEquipamento, "Não informado") },
              ]}
            />

            <SectionTitle title="INSTALAÇÃO" />
            <ChecklistTable items={instalacaoList} />

            <SectionTitle title="TESTES" />
            <ChecklistTable items={testesList} />

            {instalacao.observacoes && instalacao.observacoes.trim().length > 0 && (
              <>
                <SectionTitle title="ANOMALIAS / PONTOS DE ATENÇÃO" />
                <View style={styles.observationsBox}>
                  <Text style={styles.observationsText}>{instalacao.observacoes}</Text>
                </View>
              </>
            )}

            <SummaryBox summary={summaryInstalacao} />
          </View>
        )}

        {/* Fotos - cada imagem usa wrap={false} para não ser cortada */}
        {imagens.length > 0 && (
          <View style={styles.section} break>
            <SectionTitle title="FOTOS DO CHECKLIST" />
            <View style={styles.imageGrid}>
              {imagens.map((img, index) => (
                <View key={img.id ?? index} style={styles.imageCard} wrap={false}>
                  <Image src={img.imageBase64 || img.imageUrl} style={styles.imageItem} />
                  <Text style={styles.imageCaption}>Foto {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rodapé */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLine} />
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Master Elétrica Comércio e Serviço LTDA</Text>
            <Text style={styles.footerText}>
              Gerado em {dayjs(checklist.criadoEm ?? new Date()).format("DD/MM/YYYY HH:mm")}
            </Text>
            <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Título de seção com barra amarela.
const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionTitleRow}>
    <View style={styles.sectionAccent} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// Grid de informações.
const InfoGrid = ({ fields }: { fields: { label: string; value: string }[] }) => (
  <View style={styles.infoGrid}>
    {fields.map((field, index) => (
      <View key={`${field.label}-${index}`} style={styles.infoCell}>
        <Text style={styles.infoLabel}>{field.label}</Text>
        <Text style={styles.infoValue}>{field.value}</Text>
      </View>
    ))}
  </View>
);

// Tabela de checklist.
const ChecklistTable = ({ items }: { items: ChecklistItem[] }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, { width: 60, textAlign: "center" }]}>STATUS</Text>
      <Text style={styles.tableHeaderCell}>ITEM DE VERIFICAÇÃO</Text>
    </View>
    {(items.length > 0 ? items : [{ item: "Nenhum item cadastrado", feito: false }]).map((item, index) => {
      const done = item?.feito === true;
      return (
        <View key={`${item.item}-${index}`} style={styles.tableRow}>
          <View style={[styles.statusBox, { backgroundColor: done ? colors.success : colors.pending }]}>
            <Text style={styles.statusText}>{done ? "✓" : "✕"}</Text>
          </View>
          <Text style={styles.tableCell}>{safeText(item.item, "Não informado")}</Text>
        </View>
      );
    })}
  </View>
);

// Resumo de status.
const SummaryBox = ({ summary }: { summary: ReturnType<typeof getStatusSummary> }) => (
  <View style={styles.summaryBox}>
    <View style={styles.summaryLeft}>
      <Text style={styles.summaryTitle}>RESUMO DA INSPEÇÃO</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Total de itens: {summary.total}</Text>
        <Text style={styles.summaryTextSuccess}>Concluídos: {summary.completed}</Text>
        <Text style={[styles.summaryText, summary.pending > 0 ? styles.summaryTextPending : {}]}>
          Pendentes: {summary.pending}
        </Text>
      </View>
    </View>
    <View style={styles.summaryRight}>
      <Text style={styles.summaryPercent}>{summary.percent}%</Text>
      <Text style={styles.summaryPercentLabel}>Completo</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    paddingTop: 24,
    paddingBottom: 70,
    paddingHorizontal: 24,
    color: colors.gray800,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  headerLeft: { width: 140, justifyContent: "center" },
  logo: { width: 110, height: 40 },
  headerCenter: { flex: 1, alignItems: "center", textAlign: "center" },
  headerTitle: { fontSize: 18, color: colors.primary, fontFamily: "Helvetica-Bold" },
  headerSubtitle: { fontSize: 9, color: colors.gray500 },
  headerRight: { width: 140, textAlign: "right" },
  headerRightTitle: { fontSize: 9, color: colors.gray700, fontFamily: "Helvetica-Bold" },
  headerRightText: { fontSize: 7, color: colors.gray500 },

  section: { marginTop: 10 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 6 },
  sectionAccent: { width: 4, height: 16, backgroundColor: colors.accent },
  sectionTitle: { marginLeft: 8, fontSize: 10.5, color: colors.primary, fontFamily: "Helvetica-Bold" },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 8,
  },
  infoCell: { width: "33%", padding: 4 },
  infoLabel: { fontSize: 7, color: colors.gray500 },
  infoValue: { fontSize: 9, color: colors.gray800, fontFamily: "Helvetica-Bold" },

  table: { borderWidth: 1, borderColor: colors.gray200, backgroundColor: colors.gray50 },
  tableHeader: { flexDirection: "row", backgroundColor: colors.primary },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 7.5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  tableCell: { flex: 1, paddingVertical: 6, paddingHorizontal: 8, fontSize: 8.5 },
  statusBox: {
    width: 24,
    height: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: { color: "#ffffff", fontSize: 8, fontFamily: "Helvetica-Bold" },

  observationsBox: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 10,
  },
  observationsText: { fontSize: 9, color: colors.gray800 },

  summaryBox: {
    marginTop: 12,
    backgroundColor: colors.primary,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLeft: { flex: 1 },
  summaryTitle: { fontSize: 10, color: "#ffffff", fontFamily: "Helvetica-Bold" },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  summaryText: { fontSize: 8, color: "#ffffff", marginRight: 12 },
  summaryTextSuccess: { fontSize: 8, color: colors.success, marginRight: 12 },
  summaryTextPending: { color: colors.pending },
  summaryRight: { width: 80, alignItems: "flex-end", justifyContent: "center" },
  summaryPercent: { fontSize: 24, color: colors.accent, fontFamily: "Helvetica-Bold" },
  summaryPercentLabel: { fontSize: 7, color: "#ffffff" },

  imageGrid: { flexDirection: "row", flexWrap: "wrap" },
  imageCard: { width: "48%", borderWidth: 1, borderColor: colors.gray200, padding: 4, marginBottom: 8, marginRight: 8 },
  imageItem: { width: "100%", height: 140, objectFit: "cover" },
  imageCaption: { fontSize: 7, color: colors.gray500, marginTop: 4, textAlign: "center" },

  footer: { position: "absolute", bottom: 20, left: 24, right: 24 },
  footerLine: { height: 1, backgroundColor: colors.accent, marginBottom: 4 },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: colors.gray400 },
});

export default ChecklistInspecaoPDF;
