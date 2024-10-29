import express from 'express';
const router = express.Router();

import pool from '../db.js';

router.use(express.json());

// Datenbankabfrage Helper
async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, params);
        return rows;
    } finally {
        if (conn) conn.release(); // Verbindung freigeben
    }
}

// Get Todos (READ)
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    try {
        const todos = await query("SELECT id, text, completed FROM todos WHERE user_id=?", [userId]);
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failure', error: error.message });
    }
});
// Create Todo (CREATE)
router.post('/', async (req, res) => {
    console.log('POST');
    const { userId, text } = req.body;
    try {
        await query("INSERT INTO todos (text, completed, user_id) VALUES (?, ?, ?)", [text, 0, userId]);
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failure', error: error.message });
    }
});
// Update Todo (UPDATE)
router.put('/', async (req, res) => {
    const { id } = req.body;
    try {
        await query("UPDATE todos SET completed = NOT completed WHERE id = ?", [id]);
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failure', error: error.message });
    }
});
// Delete Todo (DELETE)
router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        await query("DELETE FROM todos WHERE id = ?", [id]);
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failure', error: error.message });
    }
});
export default router;