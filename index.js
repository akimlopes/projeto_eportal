const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const session = require("express-session");
const app = express();
const { parse, format } = require('date-fns');
const { type } = require("os");

// formata YYYY-MM-DD (ou YYYY-MM-DD HH:MM:SS) sem causar shift de fuso
function formatDateValue(raw) {
  if (!raw) return null;
  const s = String(raw).trim();

  // se já vier no formato YYYY-MM-DD
  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoWithTime = /^(\d{4})-(\d{2})-(\d{2})[T\s]/;

  try {
    if (isoDateOnly.test(s)) {
      // parse usando formato local (evita interpretação UTC)
      const d = parse(s, 'yyyy-MM-dd', new Date());
      return format(d, 'dd/MM/yyyy');
    }
    if (isoWithTime.test(s)) {
      const d = parse(s.substring(0, 10), 'yyyy-MM-dd', new Date());
      return format(d, 'dd/MM/yyyy');
    }
    // fallback: tentar Date normal
    const parsed = new Date(s);
    if (!isNaN(parsed)) return format(parsed, 'dd/MM/yyyy');
  } catch (e) {
    console.error('formatDateValue erro:', e);
  }
  return null;
}



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: "chave_etecpoa123@#",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 3 } // 3 horas
}));

// Conecta com o Aiven ou banco de dados local
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  dateStrings: true
});

connection.connect((err) => {
  if (err) console.error("Erro ao conectar:", err);
  else console.log(`Conectado ao ${process.env.DB_NAME}`);
});

log = "inativo";

app.set("view engine", "ejs");

app.use(express.static("public"));

function ensureCoordenador(req, res, next) {
  if (req.session && req.session.nivel === "coordenador") {
    // Se for coordenador, pode continuar normalmente
    return next();
  } else {
    // Se não for, bloqueia o acesso
    return res.status(403).send("<script>alert('Acesso negado.'); window.location.href='/home';</script>");
  }
}

// Middleware de proteção
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.send("<script>alert('Você precisa estar logado!'); window.location.href = '/login';</script>");
}

function saveURL(req, res, next){
  // Salva a URL atual antes de processar a requisição
   if (req.originalUrl != '/upload') {
    req.session.returnTo = req.originalUrl;
    //type = req.session.returnTo.slice(1);
  }
  next();
  console.log('URL salva na sessão: ', req.session.returnTo);
  //console.log('Tipo salvo na variável: ', type);
}

// Rotas públicas
app.get("/login", (req, res) => {
  res.render("login_page.ejs");
});


// Rotas protegidas
app.get("/home", ensureAuthenticated, saveURL, (req, res) => {
    const q = `
    SELECT a.*, d.Foto AS autorFoto
    FROM avisos a
    LEFT JOIN dados_pessoais d ON d.Nome = a.Autor
    WHERE a.Tipo = 'home'
    ORDER BY a.ID_Aviso DESC
    LIMIT 50
  `;
  connection.execute(q, [], (err, results) => {
    if (err) {
     console.error("Erro ao buscar avisos:", err);
      return res.status(500).send("Erro no servidor");
    }
    const mapped = (results || []).map(r => {
      const raw = r.Data_Aviso || r.CreatedAt || r.created_at || r.Data || r.data || null;
      r.Data_Aviso_formatada = formatDateValue(raw) || '00/00/0000';
      return r;
    });
    res.render("home.ejs", { avisos: mapped, user: req.session.user, nivel: req.session.nivel });
  });
});


app.post("/avisos/excluir", ensureAuthenticated, ensureCoordenador, (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("ID do aviso é obrigatório");
  const q = "DELETE FROM avisos WHERE ID_Aviso = ?";
  connection.execute(q, [id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar aviso:", err);
      return res.status(500).send("Erro no servidor");
    }
    res.send("Aviso deletado com sucesso");
  });
});

app.post("/avisos/editar", ensureAuthenticated, ensureCoordenador, (req, res) => {
  const avisoId = req.body.id;
  const { titulo, conteudo } = req.body;

  if (!avisoId || !titulo || !conteudo) {
    return res.status(400).send("Dados incompletos para editar aviso.");
  }

  const query = "UPDATE avisos SET Titulo = ?, Conteudo = ? WHERE ID_Aviso = ?";

  connection.execute(query, [titulo, conteudo, avisoId], (err, result) => {
    if (err) {
      console.error("Erro ao editar aviso:", err);
      return res.status(500).send("Erro ao editar aviso.");
    }

    console.log(`Aviso ID ${avisoId} atualizado com sucesso.`);
    res.redirect("/home"); // volta pra página principal
  });
});


