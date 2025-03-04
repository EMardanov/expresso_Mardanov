// import router from "./pages";
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
 
import pool from '../db.js';
import secrets from '../secrets.js';
 
const router = express.Router();

function isValidPassword(password){
    const regex = /^(?=.*[0-9])(?=.*[\W])/;
    if(password.length < 8) {
      return false;
    }
    if(!regex.test(password)) {
      return false;
    }
    return true;
  };

  router.get('/', (req, res) => {
    const token = req.cookies['token'];
    let loggedInUser = false;
    if (token) {
      // Token verifizieren und Benutzerdaten erhalten
      jwt.verify(token, secrets.jwt_secret_key, (err, user) => {
            if (err) {
                // Token ungültig
                console.log(err);
            } else {
                loggedInUser = user;
            }
      });
    }
    res.render('index',
        { title: 'Willkommen',
          message: 'Willkommen bei Ihrem ersten Express-Server!',
          user: loggedInUser
        }
    );
  });


router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, name, email, password, confirmPassword } = req.body; // Hier wird confirmPassword ausgelesen
  
    if (password !== confirmPassword) {
      return res.status(400).render('register', { title: 'Registrierung', errorMessage: 'Die Passwörter stimmen nicht überein.', erfolgMessage: null});
    }
  
    if(!isValidPassword(password)){
      return res.status(400).render('register', { title: 'Registrierung', errorMessage: 'Passwort muss mindestens 8 Zeichen, eine Zahl und ein Sonderzeichen enthalten.', erfolgMessage: null});
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
  
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const conn = await pool.getConnection();
    let user;
    try {
        user = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    } catch (err) {
        console.log(err);
        return res.status(500).render('login', { title: 'Login', error: 'Fehler beim Login'});
    } finally {
        conn.release();
    }
    if (user && user.length === 0) {
        return res.status(404).render('login', { title: 'Login', error: 'Benutzer nicht gefunden.' });
    }
    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
        return res.status(403).render('login', { title: 'Login', error: 'Falsches Passwort'});
    }
    const token = jwt.sign( {id: user[0].id, email: user[0].email} ,  secrets.jwt_secret_key, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).redirect('/');
});
  
router.post('/logout', (req, res) => {
res.clearCookie('token').redirect('/');
});

export default router;