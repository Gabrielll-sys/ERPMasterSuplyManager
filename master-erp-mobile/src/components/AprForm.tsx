import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Checkbox, Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { IApr } from '../types';

// Tipos auxiliares para o checklist tri-state
type TriState = 'S' | 'N' | 'NA';

// Item base de checklist
interface ChecklistItem {
  label: string;
  status: TriState;
}

// Estrutura de checklist por seÃ§Ã£o
interface AprChecklist {
  epis: ChecklistItem[];
  riscos: ChecklistItem[];
  outrosEpis: string;
  outrosRiscos: string;
}

// Estrutura completa do formulÃ¡rio da APR
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

// Helpers para gerar checklist default
const buildChecklist = (labels: string[]): ChecklistItem[] =>
  labels.map((label) => ({ label, status: 'NA' }));

// Normaliza checklist salvo com base na lista original
const normalizeChecklist = (saved: ChecklistItem[] | undefined, labels: string[]): ChecklistItem[] => {
  const map = new Map(saved?.map((item) => [item.label, item.status]));
  return labels.map((label) => ({
    label,
    status: map.get(label) ?? 'NA',
  }));
};

// Listas de EPIs e riscos (baseadas na planilha da APR)
const alturaEpis = [
  'Capacete com jugular',
  'Abafador de ruÃ­do e/ou concha',
  'Ã“culos de ProteÃ§Ã£o',
  'Fita Tubular',
  'Luvas de proteÃ§Ã£o',
  'CalÃ§ado de proteÃ§Ã£o com biqueira',
  'Cinto de SeguranÃ§a Paraquedista',
  'Talabarte em â€œYâ€ com amortecedor ABS',
  'MÃ¡scara PFF02 com vÃ¡lvula',
  'MosquetÃ£o para cinto seguranÃ§a',
  'Bloqueador solar',
  'Trava quedas para cordas',
  'Trava quedas para cabo aÃ§o 8mm',
  'Trava quedas retrÃ¡til',
  'Uniforme eletricista anti-chama NR-10',
];

const alturaRiscos = [
  'Trabalho Ã  Quente',
  'Trabalho sob andaimes',
  'Trabalho em telhados',
  'Trabalho em EspaÃ§o Confinado',
  'Trabalho em Plataformas ElevatÃ³rias',
  'Trabalho sob escadas',
  'CondiÃ§Ãµes climÃ¡ticas adversas',
  'PrÃ³ximo Ã  redes elÃ©tricas',
  'DifÃ­cil acesso / locomoÃ§Ã£o ao local',
  'Queda de materiais',
  'Queda de pessoas',
  'Batida por e contra objeto/material',
  'InalaÃ§Ã£o de poeira',
  'Piso escorregadio',
  'ExposiÃ§Ã£o ao calor excessivo',
  'RadiaÃ§Ãµes nÃ£o ionizantes',
  'RuÃ­do',
  'ProjeÃ§Ã£o de materiais nos olhos',
  'InterferÃªncia de Ã¡reas de trabalho',
  'IÃ§amento crÃ­tico de materiais',
  'IntempÃ©ries (chuvas, raios, etc)',
];

const espacoEpis = [
  'CalÃ§ado de proteÃ§Ã£o',
  'Capacete com jugular',
  'Ã“culos de ProteÃ§Ã£o',
  'Roupas refletivas',
  'Luvas de couro / vaqueta',
  'Luvas de nitrÃ­lica/ nitrilon / algodÃ£o',
  'Cilindro de oxigÃªnio',
  'MÃ¡scara PFF02 com vÃ¡lvula',
  'Talabarte "Y" com amortecedor ABS',
  'ProteÃ§Ã£o auricular/ concha',
  'MacacÃ£o em Tyvek',
  'Cinto de seguranÃ§a tipo paraquedista',
  'MÃ¡scara respiratÃ³ria autÃ´noma (EPA)',
  'Respirador semi-facial VO/GA',
  'Respirador facial total VO/GA',
  'Ã“culos de ProteÃ§Ã£o Ampla VisÃ£o',
  'Luvas de proteÃ§Ã£o',
];

