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
-- Table structure for table `inventarios`
--

DROP TABLE IF EXISTS `inventarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventarios` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `DataAlteracao` datetime NOT NULL,
  `MaterialId` int NOT NULL,
  `Razao` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Estoque` float DEFAULT NULL,
  `Movimentacao` float DEFAULT NULL,
  `SaldoFinal` float DEFAULT NULL,
  `Responsavel` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_Inventarios_MaterialId` (`MaterialId`),
  CONSTRAINT `FK_Inventarios_Materiais_MaterialId` FOREIGN KEY (`MaterialId`) REFERENCES `materiais` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=386 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventarios`
--

LOCK TABLES `inventarios` WRITE;
/*!40000 ALTER TABLE `inventarios` DISABLE KEYS */;
INSERT INTO `inventarios` VALUES (1,'2023-09-15 16:40:21',1,NULL,0,NULL,NULL,NULL),(2,'2023-09-15 16:40:21',2,NULL,0,NULL,NULL,NULL),(3,'2023-09-15 16:40:21',3,NULL,0,NULL,NULL,NULL),(4,'2023-09-15 16:40:21',4,NULL,0,NULL,NULL,NULL),(5,'2023-09-15 16:40:21',5,NULL,0,NULL,NULL,NULL),(6,'2023-09-15 16:40:21',6,NULL,0,NULL,NULL,NULL),(7,'2023-09-15 16:40:21',7,NULL,0,NULL,NULL,NULL),(8,'2023-09-15 16:40:21',8,NULL,0,NULL,NULL,NULL),(9,'2023-09-15 16:40:21',9,NULL,0,NULL,NULL,NULL),(10,'2023-09-15 16:40:21',10,NULL,0,NULL,NULL,NULL),(11,'2023-09-15 16:40:21',11,NULL,0,NULL,NULL,NULL),(12,'2023-09-15 16:40:21',12,NULL,0,NULL,NULL,NULL),(13,'2023-09-15 16:40:21',13,NULL,0,NULL,NULL,NULL),(14,'2023-09-15 16:40:21',14,NULL,0,NULL,NULL,NULL),(15,'2023-09-15 16:40:21',15,NULL,0,NULL,NULL,NULL),(16,'2023-09-15 16:40:21',16,NULL,0,NULL,NULL,NULL),(17,'2023-09-15 16:40:21',17,NULL,0,NULL,NULL,NULL),(18,'2023-09-15 16:40:21',18,NULL,0,NULL,NULL,NULL),(19,'2023-09-15 16:40:21',19,NULL,0,NULL,NULL,NULL),(20,'2023-09-15 16:40:21',20,NULL,0,NULL,NULL,NULL),(21,'2023-09-15 16:40:21',21,NULL,0,NULL,NULL,NULL),(22,'2023-09-15 16:40:21',22,NULL,0,NULL,NULL,NULL),(23,'2023-09-15 16:40:21',23,NULL,0,NULL,NULL,NULL),(24,'2023-09-15 16:40:21',24,NULL,0,NULL,NULL,NULL),(25,'2023-09-15 16:40:21',25,NULL,0,NULL,NULL,NULL),(26,'2023-09-15 16:40:21',26,NULL,0,NULL,NULL,NULL),(27,'2023-09-15 16:40:21',27,NULL,0,NULL,NULL,NULL),(28,'2023-09-15 16:40:21',28,NULL,0,NULL,NULL,NULL),(29,'2023-09-15 16:40:21',29,NULL,0,NULL,NULL,NULL),(30,'2023-09-15 16:40:21',30,NULL,0,NULL,NULL,NULL),(31,'2023-09-15 16:40:21',31,NULL,0,NULL,NULL,NULL),(32,'2023-09-15 16:40:21',32,NULL,0,NULL,NULL,NULL),(33,'2023-09-15 16:40:21',33,NULL,0,NULL,NULL,NULL),(34,'2023-09-15 16:40:21',34,NULL,0,NULL,NULL,NULL),(35,'2023-09-15 16:40:21',35,NULL,0,NULL,NULL,NULL),(36,'2023-09-15 16:40:21',36,NULL,0,NULL,NULL,NULL),(37,'2023-09-15 16:40:21',37,NULL,0,NULL,NULL,NULL),(38,'2023-09-15 16:40:21',38,NULL,0,NULL,NULL,NULL),(39,'2023-09-15 16:40:21',39,NULL,0,NULL,NULL,NULL),(40,'2023-09-15 16:40:21',40,NULL,0,NULL,NULL,NULL),(41,'2023-09-15 16:40:21',41,NULL,0,NULL,NULL,NULL),(42,'2023-09-15 16:40:21',42,NULL,0,NULL,NULL,NULL),(43,'2023-09-15 16:40:21',43,NULL,0,NULL,NULL,NULL),(44,'2023-09-15 16:40:21',44,NULL,0,NULL,NULL,NULL),(45,'2023-09-15 16:40:21',45,NULL,0,NULL,NULL,NULL),(46,'2023-09-15 16:40:21',46,NULL,0,NULL,NULL,NULL),(47,'2023-09-15 16:40:21',47,NULL,0,NULL,NULL,NULL),(48,'2023-09-15 16:40:21',48,NULL,0,NULL,NULL,NULL),(49,'2023-09-15 16:40:21',49,NULL,0,NULL,NULL,NULL),(50,'2023-09-15 16:40:21',50,NULL,0,NULL,NULL,NULL),(51,'2023-09-15 16:40:21',51,NULL,0,NULL,NULL,NULL),(52,'2023-09-15 16:40:21',52,NULL,0,NULL,NULL,NULL),(53,'2023-09-15 16:40:21',53,NULL,0,NULL,NULL,NULL),(54,'2023-09-15 16:40:21',54,NULL,0,NULL,NULL,NULL),(55,'2023-09-15 16:40:21',55,NULL,0,NULL,NULL,NULL),(56,'2023-09-15 16:40:21',56,NULL,0,NULL,NULL,NULL),(57,'2023-09-15 16:40:21',57,NULL,0,NULL,NULL,NULL),(58,'2023-09-15 16:40:21',58,NULL,0,NULL,NULL,NULL),(59,'2023-09-15 16:40:21',59,NULL,0,NULL,NULL,NULL),(60,'2023-09-15 16:40:21',60,NULL,0,NULL,NULL,NULL),(61,'2023-09-15 16:40:21',61,NULL,0,NULL,NULL,NULL),(62,'2023-09-15 16:40:21',62,NULL,0,NULL,NULL,NULL),(63,'2023-09-15 16:40:21',63,NULL,0,NULL,NULL,NULL),(64,'2023-09-15 16:40:21',64,NULL,0,NULL,NULL,NULL),(65,'2023-09-15 16:40:21',65,NULL,0,NULL,NULL,NULL),(66,'2023-09-15 16:40:21',66,NULL,0,NULL,NULL,NULL),(67,'2023-09-15 16:40:21',67,NULL,0,NULL,NULL,NULL),(68,'2023-09-15 16:40:21',68,NULL,0,NULL,NULL,NULL),(69,'2023-09-15 16:40:21',69,NULL,0,NULL,NULL,NULL),(70,'2023-09-15 16:40:21',70,NULL,0,NULL,NULL,NULL),(71,'2023-09-15 16:40:21',71,NULL,0,NULL,NULL,NULL),(72,'2023-09-15 16:40:21',72,NULL,0,NULL,NULL,NULL),(73,'2023-09-15 16:40:21',73,NULL,0,NULL,NULL,NULL),(74,'2023-09-15 16:40:21',74,NULL,0,NULL,NULL,NULL),(75,'2023-09-15 16:40:21',75,NULL,0,NULL,NULL,NULL),(76,'2023-09-15 16:40:21',76,NULL,0,NULL,NULL,NULL),(77,'2023-09-15 16:40:21',77,NULL,0,NULL,NULL,NULL),(78,'2023-09-15 16:40:21',78,NULL,0,NULL,NULL,NULL),(79,'2023-09-15 16:40:21',79,NULL,0,NULL,NULL,NULL),(80,'2023-09-15 16:40:21',80,NULL,0,NULL,NULL,NULL),(81,'2023-09-15 16:40:21',81,NULL,0,NULL,NULL,NULL),(82,'2023-09-15 16:40:21',82,NULL,0,NULL,NULL,NULL),(83,'2023-09-15 16:40:21',83,NULL,0,NULL,NULL,NULL),(84,'2023-09-15 16:40:21',84,NULL,0,NULL,NULL,NULL),(85,'2023-09-15 16:40:21',85,NULL,0,NULL,NULL,NULL),(86,'2023-09-15 16:40:21',86,NULL,0,NULL,NULL,NULL),(87,'2023-09-15 16:40:21',87,NULL,0,NULL,NULL,NULL),(88,'2023-09-15 16:40:21',88,NULL,0,NULL,NULL,NULL),(89,'2023-09-15 16:40:21',89,NULL,0,NULL,NULL,NULL),(90,'2023-09-15 16:40:21',90,NULL,0,NULL,NULL,NULL),(91,'2023-09-15 16:40:21',91,NULL,0,NULL,NULL,NULL),(92,'2023-09-15 16:40:21',92,NULL,0,NULL,NULL,NULL),(93,'2023-09-15 16:40:21',93,NULL,0,NULL,NULL,NULL),(94,'2023-09-15 16:40:21',94,NULL,0,NULL,NULL,NULL),(95,'2023-09-15 16:40:21',95,NULL,0,NULL,NULL,NULL),(96,'2023-09-15 16:40:21',96,NULL,0,NULL,NULL,NULL),(97,'2023-09-15 16:40:21',97,NULL,0,NULL,NULL,NULL),(98,'2023-09-15 16:40:21',98,NULL,0,NULL,NULL,NULL),(99,'2023-09-15 16:40:21',99,NULL,0,NULL,NULL,NULL),(100,'2023-09-15 16:40:21',100,NULL,0,NULL,NULL,NULL),(101,'2023-09-15 16:40:21',101,NULL,0,NULL,NULL,NULL),(102,'2023-09-15 16:40:21',102,NULL,0,NULL,NULL,NULL),(103,'2023-09-15 16:40:21',103,NULL,0,NULL,NULL,NULL),(104,'2023-09-15 16:40:21',104,NULL,0,NULL,NULL,NULL),(105,'2023-09-15 16:40:21',105,NULL,0,NULL,NULL,NULL),(106,'2023-09-15 16:40:21',106,NULL,0,NULL,NULL,NULL),(107,'2023-09-15 16:40:21',107,NULL,0,NULL,NULL,NULL),(108,'2023-09-15 16:40:21',108,NULL,0,NULL,NULL,NULL),(109,'2023-09-15 16:40:21',109,NULL,0,NULL,NULL,NULL),(110,'2023-09-15 16:40:21',110,NULL,0,NULL,NULL,NULL),(111,'2023-09-15 16:40:21',111,NULL,0,NULL,NULL,NULL),(112,'2023-09-15 16:40:21',112,NULL,0,NULL,NULL,NULL),(113,'2023-09-15 16:40:21',113,NULL,0,NULL,NULL,NULL),(114,'2023-09-15 16:40:21',114,NULL,0,NULL,NULL,NULL),(115,'2023-09-15 16:40:21',115,NULL,0,NULL,NULL,NULL),(116,'2023-09-15 16:40:21',116,NULL,0,NULL,NULL,NULL),(117,'2023-09-15 16:40:21',117,NULL,0,NULL,NULL,NULL),(118,'2023-09-15 16:40:21',118,NULL,0,NULL,NULL,NULL),(119,'2023-09-15 16:40:21',119,NULL,0,NULL,NULL,NULL),(120,'2023-09-15 16:40:21',120,NULL,0,NULL,NULL,NULL),(121,'2023-09-15 16:40:21',121,NULL,0,NULL,NULL,NULL),(122,'2023-09-15 16:40:21',122,NULL,0,NULL,NULL,NULL),(123,'2023-09-15 16:40:21',123,NULL,0,NULL,NULL,NULL),(124,'2023-09-15 16:40:21',124,NULL,0,NULL,NULL,NULL),(125,'2023-09-15 16:40:21',125,NULL,0,NULL,NULL,NULL),(126,'2023-09-15 16:40:21',126,NULL,0,NULL,NULL,NULL),(127,'2023-09-15 16:40:21',127,NULL,0,NULL,NULL,NULL),(128,'2023-09-15 16:40:21',128,NULL,0,NULL,NULL,NULL),(129,'2023-09-15 16:40:21',129,NULL,0,NULL,NULL,NULL),(130,'2023-09-15 16:40:21',130,NULL,0,NULL,NULL,NULL),(131,'2023-09-15 16:40:21',131,NULL,0,NULL,NULL,NULL),(132,'2023-09-15 16:40:21',132,NULL,0,NULL,NULL,NULL),(133,'2023-09-15 16:40:21',133,NULL,0,NULL,NULL,NULL),(134,'2023-09-15 16:40:21',134,NULL,0,NULL,NULL,NULL),(135,'2023-09-15 16:40:21',135,NULL,0,NULL,NULL,NULL),(136,'2023-09-15 16:40:21',136,NULL,0,NULL,NULL,NULL),(137,'2023-09-15 16:40:21',137,NULL,0,NULL,NULL,NULL),(138,'2023-09-15 16:40:21',138,NULL,0,NULL,NULL,NULL),(139,'2023-09-15 16:40:21',139,NULL,0,NULL,NULL,NULL),(140,'2023-09-15 16:40:21',140,NULL,0,NULL,NULL,NULL),(141,'2023-09-15 16:40:21',141,NULL,0,NULL,NULL,NULL),(142,'2023-09-15 16:40:21',142,NULL,0,NULL,NULL,NULL),(143,'2023-09-15 16:40:21',143,NULL,0,NULL,NULL,NULL),(144,'2023-09-15 16:40:21',144,NULL,0,NULL,NULL,NULL),(145,'2023-09-15 16:40:21',145,NULL,0,NULL,NULL,NULL),(146,'2023-09-15 16:40:21',146,NULL,0,NULL,NULL,NULL),(147,'2023-09-15 16:40:21',147,NULL,0,NULL,NULL,NULL),(148,'2023-09-15 16:40:21',148,NULL,0,NULL,NULL,NULL),(149,'2023-09-15 16:40:21',149,NULL,0,NULL,NULL,NULL),(150,'2023-09-15 16:40:21',150,NULL,0,NULL,NULL,NULL),(151,'2023-09-15 16:40:21',151,NULL,0,NULL,NULL,NULL),(152,'2023-09-15 16:40:21',152,NULL,0,NULL,NULL,NULL),(153,'2023-09-15 16:40:21',153,NULL,0,NULL,NULL,NULL),(154,'2023-09-15 16:40:21',154,NULL,0,NULL,NULL,NULL),(155,'2023-09-15 16:40:21',155,NULL,0,NULL,NULL,NULL),(156,'2023-09-15 16:40:21',156,NULL,0,NULL,NULL,NULL),(157,'2023-09-15 16:40:21',157,NULL,0,NULL,NULL,NULL),(158,'2023-09-15 16:40:21',158,NULL,0,NULL,NULL,NULL),(159,'2023-09-15 16:40:21',159,NULL,0,NULL,NULL,NULL),(160,'2023-09-15 16:40:21',160,NULL,0,NULL,NULL,NULL),(161,'2023-09-15 16:40:21',161,NULL,0,NULL,NULL,NULL),(162,'2023-09-15 16:40:21',162,NULL,0,NULL,NULL,NULL),(163,'2023-09-15 16:40:21',163,NULL,0,NULL,NULL,NULL),(164,'2023-09-15 16:40:21',164,NULL,0,NULL,NULL,NULL),(165,'2023-09-15 16:40:21',165,NULL,0,NULL,NULL,NULL),(166,'2023-09-15 16:40:22',166,NULL,0,NULL,NULL,NULL),(167,'2023-09-15 16:40:22',167,NULL,0,NULL,NULL,NULL),(168,'2023-09-15 16:40:22',168,NULL,0,NULL,NULL,NULL),(169,'2023-09-15 16:40:22',169,NULL,0,NULL,NULL,NULL),(170,'2023-09-15 16:40:22',170,NULL,0,NULL,NULL,NULL),(171,'2023-09-15 16:40:22',171,NULL,0,NULL,NULL,NULL),(172,'2023-09-15 16:40:22',172,NULL,0,NULL,NULL,NULL),(173,'2023-09-15 16:40:22',173,NULL,0,NULL,NULL,NULL),(174,'2023-09-15 16:40:22',174,NULL,0,NULL,NULL,NULL),(175,'2023-09-15 16:40:22',175,NULL,0,NULL,NULL,NULL),(176,'2023-09-15 16:40:22',176,NULL,0,NULL,NULL,NULL),(177,'2023-09-15 16:40:22',177,NULL,0,NULL,NULL,NULL),(178,'2023-09-15 16:40:22',178,NULL,0,NULL,NULL,NULL),(179,'2023-09-15 16:40:22',179,NULL,0,NULL,NULL,NULL),(180,'2023-09-15 16:40:22',180,NULL,0,NULL,NULL,NULL),(181,'2023-09-15 16:40:22',181,NULL,0,NULL,NULL,NULL),(182,'2023-09-15 16:40:22',182,NULL,0,NULL,NULL,NULL),(183,'2023-09-15 16:40:22',183,NULL,0,NULL,NULL,NULL),(184,'2023-09-15 16:40:22',184,NULL,0,NULL,NULL,NULL),(185,'2023-09-15 16:40:22',185,NULL,0,NULL,NULL,NULL),(186,'2023-09-15 16:40:22',186,NULL,0,NULL,NULL,NULL),(187,'2023-09-15 16:40:22',187,NULL,0,NULL,NULL,NULL),(188,'2023-09-15 16:40:22',188,NULL,0,NULL,NULL,NULL),(189,'2023-09-15 16:40:22',189,NULL,0,NULL,NULL,NULL),(190,'2023-09-15 16:40:22',190,NULL,0,NULL,NULL,NULL),(191,'2023-09-15 16:40:22',191,NULL,0,NULL,NULL,NULL),(192,'2023-09-15 16:40:22',192,NULL,0,NULL,NULL,NULL),(193,'2023-09-15 16:40:22',193,NULL,0,NULL,NULL,NULL),(194,'2023-09-15 16:40:22',194,NULL,0,NULL,NULL,NULL),(195,'2023-09-15 16:40:22',195,NULL,0,NULL,NULL,NULL),(196,'2023-09-15 16:40:22',196,NULL,0,NULL,NULL,NULL),(197,'2023-09-15 16:40:22',197,NULL,0,NULL,NULL,NULL),(198,'2023-09-15 16:40:22',198,NULL,0,NULL,NULL,NULL),(199,'2023-09-15 16:40:22',199,NULL,0,NULL,NULL,NULL),(200,'2023-09-15 16:40:22',200,NULL,0,NULL,NULL,NULL),(201,'2023-09-15 16:40:22',201,NULL,0,NULL,NULL,NULL),(202,'2023-09-15 16:40:22',202,NULL,0,NULL,NULL,NULL),(203,'2023-09-15 16:40:22',203,NULL,0,NULL,NULL,NULL),(204,'2023-09-15 16:40:22',204,NULL,0,NULL,NULL,NULL),(205,'2023-09-15 16:40:22',205,NULL,0,NULL,NULL,NULL),(206,'2023-09-15 16:40:22',206,NULL,0,NULL,NULL,NULL),(207,'2023-09-15 16:40:22',207,NULL,0,NULL,NULL,NULL),(208,'2023-09-15 16:40:22',208,NULL,0,NULL,NULL,NULL),(209,'2023-09-15 16:40:22',209,NULL,0,NULL,NULL,NULL),(210,'2023-09-15 16:40:22',210,NULL,0,NULL,NULL,NULL),(211,'2023-09-15 16:40:22',211,NULL,0,NULL,NULL,NULL),(212,'2023-09-15 16:40:22',212,NULL,0,NULL,NULL,NULL),(213,'2023-09-15 16:40:22',213,NULL,0,NULL,NULL,NULL),(214,'2023-09-15 16:40:22',214,NULL,0,NULL,NULL,NULL),(215,'2023-09-15 16:40:22',215,NULL,0,NULL,NULL,NULL),(216,'2023-09-15 16:40:22',216,NULL,0,NULL,NULL,NULL),(217,'2023-09-15 16:40:22',217,NULL,0,NULL,NULL,NULL),(218,'2023-09-15 16:40:22',218,NULL,0,NULL,NULL,NULL),(219,'2023-09-15 16:40:22',219,NULL,0,NULL,NULL,NULL),(220,'2023-09-15 16:40:22',220,NULL,0,NULL,NULL,NULL),(221,'2023-09-15 16:40:22',221,NULL,0,NULL,NULL,NULL),(222,'2023-09-15 16:40:22',222,NULL,0,NULL,NULL,NULL),(223,'2023-09-15 16:40:22',223,NULL,0,NULL,NULL,NULL),(224,'2023-09-15 16:40:22',224,NULL,0,NULL,NULL,NULL),(225,'2023-09-15 16:40:22',225,NULL,0,NULL,NULL,NULL),(226,'2023-09-15 16:40:22',226,NULL,0,NULL,NULL,NULL),(227,'2023-09-15 16:40:22',227,NULL,0,NULL,NULL,NULL),(228,'2023-09-15 16:40:22',228,NULL,0,NULL,NULL,NULL),(229,'2023-09-15 16:40:22',229,NULL,0,NULL,NULL,NULL),(230,'2023-09-15 16:40:22',230,NULL,0,NULL,NULL,NULL),(231,'2023-09-15 16:40:22',231,NULL,0,NULL,NULL,NULL),(232,'2023-09-18 13:08:24',19,'Levantamento estoque',0,1300,1300,NULL),(233,'2023-09-18 13:09:50',20,'Levantamento estoque',0,500,500,NULL),(234,'2023-09-18 13:19:15',21,'Levantamento de estoque',0,100,100,NULL),(235,'2023-09-18 13:21:17',22,'Levantamento de estoque',0,300,300,NULL),(236,'2023-09-18 13:21:38',23,'Levantamento de estoque',0,300,300,NULL),(237,'2023-09-18 13:23:01',24,'OS BRASTORNO',0,6400,6400,NULL),(238,'2023-09-18 13:23:21',25,'OS BRASTORNO',0,900,900,NULL),(239,'2023-09-18 13:29:33',26,'OS BRASTORNO',0,3200,3200,NULL),(240,'2023-09-18 13:31:42',27,'Levantamento de estoque',0,200,200,NULL),(241,'2023-09-18 13:32:16',28,'Levantamento de estoque',0,600,600,NULL),(242,'2023-09-18 13:32:39',29,'Levantamento de estoque',0,200,200,NULL),(243,'2023-09-18 13:34:45',30,'OS BRASTORNO',0,8000,8000,NULL),(244,'2023-09-18 13:43:43',31,'OS BRASTORNO',0,5200,5200,NULL),(245,'2023-09-18 13:45:04',32,'COMPRA CONDUMIG',0,700,700,NULL),(246,'2023-09-18 13:46:35',33,'Levantamento de estoque',0,150,150,NULL),(247,'2023-09-18 13:46:59',34,'Levantamento de estoque',0,395,395,NULL),(248,'2023-09-18 13:49:42',35,'COMPRA CONDUMIG',0,415,415,NULL),(249,'2023-09-18 13:51:48',36,'',0,475,475,NULL),(250,'2023-09-18 13:56:33',41,'OS BRASTORNO',0,6510,6510,NULL),(251,'2023-09-18 13:56:59',42,'OS BRASTORNO',0,5320,5320,NULL),(252,'2023-09-18 13:57:28',43,'Levantamento de estoque',0,500,500,NULL),(253,'2023-09-18 13:59:36',44,'OS BRASTORNO',0,4660,4660,NULL),(254,'2023-09-18 13:59:56',45,'COMPRA CONDUMIG',0,700,700,NULL),(255,'2023-09-18 14:04:50',46,'Levantamento de estoque',0,900,900,NULL),(256,'2023-09-18 14:05:45',48,'Levantamento de estoque',0,1100,1100,NULL),(257,'2023-09-18 14:06:06',49,'Levantamento de estoque',0,500,500,NULL),(258,'2023-09-18 14:07:04',50,'OS BRASTORNO',0,1100,1100,NULL),(259,'2023-09-18 14:07:53',63,'Levantamento de estoque',0,23,23,NULL),(260,'2023-09-18 14:08:38',64,'COMPRA LEGRAND',2,3,5,NULL),(261,'2023-09-18 14:13:21',65,'Levantamento de estoque',0,7,7,NULL),(262,'2023-09-18 14:25:14',83,'Levantamento de estoque',0,2,2,NULL),(263,'2023-09-18 14:27:23',87,'Levantamento de estoque',0,4,4,NULL),(264,'2023-09-18 14:27:37',88,'Levantamento de estoque',0,17,17,NULL),(265,'2023-09-18 14:29:07',99,'COMPRA WEG',9,5,14,NULL),(266,'2023-09-18 14:37:53',100,'COMPRA WEG',22,5,27,NULL),(267,'2023-09-18 14:40:33',101,'Levantamento de estoque',0,4,4,NULL),(268,'2023-09-18 15:49:37',128,'Levantamento de estoque',0,45,45,NULL),(269,'2023-09-18 15:49:56',137,'Levantamento de estoque',0,15,15,NULL),(270,'2023-09-19 11:22:16',34,'Serviço Papier',395,-70,325,NULL),(271,'2023-09-19 11:23:28',36,'Serviço papier',475,-100,375,NULL),(272,'2023-09-19 11:28:40',35,'Serviço papier',415,-70,345,NULL),(273,'2023-09-21 11:46:42',101,'Compra WEG NF3202125 14/09/23',4,4,8,NULL),(274,'2023-09-21 11:50:48',232,NULL,0,NULL,NULL,NULL),(275,'2023-09-21 11:51:38',232,'Compra WEG NF3202125 14/09/23',0,12,12,NULL),(276,'2023-09-21 11:53:13',233,NULL,0,NULL,NULL,NULL),(277,'2023-09-21 11:53:41',233,'Compra WEG NF3202125',0,3,3,NULL),(278,'2023-09-21 12:03:02',233,'Levantamento de estoque',3,1,4,NULL),(279,'2023-09-22 13:36:17',95,'Levantamento de estoque',0,3,3,NULL),(280,'2023-09-22 13:40:09',234,NULL,0,NULL,NULL,NULL),(281,'2023-09-22 13:40:28',234,'Levantamento de estoque',0,1,1,NULL),(282,'2023-09-22 13:42:18',235,NULL,0,NULL,NULL,NULL),(283,'2023-09-22 13:42:41',235,'Levantamento de estoque',0,3,3,NULL),(284,'2023-09-22 13:50:23',236,NULL,0,NULL,NULL,NULL),(285,'2023-09-22 13:50:36',236,'Levantamento de estoque',0,9,9,NULL),(286,'2023-09-22 13:51:51',237,NULL,0,NULL,NULL,NULL),(287,'2023-09-22 13:52:01',237,'Levantamento de estoque',0,2,2,NULL),(288,'2023-09-22 13:54:28',238,NULL,0,NULL,NULL,NULL),(289,'2023-09-22 13:54:49',238,'Levantamento de estoque',0,1,1,NULL),(290,'2023-09-22 13:57:37',239,NULL,0,NULL,NULL,NULL),(291,'2023-09-22 13:58:00',239,'Levantamento de estoque',0,1,1,NULL),(292,'2023-09-22 13:59:39',240,NULL,0,NULL,NULL,NULL),(293,'2023-09-22 14:00:52',240,'Levantamento de estoque',0,1,1,NULL),(294,'2023-09-22 14:01:39',241,NULL,0,NULL,NULL,NULL),(295,'2023-09-22 14:01:53',241,'Levantamento de estoque',0,2,2,NULL),(296,'2023-09-22 14:03:28',242,NULL,0,NULL,NULL,NULL),(297,'2023-09-22 14:03:45',242,'Levantamento de estoque',0,1,1,NULL),(298,'2023-09-22 14:08:47',243,NULL,0,NULL,NULL,NULL),(299,'2023-09-22 14:09:02',243,'Levantamento de estoque',0,1,1,NULL),(300,'2023-09-22 14:11:12',244,NULL,0,NULL,NULL,NULL),(301,'2023-09-22 14:11:22',244,'Levantamento de estoque',0,1,1,NULL),(302,'2023-09-22 14:12:37',245,NULL,0,NULL,NULL,NULL),(303,'2023-09-22 14:12:47',245,'Levantamento de estoque',0,1,1,NULL),(304,'2023-09-22 14:13:26',246,NULL,0,NULL,NULL,NULL),(305,'2023-09-22 14:13:43',246,'Levantamento de estoque',0,1,1,NULL),(306,'2023-09-22 14:27:42',247,NULL,0,NULL,NULL,NULL),(307,'2023-09-22 14:27:53',247,'Levantamento de estoque',0,1,1,NULL),(308,'2023-09-22 15:08:33',248,NULL,0,NULL,NULL,NULL),(309,'2023-09-22 15:08:51',248,'Levantamento de estoque',0,1,1,NULL),(310,'2023-09-22 15:09:27',249,NULL,0,NULL,NULL,NULL),(311,'2023-09-22 15:09:40',249,'Levantamento de estoque',0,1,1,NULL),(312,'2023-09-22 15:14:06',250,NULL,0,NULL,NULL,NULL),(313,'2023-09-22 15:14:19',250,'Levantamento de estoque',0,1,1,NULL),(314,'2023-09-25 08:21:40',251,NULL,0,NULL,NULL,NULL),(315,'2023-09-25 08:49:30',252,NULL,0,NULL,NULL,NULL),(316,'2023-09-25 08:49:46',252,'Levantamento de estoque',0,30,30,NULL),(317,'2023-09-25 08:50:41',134,'Levantamento de estoque',0,127,127,NULL),(318,'2023-09-25 08:51:41',253,NULL,0,NULL,NULL,NULL),(319,'2023-09-25 08:51:58',253,'Levantamento de estoque',0,5,5,NULL),(320,'2023-09-25 08:52:33',133,'Levantamento de estoque',0,140,140,NULL),(321,'2023-09-25 08:53:28',132,'Levantamento de estoque',0,125,125,NULL),(322,'2023-09-25 08:54:13',16,'Levantamento de estoque',0,59,59,NULL),(323,'2023-09-25 09:07:02',149,'Levantamento de estoque',0,44,44,NULL),(324,'2023-09-25 09:08:51',212,'Levantamento de estoque',0,3,3,NULL),(325,'2023-09-25 09:09:48',214,'Levantamento de estoque',0,3,3,NULL),(326,'2023-09-25 09:10:51',183,'Levantamento de estoque',0,1,1,NULL),(327,'2023-09-25 09:13:19',184,'Levantamento de estoque',0,8,8,NULL),(328,'2023-09-25 09:14:24',191,'Levantamento de estoque',0,2,2,NULL),(329,'2023-09-25 09:17:55',193,'Levantamento de estoque',0,1,1,NULL),(330,'2023-09-25 09:19:04',192,'Levantamento de estoque',0,1,1,NULL),(331,'2023-09-25 09:21:00',194,'Levantamento de estoque',0,17,17,NULL),(332,'2023-09-25 09:47:31',195,'Levantamento de estoque',0,7,7,NULL),(333,'2023-09-25 10:16:47',150,'Levantamento de estoque',0,16,16,NULL),(334,'2023-09-25 10:18:19',254,NULL,0,NULL,NULL,NULL),(335,'2023-09-25 10:18:47',254,'Levantamento de estoque',0,2,2,NULL),(336,'2023-09-25 10:20:15',255,NULL,0,NULL,NULL,NULL),(337,'2023-09-25 10:20:32',255,'Levantamento de estoque',0,3,3,NULL),(338,'2023-09-25 10:21:26',256,NULL,0,NULL,NULL,NULL),(339,'2023-09-25 10:21:36',256,'Levantamento de estoque',0,3,3,NULL),(340,'2023-09-25 10:23:05',257,NULL,0,NULL,NULL,NULL),(341,'2023-09-25 10:23:43',257,'Levantamento de estoque',0,5,5,NULL),(342,'2023-09-25 10:24:37',258,NULL,0,NULL,NULL,NULL),(343,'2023-09-25 10:24:52',258,'Levantamento de estoque',0,1,1,NULL),(344,'2023-09-25 10:25:35',259,NULL,0,NULL,NULL,NULL),(345,'2023-09-25 10:25:50',259,'Levantamento de estoque',0,1,1,NULL),(346,'2023-09-25 10:26:26',260,NULL,0,NULL,NULL,NULL),(347,'2023-09-25 10:26:36',260,'Levantamento de estoque',0,1,1,NULL),(348,'2023-09-25 10:38:39',150,'Levantamento de estoque',16,5,21,NULL),(349,'2023-09-26 14:49:59',88,'Levantamento de estoque',17,-10,7,NULL),(350,'2023-09-26 14:51:01',186,'Levantamento de estoque',0,20,20,NULL),(351,'2023-09-26 14:51:33',187,'Levantamento de estoque',0,10,10,NULL),(352,'2023-09-26 14:51:53',188,'Levantamento de estoque',0,7,7,NULL),(353,'2023-09-26 14:55:50',7,'Levantamento de estoque',0,105,105,NULL),(354,'2023-09-26 14:58:32',261,NULL,0,NULL,NULL,NULL),(355,'2023-09-26 14:58:49',261,'Levantamento de estoque',0,92,92,NULL),(356,'2023-09-26 14:59:38',6,'Levantamento de estoque',0,6,6,NULL),(357,'2023-09-26 15:02:24',196,'Levantamento de estoque',0,1,1,NULL),(358,'2023-09-26 15:03:32',197,'Levantamento de estoque',0,1,1,NULL),(359,'2023-09-26 15:04:27',198,'Levantamento de estoque',0,6,6,NULL),(360,'2023-09-26 15:05:37',82,'Levantamento de estoque',0,1,1,NULL),(361,'2023-09-26 15:07:42',199,'Levantamento de estoque',0,19,19,NULL),(362,'2023-09-26 15:09:02',200,'Levantamento de estoque',0,4,4,NULL),(363,'2023-09-26 15:10:53',8,'Levantamento de estoque',0,35,35,NULL),(364,'2023-09-26 15:11:36',262,NULL,0,NULL,NULL,NULL),(365,'2023-09-26 15:11:54',262,'Levantamento de estoque',0,15,15,NULL),(366,'2023-09-26 15:14:02',9,'Levantamento de estoque',0,62,62,NULL),(367,'2023-09-26 15:15:17',263,NULL,0,NULL,NULL,NULL),(368,'2023-09-26 15:15:35',263,'Levantamento de estoque',0,43,43,NULL),(369,'2023-09-26 15:18:48',264,NULL,0,NULL,NULL,NULL),(370,'2023-09-26 15:18:58',265,NULL,0,NULL,NULL,NULL),(371,'2023-09-26 15:19:33',264,'Levantamento de estoque',0,2,2,NULL),(372,'2023-09-26 15:19:43',265,'Levantamento de estoque',0,3,3,NULL),(373,'2023-09-26 15:20:05',265,'Levantamento de estoque',3,64,67,NULL),(374,'2023-09-26 15:21:14',90,'Levantamento de estoque',0,11,11,NULL),(375,'2023-09-26 15:21:47',90,'Levantamento de estoque',11,13,24,NULL),(376,'2023-09-26 15:22:16',266,NULL,0,NULL,NULL,NULL),(377,'2023-09-26 15:22:51',266,'Levantamento de estoque',0,11,11,NULL),(378,'2023-09-26 15:24:06',125,'Levantamento de estoque',0,20,20,NULL),(379,'2023-09-26 15:25:14',267,NULL,0,NULL,NULL,NULL),(380,'2023-09-26 15:25:49',267,'Levantamento de estoque',0,52,52,NULL),(381,'2023-09-26 15:26:10',268,NULL,0,NULL,NULL,NULL),(382,'2023-09-26 15:26:31',268,'Levantamento de estoque',0,1,1,NULL),(383,'2023-09-26 15:27:36',14,'Levantamento de estoque',0,30,30,NULL),(384,'2023-09-26 15:28:20',15,'Levantamento de estoque',0,59,59,NULL),(385,'2023-09-26 15:29:47',253,'Levantamento de estoque',5,-2,3,NULL);
/*!40000 ALTER TABLE `inventarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-26 16:54:44