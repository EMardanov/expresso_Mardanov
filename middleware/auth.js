import jwt from 'jsonwebtoken';
import secrets from '../secrets.js';


export const authenticateToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        // TODO: set flash message
        return res.status(401).redirect('/login');
    }
  
    try {
        res.locals.user = jwt.verify(token, secrets.jwt_secret_key);
    } catch(err) {
        // TODO: set flash message
        return res.status(403).redirect('/login');
    };
    next();
  }

export const authenticateUser = (req, res, next) => {
    const token = req.cookies['token'];
  
    // Kein Token vorhanden.
    if (!token) {
        res.locals.error = "Bitte loggen Sie sich ein.";
        next();
    }
  
    // Token verifizieren.
    try {
        res.locals.user = jwt.verify(token, secrets.jwt_secret_key);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
          res.locals.error = 'Bitte loggen Sie sich erneut ein.'
        } else {
            res.locals.error = 'Ein unbekannter Fehler ist aufgetreten.'
        }
    }
    next();
  }