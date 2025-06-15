# 🏭 ERP Master Supply Manager

<div align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core" />
  <img src="https://img.shields.io/badge/Entity_Framework-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="Entity Framework" />
  <img src="https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</div>

<br />

<div align="center">
  <h3>🚀 Sistema ERP Empresarial Completo</h3>
  <p><strong>Solução proprietária full-stack</strong> para gestão industrial e controle de suprimentos</p>
</div>

---

## 📋 Visão Geral

O **ERP Master Supply Manager** é uma solução empresarial robusta e proprietária, desenvolvida com arquitetura moderna full-stack para atender demandas específicas de gestão industrial e controle de suprimentos. O sistema integra um backend .NET de alta performance com uma interface frontend React responsiva e intuitiva.

### 🏗️ Arquitetura Empresarial

**Backend** - APIs RESTful escaláveis e seguras
- ASP.NET Core com .NET 8 para máxima performance
- Entity Framework Core para ORM avançado
- Autenticação JWT com controle de acesso granular
- Processamento de dados em tempo real
- Arquitetura em camadas com injeção de dependência

**Frontend** - Interface moderna e responsiva
- Next.js 14 com App Router e Server Components
- TypeScript para desenvolvimento type-safe
- UI/UX otimizada para operações industriais
- Integração com APIs através de HTTP clients

### ✨ Módulos Funcionais

- **📦 Gestão de Inventário**: Controle completo de estoque e materiais
- **📋 Ordens de Serviço**: Sistema avançado de OS e workflow
- **📊 Business Intelligence**: Dashboards e relatórios analíticos
- **💰 Gestão Comercial**: Orçamentos, vendas e faturamento
- **👥 Controle de Acesso**: Gestão de usuários e permissões
- **📱 QR Code Scanner**: Rastreamento e identificação de produtos
- **📄 Documentos Fiscais**: Notas fiscais e documentação legal
- **🔍 Search Engine**: Busca inteligente no inventário

## 🛠️ Stack Tecnológica

### ⚙️ Backend (.NET Ecosystem)
- **ASP.NET Core 8** - Web API framework de alta performance
- **Entity Framework Core** - ORM para acesso a dados
- **SQL Server** - Sistema de gerenciamento de banco de dados
- **JWT Bearer Authentication** - Autenticação e autorização
- **AutoMapper** - Mapeamento objeto-objeto
- **FluentValidation** - Validação de modelos
- **Serilog** - Logging estruturado
- **Swagger/OpenAPI** - Documentação de API
- **Hangfire** - Processamento em background
- **SignalR** - Comunicação em tempo real

### 🎨 Frontend (React Ecosystem)
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **NextUI & Material-UI** - Componentes modernos
- **Framer Motion** - Animações e transições
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **NextAuth.js** - Autenticação do lado cliente

### 🔧 Ferramentas e Integrações
- **Azure Blob Storage** - Armazenamento de arquivos
- **React PDF** - Geração de documentos
- **ExcelJS** - Manipulação de planilhas
- **QR Code Generator** - Códigos de rastreamento
- **Axios** - Cliente HTTP
- **JWT Decode** - Decodificação de tokens

## 🏛️ Arquitetura Backend

### Estrutura em Camadas
```
Backend (ASP.NET Core)/
├── API/                        # Camada de apresentação
│   ├── Controllers/           # Controllers da Web API
│   ├── Middleware/            # Middlewares customizados
│   └── Extensions/            # Extensões de serviço
├── Application/               # Camada de aplicação
│   ├── Services/              # Serviços de negócio
│   ├── Interfaces/            # Contratos de serviço
│   ├── DTOs/                  # Data Transfer Objects
│   └── Validators/            # Validadores FluentValidation
├── Domain/                    # Camada de domínio
│   ├── Entities/              # Entidades do domínio
│   ├── Enums/                 # Enumerações
│   └── Specifications/        # Especificações de negócio
├── Infrastructure/            # Camada de infraestrutura
│   ├── Data/                  # Entity Framework Context
│   ├── Repositories/          # Repositórios de dados
│   ├── Identity/              # Configuração de identidade
│   └── Services/              # Serviços de infraestrutura
└── Shared/                    # Código compartilhado
    ├── Constants/             # Constantes do sistema
    ├── Extensions/            # Métodos de extensão
    └── Helpers/               # Classes auxiliares
```

### Padrões Implementados
- **Repository Pattern** para acesso a dados
- **Unit of Work** para transações
- **CQRS** com MediatR (se aplicável)
- **Dependency Injection** nativo do .NET
- **Clean Architecture** para separação de responsabilidades

## 🎨 Arquitetura Frontend

### Estrutura Next.js 14
```
Frontend (Next.js)/
├── src/app/                   # App Router (Next.js 14)
│   ├── (budgeAndSell)/        # Módulo de orçamentos
│   ├── (daily-report)/        # Relatórios operacionais
│   ├── (manage-users)/        # Gestão de usuários
│   ├── (nota-fiscal)/         # Documentos fiscais
│   ├── (os-management)/       # Gestão de ordens de serviço
│   ├── (qrcode)/              # Sistema QR Code
│   ├── api/                   # API Routes (middleware)
│   └── globals.css            # Estilos globais
├── src/components/            # Componentes reutilizáveis
│   ├── ui/                    # Componentes base
│   ├── forms/                 # Componentes de formulário
│   └── layout/                # Componentes de layout
├── src/contexts/              # Context Providers
├── src/hooks/                 # Custom Hooks
├── src/interfaces/            # Definições TypeScript
├── src/services/              # Integração com APIs
├── src/utils/                 # Utilitários e helpers
└── src/lib/                   # Configurações e libs
```

