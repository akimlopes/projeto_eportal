const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const session = require("express-session");
const app = express();
const { parse, format } = require('date-fns');

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

// Middleware de proteção
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.send("<script>alert('Você precisa estar logado!'); window.location.href = '/login';</script>");
}

// Rotas públicas
app.get("/login", (req, res) => {
  res.render("login_page.ejs");
});


// Rotas protegidas
app.get("/home", ensureAuthenticated, (req, res) => {
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50";
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
    res.render("home.ejs", { avisos: mapped, user: req.session.user });
  });
});


app.post("/avisos/excluir", ensureAuthenticated, (req, res) => {
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

app.get("/estagios", ensureAuthenticated, (req, res) => {
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50";
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
    res.render("estagio.ejs", { avisos: mapped, user: req.session.user });
  });
});

app.get("/cursos", ensureAuthenticated, (req, res) => {
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50";
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
    res.render("cursos.ejs", { avisos: mapped, user: req.session.user });
  });
});

app.get("/perfil", ensureAuthenticated, (req, res) => {
  const rm = req.session.user && req.session.user.rm;
  const queryperfil = `SELECT * FROM dados_pessoais WHERE ID_Alunos = ? OR ID_Professores = ? OR ID_Coordenadores = ?`;
  connection.execute(queryperfil, [rm, rm, rm], (err, results) => {
    if (err) {
      console.error("Erro na query:", err);
      return res.status(500).send("Erro no servidor");
    }
    console.log("Resultados da query perfil:", results);
    if (results && results.length > 0) {
      if (results[0].ID_Alunos === null) {
        res.render("perfil.ejs", { user: results[0], aluno: null, turma: null });
      } else {
        const queryaluno = "SELECT * FROM alunos WHERE RM_Aluno = ?";
        connection.execute(queryaluno, [rm], (err2, results2) => {
          if (err2) {
            console.error("Erro na query:", err2);
            return res.status(500).send("Erro no servidor");
          }
          console.log("Resultados da query aluno:", results2);
          if (results2 && results2.length > 0) {
            const queryturma = "SELECT * FROM turmas WHERE ID_Turma = ?";
            connection.execute(queryturma, [results2[0].ID_Turmas], (err3, results3) => {
              if (err3) {
                console.error("Erro na query turma:", err3);
                return res.status(500).send("Erro no servidor");
              }
              console.log("Resultados da query turma:", results3);
              if (results3 && results3.length > 0) {
                res.render("perfil.ejs", { user: results[0], aluno: results2[0], turma: results3[0] });
              } else {
                res.render("perfil.ejs", { user: results[0], aluno: results2[0], turma: null });
              }
            });
          } else {
            res.render("perfil.ejs", { user: results[0], aluno: null, turma: null });
          }
        });
      }
    } else {
      return res.send("<script>alert('Erro ao carregar perfil'); window.location.href = '/home';</script>");
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

app.get("/projetos", ensureAuthenticated, (req, res) => {
  res.render("projetos.ejs");
});

app.get("/cadastro", ensureAuthenticated, (req, res) => {
  res.render("cadastro.ejs");
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

    console.log("Resultados da query:", results);
    if (results && results.length > 0) {
      // marca sessão como logada
      req.session.user = { rm };
      return res.redirect("/home");
    }
    else {
      return res.send("<script>alert('RM ou senha incorretos'); window.location.href = '/login';</script>");
    }
  });
});

// Rota /signup real (mantê-la)
app.get("/signup", async (req, res) => {
  res.render("cadastro.ejs");
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
  delimiter = ',' // Força o delimitador para vírgula
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

const upload = multer({ storage });

app.post("/upload", ensureAuthenticated, upload.single('arquivo'), (req, res) => {
  // Permitir upload sem imagem
  let publicPath = null;
  if (req.file) {
    publicPath = '/' + path.relative(path.join(__dirname, 'public'), req.file.path).replace(/\\/g, '/');
  }

  const title = req.body.title || null;
  const text = req.body.text || null;
  const rm = req.session.user && req.session.user.rm ? req.session.user.rm : null;

  // Não insere CreatedAt aqui para evitar erro se a coluna não existir; deixe o banco preencher automaticamente se precisar
  const insertQuery = `INSERT INTO avisos (Titulo, Conteudo, Capa) VALUES (?, ?, ?)`;
  connection.execute(insertQuery, [title, text, publicPath], (err, result) => {
    if (err) {
      console.error('Erro ao inserir aviso:', err);
      // Só tenta remover arquivo se existir
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) { }
      }
      return res.status(500).send('Erro ao salvar aviso no servidor.');
    }

    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
      return res.json({ message: 'Upload realizado e aviso salvo com sucesso!', path: publicPath, avisoId: result.insertId });
    }
    return res.redirect('/home');
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
app.listen(8080, () => {
  console.log("Server está rodando na porta 8080");
});