app.get("/estagios", ensureAuthenticated, saveURL,(req, res) => {
  const q = `
    SELECT a.*, d.Foto AS autorFoto
    FROM avisos a
    LEFT JOIN dados_pessoais d ON d.Nome = a.Autor
    WHERE a.Tipo = 'estagios'
    ORDER BY a.ID_Aviso DESC
    LIMIT 50
  `;
  connection.execute(q, [], (err, results) => {
    if (err) {
      console.error("Erro ao buscar avisos:", err);
      return res.status(500).send("Erro no servidor");
    }
    const mapped = (results || []).map(r => {
      const raw = r.Data_Aviso || r.CreatedAt || r.created_at || r.Data || r.data || null;
      r.Data_Aviso_formatada = formatDateValue(raw) || '00/00/0000';
      return r;
    });
    res.render("estagio.ejs", { avisos: mapped, user: req.session.user, nivel: req.session.nivel });
  });
});

app.get("/cursos", ensureAuthenticated, saveURL, (req, res) => {
  const rm = req.session.user?.rm;

  if (req.session.nivel === 'aluno') {
    const queryTurma = "SELECT ID_Turmas FROM dados_pessoais WHERE ID_Alunos = ?";
    connection.execute(queryTurma, [rm], (err, results) => {
      if (err) return res.status(500).send("Erro no servidor");
      const idTurma = results[0]?.ID_Turmas;
      if (!idTurma) return res.render("cursos.ejs", { avisos: [], user: req.session.user, nivel: req.session.nivel, turmas: [] });

      const queryAvisos = `
        SELECT a.*, d.Foto AS autorFoto
        FROM avisos a
        LEFT JOIN dados_pessoais d
          ON d.Nome = a.Autor
        WHERE a.Tipo = 'cursos' AND a.ID_Turmas = ?
        ORDER BY a.ID_Aviso DESC
        LIMIT 50
      `;

      connection.execute(queryAvisos, [idTurma], (err2, avisos) => {
        if (err2) return res.status(500).send("Erro ao buscar avisos");

        const mapped = (avisos || []).map(aviso => {
          const raw = aviso.Data_Aviso || aviso.CreatedAt || aviso.created_at || aviso.Data || aviso.data || null;
          aviso.Data_Aviso_formatada = formatDateValue(raw) || '00/00/0000';
          return aviso;
        });

        const queryTurmas = "SELECT * FROM turmas ORDER BY ID_Turma ASC;";
        connection.execute(queryTurmas, [], (err3, turmas) => {
          if (err3) return res.status(500).send("Erro ao buscar turmas");
          res.render("cursos.ejs", { avisos: mapped, user: req.session.user, nivel: req.session.nivel, turmas: turmas || [] });
        });
      });
    });
  } else {
    // Para coordenador/professor
    const queryAvisos = `
      SELECT a.*, d.Foto AS autorFoto
      FROM avisos a
      LEFT JOIN dados_pessoais d
        ON d.Nome = a.Autor
      WHERE a.Tipo = 'cursos'
      ORDER BY a.ID_Aviso DESC
      LIMIT 50
    `;

    connection.execute(queryAvisos, [], (err, avisos) => {
      if (err) return res.status(500).send("Erro ao buscar avisos");

      const mapped = (avisos || []).map(aviso => {
        const raw = aviso.Data_Aviso || aviso.CreatedAt || aviso.created_at || aviso.Data || aviso.data || null;
        aviso.Data_Aviso_formatada = formatDateValue(raw) || '00/00/0000';
        return aviso;
      });

      const queryTurmas = "SELECT * FROM turmas ORDER BY ID_Turma ASC;";
      connection.execute(queryTurmas, [], (err2, turmas) => {
        if (err2) return res.status(500).send("Erro ao buscar turmas");
        res.render("cursos.ejs", { avisos: mapped, user: req.session.user, nivel: req.session.nivel, turmas: turmas || [] });
      });
    });
  }
});

