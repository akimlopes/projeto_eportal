const express = require("express");
const mysql = require("mysql2");
const app = express();
const handlebars = require("ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conecta com o Aiven
const connection = mysql.createConnection({
  host: "mysql-eportal210-eportal1.i.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_24p5adYt_SWGT3dF4I2",
  database: "Eportaldb",
  port: 27813,
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

app.post("/signup", (req, res) => {
  res.send("Formulário foi recebido");
});

// Verifica o login
app.post("/login", (req, res) => {
  console.log("POST /login body:", req.body);
  const { rm, senha } = req.body;

  if (!rm || !senha) {
    console.warn("Campos ausentes ou vazios:", req.body);
    return res.status(400).send("RM e senha são obrigatórios");
  }

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
      return res.send("RM ou senha incorretos");
    }
  });
});

// Inicia o servidor
app.listen(8080, () => {
  console.log("Server está rodando na porta 8080");
});
