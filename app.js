const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Criar diretórios necessários
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Diretório criado:', dataDir);
}

// SQLite robusto
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro SQLite:', err.message);
    process.exit(1);
  }
  console.log('SQLite conectado:', dbPath);
});

// Importa a função de inicialização do banco de dados
const initDb = require('./models/initDb');

// Após a criação da conexão do db, inicialize as tabelas
initDb(db);

// Expor o banco de dados para uso nos módulos
app.locals.db = db;

// Novo conteúdo: importar o router de equipes
const equipesRouter = require('./routes/equipes');

// Registrar o router de equipes
app.use('/equipes', equipesRouter);

// Novo conteúdo: importar o router de jogadores
const jogadoresRouter = require('./routes/jogadores');

// Registrar o router de jogadores
app.use('/jogadores', jogadoresRouter);

// Novo conteúdo: importar o router de partidas
const partidasRouter = require('./routes/partidas');

// Registrar o router de partidas
app.use('/partidas', partidasRouter);

// Novo conteúdo: importar o router de classificações
const classificacoesRouter = require('./routes/classificacoes');

// Registrar o router de classificações
app.use('/classificacoes', classificacoesRouter);

// Placeholder para rotas principais (a serem implementadas)
app.get('/', (req, res) => {
  res.json({ message: "API Champions League rodando com sucesso." });
});

// Error handler genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

module.exports = app;