// GET /perfil
app.get("/perfil", ensureAuthenticated, (req, res) => {
  const rm = req.session.user && req.session.user.rm;
  const queryperfil = `SELECT * FROM dados_pessoais WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?`;
  
  connection.execute(queryperfil, [rm, rm, rm], (err, results) => {
    if (err) return res.status(500).send("Erro no servidor");
    if (results && results.length > 0) {
      const userData = results[0];
      const rawBirthDate = userData.Data_Nasc;
      userData.Data_Nasc_formatada = formatDateValue(rawBirthDate) || 'Data não informada';

      if (userData.ID_Alunos === null) {
        res.render("perfil.ejs", { user: userData, turma: null, nivel: req.session.nivel });
      } else {
        const queryturma = "SELECT * FROM turmas WHERE ID_Turma = ?";
        connection.execute(queryturma, [userData.ID_Turmas], (err2, results2) => {
          if (err2) return res.status(500).send("Erro no servidor");
          res.render("perfil.ejs", { user: userData, turma: results2 && results2.length > 0 ? results2[0] : null, nivel: req.session.nivel });
        });
      }
    } else {
      res.render("perfil.ejs", { user: null, turma: null, nivel: req.session.nivel });
    }
  });
});

app.post("/perfil/atualizar", ensureAuthenticated, (req, res) => {
  const rm = req.session.user && req.session.user.rm;
  const { email, telefone } = req.body;
  if (!rm) return res.status(400).send("RM não encontrado.");

  const query = `
    UPDATE dados_pessoais
    SET Email = ?, Telefone = ?
    WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?
  `;
  connection.execute(query, [email, telefone, rm, rm, rm], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar perfil:", err);
      return res.status(500).send("Erro no servidor");
    }
    console.log("Perfil atualizado com sucesso:", result);
    res.redirect("/perfil");
  });
});

// Alteração da senha
app.post('/perfil/alterar-senha', ensureAuthenticated, async (req, res) => {
  try {
    const rm = req.session.user && req.session.user.rm;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'Preencha todos os campos.' });
    }
    if (newPassword !== confirmPassword) {
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'A nova senha e a confirmação não coincidem.' });
    }
    if (newPassword.length < 4) {
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    // Busca a senha atual no banco
    const [rows] = await connection.promise().execute(
      'SELECT Senha FROM dados_pessoais WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?',
      [rm, rm, rm]
    );

    if (!rows || rows.length === 0) {
      console.warn('[alterar-senha] usuário não encontrado para rm=', rm);
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'Usuário não encontrado.' });
    }

    const senhaAtualBanco = rows[0].Senha;
    console.log('[alterar-senha] rm=', rm, 'senhaAtualBanco=', senhaAtualBanco);

    if (currentPassword !== senhaAtualBanco) {
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'Senha atual incorreta.' });
    }

    // Atualiza a senha no banco
    const [updateResult] = await connection.promise().execute(
      'UPDATE dados_pessoais SET Senha = ? WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?',
      [newPassword, rm, rm, rm]
    );

    console.log('[alterar-senha] updateResult:', updateResult);

    if (updateResult.affectedRows === 0) {
      return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'Nenhuma linha foi alterada.' });
    }

    // Redireciona para /perfil para recarregar os dados do banco
    return res.redirect('/perfil');

  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    return res.render('perfil.ejs', { user: req.session.user, turma: null, nivel: req.session.nivel, error: 'Erro ao atualizar senha.' });
  }
});

app.listen(8080, () => {
  console.log("Server está rodando na porta 8080");
});


app.get("/projetos", ensureAuthenticated, (req, res) => {
  res.render("projetos.ejs", { user: req.session.user, nivel: req.session.nivel });
});

app.get("/cadastro", ensureAuthenticated, (req, res) => {
  res.render("cadastro.ejs", { user: req.session.user, nivel: req.session.nivel });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    // limpa cookie da sessão no cliente
    res.clearCookie('connect.sid');
    return res.send("<script>alert('Desconectado com sucesso'); window.location.href = '/login';</script>");
  });
});

