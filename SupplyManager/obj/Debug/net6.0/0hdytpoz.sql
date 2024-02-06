CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Materiais` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Descricao` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Corrente` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Unidade` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Tensao` longtext CHARACTER SET utf8mb4 NOT NULL,
    `DataEntradaNF` datetime(6) NOT NULL,
    CONSTRAINT `PK_Materiais` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230803235036_v1', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` ADD `Marca` longtext CHARACTER SET utf8mb4 NOT NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230804104822_v2', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` ADD `Codigo` longtext CHARACTER SET utf8mb4 NOT NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230805171427_v3', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` ADD `TipoProduto` longtext CHARACTER SET utf8mb4 NOT NULL;

CREATE TABLE `Categorias` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MaterialId` int NOT NULL,
    `Nome` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Categorias` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Categorias_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Categorias_MaterialId` ON `Categorias` (`MaterialId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230807121840_v4', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` DROP COLUMN `TipoProduto`;

ALTER TABLE `Categorias` CHANGE `Nome` `NomeCategoria` longtext NOT NULL;

CREATE TABLE `Usuários` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nome` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Email` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Senha` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Usuários` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230808160507_v5', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` MODIFY COLUMN `Unidade` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `Tensao` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `Marca` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `Descricao` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `DataEntradaNF` datetime(6) NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `Corrente` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `Codigo` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230811110946_v6', '7.0.13');

COMMIT;

START TRANSACTION;

CREATE TABLE `Inventarios` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Descricao` longtext CHARACTER SET utf8mb4 NULL,
    `Codigo` longtext CHARACTER SET utf8mb4 NULL,
    `Razao` longtext CHARACTER SET utf8mb4 NULL,
    `Estoque` float NULL,
    `Movimentacao` float NULL,
    `SaldoFinal` float NULL,
    CONSTRAINT `PK_Inventarios` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230819220341_v7', '7.0.13');

COMMIT;

START TRANSACTION;

DROP TABLE `Inventarios`;

ALTER TABLE `Materiais` ADD `DataAlteracao` datetime(6) NULL;

ALTER TABLE `Materiais` ADD `Estoque` float NULL;

ALTER TABLE `Materiais` ADD `Movimentacao` float NULL;

ALTER TABLE `Materiais` ADD `Razao` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` ADD `Responsavel` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Materiais` ADD `SaldoFinal` float NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230824163008_ v8', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` CHANGE `Codigo` `CodigoInterno` longtext NULL;

ALTER TABLE `Materiais` ADD `CodigoFabricante` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230830193848_v9', '7.0.13');

COMMIT;

START TRANSACTION;

DROP TABLE `Categorias`;

ALTER TABLE `Materiais` MODIFY COLUMN `DataEntradaNF` datetime NULL;

ALTER TABLE `Materiais` MODIFY COLUMN `DataAlteracao` datetime NULL;

ALTER TABLE `Materiais` ADD `Categoria` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230912174901_v10', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` DROP COLUMN `DataAlteracao`;

ALTER TABLE `Materiais` DROP COLUMN `Estoque`;

ALTER TABLE `Materiais` DROP COLUMN `Movimentacao`;

ALTER TABLE `Materiais` DROP COLUMN `Razao`;

ALTER TABLE `Materiais` DROP COLUMN `Responsavel`;

ALTER TABLE `Materiais` DROP COLUMN `SaldoFinal`;

CREATE TABLE `Inventarios` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DataAlteracao` datetime NOT NULL,
    `MaterialId` int NOT NULL,
    `Razao` longtext CHARACTER SET utf8mb4 NULL,
    `Estoque` float NULL,
    `Movimentacao` float NULL,
    `SaldoFinal` float NULL,
    `Responsavel` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_Inventarios` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Inventarios_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Inventarios_MaterialId` ON `Inventarios` (`MaterialId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230915182050_v11', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` ADD `Localizacao` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20230926111041_v12', '7.0.13');

COMMIT;

START TRANSACTION;

