/**
 * Formulário de APR - Análise Preliminar de Riscos
 * 
 * Componente principal para criação e edição de APRs.
 * Suporta 4 tipos de trabalho:
 * - Trabalho em Altura
 * - Espaço Confinado
 * - Trabalho à Quente
 * - Trabalho com Eletricidade
 * 
 * Para cada tipo, há checklists de EPIs e Riscos configuráveis.
 * 
 * @module AprForm
 * @version 2.0.0 - Documentação e UI melhoradas
 */

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { IApr } from "../interfaces/IApr";
import { getAllUsers } from "../services/User.Services";
import { IUsuario } from "../interfaces/IUsuario";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// TIPOS E INTERFACES
// ============================================

type TriState = "S" | "N" | "NA";

interface ChecklistItem {
  label: string;
  status: TriState;
}

interface AprChecklist {
  epis: ChecklistItem[];
  riscos: ChecklistItem[];
  outrosEpis: string;
  outrosRiscos: string;
}

interface AprFormData {
  titulo: string;
  empresa: string;
  data: string;
  horaInicio: string;
  tipoTrabalho: {
    altura: boolean;
    numeroPta: string;
    espacoConfinado: boolean;
    numeroPet: string;
    eletricidade: boolean;
    numeroPte: string;
    trabalhoQuente: boolean;
    numeroPtq: string;
  };
  atividades: string;
  localSetor: string;
  ferramentas: string;
  colaboradores: string;
  supervisor: { nome: string; setor: string };
  emissor: { nome: string; setor: string };
  trabalhoAltura: AprChecklist;
  espacoConfinado: AprChecklist;
  trabalhoQuente: AprChecklist;
  eletricidade: AprChecklist;
  trabalhadores: { nome: string; funcao: string }[];
  encerramento: {
    solicitanteNome: string;
    solicitanteData: string;
    emissorNome: string;
    emissorData: string;
    interrupcoes: {
      porRazoesSeguranca: boolean;
      aprContinuacao: string;
    };
  };
}

// ============================================
// DADOS DE CHECKLIST
// Os arrays abaixo definem os itens de cada tipo de trabalho.
// Para adicionar/remover itens, edite os arrays correspondentes.
// ============================================

/** Cria array de itens de checklist a partir de labels */
const buildChecklist = (labels: string[]): ChecklistItem[] =>
  labels.map((label) => ({ label, status: "NA" }));

/** Normaliza checklist salvo, mantendo novos itens e removendo obsoletos */
const normalizeChecklist = (saved: ChecklistItem[] | undefined, labels: string[]): ChecklistItem[] => {
  const map = new Map(saved?.map((item) => [item.label, item.status]));
  return labels.map((label) => ({
    label,
    status: map.get(label) ?? "NA",
  }));
};

const alturaEpis = [
  "Capacete com jugular",
  "Abafador de ruído e/ou concha",
  "Óculos de Proteção",
  "Fita Tubular",
  "Luvas de proteção",
  "Calçado de proteção com biqueira",
  "Cinto de Segurança Paraquedista",
  "Talabarte em “Y” com amortecedor ABS",
  "Máscara PFF02 com válvula",
  "Mosquetão para cinto segurança",
  "Bloqueador solar",
  "Trava quedas para cordas",
  "Trava quedas para cabo aço 8mm",
  "Trava quedas retrátil",
  "Uniforme eletricista anti-chama NR-10",
];

const alturaRiscos = [
  "Trabalho à Quente",
  "Trabalho sob andaimes",
  "Trabalho em telhados",
  "Trabalho em Espaço Confinado",
  "Trabalho em Plataformas Elevatórias",
  "Trabalho sob escadas",
  "Condições climáticas adversas",
  "Próximo à redes elétricas",
  "Difícil acesso / locomoção ao local",
  "Queda de materiais",
  "Queda de pessoas",
  "Batida por e contra objeto/material",
  "Inalação de poeira",
  "Piso escorregadio",
  "Exposição ao calor excessivo",
  "Radiações não ionizantes",
  "Ruído",
  "Projeção de materiais nos olhos",
  "Interferência de áreas de trabalho",
  "Içamento crítico de materiais",
  "Intempéries (chuvas, raios, etc)",
];

