/**
 * Página de Criação de Nova APR
 * 
 * Formulário completo para criar uma nova Análise Preliminar de Riscos.
 * Redireciona para edição após criar com sucesso.
 * 
 * @module APRCreate
 * @version 2.0.0 - UI/UX modernizada
 */

"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AprForm from "../AprForm";
import { createApr } from "../../services/Aprs.Service";
import { IApr } from "../../interfaces/IApr";

export default function AprCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mutation para criar APR
  const mutation = useMutation({
    mutationFn: (payload: IApr) => createApr(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aprs"] });
      // Redireciona para edição após criar
      if (data?.id) {
        router.push(`/apr/${data.id}`);
      } else {
        router.push("/apr");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Botão Voltar */}
          <button
            onClick={() => router.push("/apr")}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Ícone + Título */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nova APR</h1>
            <p className="text-sm text-slate-500">Preencha os dados da Análise Preliminar de Riscos</p>
          </div>
        </div>
      </header>

      {/* Formulário */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AprForm
          onSave={async (payload) => {
            await mutation.mutateAsync(payload);
          }}
          saving={mutation.isPending}
        />
      </main>
    </div>
  );
}