const espacoRiscos = [
  'Falta de comunicaÃ§Ã£o',
  'DifÃ­cil acesso / locomoÃ§Ã£o ao local',
  'MovimentaÃ§Ã£o peÃ§as',
  'RuÃ­do',
  'EspaÃ§o Confinado',
  'CH4 (GÃ¡s Metano)',
  'CO (DiÃ³xido de Carbono)',
  'H2S (GÃ¡s Ã¡cido SulfÃ­drico)',
  'Asfixia/ IntoxicaÃ§Ã£o',
  'Queda de pessoas',
  'Ãrea sob riscos especÃ­ficos',
  'PresenÃ§a cabos elÃ©tricos',
  'Equipamentos energizados',
  'RadiaÃ§Ãµes ionizante /nÃ£o-ionizantes',
  'DeficiÃªncia de OxigÃªnio (O2)',
  'Enriquecimento de OxigÃªnio (O2)',
  'NÃ­vel de explosividade acima do LT',
  'Altas/ baixas temperaturas',
  'CondiÃ§Ãµes climÃ¡ticas adversas',
  'InterferÃªncia de Ã¡reas',
  'Trabalho em altura',
  'Engolfamento',
  'Aprisionamento',
  'Animais peÃ§onhentos',
];

const quenteEpis = [
  'CalÃ§ado de proteÃ§Ã£o',
  'Capacete com jugular',
  'Ã“culos de SeguranÃ§a Preto',
  'Perneira de Raspa',
  'Luvas de couro cano longo',
  'MÃ¡scara PFF02 com vÃ¡lvula',
  'ProteÃ§Ã£o facial',
  'Protetor auricular / tipo concha',
  'Avental de couro (raspa) com manga',
  'Avental de couro (raspa) sem manga',
  'Cinto de seguranÃ§a tipo paraquedista',
  'MÃ¡scara de solda',
  'Ã“culos de ProteÃ§Ã£o Ampla VisÃ£o',
  'Lentes Incolores para mÃ¡scara de solda',
  'Lentes 10, 12 para mÃ¡scara de solda',
  'Ã“culos maÃ§ariqueiro',
  'BlusÃ£o de raspa (couro)',
  'Capuz de raspa (couro)',
  'Luvas de proteÃ§Ã£o',
];

const quenteRiscos = [
  'Chamas / Soldas / MaÃ§arico',
  'Ãrea com produtos inflamÃ¡veis',
  'Fogo / IgniÃ§Ã£o espontÃ¢nea',
  'Asfixia / IntoxicaÃ§Ã£o',
  'Produtos tÃ³xicos / Corrosivos',
  'GÃ¡s / Liquido sobre pressÃ£o',
  'InterferÃªncia de Ã¡reas',
  'RuÃ­do',
  'RadiaÃ§Ã£o ionizantes /nÃ£o ionizantes',
  'PresenÃ§a de cabos elÃ©tricos',
  'Equipamento energizado',
  'Painel energizado',
  'MovimentaÃ§Ã£o de peÃ§as',
  'CondiÃ§Ãµes climÃ¡ticas adversas',
  'Trabalho em altura',
  'IÃ§amento crÃ­tico de materiais',
  'Mangueiras maÃ§arico danificadas',
  'Cabos elÃ©tricos com fios expostos',
  'EspaÃ§o Confinado',
];

const eletricidadeEpis = [
  'CalÃ§ado de proteÃ§Ã£o (CA p/ eletricista)',
  'Capacete com jugular',
  'Ã“culos de proteÃ§Ã£o Incolor',
  'Uniforme eletricista anti-chama NR-10',
  'Luva de cobertura',
  'Luva isolante 5,0 Kv = ________ V',
  'Luva isolante 2,5 Kv = ________ V',
  'Capuz balaclava',
  'Abafador de ruÃ­do plug e/ou concha',
  'MÃ¡scara PFF02 com vÃ¡lvula',
  'Tapete Isolante de borracha',
];

