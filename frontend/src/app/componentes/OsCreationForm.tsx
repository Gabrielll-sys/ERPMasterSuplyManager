// 🎓 ARQUITETURA: Componente de UI focado na criação de uma nova OS.
// Ele é "controlado", ou seja, seu estado interno (o valor dos inputs) é gerenciado
// pelo React, e ele recebe a lógica de submissão como uma prop (`createOs`).

import { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

// 🎓 TIPAGEM DE PROPS: Define o "contrato" do componente.
// Fica claro que ele precisa de uma função para criar a OS, um booleano para
// indicar o estado de carregamento, e o objeto do usuário atual.
interface OsCreationFormProps {
  createOs: (data: { descricao: string; responsavel: string }) => void;
  isCreating: boolean;
  currentUser: { userName: string };
}

export function OsCreationForm({ createOs, isCreating, currentUser }: OsCreationFormProps) {
  // 🎓 ESTADO LOCAL: Gerencia o valor do campo de descrição.
  // 🤔 PORQUÊ: O conteúdo de um formulário é um exemplo clássico de "Estado do Cliente".
  // Ele pertence apenas a este componente e não precisa ser compartilhado globalmente.
  // Usar `useState` aqui é a abordagem mais simples e eficiente.
  const [descricao, setDescricao] = useState('');

  // 🎓 LÓGICA DE SUBMISSÃO: Função chamada quando o usuário confirma a criação.
  const handleConfirmCreation = () => {
    // 📝 O QUE FAZ: Chama a função `createOs` (que vem do `useMutation` no hook pai)
    // passando os dados formatados do formulário.
    createOs({
      descricao: descricao.trim(),
      responsavel: currentUser.userName,
    });
    
    // 📝 LIMPEZA DO FORMULÁRIO: Reseta o campo após o envio.
    // 🤔 PORQUÊ: Melhora a UX, deixando o formulário pronto para uma nova entrada
    // sem que o usuário precise apagar o texto anterior manualmente.
    setDescricao('');
  };

  // 🎓 VALIDAÇÃO SIMPLES: Uma variável booleana para controlar o estado do botão.
  // 🤔 PORQUÊ: Manter a lógica de validação em uma variável separada torna o JSX
  // (especificamente a prop `disabled` do botão) mais limpo e legível.
  const isFormValid = descricao.trim() !== '';

  return (
    // 🎓 RADIX ALERT DIALOG ROOT: O container que gerencia o estado do diálogo.
    <AlertDialog.Root>
      <div className="p-6 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center mb-4">
          <PlusCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
          Nova Ordem de Separação
        </h2>
        
        {/* === INÍCIO DA SEÇÃO DE INPUTS === */}
        <div className="space-y-2">
          {/* 🎓 LABEL: Associado ao input via `htmlFor`. Essencial para acessibilidade.
              Clicar no label foca no input correspondente. */}
          <label htmlFor="os-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição da OS
          </label>
          {/* 🎓 TEXTAREA: Usamos <textarea> em vez de <input> para descrições mais longas.
              É um componente "controlado" porque seu valor é gerenciado pelo estado do React. */}
          <textarea
            id="os-description"
            placeholder="Ex: Separação de itens para o cliente XPTO"
            value={descricao}
            // 📝 O QUE FAZ: Atualiza o estado `descricao` a cada tecla digitada.
            onChange={(e) => setDescricao(e.target.value)}
            rows={2} // Altura inicial do campo
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        {/* === FIM DA SEÇÃO DE INPUTS === */}

        <div className="mt-6">
          {/* 🎓 AlertDialog.Trigger: O botão que inicia o fluxo de confirmação.
              `asChild` faz com que o Radix use nosso botão customizado como o gatilho,
              em vez de renderizar seu próprio botão. */}
          <AlertDialog.Trigger asChild>
            <button
              disabled={!isFormValid || isCreating}
              className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Criando...' : 'Criar OS'}
            </button>
          </AlertDialog.Trigger>
        </div>
      </div>

      {/* 🎓 PORTAL: Renderiza o modal fora da hierarquia do componente, no final do <body>.
          Isso evita problemas de sobreposição (z-index) com outros elementos da página. */}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl focus:outline-none data-[state=open]:animate-contentShow">
          
          <AlertDialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Confirmar Criação
          </AlertDialog.Title>
          
          <AlertDialog.Description className="text-gray-600 dark:text-gray-300 mt-2">
            Você está prestes a criar uma nova Ordem de Separação. Deseja continuar?
          </AlertDialog.Description>
          
          <div className="flex justify-end gap-4 mt-6">
            {/* 🎓 AlertDialog.Cancel: Botão que fecha o diálogo sem executar a ação. */}
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Cancelar
              </button>
            </AlertDialog.Cancel>
            
            {/* 🎓 AlertDialog.Action: Botão que executa a ação principal. */}
            <AlertDialog.Action asChild>
              <button onClick={handleConfirmCreation} className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
                Sim, Criar
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}