// Verifica o login
app.post("/login", (req, res) => {
  console.log("POST /login body:", req.body);
  const { rm, senha } = req.body;

  if (!rm || !senha) {
    console.warn("Campos ausentes ou vazios:", req.body);
    return res.status(400).send("RM e senha são obrigatórios");
  }
  // Consulta o SQL
  const query =
    "SELECT * FROM dados_pessoais WHERE (ID_Coordenadores = ? OR ID_Professores = ? OR ID_Alunos = ?) AND Senha = ?";
connection.execute(query, [rm, rm, rm, senha], (err, results) => {
  if (err) {
    console.error("Erro na query:", err);
    return res.status(500).send("Erro no servidor");
  }

  if (results && results.length > 0) {
    // Marca sessão como logada
    const usuario = results[0];
    req.session.user = {
      rm,
      nome: usuario.Nome,  // Aqui você adiciona o nome à sessão
      Foto: usuario.Foto
    };

    // Define o nível de usuário
    if (usuario.ID_Coordenadores) {
      req.session.nivel = "coordenador";
    } else if (usuario.ID_Professores) {
      req.session.nivel = "professor";
    } else if (usuario.ID_Alunos) {
      req.session.nivel = "aluno";
    } else {
      req.session.nivel = "desconhecido";
    }

    return res.redirect("/home");
  } else {
    return res.send("<script>alert('RM ou senha incorretos'); window.location.href = '/login';</script>");
    }
  });
});

function processTableData(tableData, hasHeader = true, delimiter = ',') {
  // Detecta delimitador especial (caso venha como '\t' para tabulação)
  if (delimiter === '\\t') delimiter = '\t';

  const lines = tableData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return [];

  let headers = [];
  let startIdx = 0;

  if (hasHeader) {
    headers = lines[0].split(delimiter).map(h => h.trim());
    startIdx = 1;
  } else {
    // Se não tem cabeçalho, cria nomes genéricos
    headers = lines[0].split(delimiter).map((_, i) => `col${i + 1}`);
  }

  const data = [];
  for (let i = startIdx; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    data.push(obj);
  }
  return data;
}

app.post("/signup", async (req, res) => {
  const { tableData, hasHeader = true } = req.body;
  tableName = 'dados_pessoais'; // Força o nome da tabela para dados_pessoais
  delimiter = ',' ;// Força o delimitador para vírgula
  console.log('Recebendo solicitação de importação...');
  console.log('Tabela:', tableName);
  console.log('Tamanho dos dados:', tableData.length);

  if (!tableName || !tableData) {
    console.warn("Campos ausentes ou vazios:", req.body);
    return res.status(400).send("Nome da tabela e dados são obrigatórios");
  }

  try {
    // Aqui você precisa implementar ou importar a função processTableData
    const data = processTableData(tableData, hasHeader, delimiter);

    // Verificar se a tabela existe
    try {
      const exists = await checkTableExists(tableName);
      if (!exists) {
        console.error(`Tabela ${tableName} não existe no database ${dbName}.`);
        return res.status(400).send(`Tabela ${tableName} não existe no banco ${dbName}.`);
      }

      console.log(`Tabela ${tableName} existe. Iniciando importação...`);

      try {
        const firstRow = data[0];
        const headers = Object.keys(firstRow);

        // Inserir dados em lote
        const columns = headers.map(h => `\`${h}\``).join(', ');
        const placeholders = headers.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;

        let affectedRows = 0;
        const batchSize = 100;
        let firstRecord = null;

        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);

          for (const row of batch) {
            const values = headers.map(header => row[header] !== null ? row[header] : '');

            const queryAsync = () => {
              return new Promise((resolve, reject) => {
                connection.execute(insertSQL, values, (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                });
              });
            };

            try {
              const result = await queryAsync();
              affectedRows += result.affectedRows;

              if (!firstRecord) {
                firstRecord = row;
              }
            } catch (insertError) {
              console.error('Erro ao inserir linha:', row, insertError);
              throw new Error(`Erro na linha ${i + 1}: ${insertError.message}`);
            }
          }

          console.log(`Lote ${Math.floor(i / batchSize) + 1} processado`);
        }

        console.log(`Importação concluída: ${affectedRows} registros inseridos`);

        res.json({
          success: true,
          affectedRows,
          tableName,
          firstRecord,
          totalRecords: data.length,
          columns: headers
        });

      } catch (error) {
        console.error('Erro na importação:', error);
        res.status(500).json({
          success: false,
          error: error.message,
          details: 'Verifique o formato dos dados e tente novamente'
        });
      }
    } catch (err) {
      console.error('Erro ao verificar existência da tabela:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

  } catch (error) {
    console.error('Erro no processamento dos dados:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Verifique o formato dos dados e tente novamente'
    });
  }
});