CREATE TABLE `OrdemServicos` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Descricao` longtext CHARACTER SET utf8mb4 NULL,
    `IsAutorizhed` tinyint(1) NOT NULL,
    `Responsavel` longtext CHARACTER SET utf8mb4 NULL,
    `DataAutorizacao` datetime NULL,
    `MaterialId` int NOT NULL,
    CONSTRAINT `PK_OrdemServicos` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_OrdemServicos_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Item` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MaterialId` int NOT NULL,
    `OrdemServicoId` int NOT NULL,
    CONSTRAINT `PK_Item` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Item_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Item_OrdemServicos_OrdemServicoId` FOREIGN KEY (`OrdemServicoId`) REFERENCES `OrdemServicos` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Item_MaterialId` ON `Item` (`MaterialId`);

CREATE INDEX `IX_Item_OrdemServicoId` ON `Item` (`OrdemServicoId`);

CREATE INDEX `IX_OrdemServicos_MaterialId` ON `OrdemServicos` (`MaterialId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231010102947_v13', '7.0.13');

COMMIT;

START TRANSACTION;

DROP PROCEDURE IF EXISTS `POMELO_BEFORE_DROP_PRIMARY_KEY`;
DELIMITER //
CREATE PROCEDURE `POMELO_BEFORE_DROP_PRIMARY_KEY`(IN `SCHEMA_NAME_ARGUMENT` VARCHAR(255), IN `TABLE_NAME_ARGUMENT` VARCHAR(255))
BEGIN
	DECLARE HAS_AUTO_INCREMENT_ID TINYINT(1);
	DECLARE PRIMARY_KEY_COLUMN_NAME VARCHAR(255);
	DECLARE PRIMARY_KEY_TYPE VARCHAR(255);
	DECLARE SQL_EXP VARCHAR(1000);
	SELECT COUNT(*)
		INTO HAS_AUTO_INCREMENT_ID
		FROM `information_schema`.`COLUMNS`
		WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
			AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
			AND `Extra` = 'auto_increment'
			AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
	IF HAS_AUTO_INCREMENT_ID THEN
		SELECT `COLUMN_TYPE`
			INTO PRIMARY_KEY_TYPE
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
		SELECT `COLUMN_NAME`
			INTO PRIMARY_KEY_COLUMN_NAME
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
		SET SQL_EXP = CONCAT('ALTER TABLE `', (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA())), '`.`', TABLE_NAME_ARGUMENT, '` MODIFY COLUMN `', PRIMARY_KEY_COLUMN_NAME, '` ', PRIMARY_KEY_TYPE, ' NOT NULL;');
		SET @SQL_EXP = SQL_EXP;
		PREPARE SQL_EXP_EXECUTE FROM @SQL_EXP;
		EXECUTE SQL_EXP_EXECUTE;
		DEALLOCATE PREPARE SQL_EXP_EXECUTE;
	END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `POMELO_AFTER_ADD_PRIMARY_KEY`;
