/**
 * Checklist Unificado de Montagem e Teste
 * 
 * Módulo que combina verificação de montagem e teste do painel elétrico
 * em uma única interface, com seções claramente separadas para facilitar
 * a identificação de cada etapa do processo.
 * 
 * SEÇÕES:
 * 1. MONTAGEM - Identificação, Funcionamento e Aspecto do Painel
 * 2. TESTE - Instalação e Testes Funcionais
 * 
 * @module ChecklistMontagemTeste
 * @version 3.0.0 - Unificado
 * @since 2026-01-26
 */

"use client";

import { useMemo, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChecklistInspecao,
  deleteChecklistInspecao,
  downloadChecklistInspecaoPdf,
  getAllChecklistsInspecao,
  updateChecklistInspecao,
} from "../services/ChecklistInspecao.Service";
import { IChecklistInspecao } from "../interfaces/IChecklistInspecao";

// ============================================
// TIPOS E INTERFACES
// ============================================

/** Item individual do checklist */
type ChecklistItem = { item: string; feito: boolean };

/** Dados unificados de Montagem e Teste */
type MontagemTesteUnificado = {
  // Dados do responsável
  nomeMontador: string;
  responsavelTeste: string;
  data: string;
  os: string;
  nomeEquipamento: string;
  
  // SEÇÃO MONTAGEM
  identificacao: ChecklistItem[];
  funcionamentoPainel: ChecklistItem[];
  aspectoPainel: ChecklistItem[];
  
  // SEÇÃO TESTE
  itensInstalacao: ChecklistItem[];
  itensTeste: ChecklistItem[];
  
  // Observações gerais
  observacoes: string;
};

/** Estrutura do JSON salvo no banco */
type MontagemTesteChecklistData = {
  tipo: "montagem"; // Mantém tipo "montagem" para compatibilidade com PDF
  montagemTeste: MontagemTesteUnificado;
};

// ============================================
// DADOS PADRÃO
// Para adicionar novos itens, edite os arrays abaixo
// ============================================

