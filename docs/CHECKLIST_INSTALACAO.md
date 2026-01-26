# Checklist de Instalação e Teste de Equipamentos

## Documentação Técnica

---

## 📋 Visão Geral

Este módulo implementa um sistema completo de checklist para validação de instalação e teste de equipamentos elétricos, com interface moderna e geração de PDF profissional.

---

## 📁 Estrutura de Arquivos

```
ERPMasterSuplyManager/
├── frontend/src/app/
│   ├── checklist-instalacao/
│   │   └── page.tsx                    # Página principal do checklist
│   └── componentes/
│       └── RadixSidebar.tsx            # Menu lateral (atualizado)
│
└── BackEnd/MasterErp.Services/
    └── Pdf/
        └── ChecklistInspecaoPdfService.cs  # Geração de PDF
```

---

## 🎨 Frontend

### Arquivo: `checklist-instalacao/page.tsx`

#### Tipos de Dados

```typescript
// Item individual do checklist
type ChecklistItem = { 
  item: string;    // Descrição do item
  feito: boolean;  // Status de conclusão
};

// Dados completos do formulário
type InstalacaoTeste = {
  nomeInstalador: string;
  nomeInspetorQualidade: string;
  data: string;
  os: string;
  nomeEquipamento: string;
  instalacao: ChecklistItem[];   // Itens de instalação
  testes: ChecklistItem[];       // Itens de teste
  observacoes: string;           // Anomalias/pontos de atenção
};

// Estrutura JSON salva no banco
type InstalacaoChecklistData = {
  tipo: "instalacao";             // Identificador do tipo
  instalacaoTeste: InstalacaoTeste;
};
```

#### Itens Padrão do Checklist

**Instalação:**
1. Cabo de alimentação e tomada
2. Painel instalado no equipamento – suporte OK
3. Tomada está dentro do painel
4. Furação da botoeira foi feita e conectada no inversor

**Testes:**
1. Equipamento funcionou (liga, desliga, reset)
2. Motor está girando para lado correto
3. Foi instalado os adesivos de advertência

#### Componentes

| Componente | Descrição |
|------------|-----------|
| `ChecklistInstalacaoPage` | Página principal com formulário e histórico |
| `InputField` | Campo de input estilizado com label |
| `ChecklistSection` | Seção de itens com progresso visual |
| `HistoryCard` | Card de checklist no histórico lateral |

#### Funções Principais

```typescript
// Parse seguro do JSON do banco
parseInstalacaoJson(json: string): InstalacaoChecklistData

// Extrai tipo do checklist para filtrar histórico
getChecklistTipo(json: string): string

// Valida campos obrigatórios antes de salvar
validateInstalacao(data: InstalacaoChecklistData): string[]

// Calcula progresso (total, concluídos, porcentagem)
getProgress(items: ChecklistItem[]): { total, done, percent }
```

---

## 🖨️ Backend - Geração de PDF

### Arquivo: `ChecklistInspecaoPdfService.cs`

#### Tipos Suportados

| Tipo | Título no PDF | Seções |
|------|---------------|--------|
| `montagem` | CHECKLIST DE MONTAGEM | Identificação, Funcionamento, Aspecto |
| `teste` | CHECKLIST DE TESTE | Itens Instalação, Itens Teste |
| `instalacao` | CHECKLIST INSTALAÇÃO E TESTE | Instalação, Testes, Observações |

#### DTO: InstalacaoTesteData

```csharp
public class InstalacaoTesteData
{
    public string? NomeInstalador { get; set; }
    public string? NomeInspetorQualidade { get; set; }
    public string? Data { get; set; }
    public string? Os { get; set; }
    public string? NomeEquipamento { get; set; }
    
    // Campos legados (compatibilidade)
    public List<ChecklistItemData> ItensInstalacao { get; set; }
    public List<ChecklistItemData> ItensTeste { get; set; }
    
    // Novos campos para checklist de instalação
    public List<ChecklistItemData> Instalacao { get; set; }
    public List<ChecklistItemData> Testes { get; set; }
    public string? Observacoes { get; set; }
}
```

