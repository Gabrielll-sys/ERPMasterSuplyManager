

import { IOrdemSeparacao } from "@/app/interfaces";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { OsCard } from "./OsCard";

// 🎓 TIPAGEM DE PROPS: Define claramente o que o componente espera.
// É um "contrato" que garante que ele receberá os dados corretos.
interface OsListProps {
  ordens: IOrdemSeparacao[];
  onViewDetails: (os: IOrdemSeparacao) => void; // Função para abrir o modal de detalhes
}

export function OsList({ ordens, onViewDetails }: OsListProps) {

  if (!ordens || ordens.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-16">
        <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold">Nenhuma Ordem de Separação Encontrada</h3>
        <p>Crie uma nova OS no formulário acima para começar.</p>
      </div>
    );
  }

  // 🎓 RENDERIZAÇÃO DA LISTA: Um grid responsivo para os cards.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ordens.map((os) => (
   
        <OsCard key={os.id} os={os} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}