### Padrões Frontend
- **Component-Based Architecture** com React
- **Custom Hooks** para lógica reutilizável
- **Context API** para estado global
- **Server Components** para performance
- **Client Components** para interatividade

## 🔐 Segurança e Autenticação

### Backend Security
- **JWT Bearer Tokens** com refresh token rotation
- **ASP.NET Core Identity** para gerenciamento de usuários
- **Role-Based Access Control (RBAC)** granular
- **Password Hashing** com BCrypt
- **HTTPS Enforcement** obrigatório
- **CORS Policy** configurada
- **Rate Limiting** para proteção contra ataques
- **Input Validation** com FluentValidation
- **SQL Injection Prevention** via Entity Framework

### Frontend Security
- **JWT Token Management** seguro
- **Route Protection** baseada em roles
- **XSS Prevention** com sanitização
- **CSRF Protection** integrada
- **Secure Storage** de tokens
- **Input Validation** client-side com Zod

## 🚀 Performance e Otimização

### Backend Performance
- **Entity Framework Optimizations**
  - Lazy loading configurável
  - Query optimization com Include/ThenInclude
  - Database indexing estratégico
  - Connection pooling
- **Caching Strategies**
  - Memory caching para dados frequentes
  - Distributed caching (Redis, se aplicável)
  - Response caching para endpoints estáticos
- **Async/Await** em todas operações I/O
- **Compression** middleware para responses

### Frontend Performance
- **Next.js Optimizations**
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - Incremental Static Regeneration (ISR)
  - Image optimization automática
- **Code Splitting** automático
- **Tree Shaking** para bundle otimizado
- **TanStack Query** para cache inteligente
- **Lazy Loading** de componentes e recursos

## 📱 Responsividade e UX

### Design Responsivo
- **Mobile-First** approach
- **Breakpoints otimizados** para todos dispositivos
- **Touch-friendly** interfaces
- **Progressive Web App (PWA)** capabilities

### Experiência do Usuário
- **Loading States** inteligentes
- **Error Boundaries** para robustez
- **Optimistic Updates** para responsividade
- **Accessibility (a11y)** compliance
- **Dark/Light Mode** (se implementado)

## 🔧 Configuração e Deploy

### Pré-requisitos Backend
```bash
# .NET 8 SDK
dotnet --version  # Deve ser >= 8.0

# SQL Server ou SQL Server Express
# Azure SQL Database (produção)

# Visual Studio 2022 ou VS Code (recomendado)
```

### Pré-requisitos Frontend
```bash
# Node.js 18+
node --version    # Deve ser >= 18.0

# Package manager
npm --version     # ou yarn/pnpm
```

### Configuração Backend
```bash
# Clone e navegue para o backend
cd backend

# Restaure as dependências
dotnet restore

# Configure o banco de dados
dotnet ef database update

# Execute em desenvolvimento
dotnet run --environment Development
```

**appsettings.json** (Backend):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ERPMasterDB;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "sua-chave-secreta-super-segura-aqui",
    "Issuer": "ERPMasterAPI",
    "Audience": "ERPMasterClient",
    "ExpirationMinutes": 60
  },
  "Azure": {
    "StorageConnectionString": "sua-connection-string-azure"
  }
}
```

### Configuração Frontend
```bash
# Navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

**.env.local** (Frontend):
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://localhost:7001/api
NEXTAUTH_SECRET=seu-nextauth-secret-aqui
NEXTAUTH_URL=http://localhost:3000

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=sua-connection-string
```

## 📊 Monitoramento e Observabilidade

### Logging e Monitoring
- **Serilog** para logging estruturado
- **Application Insights** (Azure)
- **Health Checks** endpoints
- **Performance Counters** monitoring
- **Exception Tracking** automático

### Métricas de Negócio
- **Dashboard Analytics** em tempo real
- **Business Intelligence** reports
- **User Activity** tracking
- **System Performance** metrics

## 🏗️ CI/CD e DevOps

### Pipeline de Deploy
- **Azure DevOps** ou **GitHub Actions**
- **Automated Testing** (Unit + Integration)
- **Code Quality** gates
- **Security Scanning** automático
- **Blue-Green Deployment** strategy

### Ambientes
- **Development** - Desenvolvimento local
- **Staging** - Testes e homologação  
- **Production** - Ambiente produtivo



### Direitos Autorais
**Todos os direitos reservados.** Este sistema ERP foi desenvolvido sob medida para atender requisitos empresariais específicos e não possui licença para uso público ou comercial.

---

<div align="center">
  <p><strong>Sistema ERP Proprietário</strong> • Arquitetura .NET 8 + Next.js 14</p>
  <p>🏭 <strong>ERP Master Supply Manager</strong> - Solução empresarial de alta performance</p>
  <p><em>Desenvolvido com ASP.NET Core, Entity Framework e React/TypeScript</em></p>
</div>