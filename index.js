const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const session = require("express-session");
const app = express();
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

app.get("/cursos", ensureAuthenticated, (req, res) => {
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50";
  connection.execute(q, [], (err, results) => {
    if (err) {
      console.error("Erro ao buscar avisos:", err);
      return res.status(500).send("Erro no servidor");
    }
    res.render("cursos.ejs", { avisos: results, user: req.session.user });
  });
});

app.get("/estagios", ensureAuthenticated, (req, res) => {
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50";
  connection.execute(q, [], (err, results) => {
    if (err) {
      console.error("Erro ao buscar avisos:", err);
      return res.status(500).send("Erro no servidor");
    }
    res.render("estagio.ejs", { avisos: results, user: req.session.user });
  });
});

app.get("/signup", (req, res) => {
  // se tiver página de signup separada; caso contrário, pode remover
  res.render("login_page.ejs");
});

// Rotas protegidas
app.get("/home", ensureAuthenticated, (req, res) => {
  // Busca os avisos mais recentes e passa para o template
  const q = "SELECT * FROM avisos ORDER BY ID_Aviso DESC LIMIT 50"; // corrigido: usa PK em vez de CreatedAt inexistente
  connection.execute(q, [], (err, results) => {
    if (err) {
      console.error("Erro ao buscar avisos:", err);
      return res.status(500).send("Erro no servidor");
    }
    // passa também req.session.user se precisar na view
    res.render("home.ejs", { avisos: results, user: req.session.user });
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


app.get("/projetos", ensureAuthenticated, (req, res) => {
  res.render("projetos.ejs");
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
    return res.status(200).render("/login", { error: "RM e senha são obrigatórios"});
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
app.post("/signup", (req, res) => {
  console.log("POST /signup body:", req.body);
  const { rm, email, senha } = req.body;

  if (!rm || !email || !senha) {
    console.warn("Campos ausentes ou vazios:", req.body);
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  connection.beginTransaction((txErr) => {
    if (txErr) {
      console.error("Erro ao iniciar transação:", txErr);
      return res.status(500).send("Erro no servidor");
    }

    // Verifica se já existe o aluno
    connection.execute("SELECT RM_Aluno FROM alunos WHERE RM_Aluno = ?", [rm], (selErr, selRes) => {
      if (selErr) {
        console.error("Erro ao verificar Alunos:", selErr);
        return connection.rollback(() => res.status(500).send("Erro no servidor"));
      }

      const insertDadosPessoais = () => {
        const q = "INSERT INTO dados_pessoais (ID_Alunos, Email, Senha) VALUES (?, ?, ?)";
        connection.execute(q, [rm, email, senha], (insErr, insRes) => {
          if (insErr) {
            console.error("Erro ao inserir em dados_pessoais:", insErr);
            return connection.rollback(() => res.status(500).send("Erro no servidor: " + (insErr.sqlMessage || insErr.message)));
          }

          connection.commit((commitErr) => {
            if (commitErr) {
              console.error("Erro no commit:", commitErr);
              return connection.rollback(() => res.status(500).send("Erro no servidor"));
            }
            console.log("Cadastro concluído:", insRes);
            return res.redirect("/login");
          });
        });
      };

      if (selRes && selRes.length > 0) {
        //Caso exista, insere em dados_pessoais
        insertDadosPessoais();
      } 
      else {
        //insere na tabela Alunos antes de dados_pessoais
        connection.execute("INSERT INTO alunos (RM_Aluno) VALUES (?)", [rm], (insAlErr, insAlRes) => {
          if (insAlErr) {
            console.error("Erro ao inserir em Alunos:", insAlErr);
            return connection.rollback(() => res.status(500).send("Erro ao criar registro de aluno: " + (insAlErr.sqlMessage || insAlErr.message)));
          }
          insertDadosPessoais();
        });
      }
    });
  });
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
  if (!req.file) return res.status(400).json({ message: 'Arquivo inválido.' });

  const publicPath = '/' + path.relative(path.join(__dirname, 'public'), req.file.path).replace(/\\/g, '/');

  const title = req.body.title || null;
  const text = req.body.text || null;
  const rm = req.session.user && req.session.user.rm ? req.session.user.rm : null;

  // Não insere CreatedAt aqui para evitar erro se a coluna não existir; deixe o banco preencher automaticamente se precisar
  const insertQuery = `INSERT INTO avisos (Titulo, Conteudo, Capa) VALUES (?, ?, ?)`;
  connection.execute(insertQuery, [title, text, publicPath], (err, result) => {
    if (err) {
      console.error('Erro ao inserir aviso:', err);
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(500).send('Erro ao salvar aviso no servidor.');
    }

    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
      return res.json({ message: 'Upload realizado e aviso salvo com sucesso!', path: publicPath, avisoId: result.insertId });
    }
    return res.redirect('/home');
  });
});



// Inicia o servidor
app.listen(8080, () => {
  console.log("Server está rodando na porta 8080");
});
