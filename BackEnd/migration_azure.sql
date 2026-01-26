CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    ALTER DATABASE CHARACTER SET utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `LogAcoesUsuarios` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Acao` longtext CHARACTER SET utf8mb4 NULL,
        `DataAcao` datetime(6) NULL,
        `Responsavel` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_LogAcoesUsuarios` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Materiais` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `CodigoInterno` longtext CHARACTER SET utf8mb4 NULL,
        `CodigoFabricante` longtext CHARACTER SET utf8mb4 NULL,
        `Categoria` longtext CHARACTER SET utf8mb4 NULL,
        `Descricao` longtext CHARACTER SET utf8mb4 NULL,
        `Marca` longtext CHARACTER SET utf8mb4 NULL,
        `Corrente` longtext CHARACTER SET utf8mb4 NULL,
        `Unidade` longtext CHARACTER SET utf8mb4 NULL,
        `Tensao` longtext CHARACTER SET utf8mb4 NULL,
        `Localizacao` longtext CHARACTER SET utf8mb4 NULL,
        `DataEntradaNF` datetime(6) NULL,
        `PrecoCusto` float NULL,
        `Markup` float NULL,
        `PrecoVenda` float NULL,
        `UrlImage` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Materiais` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Orcamentos` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ResponsavelOrcamento` longtext CHARACTER SET utf8mb4 NULL,
        `ResponsavelVenda` longtext CHARACTER SET utf8mb4 NULL,
        `DataOrcamento` datetime(6) NULL,
        `NomeOrcamento` longtext CHARACTER SET utf8mb4 NULL,
        `Observacoes` longtext CHARACTER SET utf8mb4 NULL,
        `Desconto` decimal(65,30) NULL,
        `Acrescimo` decimal(65,30) NULL,
        `PrecoVendaTotal` decimal(65,30) NULL,
        `PrecoVendaComDesconto` decimal(65,30) NULL,
        `DataVenda` datetime(6) NULL,
        `IsPayed` tinyint(1) NULL,
        `NomeCliente` longtext CHARACTER SET utf8mb4 NULL,
        `Empresa` longtext CHARACTER SET utf8mb4 NULL,
        `EmailCliente` longtext CHARACTER SET utf8mb4 NULL,
        `Telefone` longtext CHARACTER SET utf8mb4 NULL,
        `Endereco` longtext CHARACTER SET utf8mb4 NULL,
        `CpfOrCnpj` longtext CHARACTER SET utf8mb4 NULL,
        `TipoPagamento` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Orcamentos` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `OrdemSeparacoes` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Descricao` longtext CHARACTER SET utf8mb4 NULL,
        `IsAuthorized` tinyint(1) NOT NULL,
        `Responsavel` longtext CHARACTER SET utf8mb4 NULL,
        `BaixaSolicitada` tinyint(1) NULL,
        `Observacoes` longtext CHARACTER SET utf8mb4 NULL,
        `DataAutorizacao` datetime(6) NULL,
        `DataAbertura` datetime(6) NULL,
        `DataFechamento` datetime(6) NULL,
        `PrecoVendaTotalOs` decimal(65,30) NULL,
        `PrecoCustoTotalOs` decimal(65,30) NULL,
        CONSTRAINT `PK_OrdemSeparacoes` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `RelatorioDiarios` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `ResponsavelAbertura` longtext CHARACTER SET utf8mb4 NULL,
        `ResponsavelFechamento` longtext CHARACTER SET utf8mb4 NULL,
        `Empresa` longtext CHARACTER SET utf8mb4 NULL,
        `Contato` longtext CHARACTER SET utf8mb4 NULL,
        `Cnpj` longtext CHARACTER SET utf8mb4 NULL,
        `Telefone` longtext CHARACTER SET utf8mb4 NULL,
        `Endereco` longtext CHARACTER SET utf8mb4 NULL,
        `HorarioAbertura` datetime(6) NULL,
        `DataRD` datetime(6) NULL,
        `isFinished` tinyint(1) NULL,
        `HorarioFechamento` datetime(6) NULL,
        CONSTRAINT `PK_RelatorioDiarios` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Usuários` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nome` longtext CHARACTER SET utf8mb4 NULL,
        `Email` longtext CHARACTER SET utf8mb4 NULL,
        `Senha` longtext CHARACTER SET utf8mb4 NULL,
        `Cargo` longtext CHARACTER SET utf8mb4 NULL,
        `isActive` tinyint(1) NULL,
        `DataCadastrado` datetime(6) NULL,
        CONSTRAINT `PK_Usuários` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Inventarios` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `DataAlteracao` datetime(6) NOT NULL,
        `MaterialId` int NULL,
        `Razao` longtext CHARACTER SET utf8mb4 NULL,
        `Estoque` float NULL,
        `Movimentacao` float NULL,
        `SaldoFinal` float NULL,
        `Responsavel` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Inventarios` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Inventarios_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Clientes` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Nome` longtext CHARACTER SET utf8mb4 NULL,
        `Email` longtext CHARACTER SET utf8mb4 NULL,
        `Telefone` longtext CHARACTER SET utf8mb4 NULL,
        `Endereço` longtext CHARACTER SET utf8mb4 NULL,
        `CPFOrCNPJ` longtext CHARACTER SET utf8mb4 NULL,
        `OrcamentoId` int NOT NULL,
        `MyProperty` int NOT NULL,
        CONSTRAINT `PK_Clientes` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Clientes_Orcamentos_OrcamentoId` FOREIGN KEY (`OrcamentoId`) REFERENCES `Orcamentos` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `ItensOrcamento` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `QuantidadeMaterial` decimal(65,30) NOT NULL,
        `DataAdicaoItem` datetime(6) NOT NULL,
        `PrecoItemOrcamento` decimal(65,30) NULL,
        `MaterialId` int NOT NULL,
        `OrcamentoId` int NOT NULL,
        CONSTRAINT `PK_ItensOrcamento` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_ItensOrcamento_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE,
        CONSTRAINT `FK_ItensOrcamento_Orcamentos_OrcamentoId` FOREIGN KEY (`OrcamentoId`) REFERENCES `Orcamentos` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `Itens` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `MaterialId` int NULL,
        `OrdemSeparacaoId` int NOT NULL,
        `DescricaoNaoCadastrado` longtext CHARACTER SET utf8mb4 NULL,
        `Responsavel` longtext CHARACTER SET utf8mb4 NOT NULL,
        `DataAdicaoItem` datetime(6) NOT NULL,
        `DataAlteracaoItem` datetime(6) NULL,
        `Quantidade` float NULL,
        `Unidade` longtext CHARACTER SET utf8mb4 NULL,
        CONSTRAINT `PK_Itens` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Itens_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`),
        CONSTRAINT `FK_Itens_OrdemSeparacoes_OrdemSeparacaoId` FOREIGN KEY (`OrdemSeparacaoId`) REFERENCES `OrdemSeparacoes` (`Id`) ON DELETE CASCADE
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `AtividadesRd` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `NumeroAtividade` int NULL,
        `Descricao` longtext CHARACTER SET utf8mb4 NULL,
        `Status` longtext CHARACTER SET utf8mb4 NULL,
        `Observacoes` longtext CHARACTER SET utf8mb4 NULL,
        `RelatorioRdId` int NULL,
        `DataAtividade` datetime(6) NULL,
        CONSTRAINT `PK_AtividadesRd` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_AtividadesRd_RelatorioDiarios_RelatorioRdId` FOREIGN KEY (`RelatorioRdId`) REFERENCES `RelatorioDiarios` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `TarefaUsuarios` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `NomeTarefa` longtext CHARACTER SET utf8mb4 NULL,
        `Prioridade` longtext CHARACTER SET utf8mb4 NULL,
        `isFinished` tinyint(1) NULL,
        `UsuarioId` int NULL,
        `DataTarefa` datetime(6) NULL,
        CONSTRAINT `PK_TarefaUsuarios` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_TarefaUsuarios_Usuários_UsuarioId` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuários` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE TABLE `ImagensAtividadeRd` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `UrlImagem` longtext CHARACTER SET utf8mb4 NULL,
        `Descricao` longtext CHARACTER SET utf8mb4 NULL,
        `DataAdicao` datetime(6) NULL,
        `AtividadeRdId` int NULL,
        CONSTRAINT `PK_ImagensAtividadeRd` PRIMARY KEY (`Id`),
        CONSTRAINT `FK_ImagensAtividadeRd_AtividadesRd_AtividadeRdId` FOREIGN KEY (`AtividadeRdId`) REFERENCES `AtividadesRd` (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_AtividadesRd_RelatorioRdId` ON `AtividadesRd` (`RelatorioRdId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_Clientes_OrcamentoId` ON `Clientes` (`OrcamentoId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_ImagensAtividadeRd_AtividadeRdId` ON `ImagensAtividadeRd` (`AtividadeRdId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_Inventarios_MaterialId` ON `Inventarios` (`MaterialId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_Itens_MaterialId` ON `Itens` (`MaterialId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_Itens_OrdemSeparacaoId` ON `Itens` (`OrdemSeparacaoId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_ItensOrcamento_MaterialId` ON `ItensOrcamento` (`MaterialId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_ItensOrcamento_OrcamentoId` ON `ItensOrcamento` (`OrcamentoId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    CREATE INDEX `IX_TarefaUsuarios_UsuarioId` ON `TarefaUsuarios` (`UsuarioId`);

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629124104_v1') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250629124104_v1', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629125139_v2') THEN

    ALTER TABLE `OrdemSeparacoes` ADD `BaixaSolicitada` tinyint(1) NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629125139_v2') THEN

    ALTER TABLE `Itens` ADD `Unidade` longtext CHARACTER SET utf8mb4 NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250629125139_v2') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20250629125139_v2', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260122104527_AddSolicitacaoServico') THEN

    CREATE TABLE `SolicitacoesServico` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Descricao` longtext CHARACTER SET utf8mb4 NULL,
        `NomeCliente` longtext CHARACTER SET utf8mb4 NULL,
        `DataSolicitacao` datetime(6) NOT NULL,
        `UsuarioAceite` longtext CHARACTER SET utf8mb4 NULL,
        `DataAceite` datetime(6) NULL,
        `DataConclusao` datetime(6) NULL,
        `UsuariosConclusao` longtext CHARACTER SET utf8mb4 NULL,
        `Status` int NOT NULL,
        CONSTRAINT `PK_SolicitacoesServico` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260122104527_AddSolicitacaoServico') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260122104527_AddSolicitacaoServico', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260122233402_AddUsuariosDesignados') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260122233402_AddUsuariosDesignados', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260123115349_AddUsuariosDesignadosColumn') THEN

    ALTER TABLE `SolicitacoesServico` ADD `UsuariosDesignados` longtext CHARACTER SET utf8mb4 NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260123115349_AddUsuariosDesignadosColumn') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260123115349_AddUsuariosDesignadosColumn', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260123181153_AddApr') THEN

    CREATE TABLE `Aprs` (
        `Id` int NOT NULL AUTO_INCREMENT,
        `Titulo` longtext CHARACTER SET utf8mb4 NULL,
        `Data` datetime(6) NOT NULL,
        `ConteudoJson` longtext CHARACTER SET utf8mb4 NOT NULL,
        `CriadoEm` datetime(6) NOT NULL,
        `AtualizadoEm` datetime(6) NULL,
        CONSTRAINT `PK_Aprs` PRIMARY KEY (`Id`)
    ) CHARACTER SET=utf8mb4;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260123181153_AddApr') THEN

    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260123181153_AddApr', '8.0.5');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

