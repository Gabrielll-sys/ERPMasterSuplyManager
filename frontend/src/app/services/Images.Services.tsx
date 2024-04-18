import {BlobServiceClient, BlockBlobClient, ContainerClient} from "@azure/storage-blob";

const MY_CONNECTION_STRING :string = "";
const MY_CONTAINER_NAME : string = ""

export const uploadImagemToAzure = async (imgBlob: string, fileName: string)  =>
{
    const blobServiceClient = BlobServiceClient.fromConnectionString(MY_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(MY_CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.upload(imgBlob,imgBlob.length)


    const urlImagem = blockBlobClient.url;

}

export const  deleteFromAzure = async (fileName: string) => {

    const blobServiceClient :BlobServiceClient = BlobServiceClient.fromConnectionString(MY_CONNECTION_STRING);
    const containerClient : ContainerClient = blobServiceClient.getContainerClient(MY_CONTAINER_NAME);
    const blockBlobClient : BlockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
        await blockBlobClient.delete();
        console.log('Imagem deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar a imagem:', err);
    }
};