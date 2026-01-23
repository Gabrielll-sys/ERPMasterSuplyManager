# 🔄 Guia: Atualizar Banco Azure MySQL com Nova Migration

## ✅ Migration: AddUsuariosDesignados

Adiciona coluna `UsuariosDesignados` à tabela `SolicitacoesServico`.

---

## 📋 Método 1: Script SQL (Recomendado)

### Passo 1: Gerar Script SQL
```bash
cd BackEnd
dotnet ef migrations script --project MasterErp.Infraestructure --startup-project MasterErp.Api --idempotent --output migration_azure.sql
```

### Passo 2: Aplicar no Azure via MySQL Workbench

1. **Abrir MySQL Workbench**
2. **Conectar ao Azure MySQL**
   - Host: `seu-servidor.mysql.database.azure.com`
   - Port: `3306`
   - Username: `seu-usuario@seu-servidor`
   - Password: sua senha
   - Enable SSL

3. **Executar Script**
   - Abrir arquivo `migration_azure.sql`
   - Executar (⚡ Execute)
   - Verificarerros

### Passo 3: Verificar
```sql
DESCRIBE SolicitacoesServico;
-- Deve mostrar coluna UsuariosDesignados
```

---

## 📋 Método 2: Azure Portal (Web)

### Via Query Editor

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Navegue até seu **Azure Database for MySQL**
3. Clique em **Query editor** (preview)
4. Faça login
5. Cole o script SQL gerado
6. Execute

---

## 📋 Método 3: Linha de Comando (Azure Cloud Shell)

### Via Azure CLI + MySQL Client

```bash
# Conectar ao Azure
az login

# Executar script
mysql -h seu-servidor.mysql.database.azure.com -u seu-usuario -p database_name < migration_azure.sql
```

---

## 📋 Método 4: .NET EF Core Direto

### ⚠️ Cuidado: Requer conexão direta

```bash
# Editar appsettings.Production.json com connection string do Azure
dotnet ef database update --project MasterErp.Infraestructure --startup-project MasterErp.Api --context ApplicationDbContext
```

**Connection String Azure:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=seu-servidor.mysql.database.azure.com;Port=3306;Database=nome_db;Uid=usuario@servidor;Pwd=senha;SslMode=Required;"
  }
}
```

---

## 🔒 Boas Práticas

### Antes de Aplicar
- ✅ **Backup**: Faça backup do banco antes
- ✅ **Teste**: Teste o script em ambiente de staging primeiro
- ✅ **Horário**: Aplique fora do horário de pico
- ✅ **Rollback**: Tenha plano de rollback

### Backup via Azure Portal
1. Azure Portal → Seu MySQL Server
2. **Backup and restore**
3. **Restore** ponto de recuperação

### Rollback (se necessário)
```sql
ALTER TABLE `SolicitacoesServico` DROP COLUMN `UsuariosDesignados`;
DELETE FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260122233402_AddUsuariosDesignados';
```

---

## 📝 Script SQL da Migration

```sql
ALTER TABLE `SolicitacoesServico` 
ADD COLUMN `UsuariosDesignados` longtext NULL;
```

---

## ✅ Verificação Pós-Aplicação

### Verificar Coluna
```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'SolicitacoesServico' 
  AND COLUMN_NAME = 'UsuariosDesignados';
```

### Verificar Migration History
```sql
SELECT * FROM `__EFMigrationsHistory` 
WHERE MigrationId LIKE '%AddUsuarios%';
```

---

## 🆘 Troubleshooting

### Erro: "SSL connection required"
**Solução:** Adicionar `SslMode=Required` na connection string

### Erro: "Access denied"
**Solução:** Verificar:
- IP liberado no Firewall do Azure
- Usuário tem permissões ALTER TABLE
- Formato correto: `usuario@servidor`

### Erro: "Table doesn't exist"
**Solução:** Verificar nome correto do banco de dados

---

## 🎯 Recomendação Final

Para produção, recomendo **Método 1 (Script SQL)**:
- ✅ Mais controle
- ✅ Pode revisar antes
- ✅ Mais seguro
- ✅ Pode versionar o script

**Evite** executar `dotnet ef database update` direto em produção sem testar!