const defaultChecklist: MontagemTesteChecklistData = {
  tipo: "montagem",
  montagemTeste: {
    nomeMontador: "",
    responsavelTeste: "",
    data: "",
    os: "",
    nomeEquipamento: "",
    
    // ========== SEÇÃO MONTAGEM ==========
    // Itens de identificação do painel
    identificacao: [
      { item: "Identificação dos cabos", feito: false },
      { item: "Identificação dos componentes internos", feito: false },
      { item: "Todos os componentes estão no painel", feito: false },
      { item: "Conferência dos apertos dos cabos", feito: false },
      { item: "Todos pontos de aterramento estão ligados", feito: false },
      { item: "Tensão do inversor conforme OS", feito: false },
      { item: "Teste de continuidade conforme diagrama", feito: false },
      { item: "Regulagem do disjuntor motor", feito: false },
    ],
    // Itens de funcionamento do painel
    funcionamentoPainel: [
      { item: "Botão reset", feito: false },
      { item: "Botão emergência", feito: false },
      { item: "Botão liga/desliga", feito: false },
      { item: "Sinalizações funcionando", feito: false },
      { item: "Parametrização do inversor", feito: false },
      { item: "Configuração rampa/tempo/temperatura", feito: false },
    ],
    // Itens de aspecto do painel
    aspectoPainel: [
      { item: "Painel está limpo", feito: false },
      { item: "Etiqueta de qualidade preenchida", feito: false },
      { item: "Placas identificadas", feito: false },
      { item: "Diagrama precisa de revisão", feito: false },
    ],
    
    // ========== SEÇÃO TESTE ==========
    // Itens de instalação física
    itensInstalacao: [
      { item: "Cabo de alimentação e tomada", feito: false },
      { item: "Painel instalado no equipamento (suporte ok)", feito: false },
      { item: "Tomada está dentro do painel", feito: false },
      { item: "Furação da botoeira instalada e conectada no inversor", feito: false },
    ],
    // Itens de teste funcional
    itensTeste: [
      { item: "Equipamento funcionou (liga/desliga/reset)", feito: false },
      { item: "Motor está girando para lado correto", feito: false },
      { item: "Adesivos de advertência instalados", feito: false },
    ],
    
    observacoes: "",
  },
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Parse seguro do JSON do banco de dados
 */
const parseJson = (json: string): MontagemTesteChecklistData => {
  try {
    const parsed = JSON.parse(json) as Partial<MontagemTesteChecklistData>;
    if (parsed?.tipo !== "montagem" || !parsed.montagemTeste) {
      return structuredClone(defaultChecklist);
    }
    return {
      ...structuredClone(defaultChecklist),
      ...parsed,
      montagemTeste: {
        ...structuredClone(defaultChecklist).montagemTeste,
        ...parsed.montagemTeste,
      },
    };
  } catch {
    return structuredClone(defaultChecklist);
  }
};

/**
 * Extrai o tipo do checklist para filtrar no histórico
 */
const getChecklistTipo = (json: string) => {
  try {
    return (JSON.parse(json) as { tipo?: string })?.tipo ?? "";
  } catch {
    return "";
  }
};

/**
 * Valida campos obrigatórios
 */
const validate = (data: MontagemTesteChecklistData) => {
  const errors: string[] = [];
  const m = data.montagemTeste;
  if (!m.nomeMontador.trim()) errors.push("Nome do montador");
  if (!m.responsavelTeste.trim()) errors.push("Responsável teste");
  if (!m.data.trim()) errors.push("Data");
  if (!m.os.trim()) errors.push("OS");
  if (!m.nomeEquipamento.trim()) errors.push("Nome equipamento");
  return errors;
};

/**
 * Calcula progresso de uma lista de itens
 */
const getProgress = (items: ChecklistItem[]) => {
  const total = items.length;
  const done = items.filter((i) => i.feito).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ChecklistMontagemTestePage() {
  const queryClient = useQueryClient();
  
  // Estados do formulário
  const [data, setData] = useState<MontagemTesteChecklistData>(structuredClone(defaultChecklist));
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Seção ativa para navegação rápida
  const [activeSection, setActiveSection] = useState<"montagem" | "teste">("montagem");

  // Query para listar checklists
  const { data: items = [], isLoading } = useQuery<IChecklistInspecao[]>({
    queryKey: ["checklists-inspecao"],
    queryFn: getAllChecklistsInspecao,
  });

  // Mutations para CRUD
  const createMutation = useMutation({
    mutationFn: createChecklistInspecao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklists-inspecao"] }),
  });
  const updateMutation = useMutation({
    mutationFn: updateChecklistInspecao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklists-inspecao"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteChecklistInspecao,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklists-inspecao"] }),
  });

  // Filtra apenas checklists do tipo montagem
  const checklistItems = useMemo(() => {
    return items
      .filter((item) => getChecklistTipo(item.conteudoJson) === "montagem")
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [items]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFieldChange = useCallback((field: keyof MontagemTesteUnificado, value: string) => {
    setData((prev) => ({
      ...prev,
      montagemTeste: { ...prev.montagemTeste, [field]: value },
    }));
  }, []);

  const toggleItem = useCallback((listName: keyof MontagemTesteUnificado, index: number) => {
    setData((prev) => {
      const list = [...(prev.montagemTeste[listName] as ChecklistItem[])];
      list[index] = { ...list[index], feito: !list[index].feito };
      return { ...prev, montagemTeste: { ...prev.montagemTeste, [listName]: list } };
    });
  }, []);

  const handleSelect = useCallback((item: IChecklistInspecao) => {
    if (!item.id) return;
    setSelectedId(item.id);
    setData(parseJson(item.conteudoJson));
    setErrors([]);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedId(null);
    setData(structuredClone(defaultChecklist));
    setErrors([]);
    setNotification(null);
  }, []);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleSave = async () => {
    const validation = validate(data);
    if (validation.length > 0) {
      setErrors(validation);
      return;
    }
    setErrors([]);
    setIsSaving(true);

    const payload: IChecklistInspecao = {
      id: selectedId ?? undefined,
      conteudoJson: JSON.stringify(data),
    };

    try {
      if (selectedId) {
        await updateMutation.mutateAsync(payload);
        showNotification("success", "✓ Checklist atualizado com sucesso!");
      } else {
        const created = await createMutation.mutateAsync(payload);
        setSelectedId(created.id ?? null);
        showNotification("success", "✓ Checklist criado com sucesso!");
      }
    } catch {
      showNotification("error", "Erro ao salvar checklist.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async (id?: number) => {
    if (!id) return;
    try {
      const blob = await downloadChecklistInspecaoPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `checklist-montagem-teste-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      showNotification("error", "Erro ao baixar PDF.");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm("Deseja realmente excluir este checklist?")) return;
    await deleteMutation.mutateAsync(id);
    if (selectedId === id) handleReset();
    showNotification("success", "Checklist excluído.");
  };

  // ============================================
  // CÁLCULOS DE PROGRESSO
  // ============================================
  
  // Progresso da seção MONTAGEM
  const idProgress = getProgress(data.montagemTeste.identificacao);
  const funcProgress = getProgress(data.montagemTeste.funcionamentoPainel);
  const aspProgress = getProgress(data.montagemTeste.aspectoPainel);
  const montagemTotal = idProgress.total + funcProgress.total + aspProgress.total;
  const montagemDone = idProgress.done + funcProgress.done + aspProgress.done;
  const montagemPercent = montagemTotal > 0 ? Math.round((montagemDone / montagemTotal) * 100) : 0;
  
  // Progresso da seção TESTE
  const instProgress = getProgress(data.montagemTeste.itensInstalacao);
  const testeProgress = getProgress(data.montagemTeste.itensTeste);
  const testeTotal = instProgress.total + testeProgress.total;
  const testeDone = instProgress.done + testeProgress.done;
  const testePercent = testeTotal > 0 ? Math.round((testeDone / testeTotal) * 100) : 0;
  
  // Progresso TOTAL
  const totalItems = montagemTotal + testeTotal;
  const totalDone = montagemDone + testeDone;
  const totalPercent = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Checklist Montagem e Teste</h1>
              <p className="text-sm text-slate-500">Verificação completa do painel: montagem + teste funcional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all">
              Novo Checklist
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 transition-all shadow-lg">
              {isSaving ? "Salvando..." : selectedId ? "Atualizar" : "Salvar Checklist"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Notificações */}
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 ${notification.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"}`}>
            <span className="text-lg">{notification.type === "success" ? "✓" : "⚠"}</span>
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <span className="font-medium">Campos obrigatórios:</span> {errors.join(", ")}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,380px] gap-8">
          {/* Formulário Principal */}
          <div className="space-y-6">
            
            {/* Progresso Geral + Navegação */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Progresso Geral</h2>
                <span className="text-2xl font-bold text-slate-900">{totalPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${totalPercent}%` }} />
              </div>
              
              {/* Navegação por Seção */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveSection("montagem")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${activeSection === "montagem" ? "bg-amber-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  🔧 Montagem ({montagemPercent}%)
                </button>
                <button 
                  onClick={() => setActiveSection("teste")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${activeSection === "teste" ? "bg-blue-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  ⚡ Teste ({testePercent}%)
                </button>
              </div>
            </div>

            {/* Dados Básicos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">👤</span>
                Informações Gerais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nome do Montador" value={data.montagemTeste.nomeMontador} onChange={(v) => handleFieldChange("nomeMontador", v)} required />
                <InputField label="Responsável pelo Teste" value={data.montagemTeste.responsavelTeste} onChange={(v) => handleFieldChange("responsavelTeste", v)} required />
                <InputField label="Data" type="date" value={data.montagemTeste.data} onChange={(v) => handleFieldChange("data", v)} required />
                <InputField label="Ordem de Serviço (OS)" value={data.montagemTeste.os} onChange={(v) => handleFieldChange("os", v)} required />
                <div className="md:col-span-2">
                  <InputField label="Nome do Equipamento" value={data.montagemTeste.nomeEquipamento} onChange={(v) => handleFieldChange("nomeEquipamento", v)} required />
                </div>
              </div>
            </div>

            {/* ========== SEÇÃO MONTAGEM ========== */}
            {activeSection === "montagem" && (
              <div className="space-y-6">
                <SectionHeader title="MONTAGEM" subtitle="Verificação do painel elétrico" color="amber" progress={montagemPercent} />
                <ChecklistSection title="Identificação" icon="🔍" color="amber" progress={idProgress} items={data.montagemTeste.identificacao} onToggle={(i) => toggleItem("identificacao", i)} />
                <ChecklistSection title="Funcionamento do Painel" icon="⚙️" color="amber" progress={funcProgress} items={data.montagemTeste.funcionamentoPainel} onToggle={(i) => toggleItem("funcionamentoPainel", i)} />
                <ChecklistSection title="Aspecto do Painel" icon="✨" color="amber" progress={aspProgress} items={data.montagemTeste.aspectoPainel} onToggle={(i) => toggleItem("aspectoPainel", i)} />
              </div>
            )}

            {/* ========== SEÇÃO TESTE ========== */}
            {activeSection === "teste" && (
              <div className="space-y-6">
                <SectionHeader title="TESTE" subtitle="Verificação da instalação e funcionamento" color="blue" progress={testePercent} />
                <ChecklistSection title="Itens de Instalação" icon="🔧" color="blue" progress={instProgress} items={data.montagemTeste.itensInstalacao} onToggle={(i) => toggleItem("itensInstalacao", i)} />
                <ChecklistSection title="Itens de Teste" icon="⚡" color="blue" progress={testeProgress} items={data.montagemTeste.itensTeste} onToggle={(i) => toggleItem("itensTeste", i)} />
                
                {/* Observações */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📝</span> Observações / Anomalias
                  </h3>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={4}
                    placeholder="Descreva qualquer anomalia ou ponto de atenção identificado..."
                    value={data.montagemTeste.observacoes}
                    onChange={(e) => handleFieldChange("observacoes", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Histórico */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Histórico</h2>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                  {isLoading ? "..." : checklistItems.length}
                </span>
              </div>

              {checklistItems.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Nenhum checklist cadastrado.</p>
                </div>
              )}

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {checklistItems.map((item) => (
                  <HistoryCard key={item.id} item={item} isSelected={selectedId === item.id} onSelect={() => handleSelect(item)} onDownload={() => handleDownloadPdf(item.id)} onDelete={() => handleDelete(item.id)} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// ============================================
// COMPONENTES REUTILIZÁVEIS
// ============================================

/** Header de seção com título e progresso */
function SectionHeader({ title, subtitle, color, progress }: { title: string; subtitle: string; color: "amber" | "blue"; progress: number }) {
  const bgColor = color === "amber" ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className={`${bgColor} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold">{progress}%</span>
          <p className="text-white/80 text-sm">concluído</p>
        </div>
      </div>
    </div>
  );
}

/** Campo de input estilizado */
function InputField({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input type={type} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Seção de itens do checklist */
function ChecklistSection({ title, icon, color, progress, items, onToggle }: { title: string; icon: string; color: "amber" | "blue"; progress: { done: number; total: number; percent: number }; items: ChecklistItem[]; onToggle: (i: number) => void }) {
  const gradientColor = color === "amber" ? "from-amber-500 to-orange-500" : "from-blue-500 to-indigo-500";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className="text-xl">{icon}</span>{title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{progress.done}/{progress.total}</span>
          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all`} style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <label key={idx} className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${item.feito ? "border-emerald-200 bg-emerald-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.feito ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
              {item.feito && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <input type="checkbox" checked={item.feito} onChange={() => onToggle(idx)} className="sr-only" />
            <span className={`text-sm ${item.feito ? "text-emerald-700 font-medium" : "text-slate-700"}`}>{item.item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** Card do histórico */
function HistoryCard({ item, isSelected, onSelect, onDownload, onDelete }: { item: IChecklistInspecao; isSelected: boolean; onSelect: () => void; onDownload: () => void; onDelete: () => void }) {
  const p = parseJson(item.conteudoJson);
  const nome = p.montagemTeste.nomeEquipamento || "Sem nome";
  return (
    <div className={`rounded-xl border p-4 transition-all ${isSelected ? "border-slate-500 bg-slate-50 ring-2 ring-slate-500/20" : "border-slate-200 hover:border-slate-300"}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium text-slate-500">#{item.id?.toString().padStart(4, "0")}</span>
          <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{nome}</p>
        </div>
        {isSelected && <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-medium">Editando</span>}
      </div>
      <p className="text-xs text-slate-500 mb-3">{item.criadoEm ? new Date(item.criadoEm).toLocaleDateString("pt-BR") : "Sem data"}</p>
      <div className="flex gap-2">
        <button onClick={onSelect} className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-all">Editar</button>
        <button onClick={onDownload} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-all">PDF</button>
        <button onClick={onDelete} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
}
