/**
 * ImageGallerySection - Componente de Galeria de Imagens
 *
 * Este componente fornece uma interface completa para gerenciar fotos em checklists.
 *
 * FUNCIONALIDADES:
 * - Upload de imagens via drag-and-drop ou seleção de arquivo
 * - Galeria de imagens com grid responsivo
 * - Lightbox para visualização em tela cheia com navegação
 * - Modal de confirmação para exclusão de imagens
 * - Suporte a teclado (←, →, Esc) no lightbox
 *
 * PROPS:
 * @param images - Array de imagens do checklist
 * @param isLoadingImages - Estado de carregamento das imagens
 * @param isUploading - Estado de upload em andamento
 * @param uploadProgress - Progresso do upload (0-100), opcional
 * @param canUpload - Se o checklist está salvo e pode receber fotos
 * @param acceptedFormats - Formatos aceitos para exibição (ex: "JPG, PNG")
 * @param maxSizeMB - Tamanho máximo em MB para exibição
 * @param accentColor - Cor de destaque ("blue" ou "slate")
 * @param onFileSelect - Callback chamado quando um arquivo é selecionado
 * @param onDeleteImage - Callback chamado quando uma imagem é excluída
 *
 * @module ImageGallerySection
 * @version 1.0.0
 * @since 2026-01-29
 */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { IChecklistInspecaoImagem } from "../interfaces/IChecklistInspecaoImagem";

// ============================================
// TIPOS E INTERFACES
// ============================================

/**
 * Props do componente ImageGallerySection.
 * Todas as callbacks são obrigatórias para garantir integração correta.
 */
