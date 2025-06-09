// components/image/ImagePreview.tsx

"use client";

import Image from "next/image";
import { Box } from "@radix-ui/themes";
import { Spinner } from "@nextui-org/react";
import { ImagePreviewProps } from "./types";

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  alt,
  onClick,
  className = "",
  width = 300,
  height = 200,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Box className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <Spinner size="lg" label="Carregando imagem..." />
      </Box>
    );
  }

  if (!imageUrl) {
    return (
      <Box 
        className={`flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <svg 
            className="w-12 h-12 mx-auto mb-2 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Nenhuma imagem</p>
        </div>
      </Box>
    );
  }

  return (
    <Box
      className={`relative bg-gray-100 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:opacity-80 hover:shadow-md' : ''
      } ${className}`}
      onClick={onClick}
      style={{ width, height }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'contain' }}
        className="rounded-lg"
        loading="lazy"
      />
      
      {/* Overlay com informações quando hover (opcional) */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      )}
    </Box>
  );
};

export default ImagePreview;