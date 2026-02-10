const express = require('express');
const router = express.Router();

// Listar todas as classificações
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  db.all('SELECT * FROM classificacoes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obter detalhes de uma classificação por ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.get('SELECT * FROM classificacoes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Classificação não encontrada' });
    res.json(row);
  });
});

// Criar uma nova classificação
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { equipe_id, grupo, pontos, vitorias, empates, derrotas, gols_pro, gols_contra, saldo_gols } = req.body;
  if (!equipe_id || !grupo) {
    return res.status(400).json({ error: 'equipe_id e grupo são obrigatórios' });
  }
  const sql = `
    INSERT INTO classificacoes 
    (equipe_id, grupo, pontos, vitorias, empates, derrotas, gols_pro, gols_contra, saldo_gols) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [
    equipe_id, grupo, pontos || 0, vitorias || 0, empates || 0, derrotas || 0, gols_pro || 0, gols_contra || 0, saldo_gols || 0
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Atualizar uma classificação existente
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { equipe_id, grupo, pontos, vitorias, empates, derrotas, gols_pro, gols_contra, saldo_gols } = req.body;
  const sql = `
    UPDATE classificacoes 
    SET equipe_id = ?, grupo = ?, pontos = ?, vitorias = ?, empates = ?, derrotas = ?, gols_pro = ?, gols_contra = ?, saldo_gols = ? 
    WHERE id = ?
  `;
  db.run(sql, [
    equipe_id, grupo, pontos, vitorias, empates, derrotas, gols_pro, gols_contra, saldo_gols, req.params.id
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Classificação não encontrada' });
    res.json({ success: true });
  });
});

// Remover uma classificação
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.run('DELETE FROM classificacoes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Classificação não encontrada' });
    res.json({ success: true });
  });
});

module.exports = router;