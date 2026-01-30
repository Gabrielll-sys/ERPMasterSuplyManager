import imageCompression from "browser-image-compression";

// Comprime a imagem para no maximo 3MB, mantendo boa qualidade.
export const compressChecklistImage = async (file: File) => {
  if (file.size <= 3 * 1024 * 1024) return file;

  const options = {
    maxSizeMB: 3,

    useWebWorker: true
  };

  return imageCompression(file, options);
};
