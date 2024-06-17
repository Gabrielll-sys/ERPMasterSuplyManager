import { BlobServiceClient, BlockBlobClient, ContainerClient } from "@azure/storage-blob";
import { IImageDimensions } from "../interfaces/IImageDimensions";

const sas = process.env.NEXT_PUBLIC_AZURE_SAS

const accountName = process.env.NEXT_PUBLIC_AZURE_NAME

const containerName = "images"

export const uploadImageToAzure = async (image:string,fileName:string) : Promise<string>  =>
{

    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sas}`);
    // @ts-ignore
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blobName = `${Date.now()}-${fileName}`;
    const blockBlobClient =await containerClient.getBlockBlobClient(blobName);

    
    const binaryImage = toArrayBuffer(image);

    try {

          await blockBlobClient.upload(binaryImage,image.length)

        console.log('Imagem adicionada com sucesso com sucesso!');
    } catch (err) {
        console.error('Erro ao adicionar a imagem:', err);
    }


    const urlImagem = "https://mastererpstorage.blob.core.windows.net/images/"+blockBlobClient.name;
    console.log(urlImagem)
    return urlImagem

}

export const  deleteImageFromAzure = async (blobUrl: string | undefined) => {

    
    const blobName = extractNameBlobFromUrl(blobUrl);
    
    console.log(blobName)
    // @ts-ignore
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sas}`);
    // @ts-ignore
    const containerClient : ContainerClient = await  blobServiceClient.getContainerClient(containerName);
    const blockBlobClient : BlockBlobClient = await containerClient.getBlockBlobClient(blobName);

    console.log(BlockBlobClient)
    try {
       const a =  await blockBlobClient.delete();
        console.log('Imagem deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar a imagem:', err);
    }
};


export async function getImageDimensions(url:string | undefined) : Promise<IImageDimensions> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      //@ts-ignore
      img.src = url;
    });
  }

// Converter a base64 para um ArrayBuffer (formato binário)
//Pega a segunda parte da string, ignorando o cabeçalho data:image/png;base64
const toArrayBuffer = (imagem:string)=>
{

 return Buffer.from(imagem.split(",")[1], 'base64')


}
const extractNameBlobFromUrl = (url:string | undefined)=>{
    return url?.split("/")[4]
}