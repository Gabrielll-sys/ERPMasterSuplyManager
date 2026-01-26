"use client";

import Link from "next/link";

export default function ChecklistInspecaoPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabecalho de contexto e orientacao. */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Checklists de Inspecao</h1>
          <p className="text-sm text-slate-500">
            Selecione o tipo de checklist para criar e editar registros separados.
          </p>
        </header>

        {/* Cartoes de navegacao para os checklists separados. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/checklist-montagem"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">Checklist</div>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">Montagem</h2>
            <p className="text-sm text-slate-500 mt-2">
              Inspecao de identificacao, funcionamento e aspecto do painel.
            </p>
            <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              Abrir checklist
            </div>
          </Link>

          <Link
            href="/checklist-teste"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">Checklist</div>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">Teste</h2>
            <p className="text-sm text-slate-500 mt-2">
              Validacao de instalacao, teste e qualidade do equipamento.
            </p>
            <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              Abrir checklist
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
