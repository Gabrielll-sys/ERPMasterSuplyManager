/**
 * Formulário de APR Rápida - Versão Simplificada
 *
 * Formulário compacto para atividades simples de manutenção.
 * Reduz o tempo de preenchimento de 15-20 min para 3-5 min.
 *
 * Campos obrigatórios:
 * - Local/Setor
 * - Atividade
 * - Pelo menos 1 trabalhador
 *
 * @module AprRapidaForm
 * @version 1.0.0
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { IApr } from "../interfaces/IApr";
import { getAllUsers } from "../services/User.Services";
import { IUsuario } from "../interfaces/IUsuario";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// TIPOS E INTERFACES
// ============================================

/** Item de checklist simples (S/N) */
interface ChecklistItem {
  label: string;
  checked: boolean;
}

/** Dados do formulário de APR Rápida */
interface AprRapidaFormData {
  localSetor: string;
  atividade: string;
  empresa: string;
  data: string;
  horaInicio: string;
  epis: ChecklistItem[];
  riscos: ChecklistItem[];
  /** Lista de riscos adicionais não listados */
  outrosRiscos: string[];
  trabalhadores: string[];
  observacoes: string;
  emissor: string;
  supervisor: string;
}

// ============================================
// DADOS PADRÃO DOS CHECKLISTS
// ============================================

/** EPIs obrigatórios para trabalho com eletricidade (NR-10) */
const episPadrao: string[] = [
  "Calçado de proteção (CA p/ eletricista)",
  "Capacete com jugular",
  "Óculos de proteção incolor",
  "Uniforme eletricista anti-chama NR-10",
  "Luva de cobertura",
  "Luva isolante",
  "Abafador de ruído plug e/ou concha",
];

/** Riscos principais para trabalho com eletricidade */
const riscosPadrao: string[] = [
  "Choque elétrico",
  "Arco elétrico",
  "Painel elétrico energizado",
  "Equipamento energizado",
  "Presença de cabos/fios elétricos",
  "Ruído",
  "Trabalho em altura",
];

/** Cria lista de checklist a partir de labels */
const criarChecklist = (labels: string[]): ChecklistItem[] =>
  labels.map((label) => ({ label, checked: false }));

/** Cria formulário vazio com valores padrão */
const criarFormularioPadrao = (): AprRapidaFormData => ({
  localSetor: "",
  atividade: "",
  empresa: "Brastorno",
  data: "",
  horaInicio: "",
  epis: criarChecklist(episPadrao),
  riscos: criarChecklist(riscosPadrao),
  outrosRiscos: [],
  trabalhadores: [""],
  observacoes: "",
  emissor: "",
  supervisor: "",
});

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface AprRapidaFormProps {
  /** APR existente para edição (null = criação) */
  apr?: IApr | null;
  /** Callback de salvamento */
  onSave: (payload: IApr) => Promise<void>;
  /** Indica se está salvando */
  saving?: boolean;
}