const espacoEpis = [
  "Calçado de proteção",
  "Capacete com jugular",
  "Óculos de Proteção",
  "Roupas refletivas",
  "Luvas de couro / vaqueta",
  "Luvas de nitrílica/ nitrilon / algodão",
  "Cilindro de oxigênio",
  "Máscara PFF02 com válvula",
  "Talabarte \"Y\" com amortecedor ABS",
  "Proteção auricular/ concha",
  "Macacão em Tyvek",
  "Cinto de segurança tipo paraquedista",
  "Máscara respiratória autônoma (EPA)",
  "Respirador semi-facial VO/GA",
  "Respirador facial total VO/GA",
  "Óculos de Proteção Ampla Visão",
  "Luvas de proteção",
];

const espacoRiscos = [
  "Falta de comunicação",
  "Difícil acesso / locomoção ao local",
  "Movimentação peças",
  "Ruído",
  "Espaço Confinado",
  "CH4 (Gás Metano)",
  "CO (Dióxido de Carbono)",
  "H2S (Gás ácido Sulfídrico)",
  "Asfixia/ Intoxicação",
  "Queda de pessoas",
  "Área sob riscos específicos",
  "Presença cabos elétricos",
  "Equipamentos energizados",
  "Radiações ionizante /não-ionizantes",
  "Deficiência de Oxigênio (O2)",
  "Enriquecimento de Oxigênio (O2)",
  "Nível de explosividade acima do LT",
  "Altas/ baixas temperaturas",
  "Condições climáticas adversas",
  "Interferência de áreas",
  "Trabalho em altura",
  "Engolfamento",
  "Aprisionamento",
  "Animais peçonhentos",
];

const quenteEpis = [
  "Calçado de proteção",
  "Capacete com jugular",
  "Óculos de Segurança Preto",
  "Perneira de Raspa",
  "Luvas de couro cano longo",
  "Máscara PFF02 com válvula",
  "Proteção facial",
  "Protetor auricular / tipo concha",
  "Avental de couro (raspa) com manga",
  "Avental de couro (raspa) sem manga",
  "Cinto de segurança tipo paraquedista",
  "Máscara de solda",
  "Óculos de Proteção Ampla Visão",
  "Lentes Incolores para máscara de solda",
  "Lentes 10, 12 para máscara de solda",
  "Óculos maçariqueiro",
  "Blusão de raspa (couro)",
  "Capuz de raspa (couro)",
  "Luvas de proteção",
];

const quenteRiscos = [
  "Chamas / Soldas / Maçarico",
  "Área com produtos inflamáveis",
  "Fogo / Ignição espontânea",
  "Asfixia / Intoxicação",
  "Produtos tóxicos / Corrosivos",
  "Gás / Liquido sobre pressão",
  "Interferência de áreas",
  "Ruído",
  "Radiação ionizantes /não ionizantes",
  "Presença de cabos elétricos",
  "Equipamento energizado",
  "Painel energizado",
  "Movimentação de peças",
  "Condições climáticas adversas",
  "Trabalho em altura",
  "Içamento crítico de materiais",
  "Mangueiras maçarico danificadas",
  "Cabos elétricos com fios expostos",
  "Espaço Confinado",
];

const eletricidadeEpis = [
  "Calçado de proteção (CA p/ eletricista)",
  "Capacete com jugular",
  "Óculos de proteção Incolor",
  "Uniforme eletricista anti-chama NR-10",
  "Luva de cobertura",
  "Luva isolante 5,0 Kv = ________ V",
  "Luva isolante 2,5 Kv = ________ V",
  "Capuz balaclava",
  "Abafador de ruído plug e/ou concha",
  "Máscara PFF02 com válvula",
  "Tapete Isolante de borracha",
];

const eletricidadeRiscos = [
  "Choque elétrico",
  "Área com produtos inflamáveis",
  "Painel elétrico energizado",
  "Equipamento energizado",
  "Presença cabos e/ou fios elétricos",
  "Radiação ionizantes /não ionizantes",
  "Interferência de áreas",
  "Ruído",
  "Trabalho em altura",
  "Trabalho em Espaço Confinado",
  "Poeira",
  "Arco elétrico",
];

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================

