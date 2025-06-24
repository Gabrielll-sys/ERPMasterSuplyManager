// components/image/ImageModal.tsx

"use client";

import Image from "next/image";
import { Dialog, Flex, Button, IconButton } from "@radix-ui/themes";
import { Cross2Icon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Spinner } from "@nextui-org/react";

const ImageModal: React.FC<any> = ({
  isOpen,
  onClose,
  imageData,
  title,
  onDelete,
  onDownload,
  isProcessing = false,
  materialId
}) => {
  
  const handleDownload = () => {
    if (imageData?.urlImagem) {
      // Se onDownload for fornecido, usa a função personalizada
      if (onDownload) {
        onDownload();
      } else {
        // Comportamento padrão de download
        const link = document.createElement('a');
        link.href = imageData.urlImagem;
        link.download = `material_${materialId || 'image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content 
        className="DialogContent max-w-4xl" 
        style={{ 
          maxWidth: '90vw', 
          maxHeight: '90vh',
          width: 'auto',
          overflow: 'hidden'
        }}
      >
        <Dialog.Title className="text-center mb-4">
          {title}
        </Dialog.Title>
        
        {/* Container da Imagem */}
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          className="relative"
          style={{ minHeight: '200px' }}
        >
          {imageData?.urlImagem ? (
            <div className="relative w-full flex justify-center">
              <Image
                src={imageData.urlImagem}
                alt={title}
                width={imageData.width || 600}
                height={imageData.height || 400}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
                className="rounded-lg shadow-lg"
                priority
              />
              
              {/* Botão Download - Posicionado sobre a imagem */}
              <button
                onClick={handleDownload}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Baixar Imagem"
                title="Baixar Imagem"
                disabled={isProcessing}
              >
                <DownloadIcon height="18" width="18" className="text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" label="Carregando imagem..." />
            </div>
          )}
        </Flex>

        {/* Informações da Imagem */}
        {imageData && (
          <Flex justify="center" mt="3" gap="4" className="text-sm text-gray-600">
            <span>Largura: {imageData.width}px</span>
            <span>Altura: {imageData.height}px</span>
          </Flex>
        )}

        {/* Botões de Ação */}
        <Flex gap="3" mt="6" justify="between" align="center">
          {/* Botão Deletar (se a função for fornecida) */}
          {onDelete && (
            <Button
              variant="soft"
              color="red"
              size="3"
              onClick={handleDelete}
              disabled={isProcessing}
              className="cursor-pointer"
            >
              {isProcessing && <Spinner size="sm" />}
              <TrashIcon height="16" width="16" />
              {isProcessing ? "Deletando..." : "Deletar Imagem"}
            </Button>
          )}
          
          {/* Spacer se não há botão delete */}
          {!onDelete && <div />}

          {/* Botão Fechar */}
          <Dialog.Close>
            <Button variant="soft" color="gray" size="3">
              Fechar
            </Button>
          </Dialog.Close>
        </Flex>

        {/* Botão X no canto superior direito */}
        <Dialog.Close>
          <IconButton
            variant="ghost"
            color="gray"
            className="absolute top-3 right-3"
            aria-label="Fechar modal"
          >
            <Cross2Icon />
          </IconButton>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ImageModal;