# Diretrizes de UI/UX Profissional

## Guia para Interfaces Web e Mobile (React Native)

---

## 🎯 PRINCÍPIOS FUNDAMENTAIS

1. **Impacto Visual Imediato** - O usuário deve ser impressionado no primeiro contato. Evite interfaces genéricas ou básicas.

2. **Consistência Total** - Cores, tipografia, espaçamentos e interações uniformes em toda a aplicação.

3. **Feedback Instantâneo** - Toda ação deve ter resposta visual imediata: hover/press, loading, sucesso, erro.

4. **Hierarquia Clara** - Elementos importantes se destacam visualmente via tamanho, peso, cor e espaçamento.

5. **Acessibilidade** - Contraste adequado, áreas de toque suficientes, navegação intuitiva.

---

## 🎨 DESIGN VISUAL

### Cores
- **Gradientes suaves** para fundos (nunca cor sólida monótona)
- **Sombras coloridas** em botões primários (sombra que combina com a cor)
- **Paleta semântica**: primária, sucesso (verde), erro (vermelho), alerta (amarelo)
- **Texto em cinza escuro**, nunca preto puro

### Tipografia
- **Títulos**: Grande, bold, cor escura
- **Subtítulos**: Menor, peso normal, cinza médio
- **Labels**: Médio, semibold, cor escura
- **Texto auxiliar**: Pequeno, cinza claro
- Máximo 3 tamanhos por tela

### Espaçamento
- Generoso entre seções (32-48px)
- Padding consistente em cards (16-24px)
- **Regra: mais espaço = mais premium**

### Bordas e Cantos
- Cantos arredondados generosos (12-16px cards, 8-12px botões)
- Bordas sutis em cinza claro

---

## 🧩 COMPONENTES ESSENCIAIS

### Header/Navegação
- Sticky/fixo com blur de fundo (glass effect)
- Ícone da página com fundo colorido
- Título + subtítulo descritivo
- Ações principais visíveis

### Cards
- Fundo branco, borda sutil, sombra leve
- Padding generoso
- Estado de interação visível

### Botões
- **Primário**: Gradiente + sombra colorida + texto branco
- **Secundário**: Fundo cinza claro + texto escuro
- **Perigo**: Fundo vermelho claro + texto vermelho
- Transição suave em todos

### Inputs
- Label acima com indicador de obrigatório
- Borda cinza, foco com destaque colorido
- Placeholder descritivo

### Checkboxes/Toggles
- Customizados (não usar default do sistema)
- Estado marcado com cor de sucesso
- Label clicável/tocável

### Notificações
- Fundo colorido suave + borda + ícone
- Auto-dismiss após 3-4 segundos

### Barras de Progresso
- Gradiente, animação suave, porcentagem visível

### Estado Vazio
- Ícone centralizado + mensagem amigável

---

## 📱 ADAPTAÇÕES PARA MOBILE (React Native)

### Princípios Mobile-First
- **Touch-friendly**: Áreas de toque mínimo 44x44pt
- **Thumb zone**: Ações principais na parte inferior da tela
- **Gestos nativos**: Swipe, pull-to-refresh, long-press
- **Performance**: Animações a 60fps, listas virtualizadas

### Navegação
- Use **Stack Navigator** para fluxos lineares
- Use **Tab Navigator** para seções principais (máx. 5 tabs)
- **Header nativo** com título centralizado (iOS) ou alinhado à esquerda (Android)
- Botão de voltar sempre visível em telas internas

### Componentes Nativos
- **FlatList/SectionList** para listas (nunca ScrollView com map)
- **TouchableOpacity** ou **Pressable** para interações
- **KeyboardAvoidingView** em formulários
- **SafeAreaView** para respeitar notch/bordas

### Feedback Tátil
- **Haptics** para ações importantes (sucesso, erro, seleção)
- **Ripple effect** no Android
- **Highlight** no iOS
- Loading com **ActivityIndicator** nativo

### Formulários Mobile
- **Teclado apropriado**: email, numérico, telefone
- **Auto-capitalização** e **auto-correção** configurados
- **Scroll automático** para input focado
- **Botão de submit** acima do teclado

### Adaptações de Layout
- **Flexbox** ao invés de Grid
- **Dimensions API** para responsividade
- **Platform.select** para estilos específicos iOS/Android
- **StatusBar** configurada por tela

### Padrões de Interação
| Web | Mobile |
|-----|--------|
| Hover | Long-press ou tooltip |
| Click | Tap com highlight |
| Scroll sidebar | Bottom sheet ou modal |
| Dropdown | ActionSheet ou Picker nativo |
| Tooltip | Contextual help ou modal |
| Drag and drop | Swipe actions |

### Performance Mobile
- **Memoização** de componentes pesados
- **Lazy loading** de telas
- **Imagens otimizadas** (formato, tamanho, cache)
- **Skeleton screens** durante loading

### Estilos Mobile
```javascript
// Padrão de organização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});
```

---

## ✨ MICROINTERAÇÕES

### Transições
- Mudanças de estado com animação (200-300ms)
- **Animated API** ou **Reanimated** para performance
- Efeitos de entrada para novos elementos

### Estados de Componentes
- Normal → Pressed → Disabled
- Cada estado visualmente distinto
- Loading com indicador apropriado

### Feedback
- Sucesso: cor verde + ícone ✓ + haptic
- Erro: cor vermelha + ícone ⚠ + shake
- Confirmação antes de ações destrutivas (Alert)

---

## 🏆 BOAS PRÁTICAS

1. **Whitespace generoso** - Evite interfaces apertadas
2. **Alinhamento em grid** - Todos os elementos alinhados
3. **Contraste adequado** - Texto legível em qualquer fundo
4. **Consistência** - Mesmos padrões em toda a app
5. **Teste em dispositivo real** - Emulador não substitui device
6. **Dark mode** - Considere suporte nativo

---

## 📋 CHECKLIST DE QUALIDADE

### Web
- [ ] Primeira impressão é premium?
- [ ] Hover states em todos os clicáveis?
- [ ] Layout funciona em todas as resoluções?
- [ ] Feedback para todas as ações?

### Mobile
- [ ] Áreas de toque têm 44pt mínimo?
- [ ] Ações principais estão na thumb zone?
- [ ] Formulários funcionam com teclado aberto?
- [ ] Performance está a 60fps?
- [ ] Funciona offline ou mostra estado adequado?
- [ ] Respeita padrões iOS e Android?

---

*Adapte cores e estilos específicos para cada projeto, mantendo os princípios.*
