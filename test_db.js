
import pool from './db.js';
import { createServer }  from 'http';

async function getTodos(res) {
    let conn;
    try  {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM todos");
        console.log('row data: ', rows);
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Fehler beim Lesen der Daten.');
    } finally {
        if (conn !== undefined) {
            console.log("release connection");
            conn.release();
        }
    }
}

const server = createServer((req, res) => {
    getTodos(res);
});

server.listen(3003, '0.0.0.0', () => {
  console.log('Server running at http://localhost:3000/');
});

// let conn;
// try {
//     conn = await pool.getConnection();
//     const rows = await conn.query('SELECT * FROM todos');
//     console.log(rows);
// } catch (err) {
//     console.log(err);
// } finally {
//     if (conn !== undefined) {
//         console.log("release connection");
//         conn.release();
//     }
// }
