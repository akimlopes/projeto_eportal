-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 14/10/2025 às 21:02
-- Versão do servidor: 9.1.0
-- Versão do PHP: 8.3.14

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
  `ID_Turmas` int DEFAULT NULL,
  PRIMARY KEY (`RM_Aluno`),
  KEY `ID_Turmas` (`ID_Turmas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `alunos`
--

INSERT INTO `alunos` (`RM_Aluno`, `ID_Turmas`) VALUES
(10001, NULL),
(23045, 6);

-- --------------------------------------------------------

--
-- Estrutura para tabela `avisos`
--

DROP TABLE IF EXISTS `avisos`;
CREATE TABLE IF NOT EXISTS `avisos` (
  `ID_Aviso` int NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(255) NOT NULL,
  `Conteudo` varchar(600) NOT NULL,
  `Capa` varchar(255) DEFAULT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  `ID_Coordenadores` int DEFAULT NULL,
  `Data_Aviso` date DEFAULT NULL,
  `Autor` varchar(150) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `ID_Turmas` int DEFAULT NULL,
  PRIMARY KEY (`ID_Aviso`),
  KEY `ID_Alunos` (`ID_Alunos`),
  KEY `ID_Professores` (`ID_Professores`),
  KEY `ID_Coordenadores` (`ID_Coordenadores`),
  KEY `avisos_ibfk_4_idx` (`ID_Turmas`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Acionadores `avisos`
--
DROP TRIGGER IF EXISTS `set_data_aviso`;
DELIMITER $$
CREATE TRIGGER `set_data_aviso` BEFORE INSERT ON `avisos` FOR EACH ROW BEGIN
    IF NEW.Data_Aviso IS NULL THEN
        SET NEW.Data_Aviso = CURDATE();
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `coordenadores`
--

DROP TABLE IF EXISTS `coordenadores`;
CREATE TABLE IF NOT EXISTS `coordenadores` (
  `RM_Coordenador` int NOT NULL,
  PRIMARY KEY (`RM_Coordenador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `coordenadores`
--

INSERT INTO `coordenadores` (`RM_Coordenador`) VALUES
(23031),
(23040),
(23088);

-- --------------------------------------------------------

--
-- Estrutura para tabela `dados_pessoais`
--

DROP TABLE IF EXISTS `dados_pessoais`;
CREATE TABLE IF NOT EXISTS `dados_pessoais` (
  `ID_dados_pessoais` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) DEFAULT NULL,
  `Telefone` varchar(13) DEFAULT NULL,
  `Foto` varchar(255) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `ID_Alunos` int DEFAULT NULL,
  `ID_Professores` int DEFAULT NULL,
  `ID_Coordenadores` int DEFAULT NULL,
  `ID_Projetos` int DEFAULT NULL,
  `Data_Nasc` date DEFAULT NULL,
  `Sexo` enum('Masculino','Feminino','Prefiro não dizer') DEFAULT NULL,
  `ID_Turmas` int DEFAULT NULL,
  PRIMARY KEY (`ID_dados_pessoais`),
  KEY `ID_Projetos` (`ID_Projetos`),
  KEY `dados_pessoais_ibfk_1` (`ID_Alunos`),
  KEY `ID_Turmas` (`ID_Turmas`),
  KEY `dados_pessoais_ibfk_2` (`ID_Professores`),
  KEY `dados_pessoais_ibfk_3` (`ID_Coordenadores`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `dados_pessoais`
--

INSERT INTO `dados_pessoais` (`ID_dados_pessoais`, `Nome`, `Telefone`, `Foto`, `Email`, `Senha`, `ID_Alunos`, `ID_Professores`, `ID_Coordenadores`, `ID_Projetos`, `Data_Nasc`, `Sexo`, `ID_Turmas`) VALUES
(1, 'Joaquim Lopes', '11 98765-4321', '/uploads/fotos_perfil/23045.png', 'mazoxdafvl@gmail.com', '123456', 23045, NULL, NULL, NULL, '2007-11-04', 'Masculino', 6),
(31, 'Julio', '11 40022-8922', '/uploads/fotos_perfil/23040.jpg', 'admin@gmail.com', '54321', NULL, NULL, 23040, NULL, '2000-11-04', 'Masculino', NULL),
(37, 'Cleybson Leandro', '11 97182-1988', '/uploads/fotos_perfil/23088.png', 'cleybson@gmail.com', '9876', NULL, NULL, 23088, NULL, '1984-09-25', 'Masculino', NULL),
(38, 'Ana Silva', '11 98765-4321', NULL, 'ana.silva@email.com', 'ana123', 10001, NULL, NULL, NULL, '2010-03-15', 'Feminino', 2),
(39, 'Alexandre Siqueira', NULL, '/uploads/fotos_perfil/23031.png', 'alexandre123@gmail.com', '6789', NULL, NULL, 23031, NULL, '1994-07-21', 'Masculino', NULL);

--
-- Acionadores `dados_pessoais`
--
DROP TRIGGER IF EXISTS `set_sign_aluno`;
DELIMITER $$
CREATE TRIGGER `set_sign_aluno` BEFORE INSERT ON `dados_pessoais` FOR EACH ROW BEGIN
    DECLARE aluno_existe INT DEFAULT 0;
    
    -- Verificar se é um registro de aluno
    IF NEW.ID_Alunos IS NOT NULL THEN
        -- Verificar se o aluno já existe na tabela alunos
        SELECT COUNT(*) INTO aluno_existe 
        FROM alunos 
        WHERE RM_Aluno = NEW.ID_Alunos;
        
        -- Se não existe, criar o registro em alunos primeiro
        IF aluno_existe = 0 THEN
            INSERT INTO alunos (RM_Aluno, ID_Turmas)
            VALUES (NEW.ID_Alunos, NULL);
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `set_sign_prof`;
DELIMITER $$
CREATE TRIGGER `set_sign_prof` BEFORE INSERT ON `dados_pessoais` FOR EACH ROW BEGIN
    DECLARE professor_existe INT DEFAULT 0;
    
    -- Verificar se é um registro relacionado a professor
    IF NEW.ID_Professores IS NOT NULL THEN
        -- Verificar se o professor já existe na tabela professores
        SELECT COUNT(*) INTO professor_existe 
        FROM professores 
        WHERE RM_Professor = NEW.ID_Professores;
        
        -- Se não existe, criar o registro em professores primeiro
        IF professor_existe = 0 THEN
            INSERT INTO professores (RM_Professor)
            VALUES (NEW.ID_Professores);
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `professores`
--

DROP TABLE IF EXISTS `professores`;
CREATE TABLE IF NOT EXISTS `professores` (
  `RM_Professor` int NOT NULL,
  PRIMARY KEY (`RM_Professor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `professores`
--

INSERT INTO `professores` (`RM_Professor`) VALUES
(23030);

-- --------------------------------------------------------

--
-- Estrutura para tabela `professores_turmas`
--

DROP TABLE IF EXISTS `professores_turmas`;
CREATE TABLE IF NOT EXISTS `professores_turmas` (
  `ID_Projeto` int NOT NULL,
  `ID_Professor` int NOT NULL,
  `Data_entrada` date DEFAULT NULL,
  `Papel` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Professor`,`ID_Projeto`),
  KEY `ID_Projeto` (`ID_Projeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projetos`
--

DROP TABLE IF EXISTS `projetos`;
CREATE TABLE IF NOT EXISTS `projetos` (
  `ID_Projeto` int NOT NULL AUTO_INCREMENT,
  `Nome_Projeto` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Projeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projeto_participantes`
--

DROP TABLE IF EXISTS `projeto_participantes`;
CREATE TABLE IF NOT EXISTS `projeto_participantes` (
  `ID_Participacao` int NOT NULL AUTO_INCREMENT,
  `ID_Projeto` int NOT NULL,
  `Tipo_Participante` enum('aluno','professor','coordenador') NOT NULL,
  `RM_Participante` int NOT NULL,
  `Data_Ingresso` date DEFAULT NULL,
  `Funcao` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Participacao`),
  UNIQUE KEY `uk_projeto_participante` (`ID_Projeto`,`Tipo_Participante`,`RM_Participante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Acionadores `projeto_participantes`
--
DROP TRIGGER IF EXISTS `set_data_ingresso`;
DELIMITER $$
CREATE TRIGGER `set_data_ingresso` BEFORE INSERT ON `projeto_participantes` FOR EACH ROW BEGIN
    IF NEW.Data_Ingresso IS NULL THEN
        SET NEW.Data_Ingresso = CURDATE();
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `turmas`
--

DROP TABLE IF EXISTS `turmas`;
CREATE TABLE IF NOT EXISTS `turmas` (
  `ID_Turma` int NOT NULL AUTO_INCREMENT,
  `Serie` varchar(30) DEFAULT NULL,
  `Curso` varchar(50) DEFAULT NULL,
  `Turno` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Turma`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `turmas`
--

INSERT INTO `turmas` (`ID_Turma`, `Serie`, `Curso`, `Turno`) VALUES
(1, '1° Ano', 'Administração', 'Manhã'),
(2, '2° Ano', 'Administração', 'Manhã'),
(3, '3° Ano', 'Administração', 'Manhã'),
(4, '1° Ano', 'Desenvolvimento de Sistemas', 'Manhã'),
(5, '2° Ano', 'Desenvolvimento de Sistemas', 'Manhã'),
(6, '3° Ano', 'Desenvolvimento de Sistemas', 'Manhã'),
(7, '1° Ano', 'Informática para Internet', 'Tarde'),
(8, '2° Ano', 'Informática para Internet', 'Tarde'),
(9, '3° Ano', 'Informática para Internet', 'Tarde'),
(10, '1° Ano', 'Marketing', 'Tarde'),
(11, '2° Ano', 'Marketing', 'Tarde'),
(12, '3° Ano', 'Marketing', 'Tarde'),
(13, '1° Ano', 'Desenvolvimento de Sistemas', 'Noturno'),
(14, '2° Ano', 'Desenvolvimento de Sistemas', 'Noturno'),
(15, '1° Ano', 'Administração', 'Noturno'),
(16, '2° Ano', 'Administração', 'Noturno');

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `alunos`
--
ALTER TABLE `alunos`
  ADD CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`ID_Turmas`) REFERENCES `turmas` (`ID_Turma`);

--
-- Restrições para tabelas `avisos`
--
ALTER TABLE `avisos`
  ADD CONSTRAINT `avisos_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`),
  ADD CONSTRAINT `avisos_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`),
  ADD CONSTRAINT `avisos_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`),
  ADD CONSTRAINT `avisos_ibfk_4` FOREIGN KEY (`ID_Turmas`) REFERENCES `turmas` (`ID_Turma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `dados_pessoais`
--
ALTER TABLE `dados_pessoais`
  ADD CONSTRAINT `dados_pessoais_ibfk_1` FOREIGN KEY (`ID_Alunos`) REFERENCES `alunos` (`RM_Aluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dados_pessoais_ibfk_2` FOREIGN KEY (`ID_Professores`) REFERENCES `professores` (`RM_Professor`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dados_pessoais_ibfk_3` FOREIGN KEY (`ID_Coordenadores`) REFERENCES `coordenadores` (`RM_Coordenador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dados_pessoais_ibfk_4` FOREIGN KEY (`ID_Projetos`) REFERENCES `projetos` (`ID_Projeto`),
  ADD CONSTRAINT `dados_pessoais_ibfk_5` FOREIGN KEY (`ID_Turmas`) REFERENCES `turmas` (`ID_Turma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `professores_turmas`
--
ALTER TABLE `professores_turmas`
  ADD CONSTRAINT `professores_turmas_ibfk_1` FOREIGN KEY (`ID_Professor`) REFERENCES `professores` (`RM_Professor`),
  ADD CONSTRAINT `professores_turmas_ibfk_2` FOREIGN KEY (`ID_Projeto`) REFERENCES `projetos` (`ID_Projeto`);

--
-- Restrições para tabelas `projeto_participantes`
--
ALTER TABLE `projeto_participantes`
  ADD CONSTRAINT `projeto_participantes_ibfk_1` FOREIGN KEY (`ID_Projeto`) REFERENCES `projetos` (`ID_Projeto`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
