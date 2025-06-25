// 🎓 ARQUITETURA: Componente de UI focado em um único item.
// 📝 O QUE FAZ: Exibe um resumo de uma Ordem de Serviço e as ações relacionadas.
// 🤔 PORQUÊ: Componentizar o card permite estilizá-lo e gerenciá-lo de forma isolada.
// Qualquer mudança no design do card afeta apenas este arquivo.

import { IOrdemSeparacao } from "@/app/interfaces";
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, CheckCircleIcon, CogIcon } from "@heroicons/react/24/outline";

interface OsCardProps {
  os: IOrdemSeparacao;
  onViewDetails: (os: IOrdemSeparacao) => void;
}

export function OsCard({ os, onViewDetails }: OsCardProps) {
  // 🎓 HOOK DE NAVEGAÇÃO: `useRouter` do Next.js para navegação programática.
  // 🤔 PORQUÊ: É a forma padrão e otimizada de navegar entre páginas em um app Next.js,
  // aproveitando o prefetching e outras otimizações do framework.
  const router = useRouter();

  // 🎨 LÓGICA DE UI: Determina a cor e o texto do status.
  // Manter essa lógica simples dentro do componente de UI é aceitável.
  const status = {
    color: os.isAuthorized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
    text: os.isAuthorized ? 'Concluída' : 'Em Andamento',
    icon: os.isAuthorized ? <CheckCircleIcon className="h-4 w-4" /> : <CogIcon className="h-4 w-4" />,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col transition-shadow hover:shadow-xl">
      <header className="p-4 flex justify-between items-start border-b dark:border-gray-700">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            OS: {os.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={os.descricao}>
            {os.descricao}
          </p>
        </div>
        
        {/* 🎓 RADIX DROPDOWN MENU: Para ações secundárias. Acessível e customizável. */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-1 border dark:border-gray-700 w-48" sideOffset={5}>
              <DropdownMenu.Item onSelect={() => onViewDetails(os)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <EyeIcon className="h-4 w-4" /> Ver Detalhes
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => router.push(`/editing-os/${os.id}`)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <PencilIcon className="h-4 w-4" /> Editar OS
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
              <DropdownMenu.Item onSelect={() => alert(`Lógica para deletar a OS ${os.id} não implementada.`)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <TrashIcon className="h-4 w-4" /> Excluir OS
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>

      <div className="p-4 space-y-3 flex-grow">
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
          {status.icon}
          {status.text}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Responsável: <span className="font-medium text-gray-700 dark:text-gray-300">{os.responsavel}</span></p>
          <p>Abertura: <span className="font-medium text-gray-700 dark:text-gray-300">{dayjs(os.dataAbertura).format('DD/MM/YYYY')}</span></p>
        </div>
      </div>

      <footer className="p-4 border-t dark:border-gray-700">
        {/* 🎓 AÇÃO PRIMÁRIA: O botão de "Editar" é a ação mais comum e merece destaque. */}
        <button 
          onClick={() => router.push(`/editing-os/${os.id}`)}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Abrir OS
        </button>
      </footer>
    </div>
  );
}