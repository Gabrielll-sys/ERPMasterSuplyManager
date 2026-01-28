import axios from "axios";
import { url as apiUrl } from "../api/webApiUrl";

// ==========================================================
// SERVIÇO: R2Images.Services
// ==========================================================
// Este serviço lida com o upload de imagens para o Cloudflare R2.
// Padrão de 2 passos:
// 1. Pede uma URL autorizada (Pre-signed) ao Back-end.
// 2. Faz o upload (PUT) direto para a Cloudflare.

/**
 * Interface que representa a resposta do Back-end com os dados de upload
 */
interface R2PresignedResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  contentType: string;
}

/**
 * Função para converter uma string Base64 em um Blob (formato correto para upload)
 * ✅ USO: Para imagens em base64
 */
const base64ToBlob = (base64: string, contentType: string): Blob => {
  // Remove o prefixo data:image/xxx;base64, se existir
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: contentType });
};

/**
 * ✅ FUNÇÃO RECOMENDADA: Realiza o upload de uma imagem para o Cloudflare R2
 * Esta é a solução CORRETA que funciona 100%
 * 
 * @param imageBase64 A imagem em formato string Base64 (ex: data:image/jpeg;base64,...)
 * @param fileName O nome original do arquivo (ex: "minha-foto.jpg")
 * @param contentType O tipo MIME (ex: "image/jpeg")
 * @returns Um objeto com { publicUrl, fileKey } da imagem após o upload
 */
export const uploadImageToR2 = async (
  imageBase64: string,
  fileName: string,
  contentType: string
): Promise<{ publicUrl: string; fileKey: string }> => {
  try {
    console.log("[R2] Iniciando upload...");
    
    // ----------------------------------------------------------
    // PASSO 1: Obter a URL pré-assinada do Back-end
    // ----------------------------------------------------------
    console.log("[R2] Solicitando URL pré-assinada...");
    const presignedResponse = await axios.post<R2PresignedResponse>(
      `${apiUrl}/r2/presigned-url`,
      {
        fileName: fileName,
        contentType: contentType
      }
    );

    const { uploadUrl, publicUrl, fileKey, contentType: returnedContentType } = presignedResponse.data;
    console.log("[R2] URL pré-assinada recebida");

    // ----------------------------------------------------------
    // PASSO 2: Upload direto para o Cloudflare R2
    // ----------------------------------------------------------
    console.log("[R2] Convertendo imagem para Blob...");
    
    // ✅ Converter Base64 para Blob (formato correto)
    const imageBlob = base64ToBlob(imageBase64, contentType);

    console.log("[R2] Iniciando PUT request...");
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: imageBlob,
      headers: {
        // ✅ CORRETO: Enviar o Content-Type que foi assinado
        'Content-Type': returnedContentType || contentType
        // ❌ NÃO enviar 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD'
        // ❌ NÃO enviar 'Authorization' (já está na URL)
      }
    });

    // Verificar resposta
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("[R2] ERRO DETALHADO:", errorText);
      throw new Error(`R2 Upload Error: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    console.log("[R2] ✅ Upload bem-sucedido!");

    return {
      publicUrl: publicUrl,
      fileKey: fileKey
    };

  } catch (error) {
    console.error("[R2] Erro ao fazer upload:", error);
    throw error;
  }
};

/**
 * ⭐ SOLUÇÃO ALTERNATIVA: Upload via Proxy (Backend faz tudo)
 * Use esta função se ainda tiver problemas CORS
 * Mais seguro e confiável (credenciais R2 nunca expostas)
 * 
 * @param imageBase64 A imagem em formato string Base64
 * @param fileName O nome original do arquivo
 * @returns Um objeto com { publicUrl, fileKey } da imagem após o upload
 */
export const uploadImageViaProxy = async (
  imageBase64: string,
  fileName: string
): Promise<{ publicUrl: string; fileKey: string }> => {
  try {
    console.log("[Proxy] Iniciando upload via Backend...");
    
    // Converter Base64 para Blob
    const contentType = "image/jpeg"; // ou detectar do imageBase64
    const imageBlob = base64ToBlob(imageBase64, contentType);

    // Criar FormData para multipart/form-data
    const formData = new FormData();
    formData.append('file', imageBlob, fileName);

    console.log("[Proxy] Enviando para o servidor...");
    const response = await axios.post<{ publicUrl: string; fileKey: string }>(
      `${apiUrl}/r/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log("[Proxy] ✅ Upload concluído!");
    return {
      publicUrl: response.data.publicUrl,
      fileKey: response.data.fileKey
    };

  } catch (error) {
    console.error("[Proxy] Erro ao fazer upload:", error);
    throw error;
  }
};

/**
 * ✅ ALTERNATIVA EXTRA: Upload de File (não Base64)
 * Use esta função quando tiver um objeto File do input HTML
 * 
 * @param file O arquivo selecionado do input (type="file")
 * @returns Um objeto com { publicUrl, fileKey } da imagem após o upload
 */
export const uploadFileToR2 = async (
  file: File
): Promise<{ publicUrl: string; fileKey: string }> => {
  try {
    console.log("[R2-File] Iniciando upload de arquivo...");

    // ----------------------------------------------------------
    // PASSO 1: Obter URL pré-assinada
    // ----------------------------------------------------------
    const presignedResponse = await axios.post<R2PresignedResponse>(
      `${apiUrl}/r/presigned-url`,
      {
        fileName: file.name,
        contentType: file.type
      }
    );

    const { uploadUrl, publicUrl, fileKey, contentType: returnedContentType } = presignedResponse.data;
    console.log("[R2-File] URL pré-assinada recebida");

    // ----------------------------------------------------------
    // PASSO 2: Upload direto para R2
    // ----------------------------------------------------------
    console.log("[R2-File] Enviando arquivo...");
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': returnedContentType || file.type
      }
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("[R2-File] ERRO:", errorText);
      throw new Error(`Upload Error: ${uploadResponse.statusText}`);
    }

    console.log("[R2-File] ✅ Upload bem-sucedido!");
    return {
      publicUrl: publicUrl,
      fileKey: fileKey
    };

  } catch (error) {
    console.error("[R2-File] Erro:", error);
    throw error;
  }
};
