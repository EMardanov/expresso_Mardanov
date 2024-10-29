import express from 'express';
import { authenticateToken, authenticateUser } from '../middleware/auth.js';
const router = express.Router();

// Route mit dynamischem Inhalt
// router.get('/', (req, res) => {
//     res.render('index', { title: 'Startseite', message: 'Willkommen auf meiner Website!' });
//   });

// Weitere Routen
router.get('/about', (req, res) => {
    res.render('about', { title: 'Über uns' });
  });

router.get('/contact', (req, res) => {
res.render('contact', { title: 'Kontakt' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });
  
router.get('/register', (req, res) => {
res.render('register', { title: 'Registrierung', errorMessage: null, erfolgMessage: null });
});

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { title: 'Geschützer Bereich' });
  });

router.get('/', authenticateUser, (req, res) => {
res.render('index',
    { title: 'Willkommen',
        message: 'Willkommen bei Ihrem ersten Express-Server!'
    }
);
});

  export default router;