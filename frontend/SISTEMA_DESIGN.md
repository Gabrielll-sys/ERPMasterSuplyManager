# 🎨 Sistema de Design - ERP Master Supply Manager

> Data de criação: 04/11/2025
> Status: ✅ Em Implementação

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Componentes Disponíveis](#componentes-disponíveis)
3. [Design Tokens](#design-tokens)
4. [Guia de Uso](#guia-de-uso)
5. [Migração de Componentes](#migração-de-componentes)
6. [Acessibilidade](#acessibilidade)
7. [Roadmap](#roadmap)

---

## Visão Geral

### Objetivo

Criar um sistema de design unificado para resolver os seguintes problemas:

- ❌ **Antes**: 3 bibliotecas UI diferentes (NextUI, Radix, MUI)
- ❌ **Antes**: Inconsistência visual entre páginas
- ❌ **Antes**: Bundle size inflado (+600KB só de UI)
- ❌ **Antes**: Manutenção complexa

- ✅ **Agora**: Componentes unificados baseados em Tailwind + Radix primitives
- ✅ **Agora**: Design tokens centralizados
- ✅ **Agora**: Acessibilidade built-in
- ✅ **Agora**: Bundle otimizado

### Arquitetura

```
frontend/src/app/
├── lib/
│   └── design-tokens.ts       # Cores, espaçamentos, tipografia
├── componentes/
│   ├── ui/                    # Componentes do sistema de design
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts           # Exportações centralizadas
│   ├── common/                # Componentes utilitários
│   │   ├── LoadingState.tsx
│   │   └── ErrorState.tsx
│   └── hooks/
│       └── useConfirmDialog.tsx
```

---

## Componentes Disponíveis

### 1. Button

Botão unificado com variantes, tamanhos e estados de loading.

**Props**:
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: ReactNode

**Exemplo**:
```tsx
import { Button } from '@/app/componentes/ui';
import { Save, Trash } from 'lucide-react';

// Botão primário
<Button variant="primary" size="md">
  Salvar
</Button>

// Com loading
<Button variant="primary" loading={isSaving}>
  Salvando...
</Button>

// Com ícone
<Button variant="danger" leftIcon={<Trash size={16} />}>
  Excluir
</Button>

// Largura total
<Button variant="success" fullWidth>
  Confirmar
</Button>
```

### 2. Input

Input de texto com label, erro, helper text e ícones.

**Props**:
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: ReactNode
- `required`: boolean

**Exemplo**:
```tsx
import { Input } from '@/app/componentes/ui';
import { Mail, User } from 'lucide-react';

// Input básico
<Input
  label="Nome"
  placeholder="Digite seu nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>

// Com erro
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  leftIcon={<Mail size={16} />}
/>

// Com helper text
<Input
  label="CPF"
  helperText="Apenas números"
  leftIcon={<User size={16} />}
/>
```

### 3. Select

Dropdown select com label, erro e helper text.

**Props**:
- `label`: string
- `error`: string
- `helperText`: string
- `options`: SelectOption[]
- `placeholder`: string
- `required`: boolean

**Exemplo**:
```tsx
import { Select } from '@/app/componentes/ui';

<Select
  label="Categoria"
  placeholder="Selecione uma categoria"
  options={[
    { value: 'eletrico', label: 'Elétrico' },
    { value: 'mecanico', label: 'Mecânico' },
    { value: 'hidraulico', label: 'Hidráulico', disabled: true },
  ]}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  required
/>
```

### 4. Card

Componente de card com header, body e footer.

**Componentes**:
- `Card`: Container principal
- `CardHeader`: Cabeçalho com título, subtítulo e ação
- `CardBody`: Corpo do card
- `CardFooter`: Rodapé com alinhamento

**Props do Card**:
- `variant`: 'default' | 'bordered' | 'elevated' | 'flat'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean
- `clickable`: boolean

**Exemplo**:
```tsx
import { Card, CardHeader, CardBody, CardFooter, Button } from '@/app/componentes/ui';

<Card variant="elevated" hoverable>
  <CardHeader
    title="Orçamento #123"
    subtitle="Cliente: ABC Indústria"
    action={<Button variant="ghost">Editar</Button>}
  />
  <CardBody>
    <p>Total: R$ 15.000,00</p>
    <p>Status: Pendente</p>
  </CardBody>
  <CardFooter align="right">
    <Button variant="outline">Cancelar</Button>
    <Button variant="success">Aprovar</Button>
  </CardFooter>
</Card>
```

### 5. Badge

Badge para status, categorias, contadores.

**Props**:
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean
- `icon`: ReactNode

**Exemplo**:
```tsx
import { Badge } from '@/app/componentes/ui';
import { Check, Clock } from 'lucide-react';

// Status
<Badge variant="success" dot>Pago</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="danger">Cancelado</Badge>

// Com ícone
<Badge variant="info" icon={<Check size={12} />}>
  Aprovado
</Badge>

// Contador
<Badge variant="primary">5 itens</Badge>
```

### 6. LoadingState / ErrorState

Componentes de feedback já criados anteriormente.

**Exemplo**:
```tsx
import { LoadingState, ErrorState } from '@/app/componentes/ui';

// Loading
if (isLoading) return <LoadingState message="Carregando materiais..." />;

// Error
if (error) return (
  <ErrorState
    error={error}
    onRetry={refetch}
    showHomeButton
  />
);

// Skeleton de tabela
{isLoading ? <TableSkeleton rows={10} /> : <Table data={data} />}
```

---

## Design Tokens

### Cores

```typescript
import { colors } from '@/app/lib/design-tokens';

// Primary (Azul)
colors.primary[500] // #3b82f6

// Success (Verde)
colors.success[500] // #22c55e

// Warning (Amarelo)
colors.warning[500] // #f59e0b

// Error (Vermelho)
colors.error[500] // #ef4444

// Neutros
colors.secondary[500] // #6b7280
```

### Espaçamentos

```typescript
import { spacing } from '@/app/lib/design-tokens';

spacing[4] // 1rem (16px)
spacing[8] // 2rem (32px)
```

### Tipografia

```typescript
import { fontSize, fontWeight } from '@/app/lib/design-tokens';

fontSize.base  // 1rem (16px)
fontSize.lg    // 1.125rem (18px)
fontSize['2xl'] // 1.5rem (24px)

fontWeight.normal   // 400
fontWeight.semibold // 600
fontWeight.bold     // 700
```

### Sombras, Border Radius, etc

Veja o arquivo completo em `app/lib/design-tokens.ts`.

---

## Guia de Uso

### Importação Centralizada

```tsx
// ✅ Recomendado - Import único
import { Button, Input, Card, Badge, LoadingState } from '@/app/componentes/ui';

// ❌ Evitar - Imports múltiplos
import { Button } from '@/app/componentes/ui/Button';
import { Input } from '@/app/componentes/ui/Input';
```

### Padrão de Formulário

```tsx
import { Input, Select, Button } from '@/app/componentes/ui';
import { useState } from 'react';

export function MyForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!category) newErrors.category = 'Categoria é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit
    await submitData({ name, category });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />

      <Select
        label="Categoria"
        placeholder="Selecione..."
        options={categories}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        error={errors.category}
        required
      />

      <Button type="submit" fullWidth loading={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}
```

### Padrão de Lista com Cards

```tsx
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from '@/app/componentes/ui';

export function OrcamentosList({ orcamentos }: { orcamentos: IOrcamento[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orcamentos.map((orc) => (
        <Card key={orc.id} variant="elevated" hoverable>
          <CardHeader
            title={`Orçamento #${orc.id}`}
            subtitle={orc.nomeCliente}
          />
          <CardBody>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">
                  {formatCurrency(orc.total)}
                </span>
              </div>
              <Badge variant={orc.status === 'pago' ? 'success' : 'warning'}>
                {orc.status}
              </Badge>
            </div>
          </CardBody>
          <CardFooter align="right">
            <Button variant="outline" size="sm">Ver</Button>
            <Button variant="primary" size="sm">Editar</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

---

## Migração de Componentes

### Exemplo: Migrar de NextUI para Sistema de Design

**ANTES** (NextUI):
```tsx
import { Button, Input } from '@nextui-org/react';

<Input
  label="Nome Cliente"
  labelPlacement="outside"
  value={nomeCliente}
  className="border-1 border-black rounded-md shadow-sm shadow-black mt-10 ml-5 mr-5 w-[200px]"
  onValueChange={setNomeCliente}
/>

<Button
  isDisabled={!nomeCliente}
  onPress={handleCreateBudge}
  className="bg-master_black text-white p-7 rounded-md font-bold text-2xl shadow-lg"
>
  Criar Orçamento
</Button>
```

**DEPOIS** (Sistema de Design):
```tsx
import { Button, Input } from '@/app/componentes/ui';

<Input
  label="Nome Cliente"
  value={nomeCliente}
  onChange={(e) => setNomeCliente(e.target.value)}
  containerClassName="w-[200px]"
/>

<Button
  disabled={!nomeCliente}
  onClick={handleCreateBudge}
  variant="primary"
  size="lg"
>
  Criar Orçamento
</Button>
```

### Exemplo: Migrar de MUI para Sistema de Design

**ANTES** (Material-UI):
```tsx
import { TextField, Button } from '@mui/material';

<TextField
  label="Descrição"
  variant="outlined"
  fullWidth
  value={descricao}
  onChange={(e) => setDescricao(e.target.value)}
  error={!!errors.descricao}
  helperText={errors.descricao}
/>

<Button
  variant="contained"
  color="primary"
  onClick={handleSave}
  disabled={isLoading}
>
  Salvar
</Button>
```

**DEPOIS** (Sistema de Design):
```tsx
import { Input, Button } from '@/app/componentes/ui';

<Input
  label="Descrição"
  value={descricao}
  onChange={(e) => setDescricao(e.target.value)}
  error={errors.descricao}
/>

<Button
  variant="primary"
  onClick={handleSave}
  loading={isLoading}
>
  Salvar
</Button>
```

### Tabela de Equivalências

| NextUI | MUI | Sistema de Design |
|--------|-----|-------------------|
| `<Button>` | `<Button>` | `<Button>` |
| `<Input>` | `<TextField>` | `<Input>` |
| `<Select>` | `<Select>` | `<Select>` |
| `<Card>` | `<Card>` | `<Card>` |
| `<Chip>` | `<Chip>` | `<Badge>` |
| `<Spinner>` | `<CircularProgress>` | `<LoadingState>` |

---

## Acessibilidade

Todos os componentes do sistema de design incluem:

### ✅ ARIA Labels
```tsx
// Input com erro tem aria-invalid e aria-describedby
<Input error="Campo obrigatório" />
// Renderiza: aria-invalid="true" aria-describedby="input-id-error"
```

### ✅ Focus Management
```tsx
// Todos componentes têm focus:ring
<Button /> // focus:ring-2 focus:ring-offset-1
```

### ✅ Keyboard Navigation
- Todos botões são focáveis com Tab
- Enter/Space ativam botões
- Escape fecha modais

### ✅ Screen Readers
```tsx
// Labels associados corretamente
<Input label="Nome" />
// Renderiza: <label for="nome">Nome</label> + <input id="nome" />
```

### ✅ Contraste de Cores
- Todas combinações seguem WCAG AA (4.5:1)
- Textos têm contraste mínimo de 4.5:1
- Elementos interativos têm contraste de 3:1

### Checklist de Acessibilidade

Ao criar novos componentes, verificar:

- [ ] Label associado ao input (htmlFor + id)
- [ ] aria-invalid quando tem erro
- [ ] aria-describedby para helper text e erros
- [ ] Disabled corretamente (visual + funcional)
- [ ] Focus visível (ring)
- [ ] Navegação por teclado funciona
- [ ] Screen reader consegue ler tudo

---

## Roadmap

### ✅ Fase 1: Fundação (Concluída)
- [x] Design tokens
- [x] Button
- [x] Input
- [x] Select
- [x] Card
- [x] Badge
- [x] LoadingState / ErrorState
- [x] useConfirmDialog

### 🚧 Fase 2: Componentes Avançados (Em Progresso)
- [ ] Table (tabela com ordenação, paginação)
- [ ] Modal / Dialog
- [ ] Tabs
- [ ] Accordion
- [ ] Dropdown Menu
- [ ] Tooltip
- [ ] Toast (integrar com Sonner)

### 📋 Fase 3: Migração Gradual
- [ ] Migrar página de login
- [ ] Migrar create-budge
- [ ] Migrar manage-budges
- [ ] Migrar edit-budge
- [ ] Migrar todas páginas restantes

### 🎯 Fase 4: Otimização
- [ ] Remover NextUI
- [ ] Remover Material-UI
- [ ] Tree-shaking otimizado
- [ ] Documentação completa (Storybook?)

---

## Estatísticas

### Uso Atual de Bibliotecas
- **NextUI**: 37 ocorrências em 35 arquivos
- **Radix UI**: 49 ocorrências em 41 arquivos
- **Material-UI**: 48 ocorrências em 11 arquivos

### Meta
- **Sistema de Design**: 100% dos componentes
- **Redução de Bundle**: -400KB (após remover NextUI e MUI)
- **Consistência Visual**: 100%

---

## Suporte

Para dúvidas ou sugestões sobre o sistema de design:
1. Ver exemplos neste documento
2. Consultar `design-tokens.ts` para valores
3. Ver componentes em `componentes/ui/`

**Última atualização**: 04/11/2025
