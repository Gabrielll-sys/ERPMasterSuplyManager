/**
 * Página de Listagem de APRs
 * 
 * Lista todas as APRs cadastradas com busca, cards modernos e estatísticas.
 * 
 * @module APRList
 * @version 2.0.0 - UI/UX modernizada
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllAprs } from "../services/Aprs.Service";
import { IApr } from "../interfaces/IApr";

export default function AprListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Query para listar todas as APRs
  const { data: aprs = [], isLoading, isError } = useQuery<IApr[]>({
    queryKey: ["aprs"],
    queryFn: getAllAprs,
  });

  // Filtra APRs por título ou ID
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return aprs;
    return aprs.filter((apr) =>
      `${apr.titulo ?? ""} ${apr.id ?? ""}`.toLowerCase().includes(term)
    );
  }, [aprs, search]);

  // Ordena por data mais recente
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = a.data ? new Date(a.data).getTime() : 0;
      const dateB = b.data ? new Date(b.data).getTime() : 0;
      return dateB - dateA;
    });
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Ícone com gradiente vermelho (segurança) */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">APR - Análise Preliminar de Riscos</h1>
              <p className="text-sm text-slate-500">Gerencie e crie análises de segurança do trabalho</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/apr/nova")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg shadow-rose-500/20"
          >
            + Nova APR
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total de APRs" value={aprs.length} icon="📋" color="slate" />
          <StatCard label="Este Mês" value={aprs.filter(a => {
            if (!a.data) return false;
            const d = new Date(a.data);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length} icon="📅" color="blue" />
          <StatCard label="Resultados" value={filtered.length} icon="🔍" color="emerald" />
        </div>

        {/* Campo de Busca */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              placeholder="Buscar por título, número ou local..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Erro */}
        {isError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
            <p className="text-rose-700">Erro ao carregar APRs. Tente novamente.</p>
          </div>
        )}

        {/* Estado Vazio */}
        {!isLoading && !isError && sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">Nenhuma APR encontrada</p>
            <p className="text-sm text-slate-500 mt-1">Crie uma nova APR para começar</p>
            <button
              onClick={() => router.push("/apr/nova")}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-all"
            >
              Criar primeira APR
            </button>
          </div>
        )}

        {/* Grid de APRs */}
        {!isLoading && !isError && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((apr) => (
              <AprCard key={apr.id} apr={apr} onClick={() => apr.id && router.push(`/apr/${apr.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/** Card de estatística */
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: "slate" | "blue" | "emerald" }) {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

/** Card de APR na listagem */
function AprCard({ apr, onClick }: { apr: IApr; onClick: () => void }) {
  // Extrai informações do JSON para preview
  const getLocalSetor = () => {
    try {
      const data = JSON.parse(apr.conteudoJson || "{}");
      return data.localSetor || "";
    } catch {
      return "";
    }
  };
  const localSetor = getLocalSetor();

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
          APR #{apr.id?.toString().padStart(4, "0")}
        </span>
        <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-2">
        {apr.titulo || "APR sem título"}
      </h3>
      {localSetor && (
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {localSetor}
        </p>
      )}
      <p className="text-xs text-slate-400">
        {apr.data ? new Date(apr.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "Sem data"}
      </p>
    </button>
  );
}
