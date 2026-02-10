module.exports = function initDb(db) {
  // Tabela de equipes
  db.run(`
    CREATE TABLE IF NOT EXISTS equipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      pais TEXT NOT NULL,
      tecnico TEXT,
      escudo_url TEXT
    )
  `);

  // Tabela de jogadores
  db.run(`
    CREATE TABLE IF NOT EXISTS jogadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER,
      posicao TEXT,
      equipe_id INTEGER,
      numero INTEGER,
      nacionalidade TEXT,
      FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL
    )
  `);

  // Tabela de partidas
  db.run(`
    CREATE TABLE IF NOT EXISTS partidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_casa_id INTEGER NOT NULL,
      equipe_fora_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      estadio TEXT,
      gols_casa INTEGER,
      gols_fora INTEGER,
      fase TEXT,
      FOREIGN KEY (equipe_casa_id) REFERENCES equipes(id),
      FOREIGN KEY (equipe_fora_id) REFERENCES equipes(id)
    )
  `);

  // Tabela de classificacoes
  db.run(`
    CREATE TABLE IF NOT EXISTS classificacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER NOT NULL,
      grupo TEXT NOT NULL,
      pontos INTEGER DEFAULT 0,
      vitorias INTEGER DEFAULT 0,
      empates INTEGER DEFAULT 0,
      derrotas INTEGER DEFAULT 0,
      gols_pro INTEGER DEFAULT 0,
      gols_contra INTEGER DEFAULT 0,
      saldo_gols INTEGER DEFAULT 0,
      FOREIGN KEY (equipe_id) REFERENCES equipes(id)
    )
  `);
};