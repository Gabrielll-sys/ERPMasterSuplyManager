"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllAprs } from "../services/Aprs.Service";
import { IApr } from "../interfaces/IApr";

export default function AprListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: aprs = [], isLoading, isError } = useQuery<IApr[]>({
    queryKey: ["aprs"],
    queryFn: getAllAprs,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return aprs;
    return aprs.filter((apr) =>
      `${apr.titulo ?? ""} ${apr.id ?? ""}`.toLowerCase().includes(term)
    );
  }, [aprs, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">APR</h1>
            <p className="text-sm text-slate-500">Análise Preliminar de Riscos</p>
          </div>
          <button
            onClick={() => router.push("/apr/nova")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Nova APR
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <input
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Buscar por título ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading && <p className="text-sm text-slate-500">Carregando APRs...</p>}
        {isError && <p className="text-sm text-rose-600">Erro ao carregar APRs.</p>}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            Nenhuma APR encontrada.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((apr) => (
            <button
              key={apr.id}
              onClick={() => apr.id && router.push(`/apr/${apr.id}`)}
              className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="text-xs text-slate-400">APR #{apr.id}</p>
              <h3 className="text-base font-semibold text-slate-900 mt-1">
                {apr.titulo || "APR sem título"}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                {apr.data ? new Date(apr.data).toLocaleDateString("pt-BR") : "Sem data"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
