/**
 * Página de Criação de Nova APR
 *
 * Permite criar dois tipos de APR:
 * - APR Completa: formulário detalhado para trabalhos complexos
 * - APR Rápida: formulário simplificado para atividades simples
 *
 * @module APRCreate
 * @version 3.0.0 - Suporte a APR Rápida
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AprForm from "../AprForm";
import AprRapidaForm from "../AprRapidaForm";
import { createApr } from "../../services/Aprs.Service";
import { IApr } from "../../interfaces/IApr";

// Tipo de APR selecionado
type TipoApr = "completa" | "rapida";

export default function AprCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Estado do tipo de APR selecionado (default: rápida para facilitar)
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoApr>("rapida");

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
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
              tipoSelecionado === "rapida"
                ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20"
                : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20"
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nova APR</h1>
            <p className="text-sm text-slate-500">
              {tipoSelecionado === "rapida"
                ? "Formulário simplificado para atividades simples"
                : "Formulário completo para trabalhos de risco"}
            </p>
          </div>
        </div>
      </header>

      {/* Seletor de Tipo de APR */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700 mb-3">Selecione o tipo de APR:</p>
          <div className="flex flex-wrap gap-3">
            {/* Opção: APR Rápida */}
            <button
              onClick={() => setTipoSelecionado("rapida")}
              className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all ${
                tipoSelecionado === "rapida"
                  ? "border-amber-500 bg-amber-50"
                  : "border-slate-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tipoSelecionado === "rapida" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${tipoSelecionado === "rapida" ? "text-amber-800" : "text-slate-700"}`}>
                    APR Rápida
                  </p>
                  <p className="text-xs text-slate-500">5 EPIs • 5 Riscos • 3-5 min</p>
                </div>
              </div>
            </button>

            {/* Opção: APR Completa */}
            <button
              onClick={() => setTipoSelecionado("completa")}
              className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all ${
                tipoSelecionado === "completa"
                  ? "border-rose-500 bg-rose-50"
                  : "border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tipoSelecionado === "completa" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${tipoSelecionado === "completa" ? "text-rose-800" : "text-slate-700"}`}>
                    APR Completa
                  </p>
                  <p className="text-xs text-slate-500">Altura • Espaço Confinado • Elétrica • Quente</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Formulário baseado no tipo selecionado */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {tipoSelecionado === "rapida" ? (
          <AprRapidaForm
            onSave={async (payload) => {
              await mutation.mutateAsync(payload);
            }}
            saving={mutation.isPending}
          />
        ) : (
          <AprForm
            onSave={async (payload) => {
              await mutation.mutateAsync(payload);
            }}
            saving={mutation.isPending}
          />
        )}
      </main>
    </div>
  );
}

