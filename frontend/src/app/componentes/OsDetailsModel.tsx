

import { IOrdemSeparacao } from "@/app/interfaces/IOrdemSeparacao";
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";

// 🎓 TIPAGEM DE PROPS: Define o contrato do componente.
interface OsDetailsModalProps {
  os: IOrdemSeparacao | null; // Pode ser nulo quando o modal está fechado
  isOpen: boolean;
  onClose: () => void;
}

// 🎓 COMPONENTE DE ITEM DE DETALHE: Um pequeno componente interno para evitar repetição.
// 🤔 PORQUÊ: Cria um padrão visual consistente e reduz a verbosidade do JSX principal.
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-base font-medium text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);

export function OsDetailsModal({ os, isOpen, onClose }: OsDetailsModalProps) {
  const router = useRouter();

  // 🎓 EARLY RETURN: Se não houver OS, não renderiza nada.
  // 🤔 PORQUÊ: Evita erros de "cannot read property of null" e mantém a lógica limpa.
  if (!os) {
    return null;
  }
  
  const handleEditRedirect = () => {
    onClose(); // Fecha o modal antes de navegar
    router.push(`/editing-os/${os.id}`);
  }

  return (
    // 🎓 RADIX DIALOG ROOT: O container principal do diálogo.
    // Controla o estado de aberto/fechado através das props `open` e `onOpenChange`.
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      {/* 🎓 Dialog.Portal: Renderiza o modal no final do `body`, evitando problemas de z-index. */}
      <Dialog.Portal>
        {/* 🎓 Dialog.Overlay: O fundo escurecido. Clicar nele fecha o modal. */}
        <Dialog.Overlay className="bg-black/50 fixed inset-0 data-[state=open]:animate-overlayShow" />
        
        {/* 🎓 Dialog.Content: O container do conteúdo do modal. */}
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl focus:outline-none data-[state=open]:animate-contentShow">
          
          {/* 🎓 Dialog.Title: Título do modal. Importante para acessibilidade. */}
          <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Detalhes da OS: {os.id}
          </Dialog.Title>

          {/* 🎓 Dialog.Description: Descrição curta. Também importante para a11y. */}
          <Dialog.Description className="text-gray-600 dark:text-gray-400 mb-6 border-b dark:border-gray-700 pb-4">
            {os.descricao}
          </Dialog.Description>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <DetailItem label="Status" value={
                <span className={`px-2 py-1 text-xs rounded-full ${os.isAuthorized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {os.isAuthorized ? "Concluída" : "Em Andamento"}
                </span>
              }/>
              <DetailItem label="Responsável pela Abertura" value={os.responsavel} />
              <DetailItem label="Data de Abertura" value={dayjs(os.dataAbertura).format('DD/MM/YYYY [às] HH:mm')} />
              
              {/* 🎓 RENDERIZAÇÃO CONDICIONAL: Mostra campos apenas se eles existirem. */}
              {os.isAuthorized && os.dataAutorizacao && (
                <DetailItem label="Data de Conclusão" value={dayjs(os.dataAutorizacao).format('DD/MM/YYYY [às] HH:mm')} />
              )}
            </div>

            {os.observacoes && (
               <DetailItem label="Observações" value={
                 <p className="text-base font-normal text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border dark:border-gray-600 whitespace-pre-wrap">
                   {os.observacoes}
                 </p>
               }/>
            )}
            
            {os.isAuthorized && (
              <div className="pt-4 border-t dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem 
                  label="Preço Custo Total" 
                  value={os.precoCustoTotalOs?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}
                />
                <DetailItem 
                  label="Preço Venda Total" 
                  value={os.precoVendaTotalOs?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}
                />
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Fechar
            </button>
            <button
              onClick={handleEditRedirect}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              <PencilIcon className="h-4 w-4" />
              Editar OS
            </button>
          </div>

          {/* 🎓 Dialog.Close: Botão para fechar o modal. Pode ser posicionado em qualquer lugar. */}
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Fechar">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}