// components/image/types.ts

export interface IImageDimensions {
  width: number;
  height: number;
  urlImagem: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
  hasImage: boolean;
  acceptedFormats?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

export interface ImagePreviewProps {
  imageUrl: string | undefined;
  alt: string;
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
  isLoading?: boolean;
}

export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: IImageDimensions | undefined;
  title: string;
  onDelete?: () => void;
  onDownload?: () => void;
  isProcessing?: boolean;
  materialId?: string | number;
}