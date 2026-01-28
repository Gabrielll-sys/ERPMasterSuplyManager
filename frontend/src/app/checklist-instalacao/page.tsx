/**
 * Checklist de Instalação e Teste de Equipamentos
 * 
 * Este módulo implementa um sistema completo de checklist para validação
 * de instalação e teste de equipamentos elétricos.
 * 
 * Funcionalidades:
 * - Formulário com validação de campos obrigatórios
 * - Checklist visual com progresso em tempo real
 * - Histórico de checklists salvos
 * - Geração de PDF profissional
 * - Campo de observações para anomalias
 * 
 * @module ChecklistInstalacao
 * @version 1.0.0
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

/**
 * Item individual do checklist
 * @property {string} item - Descrição do item a ser verificado
 * @property {boolean} feito - Status de conclusão (true = concluído)
 */
type ChecklistItem = { item: string; feito: boolean };

/**
 * Dados do formulário de instalação e teste
 * Contém todos os campos preenchidos pelo operador
 */
type InstalacaoTeste = {
  nomeInstalador: string;
  nomeInspetorQualidade: string;
  data: string;
  os: string;
  nomeEquipamento: string;
  instalacao: ChecklistItem[];
  testes: ChecklistItem[];
  observacoes: string;
};

/**
 * Estrutura completa do JSON salvo no banco de dados
 * O campo 'tipo' é usado para filtrar checklists por categoria
 */
type InstalacaoChecklistData = {
  tipo: "instalacao";
  instalacaoTeste: InstalacaoTeste;
};

/**
 * Valores padrão do checklist de instalação.
 * Este objeto é clonado para criar novos checklists.
 * Para adicionar novos itens, edite os arrays 'instalacao' ou 'testes'.
 */
const defaultInstalacaoChecklist: InstalacaoChecklistData = {
  tipo: "instalacao",
  instalacaoTeste: {
    nomeInstalador: "",
    nomeInspetorQualidade: "",
    data: "",
    os: "",
    nomeEquipamento: "",
    // Itens de verificação da instalação física
    instalacao: [
      { item: "Cabo de alimentação e tomada", feito: false },
      { item: "Painel instalado no equipamento – suporte OK", feito: false },
      { item: "Tomada está dentro do painel", feito: false },
      { item: "Medição da Rotação do motor foi feita e parametrizada no inversor", feito: false },
    ],
    // Itens de verificação dos testes funcionais
    testes: [
      { item: "Equipamento funcionou (liga, desliga, reset)", feito: false },
      { item: "Motor está girando para lado correto", feito: false },
      { item: "Foi instalado os adesivos de advertência", feito: false },
    ],
    observacoes: "",
  },
};

/**
 * Faz parse seguro do JSON salvo no banco de dados.
 * Retorna o checklist padrão se o JSON for inválido ou de outro tipo.
 * @param json - String JSON do campo conteudoJson
 * @returns Dados do checklist tipados
 */
const parseInstalacaoJson = (json: string): InstalacaoChecklistData => {
  try {
    const parsed = JSON.parse(json) as Partial<InstalacaoChecklistData>;
    // Verifica se é do tipo correto
    if (parsed?.tipo !== "instalacao" || !parsed.instalacaoTeste) {
      return structuredClone(defaultInstalacaoChecklist);
    }
    // Mescla com valores padrão para garantir estrutura completa
    return {
      ...structuredClone(defaultInstalacaoChecklist),
      ...parsed,
      instalacaoTeste: {
        ...structuredClone(defaultInstalacaoChecklist).instalacaoTeste,
        ...parsed.instalacaoTeste,
      },
    };
  } catch {
    return structuredClone(defaultInstalacaoChecklist);
  }
};

/**
 * Extrai o tipo do checklist do JSON para filtrar no histórico.
 * Usado para separar checklists de montagem, teste e instalação.
 * @param json - String JSON do campo conteudoJson
 * @returns Tipo do checklist ('instalacao', 'montagem', 'teste') ou vazio
 */
const getChecklistTipo = (json: string) => {
  try {
    const parsed = JSON.parse(json) as { tipo?: string };
    return parsed?.tipo ?? "";
  } catch {
    return "";
  }
};