DELIMITER //
CREATE PROCEDURE `POMELO_AFTER_ADD_PRIMARY_KEY`(IN `SCHEMA_NAME_ARGUMENT` VARCHAR(255), IN `TABLE_NAME_ARGUMENT` VARCHAR(255), IN `COLUMN_NAME_ARGUMENT` VARCHAR(255))
BEGIN
	DECLARE HAS_AUTO_INCREMENT_ID INT(11);
	DECLARE PRIMARY_KEY_COLUMN_NAME VARCHAR(255);
	DECLARE PRIMARY_KEY_TYPE VARCHAR(255);
	DECLARE SQL_EXP VARCHAR(1000);
	SELECT COUNT(*)
		INTO HAS_AUTO_INCREMENT_ID
		FROM `information_schema`.`COLUMNS`
		WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
			AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
			AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
			AND `COLUMN_TYPE` LIKE '%int%'
			AND `COLUMN_KEY` = 'PRI';
	IF HAS_AUTO_INCREMENT_ID THEN
		SELECT `COLUMN_TYPE`
			INTO PRIMARY_KEY_TYPE
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
				AND `COLUMN_TYPE` LIKE '%int%'
				AND `COLUMN_KEY` = 'PRI';
		SELECT `COLUMN_NAME`
			INTO PRIMARY_KEY_COLUMN_NAME
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
				AND `COLUMN_TYPE` LIKE '%int%'
				AND `COLUMN_KEY` = 'PRI';
		SET SQL_EXP = CONCAT('ALTER TABLE `', (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA())), '`.`', TABLE_NAME_ARGUMENT, '` MODIFY COLUMN `', PRIMARY_KEY_COLUMN_NAME, '` ', PRIMARY_KEY_TYPE, ' NOT NULL AUTO_INCREMENT;');
		SET @SQL_EXP = SQL_EXP;
		PREPARE SQL_EXP_EXECUTE FROM @SQL_EXP;
		EXECUTE SQL_EXP_EXECUTE;
		DEALLOCATE PREPARE SQL_EXP_EXECUTE;
	END IF;
END //
DELIMITER ;

ALTER TABLE `Item` DROP FOREIGN KEY `FK_Item_Materiais_MaterialId`;

ALTER TABLE `Item` DROP FOREIGN KEY `FK_Item_OrdemServicos_OrdemServicoId`;

ALTER TABLE `OrdemServicos` DROP FOREIGN KEY `FK_OrdemServicos_Materiais_MaterialId`;

ALTER TABLE `OrdemServicos` DROP INDEX `IX_OrdemServicos_MaterialId`;

CALL POMELO_BEFORE_DROP_PRIMARY_KEY(NULL, 'Item');
ALTER TABLE `Item` DROP PRIMARY KEY;

ALTER TABLE `OrdemServicos` DROP COLUMN `MaterialId`;

ALTER TABLE `Item` RENAME `Itens`;

ALTER TABLE `Itens` DROP INDEX `IX_Item_OrdemServicoId`;

CREATE INDEX `IX_Itens_OrdemServicoId` ON `Itens` (`OrdemServicoId`);

ALTER TABLE `Itens` DROP INDEX `IX_Item_MaterialId`;

CREATE INDEX `IX_Itens_MaterialId` ON `Itens` (`MaterialId`);

ALTER TABLE `Itens` ADD CONSTRAINT `PK_Itens` PRIMARY KEY (`Id`);
CALL POMELO_AFTER_ADD_PRIMARY_KEY(NULL, 'Itens', 'Id');

ALTER TABLE `Itens` ADD CONSTRAINT `FK_Itens_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE;

ALTER TABLE `Itens` ADD CONSTRAINT `FK_Itens_OrdemServicos_OrdemServicoId` FOREIGN KEY (`OrdemServicoId`) REFERENCES `OrdemServicos` (`Id`) ON DELETE CASCADE;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231023184719_v14', '7.0.13');

DROP PROCEDURE `POMELO_BEFORE_DROP_PRIMARY_KEY`;

DROP PROCEDURE `POMELO_AFTER_ADD_PRIMARY_KEY`;

COMMIT;

START TRANSACTION;

ALTER TABLE `OrdemServicos` ADD `NumeroOs` int NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231026161426_v15', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `OrdemServicos` CHANGE `IsAutorizhed` `IsAuthorized` tinyint(1) NOT NULL;

ALTER TABLE `Itens` ADD `Quantidade` float NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231104000653_v-16', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Materiais` ADD `Markup` float NULL;

ALTER TABLE `Materiais` ADD `PrecoCusto` float NULL;

ALTER TABLE `Materiais` ADD `PrecoVenda` float NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231107210655_v17', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `OrdemServicos` DROP COLUMN `NumeroOs`;

ALTER TABLE `OrdemServicos` CHANGE `Responsavel` `ResponsavelExecucao` longtext NULL;

ALTER TABLE `OrdemServicos` ADD `DataAbertura` datetime NULL;

