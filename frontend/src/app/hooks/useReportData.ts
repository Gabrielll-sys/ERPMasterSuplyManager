"use client"
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IAtividadeRd } from '@/app/interfaces/IAtividadeRd';
import { IImagemAtividadeRd } from '@/app/interfaces/IImagemAtividadeRd';
import { IRelatorioDiario } from '@/app/interfaces/IRelatorioDiario';
import { getRelatorioDiarioById } from '@/app/services/RelatorioDiario.Services';
import { getAllAtivdadesInRd } from '@/app/services/AtvidadeRd.Service';
import { getAllImagensInAtividade } from '@/app/services/ImagensAtividadeRd.Service';

interface ImageWithBase64 extends IImagemAtividadeRd {
  base64Data?: string;
}

interface AtividadeWithImages extends IAtividadeRd {
  imagensAtividades?: ImageWithBase64[];
  allImagesLoaded?: boolean;
}

interface UseReportDataReturn {
  relatorioDiario: IRelatorioDiario | undefined;
  atividades: AtividadeWithImages[] | undefined;
  atividadesWithImages: AtividadeWithImages[];
  isLoading: boolean;
  isLoadingImages: boolean;
  isReportComplete: boolean;
  isPdfReady: boolean;
  loadingProgress: number;
  totalImages: number;
  loadedImages: number;
  refetchRelatorioDiario: () => void;
  refetchAtividades: () => void;
}

// Converte URL de imagem para base64
const imageUrlToBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao converter imagem para base64:', error);
    return null;
  }
};

export function useReportData(reportId: number): UseReportDataReturn {
  const [atividadesWithImages, setAtividadesWithImages] = useState<AtividadeWithImages[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  // Query para relatório
  const { data: relatorioDiario, refetch: refetchRelatorioDiario, isLoading: isLoadingRelatorio } = useQuery({
    queryKey: ["relatorio-diario", reportId],
    queryFn: () => getRelatorioDiarioById(reportId),
    staleTime: 72000000,
    gcTime: 72000000,
  });

  // Query para atividades
  const { data: atividades, refetch: refetchAtividades, isLoading: isLoadingAtividades } = useQuery<IAtividadeRd[]>({
    queryKey: ["atividades", `atividades-rd-${reportId}`],
    queryFn: () => getAllAtivdadesInRd(reportId),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  // Carrega todas as imagens de todas as atividades e converte para base64
  const loadAllImagesWithBase64 = useCallback(async () => {
    if (!atividades || atividades.length === 0) {
      setAtividadesWithImages([]);
      return;
    }

    setIsLoadingImages(true);
    setLoadedImages(0);

    try {
      // Primeiro, obter todas as atividades com suas imagens
      const atividadesComImagens: AtividadeWithImages[] = [];
      let totalImgCount = 0;

      // Buscar imagens de cada atividade
      for (const atividade of atividades) {
        const imagens = await getAllImagensInAtividade(atividade.id);
        totalImgCount += imagens.length;
        atividadesComImagens.push({
          ...atividade,
          imagensAtividades: imagens,
          allImagesLoaded: false,
        });
      }

      setTotalImages(totalImgCount);

      // Agora converter todas as imagens para base64
      let loadedCount = 0;
      const atividadesFinais: AtividadeWithImages[] = [];

      for (const atividade of atividadesComImagens) {
        if (atividade.imagensAtividades && atividade.imagensAtividades.length > 0) {
          const imagensComBase64: ImageWithBase64[] = [];

          for (const imagem of atividade.imagensAtividades) {
            if (imagem.urlImagem) {
              const base64 = await imageUrlToBase64(imagem.urlImagem);
              imagensComBase64.push({
                ...imagem,
                base64Data: base64 || undefined,
              });
              loadedCount++;
              setLoadedImages(loadedCount);
            } else {
              imagensComBase64.push(imagem);
            }
          }

          atividadesFinais.push({
            ...atividade,
            imagensAtividades: imagensComBase64,
            allImagesLoaded: true,
          });
        } else {
          atividadesFinais.push({
            ...atividade,
            allImagesLoaded: true,
          });
        }
      }

      setAtividadesWithImages(atividadesFinais);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setIsLoadingImages(false);
    }
  }, [atividades]);

  // Dispara carregamento quando atividades mudam
  useEffect(() => {
    if (atividades) {
      loadAllImagesWithBase64();
    }
  }, [atividades, loadAllImagesWithBase64]);

  // Verificar se relatório está completo
  const isReportComplete = atividades
    ? atividades.every(
      (a) => a.status && a.status !== '' && a.status !== 'Não Iniciada'
    ) && atividades.length > 0
    : false;

  // PDF está pronto quando todas as imagens estão carregadas
  const isPdfReady =
    !isLoadingImages &&
    atividadesWithImages.length > 0 &&
    atividadesWithImages.every((a) => a.allImagesLoaded);

  // Progresso de carregamento
  const loadingProgress = totalImages > 0 ? (loadedImages / totalImages) * 100 : 0;

  return {
    relatorioDiario,
    atividades,
    atividadesWithImages,
    isLoading: isLoadingRelatorio || isLoadingAtividades,
    isLoadingImages,
    isReportComplete,
    isPdfReady,
    loadingProgress,
    totalImages,
    loadedImages,
    refetchRelatorioDiario,
    refetchAtividades,
  };
}