/** Cria checklist padrão para um tipo de trabalho */
const defaultChecklist = (epis: string[], riscos: string[]): AprChecklist => ({
  epis: buildChecklist(epis),
  riscos: buildChecklist(riscos),
  outrosEpis: "",
  outrosRiscos: "",
});

/** Cria formulário vazio com valores padrão */
const createDefaultForm = (): AprFormData => ({
  titulo: "",
  empresa: "Brastorno",
  data: "",
  horaInicio: "",
  tipoTrabalho: {
    altura: false,
    numeroPta: "",
    espacoConfinado: false,
    numeroPet: "",
    eletricidade: false,
    numeroPte: "",
    trabalhoQuente: false,
    numeroPtq: "",
  },
  atividades: "",
  localSetor: "",
  ferramentas: "",
  colaboradores: "",
  supervisor: { nome: "", setor: "" },
  emissor: { nome: "", setor: "" },
  trabalhoAltura: defaultChecklist(alturaEpis, alturaRiscos),
  espacoConfinado: defaultChecklist(espacoEpis, espacoRiscos),
  trabalhoQuente: defaultChecklist(quenteEpis, quenteRiscos),
  eletricidade: defaultChecklist(eletricidadeEpis, eletricidadeRiscos),
  trabalhadores: [{ nome: "", funcao: "" }],
  encerramento: {
    solicitanteNome: "",
    solicitanteData: "",
    emissorNome: "",
    emissorData: "",
    interrupcoes: { porRazoesSeguranca: false, aprContinuacao: "" },
  },
});

/**
 * Mescla dados salvos com o formulário padrão.
 * Garante que novos campos sejam adicionados e itens de checklist normalizados.
 */