interface ImageGallerySectionProps {
  /** Lista de imagens já salvas no checklist */
  images: IChecklistInspecaoImagem[];
  /** Indica se as imagens estão sendo carregadas do servidor */
  isLoadingImages: boolean;
  /** Indica se há um upload em andamento */
  isUploading: boolean;
  /** Progresso do upload (0-100), usado para exibir barra de progresso */
  uploadProgress?: number;
  /** Se false, exibe mensagem para salvar o checklist primeiro */
  canUpload: boolean;
  /** Texto indicando formatos aceitos (apenas visual) */
  acceptedFormats?: string;
  /** Tamanho máximo em MB (apenas visual) */
  maxSizeMB?: number;
  /** Cor de destaque para botões e bordas */
  accentColor?: "blue" | "slate";
  /** Callback executado quando um arquivo é selecionado para upload */
  onFileSelect: (file: File) => void;
  /** Callback executado quando o usuário confirma a exclusão de uma imagem */
  onDeleteImage: (image: IChecklistInspecaoImagem) => Promise<void>;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ImageGallerySection({
  images,
  isLoadingImages,
  isUploading,
  uploadProgress,
  canUpload,
  acceptedFormats = "JPG, PNG ou WEBP",
  maxSizeMB = 3,
  accentColor = "blue",
  onFileSelect,
  onDeleteImage,
}: ImageGallerySectionProps) {
  // ============================================
  // ESTADOS LOCAIS
  // ============================================

  /** Referência para o input de arquivo oculto */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Indica se o usuário está arrastando um arquivo sobre a zona de drop */
  const [isDragging, setIsDragging] = useState(false);

  /** Índice da imagem atualmente sendo visualizada no lightbox (null = fechado) */
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  /** Imagem selecionada para exclusão (exibe modal de confirmação) */
  const [imageToDelete, setImageToDelete] = useState<IChecklistInspecaoImagem | null>(null);

  /** Indica que a exclusão está em andamento (loading no botão) */
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================
  // CLASSES DE COR BASEADAS NA PROP accentColor
  // ============================================

  const accent = accentColor === "blue" ? {
    bg: "bg-blue-600",
    bgHover: "hover:bg-blue-700",
    border: "border-blue-500",
    ring: "ring-blue-500/30",
    text: "text-blue-600",
    bgLight: "bg-blue-50",
  } : {
    bg: "bg-slate-900",
    bgHover: "hover:bg-slate-800",
    border: "border-slate-500",
    ring: "ring-slate-500/30",
    text: "text-slate-900",
    bgLight: "bg-slate-50",
  };

  // ============================================
  // HANDLERS DE DRAG AND DROP
  // ============================================

  /** Quando o arquivo entra na zona de drop */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canUpload && !isUploading) setIsDragging(true);
  }, [canUpload, isUploading]);

  /** Quando o arquivo sai da zona de drop */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /** Mantém a zona de drop ativa enquanto arrasta */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /** Quando o arquivo é solto na zona de drop */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canUpload || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Aceita apenas imagens
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    }
  }, [canUpload, isUploading, onFileSelect]);

  /** Handler para seleção de arquivo via input */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ============================================
  // HANDLERS DO LIGHTBOX
  // ============================================

  /** Abre o lightbox em uma imagem específica */
  const openLightbox = (index: number) => setViewerIndex(index);

  /** Fecha o lightbox */
  const closeLightbox = () => setViewerIndex(null);

  /** Navega entre imagens no lightbox */
  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    if (viewerIndex === null || images.length === 0) return;
    if (direction === "prev") {
      // Volta para a última imagem se estiver na primeira
      setViewerIndex((viewerIndex - 1 + images.length) % images.length);
    } else {
      // Vai para a primeira imagem se estiver na última
      setViewerIndex((viewerIndex + 1) % images.length);
    }
  }, [viewerIndex, images.length]);

  /** Navegação por teclado no lightbox */
  useEffect(() => {
    if (viewerIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, navigateLightbox]);

  // ============================================
  // HANDLERS DE EXCLUSÃO
  // ============================================

  /** Abre o modal de confirmação de exclusão */
  const requestDelete = (image: IChecklistInspecaoImagem) => {
    setImageToDelete(image);
  };

  /** Confirma a exclusão da imagem */
  const confirmDelete = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteImage(imageToDelete);
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  /** Cancela a exclusão */
  const cancelDelete = () => setImageToDelete(null);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Container Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Cabeçalho com título e contador de fotos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg ${accent.bgLight} flex items-center justify-center`}>
              <svg className={`w-4 h-4 ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            Fotos do Checklist
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
              {images.length} {images.length === 1 ? "foto" : "fotos"}
            </span>
            <span className="text-xs text-slate-400">Máx. {maxSizeMB}MB</span>
          </div>
        </div>

        {/* Estado: Checklist não salvo - Exibe mensagem de orientação */}
        {!canUpload && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Salve o checklist para adicionar fotos.
          </div>
        )}

        {/* Área de Upload (apenas quando checklist está salvo) */}
        {canUpload && (
          <div className="space-y-4">
            {/* Zona de Drag-and-Drop */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? `${accent.border} ${accent.bgLight} ${accent.ring} ring-4`
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />

              {/* Ícone central */}
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging ? accent.bg : "bg-slate-100"
              }`}>
                {isUploading ? (
                  <div className={`w-6 h-6 rounded-full border-2 ${accent.border} border-t-transparent animate-spin`} />
                ) : (
                  <svg className={`w-6 h-6 transition-colors ${isDragging ? "text-white" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Texto de instrução */}
              {isUploading ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Enviando imagem...</p>
                  {uploadProgress !== undefined && (
                    <div className="w-48 mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${accent.bg} rounded-full transition-all`} style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {isDragging ? "Solte a imagem aqui" : "Arraste uma foto ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-slate-500">{acceptedFormats}</p>
                </>
              )}
            </div>

            {/* Estado: Carregando imagens */}
            {isLoadingImages && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className={`w-4 h-4 rounded-full border-2 ${accent.border} border-t-transparent animate-spin`} />
                Carregando fotos...
              </div>
            )}

            {/* Estado: Nenhuma imagem */}
            {!isLoadingImages && images.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">Nenhuma foto adicionada ainda.</p>
              </div>
            )}

            {/* Grid de Imagens */}
            {!isLoadingImages && images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer transition-all hover:shadow-lg hover:border-slate-300"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Imagem */}
                    <img
                      src={img.imageUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Overlay com botão de excluir (aparece no hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                        <span className="text-white text-xs font-medium">Foto {index + 1}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDelete(img);
                          }}
                          className="p-2 rounded-lg bg-white/90 text-rose-600 hover:bg-white transition-colors shadow-sm"
                          title="Excluir foto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Borda de foco */}
                    <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-slate-400 transition-all pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Lightbox - Visualização em tela cheia */}
      {viewerIndex !== null && images[viewerIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Fechar (Esc)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contador de posição */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
            {viewerIndex + 1} de {images.length}
          </div>

          {/* Botão Anterior */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Anterior (←)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Imagem em destaque */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[viewerIndex].imageUrl}
              alt={`Foto ${viewerIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Botão Próxima */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Próxima (→)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {imageToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview da imagem */}
            <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={imageToDelete.imageUrl}
                alt="Imagem a ser excluída"
                className="w-full h-40 object-cover"
              />
            </div>

            {/* Conteúdo do modal */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">Excluir imagem?</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Esta ação remove a imagem do checklist e também do armazenamento na nuvem. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