#### Paleta de Cores

```csharp
private static readonly string Primary = "#1a1a2e";   // Azul escuro
private static readonly string Accent = "#f2c301";    // Amarelo
private static readonly string Success = "#22c55e";   // Verde
private static readonly string Pending = "#ef4444";   // Vermelho
private static readonly string Gray50 = "#f9fafb";    // Cinza claro
```

#### Elementos do PDF

1. **Cabeçalho**: Logo + Título + Número do registro
2. **Informações Gerais**: Grid com dados do formulário
3. **Seções de Checklist**: Tabela com status visual
4. **Observações**: Bloco de texto (se preenchido)
5. **Resumo**: Barra com estatísticas e porcentagem
6. **Rodapé**: Empresa + Data/hora + Paginação

---

## 🔗 Integração

### Rota no Sidebar

```typescript
// RadixSidebar.tsx - Menu Checklists
{
  label: 'Checklists',
  icon: ClipboardCheck,
  children: [
    { label: 'Checklist Montagem', href: '/checklist-montagem' },
    { label: 'Checklist Teste', href: '/checklist-teste' },
    { label: 'Checklist Instalação', href: '/checklist-instalacao' },  // NOVO
  ]
}
```

### API Endpoints

Todos os checklists usam a mesma API genérica:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/ChecklistInspecao` | Lista todos os checklists |
| POST | `/ChecklistInspecao` | Cria novo checklist |
| PUT | `/ChecklistInspecao` | Atualiza checklist existente |
| DELETE | `/ChecklistInspecao/{id}` | Remove checklist |
| GET | `/ChecklistInspecao/{id}/pdf` | Baixa PDF do checklist |

O campo `conteudoJson` armazena o JSON com `tipo` para diferenciar.

---

## 🛠️ Manutenção

### Adicionar Novo Item ao Checklist

1. Edite `defaultInstalacaoChecklist` no arquivo `page.tsx`:

```typescript
instalacao: [
  { item: "Novo item aqui", feito: false },
  // ... outros itens
],
```

### Adicionar Nova Seção

1. **Frontend**: Adicione ao tipo `InstalacaoTeste` e `defaultInstalacaoChecklist`
2. **Backend**: Adicione ao `InstalacaoTesteData` e `ComposeInstalacaoTeste`

### Alterar Cores do PDF

Edite as constantes de cores em `ChecklistInspecaoPdfDocument`:

```csharp
private static readonly string Accent = "#f2c301"; // Cor de destaque
```

---

## ✅ Checklist de Deploy

- [ ] Backend compilado sem erros (`dotnet build`)
- [ ] Frontend compilado sem erros (`npm run build`)
- [ ] Nova rota aparece no sidebar
- [ ] Criação de checklist funciona
- [ ] Edição de checklist funciona
- [ ] Histórico filtra apenas tipo "instalacao"
- [ ] Download de PDF funciona
- [ ] PDF exibe todas as seções corretamente

---

## 📝 Exemplo de JSON Salvo

```json
{
  "tipo": "instalacao",
  "instalacaoTeste": {
    "nomeInstalador": "João Silva",
    "nomeInspetorQualidade": "Maria Santos",
    "data": "2026-01-26",
    "os": "OS-2026-001",
    "nomeEquipamento": "Motor WEG 10CV",
    "instalacao": [
      { "item": "Cabo de alimentação e tomada", "feito": true },
      { "item": "Painel instalado no equipamento", "feito": true },
      { "item": "Tomada está dentro do painel", "feito": false },
      { "item": "Furação da botoeira conectada", "feito": true }
    ],
    "testes": [
      { "item": "Equipamento funcionou", "feito": true },
      { "item": "Motor girando corretamente", "feito": true },
      { "item": "Adesivos de advertência", "feito": false }
    ],
    "observacoes": "Motor apresentou ruído leve ao ligar"
  }
}
```

---

*Documentação criada em 26/01/2026*
