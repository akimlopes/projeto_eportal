const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conecta com o Aiven
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) console.error("Erro ao conectar:", err);
  else console.log("Conectado ao banco Aiven MySQL!");
});


app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login_page.ejs");
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.get("/perfil", (req, res) => {
  res.render("perfil.ejs");
});

app.get("/projetos", (req, res) => {
  res.render("projetos.ejs");
});

// Verifica o login
app.post("/login", (req, res) => {
  console.log("POST /login body:", req.body);
  const { rm, senha } = req.body;

  if (!rm || !senha) {
    console.warn("Campos ausentes ou vazios:", req.body);
    return res.status(400).send("RM e senha são obrigatórios");
  }
//Consulta o SQL
  const query =
    "SELECT * FROM dados_pessoais WHERE (ID_Coordenadores = ? OR ID_Professores = ? OR ID_Alunos = ?) AND Senha = ?";
  connection.execute(query, [rm, rm, rm, senha], (err, results) => {
    if (err) {
      console.error("Erro na query:", err);
      return res.status(500).send("Erro no servidor");
    }

    console.log("Resultados da query:", results);
    if (results && results.length > 0) {
      return res.redirect("/home");

    } else {
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
        // já existe, só insere dados_pessoais
        insertDadosPessoais();
      } else {
        // insere na tabela Alunos antes (ajuste colunas se necessário)
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
