import express from 'express';
import cookieParser from 'cookie-parser';

import pagesRouter from './routes/pages.js';
import usersRouter from './routes/users.js';
import todosRouter from './routes/todo-api.js';

const app = express();

// EJS als View-Engine einrichten
app.set('view engine', 'ejs');

// Route für View-Engine einrichten
app.use(express.static('public'));

//Middleware, um URL-encoded.Daten zu verarbeiten
app.use(express.urlencoded({ extended: true }));

// Cookie-Parser-Middleware verwenden
app.use(cookieParser());

//Routen einbinden
app.use('/', pagesRouter);
app.use('/', usersRouter);
app.use('/todo-api', todosRouter);

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
