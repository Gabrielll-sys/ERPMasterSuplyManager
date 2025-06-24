// components/image/ImageUpload.tsx

"use client";

import { useRef } from "react";
import { Button } from "@radix-ui/themes";
import { CameraIcon } from '@radix-ui/react-icons';
import { Spinner } from "@nextui-org/react";

const ImageUpload: React.FC<any> = ({
  onImageSelect,
  isProcessing,
  hasImage,
  acceptedFormats = "image/png, image/jpeg",
  maxSizeMB = 5,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validação de tamanho
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return;
    }

    // Validação de formato
    const allowedTypes = acceptedFormats.split(', ').map((type:any) => type.trim());
    if (!allowedTypes.includes(selectedFile.type)) {
      alert(`Formato não suportado. Formatos aceitos: ${acceptedFormats}`);
      return;
    }

    onImageSelect(selectedFile);

    // Limpa o input para permitir selecionar a mesma imagem novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept={acceptedFormats}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Selecionar arquivo de imagem"
      />
      
      <Button
        variant="soft"
        size="3"
        onClick={handleButtonClick}
        disabled={isProcessing || disabled}
        className="cursor-pointer"
      >
        {isProcessing && <Spinner size="sm" />}
        <CameraIcon height="16" width="16" />
        {isProcessing ? "Processando..." : hasImage ? "Alterar Imagem" : "Subir Imagem"}
      </Button>
    </>
  );
};

export default ImageUpload;