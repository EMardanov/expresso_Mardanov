import express from 'express';
const app = express();

// EJS als View-Engine einrichten
app.set('view engine', 'ejs');
 
// Route mit dynamischem Inhalt
app.get('/', (req, res) => {
  res.render('index', { title: 'Startseite', message: 'Willkommen auf meiner Website!' });
});

// Weitere Route
app.get('/about', (req, res) => {
    res.render('about', { title: 'Über uns'});
  });

app.get('/contact', (req, res) => {
    res.render('Kontaktiere mich doch...');
});

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});
