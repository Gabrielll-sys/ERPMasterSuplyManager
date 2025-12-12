"use client"
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import { logoBase64 } from '../assets/base64Logo';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';
import { getAllAtivdadesInRd } from '../services/AtvidadeRd.Service';
import { getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { imageUrlToBase64Cached, preloadImagesWithCache } from '../lib/imageCache';

interface RelatorioDiarioPDFProps {
  relatorioDiario: IRelatorioDiario;
  atividadesRd: IAtividadeRd[];
}

interface ImagemComCache extends IImagemAtividadeRd {
  base64?: string | null;
}

interface AtividadeComCache extends IAtividadeRd {
  imagensAtividades?: ImagemComCache[];
}

const RelatorioDiarioPDF: React.FC<RelatorioDiarioPDFProps> = ({ relatorioDiario, atividadesRd }) => {
  const [key, setKey] = useState(Date.now());
  const [atividades, setAtividades] = useState<AtividadeComCache[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

  useEffect(() => {
    setKey(Date.now());
    loadAllData();
  }, []);

  useEffect(() => {
    if (atividadesRd && atividadesRd.length > 0) {
      loadAllData();
    }
  }, [atividadesRd]);

  const loadAllData = async () => {
    setIsLoading(true);
    
    try {
      // Busca atividades com imagens
      const atividadesData = await getAllAtivdadesInRd(relatorioDiario.id);
      
      // Coleta todas as URLs de imagens para pré-carregar
      const allImageUrls: string[] = [];
      
      for (let atividade of atividadesData) {
        const imagens = await getAllImagensInAtividade(atividade.id);
        atividade.imagensAtividades = imagens;
        
        imagens.forEach(img => {
          if (img.urlImagem) {
            allImageUrls.push(img.urlImagem);
          }
        });
      }
      
      // Pré-carrega todas as imagens em paralelo com cache
      // Usa limite de 5 conexões simultâneas para não sobrecarregar
      await preloadImagesWithCache(allImageUrls, 5);
      
      // Atribui base64 das imagens do cache
      const atividadesComCache: AtividadeComCache[] = [];
      
      for (let atividade of atividadesData) {
        const imagensComCache: ImagemComCache[] = [];
        
        if (atividade.imagensAtividades) {
          for (let img of atividade.imagensAtividades) {
            const base64 = img.urlImagem ? await imageUrlToBase64Cached(img.urlImagem) : null;
            imagensComCache.push({
              ...img,
              base64
            });
          }
        }
        
        atividadesComCache.push({
          ...atividade,
          imagensAtividades: imagensComCache
        });
      }
      
      setAtividades(atividadesComCache);
    } catch (error) {
      console.error('Erro ao carregar dados para PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Concluída':
        return '#059669';
      case 'Em Andamento':
        return '#D97706';
      default:
        return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string | undefined) => {
    switch (status) {
      case 'Concluída':
        return '#ECFDF5';
      case 'Em Andamento':
        return '#FFFBEB';
      default:
        return '#F3F4F6';
    }
  };

  // Calcula todas as imagens em um array plano para renderização
  const todasImagens = useMemo(() => {
    const imagens: Array<{ imagem: ImagemComCache; atividade: AtividadeComCache; index: number }> = [];
    
    atividades.forEach(atividade => {
      atividade.imagensAtividades?.forEach((imagem, idx) => {
        imagens.push({ imagem, atividade, index: idx });
      });
    });
    
    return imagens;
  }, [atividades]);

  // Agrupa imagens em pares para renderização lado a lado
  const imagensPorPagina = useMemo(() => {
    const pares: Array<Array<{ imagem: ImagemComCache; atividade: AtividadeComCache; index: number }>> = [];
    
    for (let i = 0; i < todasImagens.length; i += 2) {
      const par = [todasImagens[i]];
      if (todasImagens[i + 1]) {
        par.push(todasImagens[i + 1]);
      }
      pares.push(par);
    }
    
    return pares;
  }, [todasImagens]);

  return (
    <Document key={key}>
      {/* Página de informações e atividades */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logoBase64} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>Master Elétrica Comércio e Serviço LTDA</Text>
            <Text style={styles.companyInfo}>CNPJ: 35.051.479/0001-70</Text>
            <Text style={styles.companyInfo}>Avenida Das Indústrias, 375 - Santa Luzia/MG</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.reportBadge}>
              <Text style={styles.reportBadgeText}>RELATÓRIO</Text>
              <Text style={styles.reportNumber}>Nº {relatorioDiario.id}</Text>
            </View>
          </View>
        </View>

        {/* Report Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data de Abertura</Text>
            <Text style={styles.infoValue}>
              {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY [às] HH:mm")}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dia da Semana</Text>
            <Text style={styles.infoValue}>{semana[dayjs(relatorioDiario.horarioAbertura).day()]}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: relatorioDiario.isFinished ? '#059669' : '#D97706' }]}>
              {relatorioDiario.isFinished ? "Finalizado" : "Em Análise"}
            </Text>
          </View>
        </View>

        {/* Client Info Box */}
        <View style={styles.clientBox}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>
          <View style={styles.clientGrid}>
            <View style={styles.clientRow}>
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>CLIENTE</Text>
                <Text style={styles.clientValue}>{relatorioDiario.empresa || '—'}</Text>
              </View>
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>CNPJ</Text>
                <Text style={styles.clientValue}>{relatorioDiario.cnpj || '—'}</Text>
              </View>
            </View>
            <View style={styles.clientRow}>
              <View style={styles.clientFieldFull}>
                <Text style={styles.clientLabel}>ENDEREÇO</Text>
                <Text style={styles.clientValue}>{relatorioDiario.endereco || '—'}</Text>
              </View>
            </View>
            <View style={styles.clientRow}>
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>CONTATO</Text>
                <Text style={styles.clientValue}>{relatorioDiario.contato || '—'}</Text>
              </View>
              <View style={styles.clientField}>
                <Text style={styles.clientLabel}>TELEFONE</Text>
                <Text style={styles.clientValue}>{relatorioDiario.telefone || '—'}</Text>
              </View>
            </View>
            <View style={styles.clientRow}>
              <View style={styles.clientFieldFull}>
                <Text style={styles.clientLabel}>RESPONSÁVEL</Text>
                <Text style={styles.clientValue}>{relatorioDiario.responsavelAbertura || '—'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Activities Section Title */}
        <View style={styles.activitiesSectionHeader}>
          <Text style={styles.sectionTitle}>Atividades Realizadas</Text>
          <Text style={styles.activityCount}>{atividades.length} {atividades.length === 1 ? 'atividade' : 'atividades'}</Text>
        </View>

        {/* Activities List */}
        {atividades.map((atividade: AtividadeComCache) => (
          <View wrap={false} key={atividade.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.activityNumberBadge}>
                <Text style={styles.activityNumberText}>{atividade.numeroAtividade}</Text>
              </View>
              <View style={styles.activityTitleContainer}>
                <Text style={styles.activityTitle}>{atividade.descricao?.toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(atividade.status) }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(atividade.status) }]}>
                    {atividade.status || 'Não Iniciada'}
                  </Text>
                </View>
              </View>
            </View>
            {atividade.observacoes && (
              <View style={styles.activityObservations}>
                <Text style={styles.observationsLabel}>Observações:</Text>
                <Text style={styles.observationsText}>{atividade.observacoes}</Text>
              </View>
            )}
            {/* Contador de imagens da atividade */}
            {atividade.imagensAtividades && atividade.imagensAtividades.length > 0 && (
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>
                  📷 {atividade.imagensAtividades.length} {atividade.imagensAtividades.length === 1 ? 'foto' : 'fotos'}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>

      {/* Páginas de Imagens - Layout otimizado 2 por linha */}
      {todasImagens.length > 0 && (
        <Page size="A4" style={styles.imagePage}>
          {/* Images Header */}
          <View style={styles.imagesHeader} fixed>
            <Text style={styles.sectionTitleLarge}>Registro Fotográfico</Text>
            <Text style={styles.imagesSubtitle}>
              Relatório Diário Nº {relatorioDiario.id} • {todasImagens.length} {todasImagens.length === 1 ? 'foto' : 'fotos'}
            </Text>
          </View>

          {/* Renderiza imagens em pares */}
          {imagensPorPagina.map((par, parIndex) => (
            <View key={parIndex} wrap={false} style={styles.imageRow}>
              {par.map(({ imagem, atividade, index }) => (
                <View key={imagem.id} style={styles.imageContainer}>
                  {/* Imagem */}
                  <Image
                    style={styles.optimizedImage}
                    src={imagem.base64 || imagem.urlImagem}
                  />
                  {/* Legenda com número da atividade */}
                  <View style={styles.imageLabelContainer}>
                    <View style={styles.imageLabelBadge}>
                      <Text style={styles.imageLabelNumber}>{atividade.numeroAtividade}</Text>
                    </View>
                    <Text style={styles.imageLabelText}>
                      {atividade.descricao}
                    </Text>
                  </View>
                </View>
              ))}
              {/* Se o par só tem 1 imagem, adiciona espaço vazio */}
              {par.length === 1 && (
                <View style={styles.imageContainerEmpty} />
              )}
            </View>
          ))}

          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} fixed />
        </Page>
      )}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 50,
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
  },
  imagePage: {
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#2A2E48',
  },
  headerLeft: {
    width: '25%',
  },
  headerCenter: {
    width: '45%',
    paddingLeft: 12,
  },
  headerRight: {
    width: '30%',
    alignItems: 'flex-end',
  },
  logo: {
    width: 110,
    height: 44,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  companyInfo: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  reportBadge: {
    backgroundColor: '#2A2E48',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  reportBadgeText: {
    fontSize: 7,
    color: '#FCDD74',
    letterSpacing: 1,
    marginBottom: 2,
  },
  reportNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Info Bar Styles
  infoBar: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 7,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Client Box Styles
  clientBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2A2E48',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#FCDD74',
  },
  clientGrid: {
    flexDirection: 'column',
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  clientField: {
    width: '50%',
    paddingRight: 8,
  },
  clientFieldFull: {
    width: '100%',
  },
  clientLabel: {
    fontSize: 7,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  clientValue: {
    fontSize: 9,
    color: '#1F2937',
  },
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 12,
  },
  // Activities Section
  activitiesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityCount: {
    fontSize: 9,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // Activity Card
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 10,
    alignItems: 'center',
  },
  activityNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2A2E48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityObservations: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  observationsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  observationsText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  imageCountBadge: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  imageCountText: {
    fontSize: 8,
    color: '#4F46E5',
    textAlign: 'center',
  },
  // Images Section - Otimizado
  imagesHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2A2E48',
  },
  sectionTitleLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2E48',
    marginBottom: 3,
  },
  imagesSubtitle: {
    fontSize: 9,
    color: '#6B7280',
  },
  // Layout otimizado para 2 imagens por linha
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageContainer: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageContainerEmpty: {
    width: '48%',
  },
  optimizedImage: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
  },
  imageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#FFFFFF',
  },
  imageLabelBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2A2E48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  imageLabelNumber: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  imageLabelText: {
    fontSize: 7,
    color: '#374151',
    flex: 1,
  },
  // Page Number
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#9CA3AF',
  },
});

export default RelatorioDiarioPDF;