ALTER TABLE `OrdemServicos` ADD `DataFechamento` datetime NULL;

ALTER TABLE `OrdemServicos` ADD `Observacao` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `OrdemServicos` ADD `OsBrastorno` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `OrdemServicos` ADD `PrecoTotalEquipamentosOs` decimal(65,30) NOT NULL DEFAULT 0.0;

ALTER TABLE `OrdemServicos` ADD `ResponsavelAutorizacao` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231130131823_v18', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `OrdemServicos` CHANGE `ResponsavelExecucao` `ResponsavelAbertura` longtext NULL;

ALTER TABLE `OrdemServicos` CHANGE `OsBrastorno` `ResponsaveisExecucao` longtext NULL;

ALTER TABLE `OrdemServicos` CHANGE `Observacao` `Observacoes` longtext NULL;

ALTER TABLE `OrdemServicos` MODIFY COLUMN `PrecoTotalEquipamentosOs` decimal(65,30) NULL;

ALTER TABLE `OrdemServicos` ADD `NumeroOs` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20231229190900_v19', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Itens` ADD `Responsavel` longtext CHARACTER SET utf8mb4 NOT NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240104172716_v20', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `OrdemServicos` CHANGE `PrecoTotalEquipamentosOs` `PrecoVendaTotalOs` decimal(65,30) NULL;

ALTER TABLE `OrdemServicos` ADD `PrecoCustoTotalOs` decimal(65,30) NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240110143111_v21', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Itens` ADD `DataAdicaoItem` datetime NOT NULL DEFAULT '0001-01-01 00:00:00';

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240110184440_v22', '7.0.13');

COMMIT;

START TRANSACTION;

ALTER TABLE `Itens` CHANGE `Responsavel` `ResponsavelAdicao` longtext NOT NULL;

ALTER TABLE `Itens` ADD `DataAlteracaoItem` datetime NULL;

ALTER TABLE `Itens` ADD `ResponsavelMudanca` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240112130542_v23', '7.0.13');

COMMIT;

START TRANSACTION;

CREATE TABLE `Fornecedores` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nome` longtext CHARACTER SET utf8mb4 NULL,
    `Endereco` longtext CHARACTER SET utf8mb4 NULL,
    `Numero` longtext CHARACTER SET utf8mb4 NULL,
    `Bairro` longtext CHARACTER SET utf8mb4 NULL,
    `Cep` longtext CHARACTER SET utf8mb4 NULL,
    `Cidade` longtext CHARACTER SET utf8mb4 NULL,
    `Estado` longtext CHARACTER SET utf8mb4 NULL,
    `Telefone` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_Fornecedores` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `NotasFiscais` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `NumeroNF` longtext CHARACTER SET utf8mb4 NULL,
    `Frete` decimal(65,30) NULL,
    `BaseCalculoICMS` decimal(65,30) NULL,
    `ValorICMS` decimal(65,30) NULL,
    `CFOP` longtext CHARACTER SET utf8mb4 NULL,
    `DataEmissaoNF` datetime NULL,
    CONSTRAINT `PK_NotasFiscais` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `ItensNotaFiscal` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ValorUnitario` decimal(65,30) NULL,
    `AliquotaICMS` decimal(65,30) NULL,
    `AliquotaIPI` decimal(65,30) NULL,
    `Quantidade` decimal(65,30) NULL,
    `MaterialId` int NOT NULL,
    `NotaFiscalId` int NOT NULL,
    CONSTRAINT `PK_ItensNotaFiscal` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ItensNotaFiscal_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `Materiais` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_ItensNotaFiscal_NotasFiscais_NotaFiscalId` FOREIGN KEY (`NotaFiscalId`) REFERENCES `NotasFiscais` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_ItensNotaFiscal_MaterialId` ON `ItensNotaFiscal` (`MaterialId`);

CREATE INDEX `IX_ItensNotaFiscal_NotaFiscalId` ON `ItensNotaFiscal` (`NotaFiscalId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240124124538_v24', '7.0.13');

COMMIT;