const mergeForm = (saved: Partial<AprFormData>): AprFormData => {
  const base = createDefaultForm();
  return {
    ...base,
    ...saved,
    tipoTrabalho: { ...base.tipoTrabalho, ...saved.tipoTrabalho },
    supervisor: { ...base.supervisor, ...saved.supervisor },
    emissor: { ...base.emissor, ...saved.emissor },
    trabalhoAltura: {
      ...base.trabalhoAltura,
      ...saved.trabalhoAltura,
      epis: normalizeChecklist(saved.trabalhoAltura?.epis, alturaEpis),
      riscos: normalizeChecklist(saved.trabalhoAltura?.riscos, alturaRiscos),
    },
    espacoConfinado: {
      ...base.espacoConfinado,
      ...saved.espacoConfinado,
      epis: normalizeChecklist(saved.espacoConfinado?.epis, espacoEpis),
      riscos: normalizeChecklist(saved.espacoConfinado?.riscos, espacoRiscos),
    },
    trabalhoQuente: {
      ...base.trabalhoQuente,
      ...saved.trabalhoQuente,
      epis: normalizeChecklist(saved.trabalhoQuente?.epis, quenteEpis),
      riscos: normalizeChecklist(saved.trabalhoQuente?.riscos, quenteRiscos),
    },
    eletricidade: {
      ...base.eletricidade,
      ...saved.eletricidade,
      epis: normalizeChecklist(saved.eletricidade?.epis, eletricidadeEpis),
      riscos: normalizeChecklist(saved.eletricidade?.riscos, eletricidadeRiscos),
    },
    trabalhadores: saved.trabalhadores?.length ? saved.trabalhadores : base.trabalhadores,
    encerramento: {
      ...base.encerramento,
      ...saved.encerramento,
      interrupcoes: { ...base.encerramento.interrupcoes, ...saved.encerramento?.interrupcoes },
    },
  };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface AprFormProps {
  /** APR existente para edição (null = criação) */
  apr?: IApr | null;
  /** Callback de salvamento */
  onSave: (payload: IApr) => Promise<void>;
  /** Indica se está salvando */
  saving?: boolean;
}

export default function AprForm({ apr, onSave, saving }: AprFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AprFormData>(createDefaultForm());
  
  // Controle de feedback e bloqueio ao criar APR
  const [statusBadge, setStatusBadge] = useState("");
  const [cooldown, setCooldown] = useState(false);
  
  // Lista de usuários para sugestão nos campos com digitação livre
  const [users, setUsers] = useState<IUsuario[]>([]);
  
  const isCreateMode = !apr?.id;

  useEffect(() => {
    if (!apr?.conteudoJson) return;
    try {
      const parsed = JSON.parse(apr.conteudoJson) as Partial<AprFormData>;
      setFormData(mergeForm(parsed));
    } catch {
      setFormData(createDefaultForm());
    }
  }, [apr]);

  useEffect(() => {
    // Carrega usuarios cadastrados para sugestoes de preenchimento.
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        const filterUsers = data.filter(u => u.isActive === true);
        setUsers(filterUsers);
      } catch {
        setUsers([]);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    // Emissor da APR deve ser o usuario criador e nao editavel.
    if (!isCreateMode) return;
    if (!user?.userName) return;
    setFormData((prev) => ({
      ...prev,
      emissor: { ...prev.emissor, nome: user.userName },
    }));
  }, [isCreateMode, user?.userName]);

  useEffect(() => {
    // Mantem o emissor do encerramento alinhado ao emissor da APR.
    if (!formData.emissor.nome) return;
    if (formData.encerramento.emissorNome === formData.emissor.nome) return;
    setFormData((prev) => ({
      ...prev,
      encerramento: { ...prev.encerramento, emissorNome: prev.emissor.nome },
    }));
  }, [formData.emissor.nome]);

  useEffect(() => {
    // Define data e hora automaticamente na criacao da APR.
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

  const toDatetimeLocal = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
  };

  const fromDatetimeLocal = (value: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toISOString();
  };

  const tituloSugestao = useMemo(() => {
    const data = formData.data ? formData.data.split("-").reverse().join("/") : "sem data";
    const local = formData.localSetor || "sem local";
    return `APR ${data} - ${local}`;
  }, [formData.data, formData.localSetor]);

  const updateChecklist = (
    section: keyof Pick<AprFormData, "trabalhoAltura" | "espacoConfinado" | "trabalhoQuente" | "eletricidade">,
    group: "epis" | "riscos",
    index: number,
    status: TriState
  ) => {
    setFormData((prev) => {
      const items = prev[section][group].map((item, i) =>
        i === index ? { ...item, status } : item
      );
      const next = { ...prev, [section]: { ...prev[section], [group]: items } };
      // Se selecionar risco em eletricidade, habilita automaticamente trabalho em altura.
      if (section === "eletricidade" && group === "riscos") {
        return {
          ...next,
          tipoTrabalho: { ...next.tipoTrabalho, altura: true },
        };
      }
      return next;
    });
  };

  const setAllChecklist = (
    section: keyof Pick<AprFormData, "trabalhoAltura" | "espacoConfinado" | "trabalhoQuente" | "eletricidade">,
    group: "epis" | "riscos",
    status: TriState
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [group]: prev[section][group].map((item) => ({ ...item, status })),
      },
    }));
  };

  const handleSave = async () => {
    const tituloFinal = formData.titulo?.trim() || tituloSugestao;
    const dataFinal = formData.data ? new Date(formData.data).toISOString() : new Date().toISOString();
    const payload: IApr = {
      id: apr?.id,
      titulo: tituloFinal,
      data: dataFinal,
      conteudoJson: JSON.stringify({ ...formData, titulo: tituloFinal }),
    };

    const isCreateMode = !apr?.id;
    if (isCreateMode) {
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
      }, 3000);
    }

    await onSave(payload);

    if (isCreateMode) {
      setStatusBadge("APR criada");
      setTimeout(() => {
        setStatusBadge("");
      }, 3000);
    } else {
      setStatusBadge("APR autorizada");
      setTimeout(() => {
        setStatusBadge("");
      }, 3000);
    }
  };

  const renderChecklist = (
    title: string,
    section: keyof Pick<AprFormData, "trabalhoAltura" | "espacoConfinado" | "trabalhoQuente" | "eletricidade">
  ) => (
    <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700"
            onClick={() => setAllChecklist(section, "epis", "S")}
          >
            EPIs S
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-full bg-slate-100 text-slate-700"
            onClick={() => setAllChecklist(section, "epis", "NA")}
          >
            EPIs N/A
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700"
            onClick={() => setAllChecklist(section, "riscos", "S")}
          >
            Riscos S
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-full bg-slate-100 text-slate-700"
            onClick={() => setAllChecklist(section, "riscos", "NA")}
          >
            Riscos N/A
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">EPIs Obrigatórios</p>
          <div className="space-y-2">
            {formData[section].epis.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                <div className="flex gap-1">
                  {(["S", "N", "NA"] as TriState[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateChecklist(section, "epis", index, value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === value
                          ? value === "S"
                            ? "bg-emerald-500 text-white"
                            : value === "N"
                            ? "bg-rose-500 text-white"
                            : "bg-slate-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-sm"
            rows={2}
            placeholder="Outros EPIs (separar por vírgula)"
            value={formData[section].outrosEpis}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], outrosEpis: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Riscos / Perigos</p>
          <div className="space-y-2">
            {formData[section].riscos.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                <div className="flex gap-1">
                  {(["S", "N", "NA"] as TriState[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateChecklist(section, "riscos", index, value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === value
                          ? value === "S"
                            ? "bg-emerald-500 text-white"
                            : value === "N"
                            ? "bg-rose-500 text-white"
                            : "bg-slate-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-sm"
            rows={2}
            placeholder="Outros riscos (separar por vírgula)"
            value={formData[section].outrosRiscos}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], outrosRiscos: e.target.value },
              }))
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Identificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-600">Título da APR</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder={tituloSugestao}
              value={formData.titulo}
              onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Empresa</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
              value={formData.empresa}
              onChange={(e) => setFormData((prev) => ({ ...prev, empresa: e.target.value }))}
            />
          </div>
          {!isCreateMode && (
            <div>
              <label className="text-xs font-semibold text-slate-600">Data</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-sm text-slate-600"
                value={formData.data}
                disabled
                readOnly
              />
            </div>
          )}
          {!isCreateMode && (
            <div>
              <label className="text-xs font-semibold text-slate-600">Hora Início</label>
              <input
                type="time"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-sm text-slate-600"
                value={formData.horaInicio}
                disabled
                readOnly
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tipo de Trabalho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { key: "altura", label: "Trabalho em Altura", numero: "numeroPta", placeholder: "Nº PTA" },
            { key: "espacoConfinado", label: "Trabalho em Espaço Confinado", numero: "numeroPet", placeholder: "Nº PET" },
            { key: "eletricidade", label: "Trabalho com Eletricidade", numero: "numeroPte", placeholder: "Nº PTE" },
            { key: "trabalhoQuente", label: "Trabalho à Quente", numero: "numeroPtq", placeholder: "Nº PTQ" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.tipoTrabalho[item.key as keyof AprFormData["tipoTrabalho"]] as boolean}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipoTrabalho: { ...prev.tipoTrabalho, [item.key]: e.target.checked },
                    }))
                  }
                />
                {item.label}
              </label>
              <input
                className="w-24 rounded-lg border border-slate-200 p-1 text-xs"
                placeholder={item.placeholder}
                value={
                  formData.tipoTrabalho[item.numero as keyof AprFormData["tipoTrabalho"]] as string
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipoTrabalho: { ...prev.tipoTrabalho, [item.numero]: e.target.value },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Atividades e Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            rows={3}
            placeholder="Atividades a serem realizadas"
            value={formData.atividades}
            onChange={(e) => setFormData((prev) => ({ ...prev, atividades: e.target.value }))}
          />
          <textarea
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            rows={3}
            placeholder="Ferramentas a serem utilizadas"
            value={formData.ferramentas}
            onChange={(e) => setFormData((prev) => ({ ...prev, ferramentas: e.target.value }))}
          />
          <input
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Local / Setor"
            value={formData.localSetor}
            onChange={(e) => setFormData((prev) => ({ ...prev, localSetor: e.target.value }))}
          />
          <input
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Colaboradores envolvidos"
            value={formData.colaboradores}
            onChange={(e) => setFormData((prev) => ({ ...prev, colaboradores: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">Supervisor da área/setor</p>
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm mb-2"
              placeholder="Nome"
              value={formData.supervisor.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, supervisor: { ...prev.supervisor, nome: e.target.value } }))
              }
            />
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Setor"
              value={formData.supervisor.setor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, supervisor: { ...prev.supervisor, setor: e.target.value } }))
              }
            />
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">Emissor da APR</p>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-sm text-slate-600 mb-2"
              placeholder="Nome"
              value={formData.emissor.nome}
              readOnly
              disabled
            />
            <input
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Setor"
              value={formData.emissor.setor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, emissor: { ...prev.emissor, setor: e.target.value } }))
              }
            />
          </div>
        </div>
      </div>

      {formData.tipoTrabalho.altura && renderChecklist("Trabalho em Altura", "trabalhoAltura")}
      {formData.tipoTrabalho.espacoConfinado && renderChecklist("Espaço Confinado", "espacoConfinado")}
      {formData.tipoTrabalho.trabalhoQuente && renderChecklist("Trabalho à Quente", "trabalhoQuente")}
      {formData.tipoTrabalho.eletricidade && renderChecklist("Trabalho com Eletricidade", "eletricidade")}

      {/* Sugestoes de usuarios cadastrados com digitacao livre */}
      <datalist id="apr-users-list">
        {users.map((user) => (
          <option key={user.id} value={user.nome || ""} />
        ))}
      </datalist>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Trabalhadores autorizados</h2>
        <div className="space-y-3">
          {formData.trabalhadores.map((trabalhador, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <input
                className="md:col-span-2 rounded-lg border border-slate-200 p-2 text-sm"
                placeholder={`Nome ${index + 1}`}
                list="apr-users-list"
                value={trabalhador.nome}
                onChange={(e) => {
                  const workers = [...formData.trabalhadores];
                  workers[index] = { ...workers[index], nome: e.target.value };
                  setFormData((prev) => ({ ...prev, trabalhadores: workers }));
                }}
              />
              <input
                className="md:col-span-2 rounded-lg border border-slate-200 p-2 text-sm"
                placeholder="Função"
                value={trabalhador.funcao}
                onChange={(e) => {
                  const workers = [...formData.trabalhadores];
                  workers[index] = { ...workers[index], funcao: e.target.value };
                  setFormData((prev) => ({ ...prev, trabalhadores: workers }));
                }}
              />
              <button
                type="button"
                className="text-xs text-rose-600 hover:underline"
                onClick={() => {
                  const workers = formData.trabalhadores.filter((_, i) => i !== index);
                  setFormData((prev) => ({
                    ...prev,
                    trabalhadores: workers.length ? workers : [{ nome: "", funcao: "" }],
                  }));
                }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 text-xs text-blue-600 hover:underline"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              trabalhadores: [...prev.trabalhadores, { nome: "", funcao: "" }],
            }))
          }
        >
          + Adicionar trabalhador
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Encerramento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="Solicitante da atividade"
            list="apr-users-list"
            value={formData.encerramento.solicitanteNome}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, solicitanteNome: e.target.value },
              }))
            }
          />
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={toDatetimeLocal(formData.encerramento.solicitanteData)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, solicitanteData: fromDatetimeLocal(e.target.value) },
              }))
            }
          />
          <input
            className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-sm text-slate-600"
            placeholder="Emissor da APR"
            disabled
            readOnly
            value={formData.encerramento.emissorNome}
          />
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            value={toDatetimeLocal(formData.encerramento.emissorData)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, emissorData: fromDatetimeLocal(e.target.value) },
              }))
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.encerramento.interrupcoes.porRazoesSeguranca}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  encerramento: {
                    ...prev.encerramento,
                    interrupcoes: {
                      ...prev.encerramento.interrupcoes,
                      porRazoesSeguranca: e.target.checked,
                    },
                  },
                }))
              }
            />
            Trabalhos interrompidos por razões de segurança
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 p-2 text-sm"
            placeholder="APR Nº de continuação (se houver)"
            value={formData.encerramento.interrupcoes.aprContinuacao}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: {
                  ...prev.encerramento,
                  interrupcoes: {
                    ...prev.encerramento.interrupcoes,
                    aprContinuacao: e.target.value,
                  },
                },
              }))
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        {statusBadge && (
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 flex items-center gap-2">
            <span>✓</span> {statusBadge}
          </span>
        )}
        <button
          type="button"
          disabled={saving || cooldown}
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold hover:from-rose-600 hover:to-red-700 disabled:opacity-60 transition-all shadow-lg shadow-rose-500/20"
        >
          {saving ? "Salvando..." : isCreateMode ? "Criar APR" : "Salvar APR"}
        </button>
      </div>
    </div>
  );
}
