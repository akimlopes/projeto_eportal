-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-eportal210-eportal1.i.aivencloud.com    Database: Eportaldb
-- ------------------------------------------------------
-- Server version	8.0.35

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '571a30a5-8f78-11f0-821d-3ad1a0fc3928:1-97,
a3b10948-8f62-11f0-89d9-22b709d99316:1-29,
a6956ce3-8ea4-11f0-9092-5ef681d2cd51:1-23,
e82dcbfa-8d73-11f0-935e-bec46436e6e5:1-27';

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `RM_Aluno` int NOT NULL,
  `ID_Turmas` int DEFAULT NULL,
  PRIMARY KEY (`RM_Aluno`),
  KEY `ID_Turmas` (`ID_Turmas`),
  CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`ID_Turmas`) REFERENCES `turmas` (`ID_Turma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES (11111,NULL),(23042,NULL),(23143,NULL),(23045,6),(23063,10);
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avisos`
--

DROP TABLE IF EXISTS `avisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avisos` (
  `ID_Aviso` int NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(255) NOT NULL,
  `Conteudo` varchar(500) NOT NULL,
  `Capa` varchar(255) DEFAULT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  `ID_Coordenadores` int DEFAULT NULL,
  `Data_Aviso` date DEFAULT NULL,
  PRIMARY KEY (`ID_Aviso`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`),
  KEY `ID_Coordenadores` (`ID_Coordenadores`),
  CONSTRAINT `avisos_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  CONSTRAINT `avisos_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`),
  CONSTRAINT `avisos_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avisos`
--

LOCK TABLES `avisos` WRITE;
/*!40000 ALTER TABLE `avisos` DISABLE KEYS */;
INSERT INTO `avisos` VALUES (5,'EXCURSÃO PARA O ZOOLÓGICO DE SÃO PAULO!','? Data da excursão: 24/10 (quinta-feira)\r\n? Prazo para pagamento: até o dia 15/10\r\n? VAGAS LIMITADAS: apenas 43!\r\n\r\n⚠ Atenção: a vaga só será reservada mediante pagamento. Não deixe para a última hora!\r\n\r\nGaranta já seu lugar nessa aventura incrível com a turma! ??\r\nPagamentos e reserva na coordenação!!','/uploads/jpgFiles/1759873035049-Imagem do WhatsApp de 2025-10-07 Ã (s) 18.28.14_94a61765.jpg',NULL,NULL,NULL,NULL),(6,'CASA ABERTA NA ETEC POÁ','Na semana do dia 16/10, na ETEC de Poá teremos o Casa Aberta, evento onde os alunos apresentam seus projetos para o público!\r\n\r\nVenham conferir a criatividade e trabalho em equipe dos alunos da 210!','/uploads/jpgFiles/1759873687324-ETEC_POA.jpg',NULL,NULL,NULL,NULL),(7,'mochileiro das galaxias','um livro muito legal sobre coisas legais','/uploads/jpgFiles/1759884577126-rpg.jpg',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `avisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordenadores`
--

DROP TABLE IF EXISTS `coordenadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordenadores` (
  `RM_Coordenador` int NOT NULL,
  PRIMARY KEY (`RM_Coordenador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordenadores`
--

LOCK TABLES `coordenadores` WRITE;
/*!40000 ALTER TABLE `coordenadores` DISABLE KEYS */;
INSERT INTO `coordenadores` VALUES (54321),(80800);
/*!40000 ALTER TABLE `coordenadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dados_pessoais`
--

DROP TABLE IF EXISTS `dados_pessoais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dados_pessoais` (
  `ID_dados_pessoais` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) DEFAULT NULL,
  `Telefone` varchar(13) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  `ID_Coordenadores` int DEFAULT NULL,
  `ID_Projetos` int DEFAULT NULL,
  `Data_Nasc` date DEFAULT NULL,
  `Sexo` enum('Masculino','Feminino','Prefiro não dizer') DEFAULT NULL,
  PRIMARY KEY (`ID_dados_pessoais`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`),
  KEY `ID_Coordenadores` (`ID_Coordenadores`),
  KEY `ID_Projetos` (`ID_Projetos`),
  CONSTRAINT `dados_pessoais_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  CONSTRAINT `dados_pessoais_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`),
  CONSTRAINT `dados_pessoais_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`),
  CONSTRAINT `dados_pessoais_ibfk_4` FOREIGN KEY (`ID_Projetos`) REFERENCES `projetos` (`ID_Projeto`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dados_pessoais`
--

LOCK TABLES `dados_pessoais` WRITE;
/*!40000 ALTER TABLE `dados_pessoais` DISABLE KEYS */;
INSERT INTO `dados_pessoais` VALUES (1,'Joaquim Lopes','11 98765-4321','mazoxdafvl@gmail.com','123456',23045,NULL,NULL,NULL,'2007-11-04','Masculino'),(2,NULL,NULL,'slamano@gmail.com','12345',23042,NULL,NULL,NULL,NULL,NULL),(6,'Alexandre Siqueira','11 91234-5678','alexandre@gmail.com','6789',NULL,23031,NULL,NULL,'1995-06-25','Masculino'),(7,NULL,NULL,'rick@gmail.com','teste',23063,NULL,NULL,NULL,NULL,NULL),(8,NULL,NULL,'jhojhon@gmail.com','1234',11111,NULL,NULL,NULL,NULL,NULL),(9,NULL,NULL,'oakge@gmail.com','cogumelo123',23143,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `dados_pessoais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores`
--

DROP TABLE IF EXISTS `professores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores` (
  `RM_Professor` int NOT NULL,
  PRIMARY KEY (`RM_Professor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores`
--

LOCK TABLES `professores` WRITE;
/*!40000 ALTER TABLE `professores` DISABLE KEYS */;
INSERT INTO `professores` VALUES (12345),(23031);
/*!40000 ALTER TABLE `professores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores_turmas`
--

DROP TABLE IF EXISTS `professores_turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores_turmas` (
  `ID_Projeto` int NOT NULL,
  `ID_Professor` int NOT NULL,
  `Data_entrada` date DEFAULT NULL,
  `Papel` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Professor`,`ID_Projeto`),
  KEY `ID_Projeto` (`ID_Projeto`),
  CONSTRAINT `professores_turmas_ibfk_1` FOREIGN KEY (`ID_Professor`) REFERENCES `professores` (`RM_Professor`),
  CONSTRAINT `professores_turmas_ibfk_2` FOREIGN KEY (`ID_Projeto`) REFERENCES `projetos` (`ID_Projeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores_turmas`
--

LOCK TABLES `professores_turmas` WRITE;
/*!40000 ALTER TABLE `professores_turmas` DISABLE KEYS */;
/*!40000 ALTER TABLE `professores_turmas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projeto_participantes`
--

DROP TABLE IF EXISTS `projeto_participantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projeto_participantes` (
  `ID_Participacao` int NOT NULL AUTO_INCREMENT,
  `ID_Projeto` int NOT NULL,
  `Tipo_Participante` enum('aluno','professor','coordenador') NOT NULL,
  `RM_Participante` int NOT NULL,
  `Data_Ingresso` date DEFAULT NULL,
  `Funcao` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Participacao`),
  UNIQUE KEY `uk_projeto_participante` (`ID_Projeto`,`Tipo_Participante`,`RM_Participante`),
  CONSTRAINT `projeto_participantes_ibfk_1` FOREIGN KEY (`ID_Projeto`) REFERENCES `projetos` (`ID_Projeto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projeto_participantes`
--

LOCK TABLES `projeto_participantes` WRITE;
/*!40000 ALTER TABLE `projeto_participantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `projeto_participantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projetos`
--

DROP TABLE IF EXISTS `projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projetos` (
  `ID_Projeto` int NOT NULL AUTO_INCREMENT,
  `Nome_Projeto` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Projeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projetos`
--

LOCK TABLES `projetos` WRITE;
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS `turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turmas` (
  `ID_Turma` int NOT NULL AUTO_INCREMENT,
  `Serie` varchar(30) DEFAULT NULL,
  `Curso` varchar(50) DEFAULT NULL,
  `Turno` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Turma`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
INSERT INTO `turmas` VALUES (1,'1° Ano','Administração','Manhã'),(2,'2° Ano','Administração','Manhã'),(3,'3° Ano','Administração','Manhã'),(4,'1° Ano','Desenvolvimento de Sistemas','Manhã'),(5,'2° Ano','Desenvolvimento de Sistemas','Manhã'),(6,'3° Ano','Desenvolvimento de Sistemas','Manhã'),(7,'1° Ano','Informática para Internet','Tarde'),(8,'2° Ano','Informática para Internet','Tarde'),(9,'3° Ano','Informática para Internet','Tarde'),(10,'1° Ano','Marketing','Tarde'),(11,'2° Ano','Marketing','Tarde'),(12,'3° Ano','Marketing','Tarde'),(13,'1° Ano','Desenvolvimento de Sistemas','Noturno'),(14,'2° Ano','Desenvolvimento de Sistemas','Noturno'),(15,'1° Ano','Administração','Noturno'),(16,'2° Ano','Administração','Noturno');
/*!40000 ALTER TABLE `turmas` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-08  7:57:45
