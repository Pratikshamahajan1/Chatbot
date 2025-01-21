const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;  // Backend server port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL username
  password: 'Pratiksha@403', // MySQL password
  database: 'chat_app',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Route to retrieve messages
app.get('/messages', (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY timestamp ASC';
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// Route to send a message
app.post('/send-message', (req, res) => {
  const { sender, message } = req.body;
  //console.log('Received message:', sender, message); // Debugging line
  const query = 'INSERT INTO messages (sender, message) VALUES (?, ?)';

  db.query(query, [sender, message], (err, result) => {
    if (err) {
      //  console.error('Error inserting message:', err);  // Debugging line
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, sender, message });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
