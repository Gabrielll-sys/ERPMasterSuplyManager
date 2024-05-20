import { BlobServiceClient, BlockBlobClient, ContainerClient } from "@azure/storage-blob";

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

    // Converter a base64 para um ArrayBuffer (formato binário)
    //Pega a segunda parte da string, ignorando o cabeçalho data:image/png;base64
    const binaryImage = Buffer.from(image.split(",")[1], 'base64');

    try {
          await blockBlobClient.upload(binaryImage,image.length)

        console.log('Imagem adicionada com sucesso com sucesso!');
    } catch (err) {
        console.error('Erro ao adicionar a imagem:', err);
    }


    const urlImagem = blockBlobClient.url;
    console.log(urlImagem)
    return urlImagem

}

export const  deleteImageFromAzure = async (fileName: string) => {

    const blobName = fileName.split('/').slice(2).join('/');

    // @ts-ignore
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sas}`);
    // @ts-ignore
    const containerClient : ContainerClient = await  blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
    const blockBlobClient : BlockBlobClient = await containerClient.getBlockBlobClient(blobName);

    console.log(BlockBlobClient)
    try {
       const a =  await blockBlobClient.delete();
       console.log(a)
        console.log('Imagem deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar a imagem:', err);
    }
};