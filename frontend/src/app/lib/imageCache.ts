"use client"

// Cache global para imagens - evita chamadas repetidas ao Azure Storage
const imageCache = new Map<string, string>();
const imageCachePromises = new Map<string, Promise<string | null>>();

/**
 * Converte URL de imagem para base64 com cache
 * Evita múltiplas chamadas ao Azure Storage para a mesma imagem
 */
export const imageUrlToBase64Cached = async (url: string | undefined): Promise<string | null> => {
  if (!url) return null;

  // Verifica se já está em cache
  const cached = imageCache.get(url);
  if (cached) {
    return cached;
  }

  // Verifica se já existe uma promessa em andamento para esta URL
  const existingPromise = imageCachePromises.get(url);
  if (existingPromise) {
    return existingPromise;
  }

  // Cria nova promessa para carregar a imagem
  const loadPromise = (async (): Promise<string | null> => {
    try {
      const response = await fetch(url, {
        cache: 'force-cache', // Usa cache do navegador
      });

      if (!response.ok) {
        console.error(`Erro ao carregar imagem: ${response.status}`);
        return null;
      }

      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Salva no cache
          imageCache.set(url, base64);
          // Remove a promessa do cache de promessas
          imageCachePromises.delete(url);
          resolve(base64);
        };
        reader.onerror = () => {
          imageCachePromises.delete(url);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      imageCachePromises.delete(url);
      return null;
    }
  })();

  // Salva a promessa no cache
  imageCachePromises.set(url, loadPromise);

  return loadPromise;
};

/**
 * Pré-carrega múltiplas imagens em paralelo com limite de concorrência
 * @param urls Array de URLs para pré-carregar
 * @param concurrencyLimit Limite de downloads simultâneos (padrão: 5)
 */
export const preloadImagesWithCache = async (
  urls: (string | undefined)[],
  concurrencyLimit: number = 5,
  onProgress?: (loaded: number, total: number) => void
): Promise<Map<string, string | null>> => {
  const validUrls = urls.filter((url): url is string => !!url);
  const results = new Map<string, string | null>();
  let loadedCount = 0;

  // Função para processar URLs em lotes
  const processBatch = async (batch: string[]) => {
    const promises = batch.map(async (url) => {
      const base64 = await imageUrlToBase64Cached(url);
      results.set(url, base64);
      loadedCount++;
      onProgress?.(loadedCount, validUrls.length);
    });
    await Promise.all(promises);
  };

  // Processa em lotes para não sobrecarregar
  for (let i = 0; i < validUrls.length; i += concurrencyLimit) {
    const batch = validUrls.slice(i, i + concurrencyLimit);
    await processBatch(batch);
  }

  return results;
};

/**
 * Limpa o cache de imagens (útil quando precisar forçar recarregamento)
 */
export const clearImageCache = () => {
  imageCache.clear();
  imageCachePromises.clear();
};

/**
 * Retorna estatísticas do cache
 */
export const getImageCacheStats = () => {
  return {
    cachedImages: imageCache.size,
    pendingLoads: imageCachePromises.size,
  };
};

/**
 * Verifica se uma imagem está em cache
 */
export const isImageCached = (url: string): boolean => {
  return imageCache.has(url);
};

/**
 * Obtém imagem do cache (retorna undefined se não estiver em cache)
 */
export const getImageFromCache = (url: string): string | undefined => {
  return imageCache.get(url);
};