const eletricidadeRiscos = [
  'Choque elÃ©trico',
  'Ãrea com produtos inflamÃ¡veis',
  'Painel elÃ©trico energizado',
  'Equipamento energizado',
  'PresenÃ§a cabos e/ou fios elÃ©tricos',
  'RadiaÃ§Ã£o ionizantes /nÃ£o ionizantes',
  'InterferÃªncia de Ã¡reas',
  'RuÃ­do',
  'Trabalho em altura',
  'Trabalho em EspaÃ§o Confinado',
  'Poeira',
  'Arco elÃ©trico',
];

// Checklist default por seÃ§Ã£o
const defaultChecklist = (epis: string[], riscos: string[]): AprChecklist => ({
  epis: buildChecklist(epis),
  riscos: buildChecklist(riscos),
  outrosEpis: '',
  outrosRiscos: '',
});

// Estado inicial do formulÃ¡rio
const createDefaultForm = (): AprFormData => ({
  titulo: '',
  empresa: '',
  data: '',
  horaInicio: '',
  tipoTrabalho: {
    altura: false,
    numeroPta: '',
    espacoConfinado: false,
    numeroPet: '',
    eletricidade: false,
    numeroPte: '',
    trabalhoQuente: false,
    numeroPtq: '',
  },
  atividades: '',
  localSetor: '',
  ferramentas: '',
  colaboradores: '',
  supervisor: { nome: '', setor: '' },
  emissor: { nome: '', setor: '' },
  trabalhoAltura: defaultChecklist(alturaEpis, alturaRiscos),
  espacoConfinado: defaultChecklist(espacoEpis, espacoRiscos),
  trabalhoQuente: defaultChecklist(quenteEpis, quenteRiscos),
  eletricidade: defaultChecklist(eletricidadeEpis, eletricidadeRiscos),
  trabalhadores: [{ nome: '', funcao: '' }],
  encerramento: {
    solicitanteNome: '',
    solicitanteData: '',
    emissorNome: '',
    emissorData: '',
    interrupcoes: { porRazoesSeguranca: false, aprContinuacao: '' },
  },
});

// Merge entre dados salvos e o default para manter listas completas
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

interface AprFormProps {
  apr?: IApr | null;
  onSave: (payload: IApr) => Promise<void>;
  saving?: boolean;
}

