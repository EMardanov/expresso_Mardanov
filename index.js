import express from 'express';
import bcrypt from 'bcryptjs';
import pool from './db.js';
import { createPool } from 'mariadb';

const app = express();

// EJS als View-Engine einrichten
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route mit dynamischem Inhalt
app.get('/', (req, res) => {
  res.render('index', { title: 'Startseite', message: 'Willkommen auf meiner Website!' });
});

// Weitere Routen
app.get('/about', (req, res) => {
  res.render('about', { title: 'Über uns' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Kontakt' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Registrierung', errorMessage: null, erfolgMessage: null });
});

app.post('/register', async (req, res) => {
  console.log(req.body);
  const { username, name, email, password, confirmPassword } = req.body; // Hier wird confirmPassword ausgelesen

  if (password !== confirmPassword) {
    return res.status(400).render('register', { title: 'Registrierung', errorMessage: 'Die Passwörter stimmen nicht überein.', erfolgMessage: null,     });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const conn = await pool.getConnection();

  try {

    const existingUserByUsername = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    const existingUserByEmail = await conn.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUserByUsername.length > 0) {
      return res.render('register', { title: 'Registrierung', errorMessage: 'Benutzername ist bereits vergeben.', erfolgMessage: null });
    }

    if (existingUserByEmail.length > 0) {
      return res.render('register', { title: 'Registrierung', errorMessage: 'E-Mail ist bereits vergeben.', erfolgMessage: null });
    }

    await conn.query('INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)', 
      [username, name, email, hashedPassword]);
    res.status(201).render('register', {title: 'Registrierung', errorMessage: null, erfolgMessage: 'Success!'});
  } catch (err) {
    console.log(err);
    res.status(500).render('register', { title: 'Registrierung', errorMessage: 'Fehler bei der Registrierung', erfolgMessage: null });
  } finally {
    conn.release();
  }
});

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