export default function AprRapidaForm({ apr, onSave, saving }: AprRapidaFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AprRapidaFormData>(criarFormularioPadrao());

  // Estado de feedback visual
  const [statusBadge, setStatusBadge] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // Lista de usuários para sugestões
  const [users, setUsers] = useState<IUsuario[]>([]);

  const isCreateMode = !apr?.id;

  // Cargos que podem fechar e editar APR fechada
  const cargosPermitidos = ["Diretor", "Administrador", "SuporteTecnico", "SuporteTécnico"];
  const userPodeFechar = cargosPermitidos.includes(user?.role || "");
  const aprFechada = apr?.fechada === true;
  // Se APR está fechada e usuário não tem permissão, bloqueia edição
  const bloqueiaEdicao = aprFechada && !userPodeFechar;

  // ============================================
  // EFEITOS
  // ============================================

  // Carrega dados se estiver editando APR existente
  useEffect(() => {
    if (!apr?.conteudoJson) return;
    try {
      const parsed = JSON.parse(apr.conteudoJson) as Partial<AprRapidaFormData>;
      setFormData((prev) => ({
        ...prev,
        ...parsed,
        // Garante que arrays existam
        epis: parsed.epis?.length ? parsed.epis : criarChecklist(episPadrao),
        riscos: parsed.riscos?.length ? parsed.riscos : criarChecklist(riscosPadrao),
        trabalhadores: parsed.trabalhadores?.length ? parsed.trabalhadores : [""],
      }));
    } catch {
      setFormData(criarFormularioPadrao());
    }
  }, [apr]);

  // Carrega lista de usuários para sugestões
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
  
        const ativos = data.filter((u) => u.isActive === true && u.id != user.userId);
        setUsers(ativos);
      } catch {
        setUsers([]);
      }
    };
    loadUsers();
  }, []);

  // Define emissor automaticamente como usuário logado
  useEffect(() => {
    if (!isCreateMode) return;
    if (!user?.userName) return;
    setFormData((prev) => ({ ...prev, emissor: user.userName }));
  }, [isCreateMode, user?.userName]);

  // Define data e hora automaticamente na criação
  useEffect(() => {
    if (!isCreateMode) return;
    if (formData.data && formData.horaInicio) return;
    const now = new Date();
    const dateValue = now.toISOString().slice(0, 10);
    const timeValue = now.toTimeString().slice(0, 5);
    setFormData((prev) => ({
      ...prev,
      data: prev.data || dateValue,
      horaInicio: prev.horaInicio || timeValue,
    }));
  }, [isCreateMode, formData.data, formData.horaInicio]);

  // ============================================
  // HANDLERS
  // ============================================

  /** Alterna estado de um item no checklist */
  const toggleChecklist = useCallback(
    (tipo: "epis" | "riscos", index: number) => {
      setFormData((prev) => ({
        ...prev,
        [tipo]: prev[tipo].map((item, i) =>
          i === index ? { ...item, checked: !item.checked } : item
        ),
      }));
    },
    []
  );

  /** Adiciona novo trabalhador à lista */
  const adicionarTrabalhador = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      trabalhadores: [...prev.trabalhadores, ""],
    }));
  }, []);

  /** Remove trabalhador da lista (mínimo 1) */
  const removerTrabalhador = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      trabalhadores:
        prev.trabalhadores.length > 1
          ? prev.trabalhadores.filter((_, i) => i !== index)
          : [""],
    }));
  }, []);

  /** Atualiza nome do trabalhador */
  const atualizarTrabalhador = useCallback((index: number, nome: string) => {
    setFormData((prev) => ({
      ...prev,
      trabalhadores: prev.trabalhadores.map((t, i) => (i === index ? nome : t)),
    }));
  }, []);

  /** Gera título automático para a APR */
  const gerarTitulo = () => {
    const data = formData.data
      ? formData.data.split("-").reverse().join("/")
      : "sem data";
    const local = formData.localSetor || "sem local";
    return `APR Rápida ${data} - ${local}`;
  };

  /** Valida se formulário está completo */
  const validarFormulario = (): boolean => {
    if (!formData.localSetor.trim()) return false;
    if (!formData.atividade.trim()) return false;
    if (!formData.trabalhadores.some((t) => t.trim())) return false;
    return true;
  };

  /** Salva a APR */
  const handleSave = async () => {
    if (!validarFormulario()) {
      setStatusBadge("Preencha todos os campos obrigatórios");
      setTimeout(() => setStatusBadge(""), 3000);
      return;
    }

    const titulo = gerarTitulo();
    const dataFinal = formData.data
      ? new Date(formData.data).toISOString()
      : new Date().toISOString();

    const payload: IApr = {
      id: apr?.id,
      titulo,
      data: dataFinal,
      tipo: "rapida",
      conteudoJson: JSON.stringify({ ...formData }),
    };

    if (isCreateMode) {
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    }

    await onSave(payload);

    setStatusBadge(isCreateMode ? "APR Rápida criada" : "APR Rápida salva");
    setTimeout(() => setStatusBadge(""), 3000);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Banner de APR fechada */}
      {aprFechada && (
        <div className={`rounded-xl p-4 border ${
          userPodeFechar ? "bg-amber-50 border-amber-200" : "bg-slate-100 border-slate-300"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className={`font-semibold ${
                userPodeFechar ? "text-amber-800" : "text-slate-700"
              }`}>
                APR Fechada
              </p>
              <p className="text-sm text-slate-600">
                Fechada por {apr?.fechadaPor || "usuário"}
                {apr?.fechadaEm && ` em ${new Date(apr.fechadaEm).toLocaleDateString("pt-BR")}`}
              </p>
              {!userPodeFechar && (
                <p className="text-xs text-rose-600 mt-1">
                  Somente Diretor, Administrador ou Suporte Técnico podem editar.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho com indicador de tipo */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
          APR RÁPIDA
        </span>
        <span className="text-sm text-slate-500">
          Formulário simplificado para atividades simples
        </span>
      </div>

      {/* Seção: Identificação */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Identificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local/Setor - Obrigatório */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Local / Setor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              placeholder="Ex: Sala de painéis - Bloco A"
              value={formData.localSetor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, localSetor: e.target.value }))
              }
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Empresa
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              value={formData.empresa}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, empresa: e.target.value }))
              }
            />
          </div>

          {/* Atividade - Obrigatório */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Atividade a ser realizada <span className="text-rose-500">*</span>
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
              rows={2}
              placeholder="Ex: Manutenção preventiva em painel elétrico"
              value={formData.atividade}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, atividade: e.target.value }))
              }
            />
          </div>

          {/* Data e Hora (somente leitura) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Data
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
              value={formData.data}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Hora Início
            </label>
            <input
              type="time"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
              value={formData.horaInicio}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Seção: EPIs e Riscos (lado a lado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EPIs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-3">
            EPIs Obrigatórios
          </h3>
          <div className="space-y-2">
            {formData.epis.map((item, index) => (
              <label
                key={item.label}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklist("epis", index)}
                  className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Riscos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-3">
            Riscos Identificados
          </h3>
          <div className="space-y-2">
            {formData.riscos.map((item, index) => (
              <label
                key={item.label}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklist("riscos", index)}
                  className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
          {/* Campo para outros riscos - incremental */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                Outros riscos
              </label>
              <button
                type="button"
                onClick={() => setFormData((prev) => {
                  // Garante que outrosRiscos seja array antes de adicionar novo item
                  const listaAtual = Array.isArray(prev.outrosRiscos) ? prev.outrosRiscos : [];
                  return { ...prev, outrosRiscos: [...listaAtual, ""] };
                })}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                + Adicionar risco
              </button>
            </div>
            <div className="space-y-2">
              {/* Fallback: garante que outrosRiscos seja sempre array */}
              {(Array.isArray(formData.outrosRiscos) ? formData.outrosRiscos : []).map((risco, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder={`Risco adicional ${index + 1}`}
                    value={risco}
                    onChange={(e) => {
                      const novos = [...formData.outrosRiscos];
                      novos[index] = e.target.value;
                      setFormData((prev) => ({ ...prev, outrosRiscos: novos }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const novos = formData.outrosRiscos.filter((_, i) => i !== index);
                      setFormData((prev) => ({ ...prev, outrosRiscos: novos }));
                    }}
                    className="text-rose-500 hover:text-rose-600 text-sm font-medium px-2"
                  >
                    Remover
                  </button>
                </div>
              ))}
              {(Array.isArray(formData.outrosRiscos) ? formData.outrosRiscos : []).length === 0 && (
                <p className="text-xs text-slate-400 italic">Nenhum risco adicional adicionado</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Trabalhadores */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Trabalhadores <span className="text-rose-500">*</span>
        </h2>
        <div className="space-y-3">
          {formData.trabalhadores.map((trabalhador, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                placeholder={`Nome do trabalhador ${index + 1}`}
                list="apr-users-list"
                value={trabalhador}
                onChange={(e) => atualizarTrabalhador(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removerTrabalhador(index)}
                className="text-xs text-rose-600 hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={adicionarTrabalhador}
          className="mt-3 text-xs text-amber-600 hover:underline"
        >
          + Adicionar trabalhador
        </button>

        {/* Datalist para sugestões de usuários */}
        <datalist id="apr-users-list">
          {users.map((user) => (
            <option key={user.id} value={user.nome || ""} />
          ))}
        </datalist>
      </div>

      {/* Seção: Observações e Responsáveis */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Informações Adicionais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supervisor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Supervisor da área
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              placeholder="Nome do supervisor"
              list="apr-users-list"
              value={formData.supervisor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, supervisor: e.target.value }))
              }
            />
          </div>

          {/* Emissor (automático) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Emissor da APR
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
              value={formData.emissor}
              readOnly
            />
          </div>

          {/* Observações */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Observações
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
              rows={3}
              placeholder="Observações adicionais, riscos não listados, etc..."
              value={formData.observacoes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex items-center justify-end gap-3">
        {statusBadge && (
          <span
            className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
              statusBadge.includes("Preencha")
                ? "bg-rose-50 border border-rose-200 text-rose-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {statusBadge.includes("Preencha") ? "⚠" : "✓"} {statusBadge}
          </span>
        )}

        {/* Botão Fechar APR - só aparece para usuários autorizados e APR não fechada */}
        {!isCreateMode && userPodeFechar && !aprFechada && (
          <button
            type="button"
            disabled={saving || cooldown}
            onClick={async () => {
              if (!confirm("Tem certeza que deseja FECHAR esta APR? APRs fechadas só podem ser editadas por Diretor, Administrador ou Suporte Técnico.")) return;
              const payload: IApr = {
                id: apr?.id,
                titulo: apr?.titulo,
                data: apr?.data,
                tipo: "rapida",
                conteudoJson: apr?.conteudoJson || "{}",
                fechada: true,
                fechadaPor: user?.userName || "Usuário",
              };
              await onSave(payload);
              setStatusBadge("APR Fechada com sucesso");
              setTimeout(() => setStatusBadge(""), 3000);
            }}
            className="px-6 py-2.5 rounded-xl border-2 border-rose-500 text-rose-600 text-sm font-semibold hover:bg-rose-50 disabled:opacity-60 transition-all"
          >
            🔒 Fechar APR
          </button>
        )}

        {/* Botão Salvar */}
        <button
          type="button"
          disabled={saving || cooldown || bloqueiaEdicao}
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-700 disabled:opacity-60 transition-all shadow-lg shadow-amber-500/20"
        >
          {saving ? "Salvando..." : isCreateMode ? "Criar APR Rápida" : "Salvar APR"}
        </button>
      </div>
    </div>
  );
}
