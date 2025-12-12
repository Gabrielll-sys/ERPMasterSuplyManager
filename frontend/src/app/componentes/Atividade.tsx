"use client"
import { AlertColor, Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { Modal, ModalBody, ModalContent, ModalFooter, Spinner, Textarea, useDisclosure } from '@nextui-org/react';
import imageCompression from 'browser-image-compression';
import "dayjs/locale/pt-br";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconArrowDownCircle from '../assets/icons/IconArrowDownCircleFill';
import IconCamera from '../assets/icons/IconCamera';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addImagemAtividadeRd, deleteImagemAtividadeRd, getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import { deleteImageFromAzure, getImageDimensions, uploadImageToAzure } from '../services/Images.Services';
import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import IconTrash from '../assets/icons/IconTrash';
import { Camera, Trash2, Check, Clock, AlertCircle, X, Download, ChevronDown, ChevronUp, ImageIcon } from 'lucide-react';

type AtividadeProps = {
  relatorioDiario: IRelatorioDiario,
  atividade: IAtividadeRd,
  onUpdate: (atividade: IAtividadeRd, status: string | undefined, observacoes: string | undefined, descricao: string | undefined) => void,
  onDelete: any,
  isFinished: boolean,
}

const Atividade = ({ relatorioDiario, atividade, onUpdate, onDelete, isFinished }: AtividadeProps) => {
  const [imageModal, setImageModal] = useState<IImagemAtividadeRd>();
  const [widthImageModal, setWidthImageModal] = useState<number>(0);
  const [heightImageModal, setHeightImageModal] = useState<number>(0);
  const [observacoes, setObservacoes] = useState<string | undefined>(atividade.observacoes);
  const [checkboxStatus, setCheckboxStatus] = useState(atividade.status);
  const [descricao, setDescricao] = useState(atividade.descricao);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>();
  const [severidadeAlert, setSeveridadeAlert] = useState<AlertColor>();
  const [blockButton, setBlockButton] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subindoImagem, setSubindoImagem] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const queryClient = useQueryClient();

  const { data: imagesInAtividades, refetch: refetchImagensInAtividadeRd, isFetching } = useQuery<IImagemAtividadeRd[]>({
    queryKey: ['imagesInAtividades', atividade.id],
    enabled: relatorioDiario?.id != undefined,
    staleTime: isFinished ? (1 * 1000 * 60 * 60 * 24) * 20 : 1 * 1000 * 60 * 60 * 8,
    gcTime: isFinished ? (1 * 1000 * 60 * 60 * 24) * 20 : 1 * 1000 * 60 * 60 * 8,
    queryFn: () => getAllImagensInAtividade(atividade.id),
  });

  useEffect(() => {
    if (imagesInAtividades) {
      imagesInAtividades.forEach(async (image) => {
        const dimensions = await getImageDimensions(image.urlImagem);
        image.height = dimensions.height;
        image.width = dimensions.width;
      });
    }
  }, [imagesInAtividades]);

  const deleteAtividadeMutation = useMutation({
    mutationFn: (id: number | undefined) => onDelete(id),
    onMutate: () => setBlockButton(true),
    onSuccess: () => setBlockButton(false),
  });

  const addImagemAtividadeMutation = useMutation({
    mutationFn: addImagemAtividadeRd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagens', atividade.id] });
      refetchImagensInAtividadeRd();
      setOpenSnackBar(true);
      setSeveridadeAlert('success');
      setMessageAlert('Imagem adicionada à atividade');
    },
    onError: () => {
      setOpenSnackBar(true);
      setSeveridadeAlert('error');
      setMessageAlert('Erro ao adicionar imagem');
    }
  });

  const deleteImagemAtividadeMutation = useMutation({
    mutationFn: async () => {
      if (imageModal) {
        await deleteImageFromAzure(imageModal.urlImagem, "images");
        await deleteImagemAtividadeRd(imageModal.id);
      }
    },
    onMutate: () => setBlockButton(true),
    onSuccess: () => {
      setBlockButton(false);
      refetchImagensInAtividadeRd();
      onClose();
      setImageModal(undefined);
    },
  });

  const handleImageChange = async (event: any) => {
    const selectedImage: File = event.target.files[0];

    if (selectedImage !== undefined) {
      let imageFile = selectedImage;

      if (selectedImage.type === 'image/jpeg') {
        imageFile = await convertToPng(selectedImage);
      }

      const imageBase64 = await readImageFromFile(imageFile);

      setSubindoImagem(true);
      const urlImagem = await uploadImageToAzure(imageBase64, imageFile.name, "images");

      //@ts-ignore
      addImagemAtividadeMutation.mutate({
        atividadeRdId: atividade.id,
        descricao: atividade.descricao,
        urlImagem: urlImagem,
        imageName: imageFile.name
      });
    }
    setSubindoImagem(false);
  };

  const handleImageModal = async (imageModal: IImagemAtividadeRd) => {
    const res: any = await getImageDimensions(imageModal.urlImagem);
    setWidthImageModal(res.width);
    setHeightImageModal(res.height);
    setImageModal(imageModal);
  };

  const readImageFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertToPng = async (file: File): Promise<File> => {
    const options = {
      maxSizeMb: 3,
      maxWidthOrHeight: 2000,
      fileType: 'image/png',
    };
    return await imageCompression(file, options);
  };

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'Concluída':
        return {
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          icon: <Check className="w-4 h-4" />,
          label: 'Concluída'
        };
      case 'Em Andamento':
        return {
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Em Andamento'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Não Iniciada'
        };
    }
  };

  const statusConfig = getStatusConfig(checkboxStatus);

  return (
    <>
      <div className="bg-white">
        {/* Activity Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {atividade.numeroAtividade}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{atividade.descricao}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
                {imagesInAtividades && imagesInAtividades.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    <ImageIcon className="w-3 h-3" />
                    {imagesInAtividades.length} {imagesInAtividades.length === 1 ? 'imagem' : 'imagens'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            {/* Description Edit */}
            {!isFinished && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  value={descricao}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onBlur={() => onUpdate(atividade, checkboxStatus, observacoes, descricao)}
                  onChange={(x) => setDescricao(x.target.value)}
                  placeholder="Descrição da atividade"
                />
              </div>
            )}

            {/* Status Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {!relatorioDiario?.isFinished ? (
                <div className="flex flex-wrap gap-2">
                  {['Não Iniciada', 'Em Andamento', 'Concluída'].map((status) => {
                    const config = getStatusConfig(status);
                    const isSelected = checkboxStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          setCheckboxStatus(status);
                          onUpdate(atividade, status, observacoes, descricao);
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? `${config.bgColor} ${config.textColor} border-2 ${config.borderColor} shadow-sm`
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        {config.icon}
                        {status}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                  {statusConfig.icon}
                  {checkboxStatus || 'Não Iniciada'}
                </div>
              )}
            </div>

            {/* Observations */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              {!relatorioDiario?.isFinished ? (
                <Textarea
                  placeholder="Adicione observações sobre a atividade..."
                  className="w-full border border-gray-200 rounded-lg bg-white"
                  rows={4}
                  value={observacoes}
                  onValueChange={setObservacoes}
                  onBlur={() => onUpdate(atividade, checkboxStatus, observacoes, descricao)}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg min-h-[80px]">
                  <p className="text-gray-700 italic">{observacoes || 'Sem observações'}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isFinished && (
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Excluir Atividade
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Title>Excluir Atividade</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Tem certeza que deseja excluir esta atividade? Todas as imagens vinculadas também serão apagadas. Esta ação não pode ser desfeita.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancelar
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          color="red"
                          onClick={() => deleteAtividadeMutation.mutate(atividade.id)}
                        >
                          Excluir
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Adicionar Imagem
                </button>
              </div>
            )}

            {/* Image Gallery */}
            {(imagesInAtividades?.length || subindoImagem) && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagens ({imagesInAtividades?.length || 0})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagesInAtividades?.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
                      onClick={() => {
                        onOpenChange();
                        handleImageModal(image);
                      }}
                    >
                      <Image
                        src={image.urlImagem ?? ""}
                        alt={image.descricao ?? "Imagem da atividade"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Download className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {subindoImagem && (
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Spinner size="lg" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal isOpen={isOpen} backdrop="blur" size='xl' onOpenChange={onOpenChange} classNames={{
        backdrop: "bg-black/60 backdrop-blur-sm"
      }}>
        <ModalContent className="bg-white rounded-2xl overflow-hidden">
          {(onClose) => (
            <>
              <ModalBody className="p-0 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {imageModal ? (
                  <div className="relative w-full flex items-center justify-center bg-gray-900 min-h-[400px]">
                    <Image
                      src={imageModal.urlImagem ?? ""}
                      alt="Imagem da Atividade"
                      width={widthImageModal || 800}
                      height={heightImageModal || 600}
                      className="max-w-full max-h-[70vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Spinner size="lg" />
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="flex flex-row justify-between p-4 bg-gray-50">
                <a
                  href={imageModal?.urlImagem}
                  download={imageModal?.descricao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar Imagem
                </a>
                {!relatorioDiario?.isFinished && (
                  <button
                    onClick={() => deleteImagemAtividadeMutation.mutate()}
                    disabled={blockButton}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Imagem
                  </button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={openSnackBar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        autoHideDuration={2000}
        onClose={() => setOpenSnackBar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackBar(false)}
          severity={severidadeAlert}
          sx={{ width: "100%" }}
        >
          {messageAlert}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Atividade;
