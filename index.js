const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
const db = new sqlite3.Database('./users.db');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Registration Route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) return res.status(400).send('User already exists');
    res.send('Registration successful!');
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.status(400).send('Invalid credentials');
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).send('Invalid credentials');
    res.send('Login successful!');
  });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