// Configuração do multer para upload de arquivos (corrigida)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDir = path.join(__dirname, 'public', 'uploads');
    const ext = path.extname(file.originalname).toLowerCase();
    let subFolder = 'otherFiles';
    if (ext === '.png') {
      subFolder = 'pngFiles';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      subFolder = 'jpgFiles';
    }

    const uploadDir = path.join(baseDir, subFolder);
    fs.mkdirSync(uploadDir, { recursive: true });

    req.uploadDir = uploadDir; // Salva o diretório na requisição para uso posterior
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

const storageFoto = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public', 'uploads', 'fotos_perfil');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const user = req.session.user;
    const ext = path.extname(file.originalname);
    const userId = user?.rm; // 🟢 Usa RM do usuário para nome do arquivo
    cb(null, `${userId}${ext}`);
  }
});


const upload = multer({ storage });

// Configuração do multer para upload de fotos de perfil
const uploadFoto = multer({ storage: storageFoto });

app.post('/upload-foto', ensureAuthenticated, uploadFoto.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('Nenhuma imagem enviada.');
    const user = req.session.user;
    const fotoPath = `/uploads/fotos_perfil/${req.file.filename}`;

    const query = `
      UPDATE dados_pessoais
      SET Foto = ?
      WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?
    `;

    await connection.promise().execute(query, [
      fotoPath,
      user.rm,
      user.rm,
      user.rm
    ]);

    req.session.user.Foto = fotoPath; // 🟢 Atualiza a sessão com a nova foto
    res.redirect('/perfil');
  } catch (err) {
    console.error('Erro ao enviar foto de perfil:', err);
    res.status(500).send('Erro ao salvar imagem de perfil.');
  }
});


app.post("/upload", ensureAuthenticated, ensureCoordenador, saveURL, upload.single('arquivo'), (req, res) => {
  // Permitir upload sem imagem
  let publicPath = null;
  if (req.file) {
    publicPath = '/' + path.relative(path.join(__dirname, 'public'), req.file.path).replace(/\\/g, '/');
  }

  const title = req.body.title || null;
  const text = req.body.text || null;
  const rm = req.session.user && req.session.user.rm ? req.session.user.rm : null;
  const turma = req.body.turma || null;
  // Corrigido: verifica se returnTo existe e é string
  let tipo = req.session.returnTo && typeof req.session.returnTo === 'string' && req.session.returnTo.length > 1
    ? req.session.returnTo.slice(1)
    : 'geral';
  console.log('Tipo para o aviso:', tipo);
  const autor = (req.session.user && req.session.user.nome) || 'Autor';
  const insertQuery = `INSERT INTO avisos (Titulo, Conteudo, Capa, Autor, Tipo, ID_Turmas) VALUES (?, ?, ?, ?, ?, ?)`;
  console.log('Valor do insert: ', [title, text, publicPath, autor, tipo, turma]);

  connection.execute(insertQuery, [title, text, publicPath, autor, tipo, turma], (err, result) => {
    if (err) {
      console.error('Erro ao inserir aviso:', err);
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
      }
      return res.status(500).send('Erro ao salvar aviso no servidor.');
    }

    return res.redirect(`/${tipo}`);
  });
});

app.get("/tables", (req, res) => {
  connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      return res.json({ success: false, error: err.message });
    }
    return res.json({ success: true, tables: results });
  });
});


const dbName = (connection.config && (connection.config.database || connection.config.db)) || process.env.DB_DATABASE || process.env.DB_NAME || null;

function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    if (!dbName) return reject(new Error('Nome do database não definido (dbName vazio)'));
    const q = `
      SELECT COUNT(*) AS cnt
      FROM information_schema.tables
      WHERE table_schema = ? AND table_name = ?
    `;
    connection.execute(q, [dbName, tableName], (err, results) => {
      if (err) return reject(err);
      resolve(results && results[0] && results[0].cnt > 0);
    });
  });
}

// Inicia o servidor