// FormulÃ¡rio reutilizÃ¡vel para criar/editar APR
export default function AprForm({ apr, onSave, saving }: AprFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState<AprFormData>(createDefaultForm());

  // Carrega dados da APR existente (se houver)
  useEffect(() => {
    if (!apr?.conteudoJson) return;
    try {
      const parsed = JSON.parse(apr.conteudoJson) as Partial<AprFormData>;
      setFormData(mergeForm(parsed));
    } catch {
      setFormData(createDefaultForm());
    }
  }, [apr]);

  // SugestÃ£o de tÃ­tulo baseada em data + local
  const tituloSugestao = useMemo(() => {
    const data = formData.data ? formData.data.split('-').reverse().join('/') : 'sem data';
    const local = formData.localSetor || 'sem local';
    return `APR ${data} - ${local}`;
  }, [formData.data, formData.localSetor]);

  // Atualiza status de um item de checklist
  const updateChecklist = (
    section: keyof Pick<AprFormData, 'trabalhoAltura' | 'espacoConfinado' | 'trabalhoQuente' | 'eletricidade'>,
    group: 'epis' | 'riscos',
    index: number,
    status: TriState
  ) => {
    setFormData((prev) => {
      const items = prev[section][group].map((item, i) =>
        i === index ? { ...item, status } : item
      );
      return { ...prev, [section]: { ...prev[section], [group]: items } };
    });
  };

  // Define um status Ãºnico para toda a lista
  const setAllChecklist = (
    section: keyof Pick<AprFormData, 'trabalhoAltura' | 'espacoConfinado' | 'trabalhoQuente' | 'eletricidade'>,
    group: 'epis' | 'riscos',
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

  // Envia payload para salvar a APR
  const handleSave = async () => {
    const tituloFinal = formData.titulo?.trim() || tituloSugestao;
    const dataFinal = formData.data ? new Date(formData.data).toISOString() : new Date().toISOString();
    const payload: IApr = {
      id: apr?.id,
      titulo: tituloFinal,
      data: dataFinal,
      conteudoJson: JSON.stringify({ ...formData, titulo: tituloFinal }),
    };
    await onSave(payload);
  };

  // Renderiza checklists de EPIs e Riscos
  const renderChecklist = (
    title: string,
    section: keyof Pick<AprFormData, 'trabalhoAltura' | 'espacoConfinado' | 'trabalhoQuente' | 'eletricidade'>
  ) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium">{title}</Text>
          <View style={styles.cardActionsRow}>
            <Button
              mode="outlined"
              compact
              onPress={() => setAllChecklist(section, 'epis', 'S')}
            >
              EPIs S
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setAllChecklist(section, 'epis', 'NA')}
            >
              EPIs N/A
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setAllChecklist(section, 'riscos', 'S')}
            >
              Riscos S
            </Button>
            <Button
              mode="outlined"
              compact
              onPress={() => setAllChecklist(section, 'riscos', 'NA')}
            >
              Riscos N/A
            </Button>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionLabel}>EPI's ObrigatÃ³rios</Text>
        {formData[section].epis.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.triStateRow}>
            <Text style={styles.triStateLabel}>{item.label}</Text>
            <View style={styles.triStateButtons}>
              {(['S', 'N', 'NA'] as TriState[]).map((value) => (
                <Button
                  key={value}
                  mode={item.status === value ? 'contained' : 'outlined'}
                  compact
                  onPress={() => updateChecklist(section, 'epis', index, value)}
                  style={styles.triStateButton}
                  buttonColor={item.status === value ? statusColors[value] : undefined}
                >
                  {value}
                </Button>
              ))}
            </View>
          </View>
        ))}
        <TextInput
          label="Outros EPIs"
          mode="outlined"
          multiline
          numberOfLines={2}
          value={formData[section].outrosEpis}
          onChangeText={(value) =>
            setFormData((prev) => ({
              ...prev,
              [section]: { ...prev[section], outrosEpis: value },
            }))
          }
          style={styles.input}
        />

        <Divider style={styles.divider} />

        <Text style={styles.sectionLabel}>Riscos / Perigos</Text>
        {formData[section].riscos.map((item, index) => (
          <View key={`${item.label}-${index}`} style={styles.triStateRow}>
            <Text style={styles.triStateLabel}>{item.label}</Text>
            <View style={styles.triStateButtons}>
              {(['S', 'N', 'NA'] as TriState[]).map((value) => (
                <Button
                  key={value}
                  mode={item.status === value ? 'contained' : 'outlined'}
                  compact
                  onPress={() => updateChecklist(section, 'riscos', index, value)}
                  style={styles.triStateButton}
                  buttonColor={item.status === value ? statusColors[value] : undefined}
                >
                  {value}
                </Button>
              ))}
            </View>
          </View>
        ))}
        <TextInput
          label="Outros riscos"
          mode="outlined"
          multiline
          numberOfLines={2}
          value={formData[section].outrosRiscos}
          onChangeText={(value) =>
            setFormData((prev) => ({
              ...prev,
              [section]: { ...prev[section], outrosRiscos: value },
            }))
          }
          style={styles.input}
        />
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* IdentificaÃ§Ã£o */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            IdentificaÃ§Ã£o
          </Text>
          <TextInput
            label="TÃ­tulo da APR"
            placeholder={tituloSugestao}
            mode="outlined"
            value={formData.titulo}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, titulo: value }))}
            style={styles.input}
          />
          <TextInput
            label="Empresa"
            mode="outlined"
            value={formData.empresa}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, empresa: value }))}
            style={styles.input}
          />
          <View style={styles.inlineRow}>
            <TextInput
              label="Data (AAAA-MM-DD)"
              mode="outlined"
              value={formData.data}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, data: value }))}
              style={[styles.input, styles.inlineInput]}
            />
            <TextInput
              label="Hora InÃ­cio (HH:MM)"
              mode="outlined"
              value={formData.horaInicio}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, horaInicio: value }))}
              style={[styles.input, styles.inlineInput]}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Tipo de trabalho */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Tipo de Trabalho
          </Text>
          {[
            { key: 'altura', label: 'Trabalho em Altura', numero: 'numeroPta', placeholder: 'NÂº PTA' },
            { key: 'espacoConfinado', label: 'Trabalho em EspaÃ§o Confinado', numero: 'numeroPet', placeholder: 'NÂº PET' },
            { key: 'eletricidade', label: 'Trabalho com Eletricidade', numero: 'numeroPte', placeholder: 'NÂº PTE' },
            { key: 'trabalhoQuente', label: 'Trabalho Ã  Quente', numero: 'numeroPtq', placeholder: 'NÂº PTQ' },
          ].map((item) => (
            <View key={item.key} style={styles.typeRow}>
              <View style={styles.typeLabelRow}>
                <Checkbox
                  status={
                    formData.tipoTrabalho[item.key as keyof AprFormData['tipoTrabalho']]
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tipoTrabalho: {
                        ...prev.tipoTrabalho,
                        [item.key]: !prev.tipoTrabalho[item.key as keyof AprFormData['tipoTrabalho']],
                      },
                    }))
                  }
                />
                <Text>{item.label}</Text>
              </View>
              <TextInput
                mode="outlined"
                placeholder={item.placeholder}
                value={formData.tipoTrabalho[item.numero as keyof AprFormData['tipoTrabalho']] as string}
                onChangeText={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipoTrabalho: { ...prev.tipoTrabalho, [item.numero]: value },
                  }))
                }
                style={styles.typeInput}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Atividades e equipe */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Atividades e Equipe
          </Text>
          <TextInput
            label="Atividades"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={formData.atividades}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, atividades: value }))}
            style={styles.input}
          />
          <TextInput
            label="Ferramentas"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={formData.ferramentas}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, ferramentas: value }))}
            style={styles.input}
          />
          <TextInput
            label="Local / Setor"
            mode="outlined"
            value={formData.localSetor}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, localSetor: value }))}
            style={styles.input}
          />
          <TextInput
            label="Colaboradores envolvidos"
            mode="outlined"
            value={formData.colaboradores}
            onChangeText={(value) => setFormData((prev) => ({ ...prev, colaboradores: value }))}
            style={styles.input}
          />
          <Divider style={styles.divider} />
          <Text style={styles.sectionLabel}>Supervisor da Ã¡rea / setor</Text>
          <TextInput
            label="Nome"
            mode="outlined"
            value={formData.supervisor.nome}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, supervisor: { ...prev.supervisor, nome: value } }))
            }
            style={styles.input}
          />
          <TextInput
            label="Setor"
            mode="outlined"
            value={formData.supervisor.setor}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, supervisor: { ...prev.supervisor, setor: value } }))
            }
            style={styles.input}
          />
          <Divider style={styles.divider} />
          <Text style={styles.sectionLabel}>Emissor da APR</Text>
          <TextInput
            label="Nome"
            mode="outlined"
            value={formData.emissor.nome}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, emissor: { ...prev.emissor, nome: value } }))
            }
            style={styles.input}
          />
          <TextInput
            label="Setor"
            mode="outlined"
            value={formData.emissor.setor}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, emissor: { ...prev.emissor, setor: value } }))
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {formData.tipoTrabalho.altura && renderChecklist('Trabalho em Altura', 'trabalhoAltura')}
      {formData.tipoTrabalho.espacoConfinado && renderChecklist('EspaÃ§o Confinado', 'espacoConfinado')}
      {formData.tipoTrabalho.trabalhoQuente && renderChecklist('Trabalho Ã  Quente', 'trabalhoQuente')}
      {formData.tipoTrabalho.eletricidade && renderChecklist('Trabalho com Eletricidade', 'eletricidade')}

      {/* Trabalhadores autorizados */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Trabalhadores autorizados
          </Text>
          {formData.trabalhadores.map((trabalhador, index) => (
            <View key={`trabalhador-${index}`} style={styles.workerRow}>
              <TextInput
                label={`Nome ${index + 1}`}
                mode="outlined"
                value={trabalhador.nome}
                onChangeText={(value) => {
                  const workers = [...formData.trabalhadores];
                  workers[index] = { ...workers[index], nome: value };
                  setFormData((prev) => ({ ...prev, trabalhadores: workers }));
                }}
                style={styles.workerInput}
              />
              <TextInput
                label="FunÃ§Ã£o"
                mode="outlined"
                value={trabalhador.funcao}
                onChangeText={(value) => {
                  const workers = [...formData.trabalhadores];
                  workers[index] = { ...workers[index], funcao: value };
                  setFormData((prev) => ({ ...prev, trabalhadores: workers }));
                }}
                style={styles.workerInput}
              />
              <Button
                mode="text"
                onPress={() => {
                  const workers = formData.trabalhadores.filter((_, i) => i !== index);
                  setFormData((prev) => ({
                    ...prev,
                    trabalhadores: workers.length ? workers : [{ nome: '', funcao: '' }],
                  }));
                }}
              >
                Remover
              </Button>
            </View>
          ))}
          <Button
            mode="outlined"
            onPress={() =>
              setFormData((prev) => ({
                ...prev,
                trabalhadores: [...prev.trabalhadores, { nome: '', funcao: '' }],
              }))
            }
          >
            + Adicionar trabalhador
          </Button>
        </Card.Content>
      </Card>

      {/* Encerramento */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Encerramento
          </Text>
          <TextInput
            label="Solicitante da atividade"
            mode="outlined"
            value={formData.encerramento.solicitanteNome}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, solicitanteNome: value },
              }))
            }
            style={styles.input}
          />
          <TextInput
            label="Data do solicitante (AAAA-MM-DD)"
            mode="outlined"
            value={formData.encerramento.solicitanteData}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, solicitanteData: value },
              }))
            }
            style={styles.input}
          />
          <TextInput
            label="Emissor da APR"
            mode="outlined"
            value={formData.encerramento.emissorNome}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, emissorNome: value },
              }))
            }
            style={styles.input}
          />
          <TextInput
            label="Data do emissor (AAAA-MM-DD)"
            mode="outlined"
            value={formData.encerramento.emissorData}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: { ...prev.encerramento, emissorData: value },
              }))
            }
            style={styles.input}
          />
          <View style={styles.checkboxRow}>
            <Checkbox
              status={formData.encerramento.interrupcoes.porRazoesSeguranca ? 'checked' : 'unchecked'}
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  encerramento: {
                    ...prev.encerramento,
                    interrupcoes: {
                      ...prev.encerramento.interrupcoes,
                      porRazoesSeguranca: !prev.encerramento.interrupcoes.porRazoesSeguranca,
                    },
                  },
                }))
              }
            />
            <Text>Trabalhos interrompidos por razÃµes de seguranÃ§a</Text>
          </View>
          <TextInput
            label="APR NÂº de continuaÃ§Ã£o (se houver)"
            mode="outlined"
            value={formData.encerramento.interrupcoes.aprContinuacao}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                encerramento: {
                  ...prev.encerramento,
                  interrupcoes: { ...prev.encerramento.interrupcoes, aprContinuacao: value },
                },
              }))
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* BotÃ£o de salvar */}
      <View style={styles.footerActions}>
        <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar APR'}
        </Button>
      </View>
    </ScrollView>
  );
}

// Cores de destaque para os botÃµes do tri-state
const statusColors: Record<TriState, string> = {
  S: '#2E7D32',
  N: '#C62828',
  NA: '#616161',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: '700',
  },
  cardHeader: {
    gap: 8,
  },
  cardActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  typeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 4,
  },
  typeInput: {
    width: 110,
    backgroundColor: 'transparent',
  },
  triStateRow: {
    marginBottom: 10,
  },
  triStateLabel: {
    marginBottom: 6,
  },
  triStateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  triStateButton: {
    marginRight: 4,
  },
  workerRow: {
    marginBottom: 12,
    gap: 8,
  },
  workerInput: {
    backgroundColor: 'transparent',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  footerActions: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
});
