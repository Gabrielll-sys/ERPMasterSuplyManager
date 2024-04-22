import {BlobServiceClient, BlockBlobClient, ContainerClient} from "@azure/storage-blob";


export const uploadImageToAzure = async (image:string,fileName:string)  =>
{
    // @ts-ignore
    const blobServiceClient = BlobServiceClient.fromConnectionString(rocess.env.AZURE_CONNECTION_STRING);
    // @ts-ignore
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME );
    const blobName = `${Date.now()}-${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(image,image.length)


    const urlImagem = blockBlobClient.url;


}

export const  deleteFromAzure = async (fileName: string) => {

    // @ts-ignore
    const blobServiceClient :BlobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
    // @ts-ignore
    const containerClient : ContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
    const blockBlobClient : BlockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
        await blockBlobClient.delete();
        console.log('Imagem deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar a imagem:', err);
    }
};