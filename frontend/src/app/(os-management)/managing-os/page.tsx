"use client";
import { useState, useEffect } from 'react';
import { useOsList } from '@/app/hooks/useOsList';
import { OsCreationForm } from '@/app/componentes/OsCreationForm';
import { OsList } from '@/app/componentes/OsList';
import { OsDetailsModal } from '@/app/componentes/OsDetailsModel';
import { IOrdemSeparacao } from '@/app/interfaces/IOrdemSeparacao';

export default function OsManagementPage() {
  const { ordens, isLoading, isError, error, createOs, isCreating } = useOsList();
  
  const [selectedOs, setSelectedOs] = useState<IOrdemSeparacao | null>(null);
  const [currentUser, setCurrentUser] = useState<{ userName: string } | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) setCurrentUser(user);
  }, []);

  return (
    //
    <>
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Gerenciamento de Ordens de Separação
          </h1>
        </header>
        
        {currentUser && (
          <OsCreationForm
            createOs={({ descricao, responsavel }) =>
              createOs({
                id: "", // ou gere um id temporário se necessário
                descricao,
                responsavel,
              } as any)
            }
            isCreating={isCreating}
            currentUser={currentUser}
          />
        )}
        
        {isLoading && <div className="text-center p-8">Carregando...</div>}
        
        {isError && <div className="text-center text-red-500 p-8">Erro: {error?.message}</div>}
        
        {/* 🎓 PASSANDO A FUNÇÃO HANDLER: Passamos a função que atualiza o estado `selectedOs`. */}
        {!isLoading && !isError && (
          <OsList ordens={ordens || []} onViewDetails={(os) => setSelectedOs(os)} />
        )}
      </div>

      {/* 🎓 RENDERIZAÇÃO CONDICIONAL DO MODAL: O modal só é montado se uma OS for selecionada. */}
      <OsDetailsModal
        os={selectedOs}
        isOpen={!!selectedOs} // `!!` converte o objeto (truthy) ou null (falsy) para um booleano.
        onClose={() => setSelectedOs(null)}
      />
    </>
  );
}