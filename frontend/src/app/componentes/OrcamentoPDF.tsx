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
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

// --- COMPONENTE PRINCIPAL ---
const OrcamentoPDF = ({ orcamento, materiaisOrcamento, nomeUsuario }: OrcamentoPDFProps) => {

  // --- CÁLCULOS CORRIGIDOS ---
  // Calcula o valor bruto total dos itens.
  const subtotal = materiaisOrcamento.reduce((acc, item) => {
    const itemTotal = (item.precoItemOrcamento ?? item.material?.precoVenda ?? 0) * item.quantidadeMaterial;
    return acc + itemTotal;
  }, 0);

  // Garante que o percentual de desconto seja um número válido.
  const descontoPercentual = parseFloat(String(orcamento?.desconto || '0').replace(',', '.')) || 0;
  
  // Calcula o valor monetário do desconto.
  const valorDoDesconto = subtotal * (descontoPercentual / 100);

  // Calcula o valor final após o desconto.
  const totalFinal = subtotal - valorDoDesconto;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABEÇALHO */}
        <View style={styles.header} fixed>
          <Image style={styles.logo} src={logoBase64} />
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>Master Elétrica Comércio e Serviço LTDA </Text>
            <Text style={styles.companyInfo}>35.051.479/0001-70 </Text>
            <Text style={styles.companyInfo}>Avenida Das Industrias, 375 - Santa Luzia, MG </Text>
          </View>
        </View>

        {/* INFORMAÇÕES DO ORÇAMENTO E CLIENTE */}
        <View style={styles.section}>
          <Text style={styles.title}>Orçamento Nº {orcamento?.id}</Text>
          <View style={styles.customerBox}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.text}>{orcamento?.nomeCliente || 'Não informado'}</Text>
            {orcamento?.endereco && <Text style={styles.text}>Endereço: {orcamento.endereco}</Text>}
            {orcamento?.emailCliente && <Text style={styles.text}>Email: {orcamento.emailCliente}</Text>}
            {orcamento?.telefone && <Text style={styles.text}>Telefone: {orcamento.telefone}</Text>}
            {orcamento?.cpfOrCnpj && <Text style={styles.text}>CPF/CNPJ: {orcamento.cpfOrCnpj}</Text>}
          </View>
        </View>

        {/* CONTAINER PRINCIPAL COM FLEX PARA CONTROLAR O ESPAÇO */}
        <View style={styles.mainContent}>
          {/* TABELA DE MATERIAIS */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader} fixed>
              <Text style={[styles.tableCol, { width: '45%' }]}>Descrição</Text>
              <Text style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}>Qtd.</Text>
              <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Preço UN</Text>
              <Text style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}>Total</Text>
            </View>
            {materiaisOrcamento.map(item => (
              <View key={item.id} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, { width: '45%', textAlign: 'left' }]}>{item.material?.descricao}</Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>{`${item.quantidadeMaterial} ${item.material?.unidade}`}</Text>
                <Text style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}>{formatCurrency(Number(item.precoItemOrcamento || item.material?.precoVenda))}</Text>
                <Text style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}>{formatCurrency(Number((item.precoItemOrcamento || item.material?.precoVenda || 0)) * item.quantidadeMaterial)}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* RODAPÉ E TOTAIS - AGORA SEM POSITION ABSOLUTE */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            {/* Lado Esquerdo do Rodapé */}
            <View style={styles.footerLeft}>
              <View>
                  <Text style={styles.label}>Condições de Pagamento:</Text>
                  <Text style={styles.text}>{orcamento?.tipoPagamento || 'PIX'}</Text>
              </View>
              <View>
                  <Text style={styles.label}>Data do Orçamento:</Text>
                  <Text style={styles.text}>{formatDate(orcamento?.dataOrcamento)}</Text>
              </View>
              {orcamento?.observacoes && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>Observações:</Text>
                  <Text style={styles.text}>{orcamento.observacoes}</Text>
                </View>
              )}
            </View>

            {/* Lado Direito do Rodapé (Caixa de Totais) */}
            <View style={styles.footerRight}>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Subtotal:</Text>
                        <Text style={styles.text}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Desconto ({descontoPercentual}%):</Text>
                        <Text style={styles.text}>- {formatCurrency(valorDoDesconto)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>TOTAL:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(totalFinal)}</Text>
                    </View>
                </View>
            </View>
          </View>
          
          {/* Assinatura Centralizada */}
          <View style={styles.signatureSection}>
            <Text style={styles.text}>Atenciosamente,</Text>
            <Text style={styles.text}>{nomeUsuario || 'Equipe Master Elétrica'}</Text>
            <Text style={styles.slogan}>Gerando melhorias, desenvolvendo soluções!</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// --- ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
    page: { 
      fontFamily: 'Helvetica', 
      fontSize: 10, 
      padding: 30, 
      color: '#333',
      flexDirection: 'column',
      minHeight: '100%'
    },
    header: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      borderBottomWidth: 2, 
      borderBottomColor: '#f2c301', 
      paddingBottom: 10, 
      marginBottom: 20 
    },
    logo: { width: 120, height: 'auto' },
    companyDetails: { textAlign: 'right' },
    companyName: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
    companyInfo: { fontSize: 9, color: '#555' },
    section: { marginBottom: 15 },
    title: { 
      fontSize: 16, 
      fontFamily: 'Helvetica-Bold', 
      textAlign: 'center', 
      marginBottom: 15, 
      backgroundColor: '#f3f4f6', 
      padding: 5, 
      borderRadius: 3 
    },
    customerBox: { 
      border: '1px solid #e5e7eb', 
      borderRadius: 3, 
      padding: 10 
    },
    label: { 
      fontFamily: 'Helvetica-Bold', 
      marginBottom: 2, 
      color: '#111' 
    },
    text: { 
      marginBottom: 5, 
      color: '#333' 
    },
    mainContent: {
      flex: 1,
      minHeight: 0
    },
    tableContainer: { 
      display: "flex", 
      width: "100%",
      marginBottom: 20
    },
    tableHeader: { 
      flexDirection: 'row', 
      backgroundColor: '#EBE2AB', 
      borderBottomWidth: 1, 
      borderBottomColor: '#999', 
      padding: 5, 
      fontFamily: 'Helvetica-Bold' 
    },
    tableRow: { 
      flexDirection: 'row', 
      borderBottomWidth: 1, 
      borderBottomColor: '#eee' 
    },
    tableCol: { 
      fontSize: 10, 
      padding: 5 
    },
    tableCell: { 
      padding: 5, 
      fontSize: 9 
    },
    summaryBox: { 
      width: '100%', 
      border: '1px solid #e5e7eb', 
      borderRadius: 3, 
      padding: 10, 
      backgroundColor: '#fafafa' 
    },
    summaryRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 4 
    },
    totalRow: { 
      borderTopWidth: 1, 
      borderTopColor: '#999', 
      marginTop: 5, 
      paddingTop: 5 
    },
    totalLabel: { 
      fontFamily: 'Helvetica-Bold', 
      fontSize: 12 
    },
    totalValue: { 
      fontFamily: 'Helvetica-Bold', 
      fontSize: 12 
    },
    footer: { 
      borderTopWidth: 2, 
      borderTopColor: '#f2c301', 
      paddingTop: 15,
      marginTop: 'auto'
    },
    footerContent: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
      marginBottom: 20 
    },
    footerLeft: { 
      width: '55%' 
    },
    footerRight: { 
      width: '40%' 
    },
    signatureSection: { 
      textAlign: 'center', 
      color: '#555' 
    },
    slogan: { 
      fontStyle: 'italic', 
      fontSize: 9, 
      color: '#777', 
      marginTop: 4 
    }
});

export default OrcamentoPDF;