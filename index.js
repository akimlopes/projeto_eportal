const express = require("express");
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

app.get("/signup", (req, res) => {
  // se tiver página de signup separada; caso contrário, pode remover
  res.render("login_page.ejs");
});

// Rotas protegidas
app.get("/home", ensureAuthenticated, (req, res) => {
  res.render("home.ejs");
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
  // Sempre envie aluno e turma, mesmo que null
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
            res.render("perfil.ejs", { user: results[0],aluno: null, turma: null});
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

// Inicia o servidor
app.listen(8080, () => {
  console.log("Server está rodando na porta 8080");
});
