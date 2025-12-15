"use client";
import { Document, Page, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { logoBase64 } from '../assets/base64Logo';
import { IOrcamento } from '../interfaces/IOrcamento';
import { IItemOrcamento } from '../interfaces/IItemOrcamento';

// --- PROPS DO COMPONENTE ---
interface OrcamentoPDFProps {
  orcamento: IOrcamento;
  materiaisOrcamento: IItemOrcamento[];
  nomeUsuario?: string;
}

// --- FUNÇÕES HELPER ---
const formatCurrency = (value: number | string | null | undefined): string => {
  const numValue = Number(value);
  if (value === null || value === undefined || isNaN(numValue)) return 'R$ 0,00';
  return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return dayjs().format("DD/MM/YYYY");
  return dayjs(date).format("DD/MM/YYYY");
};

// --- CORES ---
const colors = {
  primary: '#1a1a2e',
  accent: '#f2c301',
  success: '#059669',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  }
};

// --- COMPONENTE PRINCIPAL ---
const OrcamentoPDF = ({ orcamento, materiaisOrcamento, nomeUsuario }: OrcamentoPDFProps) => {

  // --- CÁLCULOS ---
  const subtotal = materiaisOrcamento.reduce((acc, item) => {
    const preco = Number(item.precoItemOrcamento ?? item.material?.precoVenda ?? 0);
    const itemTotal = preco * item.quantidadeMaterial;
    return acc + itemTotal;
  }, 0);

  const descontoPercentual = parseFloat(String(orcamento?.desconto || '0').replace(',', '.')) || 0;
  const valorDoDesconto = subtotal * (descontoPercentual / 100);
  const totalFinal = subtotal - valorDoDesconto;
  
  // Agrupa quantidades por unidade
  const quantitiesByUnit: Record<string, number> = {};
  materiaisOrcamento.forEach(item => {
    const unit = item.material?.unidade || 'UN';
    quantitiesByUnit[unit] = (quantitiesByUnit[unit] || 0) + (item.quantidadeMaterial || 0);
  });
  const quantitySummary = Object.entries(quantitiesByUnit)
    .map(([unit, qty]) => `${qty} ${unit}`)
    .join(' + ');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ========== CABEÇALHO ========== */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logoBase64} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>Master Elétrica</Text>
            <Text style={styles.companySubtitle}>Comércio e Serviço LTDA</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.companyInfo}>CNPJ: 35.051.479/0001-70</Text>
            <Text style={styles.companyInfo}>Av. Das Industrias, 375</Text>
            <Text style={styles.companyInfo}>Santa Luzia - MG</Text>
          </View>
        </View>

        {/* ========== TÍTULO DO ORÇAMENTO ========== */}
        <View style={styles.titleSection}>
          <View style={styles.titleBox}>
            <Text style={styles.documentType}>ORÇAMENTO</Text>
            <Text style={styles.documentNumber}>Nº {orcamento?.id || '---'}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Data de Emissão</Text>
            <Text style={styles.dateValue}>{formatDate(orcamento?.dataOrcamento)}</Text>
          </View>
        </View>

        {/* ========== DADOS DO CLIENTE ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>👤</Text>
            </View>
            <Text style={styles.sectionTitle}>DADOS DO CLIENTE</Text>
          </View>
          <View style={styles.clientCard}>
            <View style={styles.clientRow}>
              <View style={styles.clientField}>
                <Text style={styles.fieldLabel}>Nome / Razão Social</Text>
                <Text style={styles.fieldValue}>{orcamento?.nomeCliente || 'Não informado'}</Text>
              </View>
              <View style={styles.clientFieldSmall}>
                <Text style={styles.fieldLabel}>CPF / CNPJ</Text>
                <Text style={styles.fieldValue}>{orcamento?.cpfOrCnpj || 'Não informado'}</Text>
              </View>
            </View>
            <View style={styles.clientRow}>
              <View style={styles.clientField}>
                <Text style={styles.fieldLabel}>Endereço</Text>
                <Text style={styles.fieldValue}>{orcamento?.endereco || 'Não informado'}</Text>
              </View>
            </View>
            <View style={styles.clientRow}>
              <View style={styles.clientFieldSmall}>
                <Text style={styles.fieldLabel}>Telefone</Text>
                <Text style={styles.fieldValue}>{orcamento?.telefone || 'Não informado'}</Text>
              </View>
              <View style={styles.clientField}>
                <Text style={styles.fieldLabel}>E-mail</Text>
                <Text style={styles.fieldValue}>{orcamento?.emailCliente || 'Não informado'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========== TABELA DE MATERIAIS ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>📦</Text>
            </View>
            <Text style={styles.sectionTitle}>MATERIAIS</Text>
            <Text style={styles.itemCount}>{materiaisOrcamento.length} itens</Text>
          </View>
          
          {/* Header da Tabela */}
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.tableHeaderCell, { width: '8%' }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { width: '42%' }]}>Descrição</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%', textAlign: 'center' }]}>Qtd</Text>
            <Text style={[styles.tableHeaderCell, { width: '10%', textAlign: 'center' }]}>Un</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Unitário</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Total</Text>
          </View>

          {/* Linhas da Tabela */}
          {materiaisOrcamento.map((item, index) => {
            const preco = Number(item.precoItemOrcamento ?? item.material?.precoVenda ?? 0);
            const total = preco * item.quantidadeMaterial;
            const isEven = index % 2 === 0;
            
            return (
              <View 
                key={item.id} 
                style={isEven ? [styles.tableRow, styles.tableRowEven] : styles.tableRow} 
                wrap={false}
              >
                <Text style={[styles.tableCell, { width: '8%', color: colors.gray[400] }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text style={[styles.tableCell, { width: '42%' }]}>
                  {item.material?.descricao || 'Sem descrição'}
                </Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>
                  {item.quantidadeMaterial}
                </Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center', color: colors.gray[500] }]}>
                  {item.material?.unidade || 'UN'}
                </Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                  {formatCurrency(preco)}
                </Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                  {formatCurrency(total)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ========== RESUMO FINANCEIRO ========== */}
        <View style={styles.summarySection} wrap={false}>
          <View style={styles.summaryLeft}>
            {/* Condições de Pagamento */}
            <View style={styles.paymentBox}>
              <Text style={styles.paymentLabel}>Forma de Pagamento</Text>
              <Text style={styles.paymentValue}>{orcamento?.tipoPagamento || 'PIX'}</Text>
            </View>
            
            {/* Observações */}
            {orcamento?.observacoes && (
              <View style={styles.observationsBox}>
                <Text style={styles.observationsLabel}>Observações:</Text>
                <Text style={styles.observationsText}>{orcamento.observacoes}</Text>
              </View>
            )}
          </View>

          <View style={styles.summaryRight}>
            <View style={styles.totalsCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal ({materiaisOrcamento.length} itens)</Text>
                <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={styles.quantitySummaryRow}>
                <Text style={styles.quantitySummaryText}>Quantidades: {quantitySummary}</Text>
              </View>
              {descontoPercentual > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.discountLabel}>Desconto ({descontoPercentual}%)</Text>
                  <Text style={styles.discountValue}>- {formatCurrency(valorDoDesconto)}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>TOTAL</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(totalFinal)}</Text>
              </View>
            </View>
          </View>
        </View>



        {/* ========== RODAPÉ ========== */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLine} />
          <View style={styles.footerContent}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>Master Elétrica Comércio e Serviço LTDA</Text>
              <Text style={styles.footerSubtext}>(31) 3333-3333 | contato@mastereletrica.com.br</Text>
            </View>
            <View style={styles.footerCenter}>
              <Text style={styles.slogan}>Gerando melhorias, desenvolvendo soluções!</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.responsibleText}>Responsável: {nomeUsuario || orcamento?.responsavelOrcamento || 'Equipe Master'}</Text>
              <Text 
                style={styles.pageNumber} 
                render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} 
              />
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  page: { 
    fontFamily: 'Helvetica', 
    fontSize: 9, 
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 30, 
    color: colors.gray[800],
    backgroundColor: '#ffffff',
  },

  // Header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15, 
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
  },
  headerLeft: {
    width: '25%',
  },
  headerCenter: {
    width: '40%',
    textAlign: 'center',
  },
  headerRight: {
    width: '30%',
    textAlign: 'right',
  },
  logo: { 
    width: 90, 
    height: 'auto' 
  },
  companyName: { 
    fontSize: 16, 
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  companySubtitle: {
    fontSize: 10,
    color: colors.gray[600],
  },
  companyInfo: { 
    fontSize: 8, 
    color: colors.gray[500],
    marginBottom: 1,
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  documentType: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  documentNumber: {
    fontSize: 14,
    color: colors.gray[500],
  },
  dateBox: {
    backgroundColor: colors.gray[100],
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 8,
    color: colors.gray[500],
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[700],
  },

  // Sections
  section: { 
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    backgroundColor: colors.accent,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconText: {
    fontSize: 10,
  },
  sectionTitle: { 
    fontSize: 11, 
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  itemCount: {
    fontSize: 9,
    color: colors.gray[500],
    marginLeft: 'auto',
  },

  // Client Card
  clientCard: { 
    backgroundColor: colors.gray[50],
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 15,
  },
  clientField: {
    flex: 2,
  },
  clientFieldSmall: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 7,
    color: colors.gray[500],
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 10,
    color: colors.gray[800],
  },

  // Table
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray[100],
  },
  tableRowEven: {
    backgroundColor: colors.gray[50],
  },
  tableCell: { 
    fontSize: 9,
    color: colors.gray[700],
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
    gap: 20,
  },
  summaryLeft: {
    width: '50%',
  },
  summaryRight: {
    width: '45%',
  },
  paymentBox: {
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 8,
    color: colors.gray[500],
    marginBottom: 4,
  },
  paymentValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[800],
  },
  observationsBox: {
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    backgroundColor: '#fffbeb',
  },
  observationsLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[600],
    marginBottom: 4,
  },
  observationsText: {
    fontSize: 9,
    color: colors.gray[600],
    lineHeight: 1.4,
  },

  // Totals Card
  totalsCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 4,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    borderStyle: 'dashed',
  },
  totalLabel: {
    fontSize: 9,
    color: colors.gray[600],
  },
  totalValue: {
    fontSize: 10,
    color: colors.gray[700],
  },
  discountLabel: {
    fontSize: 9,
    color: colors.success,
  },
  discountValue: {
    fontSize: 10,
    color: colors.success,
  },
  quantitySummaryRow: {
    marginBottom: 6,
    paddingBottom: 6,
  },
  quantitySummaryText: {
    fontSize: 8,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },

  // Terms Section
  termsSection: {
    marginTop: 10,
  },
  termsBox: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[700],
    marginBottom: 6,
  },
  termsText: {
    fontSize: 8,
    color: colors.gray[500],
    marginBottom: 3,
  },

  // Footer
  footer: { 
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
  },
  footerLine: {
    height: 2,
    backgroundColor: colors.accent,
    marginBottom: 10,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    width: '35%',
  },
  footerCenter: {
    width: '30%',
    textAlign: 'center',
  },
  footerRight: {
    width: '30%',
    textAlign: 'right',
  },
  footerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray[600],
  },
  footerSubtext: {
    fontSize: 7,
    color: colors.gray[500],
  },
  slogan: { 
    fontStyle: 'italic', 
    fontSize: 8, 
    color: colors.gray[500],
  },
  responsibleText: {
    fontSize: 8,
    color: colors.gray[600],
  },
  pageNumber: {
    fontSize: 8,
    color: colors.gray[400],
    marginTop: 2,
  },
});

export default OrcamentoPDF;