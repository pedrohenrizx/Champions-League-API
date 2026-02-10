const express = require('express');
const router = express.Router();

// Listar todas as partidas
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  db.all('SELECT * FROM partidas', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obter detalhes de uma partida por ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.get('SELECT * FROM partidas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json(row);
  });
});

// Criar uma nova partida
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { equipe_casa_id, equipe_fora_id, data, estadio, gols_casa, gols_fora, fase } = req.body;
  if (!equipe_casa_id || !equipe_fora_id || !data) {
    return res.status(400).json({ error: 'equipe_casa_id, equipe_fora_id e data são obrigatórios' });
  }
  const sql = 'INSERT INTO partidas (equipe_casa_id, equipe_fora_id, data, estadio, gols_casa, gols_fora, fase) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [
    equipe_casa_id, equipe_fora_id, data, estadio || null, gols_casa || null, gols_fora || null, fase || null
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar uma partida existente
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { equipe_casa_id, equipe_fora_id, data, estadio, gols_casa, gols_fora, fase } = req.body;
  const sql = 'UPDATE partidas SET equipe_casa_id = ?, equipe_fora_id = ?, data = ?, estadio = ?, gols_casa = ?, gols_fora = ?, fase = ? WHERE id = ?';
  db.run(sql, [
    equipe_casa_id, equipe_fora_id, data, estadio, gols_casa, gols_fora, fase, req.params.id
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json({ success: true });
  });
});

// Remover uma partida
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.run('DELETE FROM partidas WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Partida não encontrada' });
    res.json({ success: true });
  });
});

module.exports = router;