# 📱 Guia: Conectando o App Mobile à API

## ✅ Configuração Atual

**API Backend:** `http://localhost:5285/api/v1`  
**IP da Máquina:** `192.168.100.241`  
**App Mobile:** `http://192.168.100.241:5285/api/v1`

---

## 🌐 Como Funciona com Expo Go

### ❌ Problema com "localhost"
- `localhost` no celular = o próprio celular
- O backend está na sua máquina, NÃO no celular
- Por isso NÃO podemos usar `localhost:5285`

### ✅ Solução: Usar IP da Rede Local
- Celular e computador na **mesma rede WiFi**
- App usa `http://192.168.100.241:5285/api/v1`
- Funciona perfeitamente com Expo Go!

---

## 📋 Pré-requisitos

### 1. Backend Rodando
```bash
cd BackEnd/MasterErp.Api
dotnet run
```
✅ Deve mostrar: `Now listening on: http://localhost:5285`

### 2. Celular no Mesmo WiFi
- ✅ Computador e celular conectados na **mesma rede WiFi**
- ❌ Não funciona se usar dados móveis (4G/5G)
- ❌ Não funciona se usar WiFi diferente

### 3. Expo Go Instalado
- Android: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [App Store - Expo Go](https://apps.apple.com/br/app/expo-go/id982107779)

---

## 🚀 Como Executar

### 1. Iniciar Backend
```bash
cd BackEnd/MasterErp.Api
dotnet run
```

### 2. Iniciar App Mobile
```bash
cd master-erp-mobile
npx expo start
```

### 3. Escanear QR Code
- **Android**: Abra Expo Go → "Scan QR Code"
- **iOS**: Abra a câmera nativa → aponte para o QR code

---

## 🔧 Troubleshooting

### ❌ Erro: "Network request failed"

**Causa:** Backend não acessível ou IP errado

**Soluções:**
1. **Verificar se backend está rodando:**
   ```bash
   curl http://localhost:5285/api/v1/Login
   ```
   Deve retornar erro 405 (método não permitido) - significa que está acessível

2. **Verificar IP da máquina:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```
   Procure por "IPv4" ou "inet"

3. **Atualizar IP no arquivo:**
   - Edite: `master-erp-mobile/src/api/client.ts`
   - Linha 10: `const API_BASE_URL = 'http://SEU_IP:5285/api/v1'`

4. **Verificar firewall:**
   - Windows Firewall pode bloquear conexões da rede local
   - Adicione exceção para porta 5285 se necessário

### ❌ Erro: "401 Unauthorized"

**Causa:** Token JWT inválido ou expirado

**Solução:**
- Faça logout e login novamente
- Token é renovado a cada login

### ❌ App não conecta no Expo Go

**Soluções:**
1. Ambos (PC e celular) no **mesmo WiFi**
2. Reinicie o Expo: `Ctrl+C` → `npx expo start`
3. Limpe cache: `npx expo start -c`

---

## 🎯 Alternativas de Configuração

### Para Emulador Android
```typescript
const API_BASE_URL = 'http://10.0.2.2:5285/api/v1';
```
`10.0.2.2` = localhost do computador visto do emulador Android

### Para Emulador iOS
```typescript
const API_BASE_URL = 'http://localhost:5285/api/v1';
```
Emulador iOS consegue acessar localhost diretamente

### Para Produção (ngrok/tunneling)
Se precisar testar fora da rede local:
```bash
npx ngrok http 5285
```
Use a URL gerada pelo ngrok no `client.ts`

---

## ✅ Checklist de Verificação

- [ ] Backend rodando (`dotnet run`)
- [ ] Celular no mesmo WiFi que o PC
- [ ] IP correto em `src/api/client.ts`
- [ ] Expo Go instalado no celular
- [ ] QR code escaneado
- [ ] Firewall liberado (porta 5285)

---

## 📝 Notas Importantes

1. **Segurança:** Esta configuração é apenas para desenvolvimento
2. **HTTPS:** Não é necessário HTTPS para desenvolvimento local
3. **Performance:** Conexão local é rápida (mesma rede)
4. **Produção:** Na produção, use URL real da API hospedada

---

## 🆘 Precisa de Ajuda?

Verifique os logs do console:
- **Backend:** Terminal onde rodou `dotnet run`
- **Expo:** Terminal onde rodou `npx expo start`
- **App:** Agite o celular → "Debug Remote JS"
