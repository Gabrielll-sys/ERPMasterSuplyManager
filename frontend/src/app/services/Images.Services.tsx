import { BlobServiceClient, BlockBlobClient, ContainerClient } from "@azure/storage-blob";
import { IImage } from "../interfaces/IImage";
import { IImagemAtividadeRd } from "../interfaces/IImagemAtividadeRd";

const sas = process.env.NEXT_PUBLIC_AZURE_SAS;
const accountName = process.env.NEXT_PUBLIC_AZURE_NAME;

if (!sas || !accountName) {
  throw new Error('Azure SAS token or account name is missing.');
}

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sas}`);

export const uploadImageToAzure = async (image: string, fileName: string, containerName: string): Promise<string> => {
  try {
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blobName = `${Date.now()}-${fileName}`;
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
    
    const binaryImage = toArrayBuffer(image);
    await blockBlobClient.upload(binaryImage, binaryImage.byteLength);
    
    console.log('Imagem adicionada com sucesso!');
    const urlImagem = `https://${accountName}.blob.core.windows.net/${containerName}/${blockBlobClient.name}`;
    return urlImagem;
  } catch (err) {
    console.error('Erro ao adicionar a imagem:', err);
    throw err;
  }
}

export const deleteImageFromAzure = async (blobUrl: string | undefined, containerName: string) => {
  try {
    const blobName = extractNameBlobFromUrl(blobUrl);
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.delete();
    console.log('Imagem deletada com sucesso!');
  } catch (err) {
    console.error('Erro ao deletar a imagem:', err);
    throw err;
  }
};

export const deleteAllImagesFromAtividadeFromAzure = async (imagens: IImagemAtividadeRd[]) => {
  try {
    for (let imagem of imagens) {
      await deleteImageFromAzure(imagem.urlImagem, "images");
    }
  } catch (err) {
    console.error('Erro ao deletar imagens da atividade:', err);
    throw err;
  }
};

export async function getImageDimensions(url: string | undefined): Promise<IImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height, urlImagem: url });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url || '';
  });
}

const toArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64.split(',')[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const extractNameBlobFromUrl = (url: string | undefined): string => {
  if (!url) return "";
  return url.split("/").pop() || "";
};
