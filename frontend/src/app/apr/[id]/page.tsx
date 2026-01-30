/**
 * Página de Edição de APR
 *
 * Carrega APR existente para edição e permite download do PDF.
 * Suporta APR Completa e APR Rápida.
 *
 * @module APREdit
 * @version 3.0.0 - Suporte a APR Rápida
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AprForm from "../AprForm";
import AprRapidaForm from "../AprRapidaForm";
import { downloadAprPdf, getAprById, updateApr } from "../../services/Aprs.Service";
import { IApr } from "../../interfaces/IApr";

export default function AprEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const aprId = Number(params.id);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Query para carregar APR
  const { data: apr, isLoading, isError } = useQuery<IApr>({
    queryKey: ["apr", aprId],
    queryFn: () => getAprById(aprId),
    enabled: !!aprId,
  });

  // Mutation para atualizar APR
  const mutation = useMutation({
    mutationFn: (payload: IApr) => updateApr(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aprs"] });
      queryClient.invalidateQueries({ queryKey: ["apr", aprId] });
      showNotification("success", "✓ APR atualizada com sucesso!");
    },
    onError: () => {
      showNotification("error", "Erro ao atualizar APR.");
    },
  });

  /** Exibe notificação temporária */
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  /** Download do PDF da APR */
  const handleDownloadPdf = async () => {
    if (!aprId) return;
    try {
      setIsDownloading(true);
      const blob = await downloadAprPdf(aprId);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `APR_${aprId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      showNotification("error", "Erro ao gerar PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Determina se é APR Rápida.
   * Fallback: verifica estrutura do conteudoJson se campo tipo não estiver definido.
   */
  const detectarTipoRapida = (): boolean => {
    // Verifica campo tipo diretamente
    if (apr?.tipo === "rapida") return true;
    if (apr?.tipo === "completa") return false;

    // Fallback: verifica se conteudoJson tem estrutura de APR Rápida
    // (possui campos específicos como localSetor, horaInicio que não existem em APR Completa)
    if (apr?.conteudoJson) {
      try {
        const parsed = JSON.parse(apr.conteudoJson);
        // APR Rápida tem estes campos específicos
        if (parsed.localSetor !== undefined || parsed.horaInicio !== undefined) {
          return true;
        }
      } catch {
        // Se não conseguir parsear, assume completa
      }
    }
    return false;
  };

  const isRapida = detectarTipoRapida();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Carregando APR...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !apr) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Não foi possível carregar a APR</h2>
          <p className="text-sm text-slate-500 mb-4">A APR pode ter sido removida ou você não tem permissão.</p>
          <button
            onClick={() => router.push("/apr")}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all"
          >
            Voltar para listagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
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
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                isRapida
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20"
                  : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20"
              }`}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Editar APR</h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isRapida ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {isRapida ? "⚡ RÁPIDA" : `#${apr.id?.toString().padStart(4, "0")}`}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate max-w-md">{apr.titulo || "Sem título"}</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 disabled:opacity-60 transition-all flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notificações */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 ${notification.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"}`}>
            <span className="text-lg">{notification.type === "success" ? "✓" : "⚠"}</span>
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Formulário baseado no tipo */}
        {isRapida ? (
          <AprRapidaForm
            apr={apr}
            onSave={async (payload) => {
              await mutation.mutateAsync(payload);
            }}
            saving={mutation.isPending}
          />
        ) : (
          <AprForm
            apr={apr}
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

