-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 25/09/2025 às 15:25
-- Versão do servidor: 8.0.43
-- Versão do PHP: 8.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `eportaldb`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alunos`
--

DROP TABLE IF EXISTS `alunos`;
CREATE TABLE IF NOT EXISTS `alunos` (
  `RM_Aluno` int NOT NULL,
  `Data_Nasc` date NOT NULL,
  PRIMARY KEY (`RM_Aluno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `avisos`
--

DROP TABLE IF EXISTS `avisos`;
CREATE TABLE IF NOT EXISTS `avisos` (
  `ID_Aviso` int NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(255) NOT NULL,
  `Conteudo` varchar(500) NOT NULL,
  `Imagem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  `ID_Coordenadores` int DEFAULT NULL,
  PRIMARY KEY (`ID_Aviso`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`),
  KEY `ID_Coordenadores` (`ID_Coordenadores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `coordenadores`
--

DROP TABLE IF EXISTS `coordenadores`;
CREATE TABLE IF NOT EXISTS `coordenadores` (
  `RM_Coordenador` int NOT NULL,
  PRIMARY KEY (`RM_Coordenador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `dados_pessoais`
--

DROP TABLE IF EXISTS `dados_pessoais`;
CREATE TABLE IF NOT EXISTS `dados_pessoais` (
  `Nome` varchar(255) NOT NULL,
  `Telefone` varchar(13) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `ID_Alunos` int NOT NULL,
  `ID_Professores` int NOT NULL,
  `ID_Coordenadores` int NOT NULL,
  PRIMARY KEY (`ID_Alunos`,`ID_Professores`,`ID_Coordenadores`,`Senha`),
  KEY `ID_Professores` (`ID_Professores`),
  KEY `ID_Coordenadores` (`ID_Coordenadores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `professores`
--

DROP TABLE IF EXISTS `professores`;
CREATE TABLE IF NOT EXISTS `professores` (
  `RM_Professor` int NOT NULL,
  PRIMARY KEY (`RM_Professor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projetos`
--

DROP TABLE IF EXISTS `projetos`;
CREATE TABLE IF NOT EXISTS `projetos` (
  `ID_Projeto` int NOT NULL AUTO_INCREMENT,
  `Nome_Projeto` varchar(100) NOT NULL,
  `Imagem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  PRIMARY KEY (`ID_Projeto`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `turmas`
--

DROP TABLE IF EXISTS `turmas`;
CREATE TABLE IF NOT EXISTS `turmas` (
  `ID_Turma` int NOT NULL AUTO_INCREMENT,
  `Serie` varchar(30) DEFAULT NULL,
  `Curso` varchar(50) DEFAULT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  PRIMARY KEY (`ID_Turma`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `avisos`
--
ALTER TABLE `avisos`
  ADD CONSTRAINT `avisos_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  ADD CONSTRAINT `avisos_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`),
  ADD CONSTRAINT `avisos_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`);

--
-- Restrições para tabelas `dados_pessoais`
--
ALTER TABLE `dados_pessoais`
  ADD CONSTRAINT `dados_pessoais_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  ADD CONSTRAINT `dados_pessoais_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`),
  ADD CONSTRAINT `dados_pessoais_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`);

--
-- Restrições para tabelas `projetos`
--
ALTER TABLE `projetos`
  ADD CONSTRAINT `projetos_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  ADD CONSTRAINT `projetos_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`);

--
-- Restrições para tabelas `turmas`
--
ALTER TABLE `turmas`
  ADD CONSTRAINT `turmas_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  ADD CONSTRAINT `turmas_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