/**
 * Valida os campos obrigatórios antes de salvar.
 * @param data - Dados do formulário
 * @returns Array com nomes dos campos faltantes (vazio se válido)
 */
const validateInstalacao = (data: InstalacaoChecklistData) => {
  const errors: string[] = [];
  const inst = data.instalacaoTeste;

  if (!inst.nomeInstalador.trim()) errors.push("Nome do instalador");
  if (!inst.nomeInspetorQualidade.trim()) errors.push("Inspetor de qualidade");
  if (!inst.data.trim()) errors.push("Data");
  if (!inst.os.trim()) errors.push("OS");
  if (!inst.nomeEquipamento.trim()) errors.push("Nome do equipamento");

  return errors;
};

/**
 * Calcula estatísticas de progresso de uma lista de itens.
 * @param items - Array de itens do checklist
 * @returns Objeto com total, concluídos e porcentagem
 */
const getProgress = (items: ChecklistItem[]) => {
  const total = items.length;
  const done = items.filter((item) => item.feito).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
};

export default function ChecklistInstalacaoPage() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<InstalacaoChecklistData>(
    structuredClone(defaultInstalacaoChecklist)
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: items = [], isLoading } = useQuery<IChecklistInspecao[]>({
    queryKey: ["checklists-inspecao"],
    queryFn: getAllChecklistsInspecao,
  });

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

  const instalacaoItems = useMemo(() => {
    return items
      .filter((item) => getChecklistTipo(item.conteudoJson) === "instalacao")
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [items]);

  const handleFieldChange = useCallback((field: keyof InstalacaoTeste, value: string) => {
    setData((prev) => ({
      ...prev,
      instalacaoTeste: { ...prev.instalacaoTeste, [field]: value },
    }));
  }, []);

  const toggleItem = useCallback((listName: "instalacao" | "testes", index: number) => {
    setData((prev) => {
      const list = [...prev.instalacaoTeste[listName]];
      list[index] = { ...list[index], feito: !list[index].feito };
      return {
        ...prev,
        instalacaoTeste: { ...prev.instalacaoTeste, [listName]: list },
      };
    });
  }, []);

  const handleSelect = useCallback((item: IChecklistInspecao) => {
    if (!item.id) return;
    setSelectedId(item.id);
    setData(parseInstalacaoJson(item.conteudoJson));
    setErrors([]);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedId(null);
    setData(structuredClone(defaultInstalacaoChecklist));
    setErrors([]);
    setNotification(null);
  }, []);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleSave = async () => {
    const validation = validateInstalacao(data);
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
      showNotification("error", "Erro ao salvar checklist. Tente novamente.");
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
      link.download = `checklist-instalacao-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      showNotification("error", "Erro ao baixar PDF.");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este checklist?")) return;
    await deleteMutation.mutateAsync(id);
    if (selectedId === id) handleReset();
    showNotification("success", "Checklist excluído.");
  };

  const instalacaoProgress = getProgress(data.instalacaoTeste.instalacao);
  const testesProgress = getProgress(data.instalacaoTeste.testes);
  const totalItems = instalacaoProgress.total + testesProgress.total;
  const totalDone = instalacaoProgress.done + testesProgress.done;
  const totalPercent = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Checklist Instalação e Teste</h1>
              <p className="text-sm text-slate-500">Validação de instalação, teste e qualidade do equipamento</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-all"
            >
              Novo Checklist
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 transition-all shadow-lg shadow-blue-600/20"
            >
              {isSaving ? "Salvando..." : selectedId ? "Atualizar" : "Salvar Checklist"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Notificações */}
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success" 
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
              : "bg-rose-50 border border-rose-200 text-rose-700"
          }`}>
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
            {/* Progresso Geral */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Progresso Geral</h2>
                <span className="text-2xl font-bold text-slate-900">{totalPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{totalDone} de {totalItems} itens concluídos</span>
                <span>{totalItems - totalDone} pendentes</span>
              </div>
            </div>

            {/* Dados Básicos */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Informações Gerais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nome do Instalador"
                  placeholder="Digite o nome do instalador"
                  value={data.instalacaoTeste.nomeInstalador}
                  onChange={(v) => handleFieldChange("nomeInstalador", v)}
                  required
                />
                <InputField
                  label="Inspetor de Qualidade"
                  placeholder="Digite o nome do inspetor"
                  value={data.instalacaoTeste.nomeInspetorQualidade}
                  onChange={(v) => handleFieldChange("nomeInspetorQualidade", v)}
                  required
                />
                <InputField
                  label="Data"
                  type="date"
                  value={data.instalacaoTeste.data}
                  onChange={(v) => handleFieldChange("data", v)}
                  required
                />
                <InputField
                  label="Ordem de Serviço (OS)"
                  placeholder="Ex: OS-2026-001"
                  value={data.instalacaoTeste.os}
                  onChange={(v) => handleFieldChange("os", v)}
                  required
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Nome do Equipamento"
                    placeholder="Digite o nome/modelo do equipamento"
                    value={data.instalacaoTeste.nomeEquipamento}
                    onChange={(v) => handleFieldChange("nomeEquipamento", v)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Seção Instalação */}
            <ChecklistSection
              title="Instalação"
              icon={
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              iconBg="bg-amber-100"
              progress={instalacaoProgress}
              items={data.instalacaoTeste.instalacao}
              onToggle={(index) => toggleItem("instalacao", index)}
            />

            {/* Seção Testes */}
            <ChecklistSection
              title="Testes"
              icon={
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              iconBg="bg-emerald-100"
              progress={testesProgress}
              items={data.instalacaoTeste.testes}
              onToggle={(index) => toggleItem("testes", index)}
            />

            {/* Observações */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Anomalias ou Pontos de Atenção
              </h2>
              <textarea
                className="w-full rounded-xl border border-slate-200 p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={4}
                placeholder="Descreva qualquer anomalia ou ponto de atenção identificado durante o teste..."
                value={data.instalacaoTeste.observacoes}
                onChange={(e) => handleFieldChange("observacoes", e.target.value)}
              />
            </div>
          </div>

          {/* Sidebar - Histórico */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Histórico</h2>
                <span className="px-2 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                  {isLoading ? "..." : instalacaoItems.length}
                </span>
              </div>

              {instalacaoItems.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Nenhum checklist de instalação cadastrado ainda.</p>
                </div>
              )}

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {instalacaoItems.map((item) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onSelect={() => handleSelect(item)}
                    onDownload={() => handleDownloadPdf(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// Componente de Input estilizado
function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Componente de Seção de Checklist
function ChecklistSection({
  title,
  icon,
  iconBg,
  progress,
  items,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  progress: { done: number; total: number; percent: number };
  items: ChecklistItem[];
  onToggle: (index: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            {icon}
          </span>
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{progress.done}/{progress.total}</span>
          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <label
            key={`${title}-${index}`}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
              item.feito
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              item.feito
                ? "bg-emerald-500 border-emerald-500"
                : "border-slate-300"
            }`}>
              {item.feito && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={item.feito}
              onChange={() => onToggle(index)}
              className="sr-only"
            />
            <span className={`text-sm ${item.feito ? "text-emerald-700 font-medium" : "text-slate-700"}`}>
              {item.item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Componente do Card de Histórico
function HistoryCard({
  item,
  isSelected,
  onSelect,
  onDownload,
  onDelete,
}: {
  item: IChecklistInspecao;
  isSelected: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const parsedData = parseInstalacaoJson(item.conteudoJson);
  const equipamento = parsedData.instalacaoTeste.nomeEquipamento || "Sem nome";

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isSelected 
        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" 
        : "border-slate-200 hover:border-slate-300"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium text-slate-500">#{item.id?.toString().padStart(4, "0")}</span>
          <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{equipamento}</p>
        </div>
        {isSelected && (
          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-medium">
            Editando
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3">
        {item.criadoEm ? new Date(item.criadoEm).toLocaleDateString("pt-BR") : "Sem data"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-all"
        >
          Editar
        </button>
        <button
          onClick={onDownload}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all"
        >
          PDF
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
