-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: mastererp
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `itens`
--

DROP TABLE IF EXISTS `itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `MaterialId` int NOT NULL,
  `OrdemServicoId` int NOT NULL,
  `Quantidade` float DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Itens_OrdemServicoId` (`OrdemServicoId`),
  KEY `IX_Itens_MaterialId` (`MaterialId`),
  CONSTRAINT `FK_Itens_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `materiais` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Itens_OrdemServicos_OrdemServicoId` FOREIGN KEY (`OrdemServicoId`) REFERENCES `ordemservicos` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens`
--

LOCK TABLES `itens` WRITE;
/*!40000 ALTER TABLE `itens` DISABLE KEYS */;
INSERT INTO `itens` VALUES (28,88,2,2),(31,61,3,1),(33,99,3,2),(34,180,3,1),(36,135,3,4),(37,273,3,3),(38,236,3,2),(39,480,3,6),(40,481,3,1),(41,12,3,6),(42,132,4,1),(43,74,4,1),(44,15,4,1),(45,134,4,1),(46,10,4,6),(47,11,4,2),(48,136,4,1),(49,120,4,2),(50,186,4,1),(51,99,4,1),(52,177,4,1),(53,150,4,1),(54,16,4,1),(55,236,4,1),(56,14,4,1),(57,177,5,1),(58,99,5,1),(59,186,5,1),(60,74,5,1),(61,14,5,1),(62,134,5,1),(63,132,5,1),(64,120,5,2),(65,15,5,1),(66,16,5,1),(67,10,5,10),(68,11,5,2),(69,135,5,2),(70,255,5,1),(71,133,5,1),(72,97,5,1),(73,97,4,1),(74,133,4,1);
/*!40000 ALTER TABLE `itens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-14 16:59:01
