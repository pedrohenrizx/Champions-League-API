const express = require('express');
const router = express.Router();

// Listar todos os jogadores
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  db.all('SELECT * FROM jogadores', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obter detalhes de um jogador por ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.get('SELECT * FROM jogadores WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json(row);
  });
});

// Criar um novo jogador
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { nome, idade, posicao, equipe_id, numero, nacionalidade } = req.body;
  if (!nome || !equipe_id) {
    return res.status(400).json({ error: 'Nome e equipe_id são obrigatórios' });
  }
  const sql = 'INSERT INTO jogadores (nome, idade, posicao, equipe_id, numero, nacionalidade) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [nome, idade || null, posicao || null, equipe_id, numero || null, nacionalidade || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar um jogador existente
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { nome, idade, posicao, equipe_id, numero, nacionalidade } = req.body;
  const sql = 'UPDATE jogadores SET nome = ?, idade = ?, posicao = ?, equipe_id = ?, numero = ?, nacionalidade = ? WHERE id = ?';
  db.run(sql, [nome, idade, posicao, equipe_id, numero, nacionalidade, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json({ success: true });
  });
});

// Remover um jogador
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.run('DELETE FROM jogadores WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json({ success: true });
  });
});

module.exports = router;