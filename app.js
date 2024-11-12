const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
let users = [];


app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

 // Registre d'usuari
app.post('/register', [
body('username').isAlphanumeric().trim(),
body('password').isLength({ min: 6 }).withMessage('La contrasenyaha de tenir almenys 6 caràcters')], 
async (req, res) => {const errors = validationResult(req);
if (!errors.isEmpty()) {
 return res.status(400).json({ errors: errors.array() });
}

const { username, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
users.push({ username, password: hashedPassword });
res.status(201).send('Usuari registrat amb èxit');});

 // Inici de sessió
app.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = users.find(u => u.username === username);

if (!user) {
return res.status(404).send('Usuari no trobat');
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(401).send('Contrasenya incorrecta');
}

const token = jwt.sign({ username: user.username }, 'SECRET_KEY', {
expiresIn: '1h' });
res.json({ token });
});

 // Recurs protegit
app.get('/protected', authenticateToken, (req, res) => {
res.send(`Benvingut, ${req.user.username}`);
});
// Middleware per a verificar el token
function authenticateToken(req, res, next) {
const token = req.headers['authorization'];
if (!token) return res.status(401).send('Es requereix autenticació'
);

jwt.verify(token, 'SECRET_KEY', (err, user) => {
 if (err) return res.status(403).send('Token invàlid');
req.user = user;
 next();
 });
 }

 module.exports = app;
