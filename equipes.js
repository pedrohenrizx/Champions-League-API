const express = require('express');
const router = express.Router();

// Listar todas as equipes
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  db.all('SELECT * FROM equipes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obter detalhes de uma equipe por ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.get('SELECT * FROM equipes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Equipe não encontrada' });
    res.json(row);
  });
});

// Criar uma nova equipe
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { nome, pais, tecnico, escudo_url } = req.body;
  if (!nome || !pais) {
    return res.status(400).json({ error: 'Nome e país são obrigatórios' });
  }
  const sql = 'INSERT INTO equipes (nome, pais, tecnico, escudo_url) VALUES (?, ?, ?, ?)';
  db.run(sql, [nome, pais, tecnico || null, escudo_url || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar uma equipe existente
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { nome, pais, tecnico, escudo_url } = req.body;
  const sql = 'UPDATE equipes SET nome = ?, pais = ?, tecnico = ?, escudo_url = ? WHERE id = ?';
  db.run(sql, [nome, pais, tecnico, escudo_url, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Equipe não encontrada' });
    res.json({ success: true });
  });
});

// Remover uma equipe
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.run('DELETE FROM equipes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Equipe não encontrada' });
    res.json({ success: true });
  });
});

module.exports = router;