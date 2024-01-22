const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;


const connection = mysql.createConnection({
     host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});


app.use(bodyParser.json());
app.use(cors());

app.get('/notes', (req, res) => {
  connection.query('SELECT * FROM notes', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  connection.query('SELECT * FROM notes WHERE id = ?', [noteId], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});


app.post('/notes', (req, res) => {
  const { title, description } = req.body;
  connection.query('INSERT INTO notes (title, description) VALUES (?, ?)', [title, description], (error, results) => {
    if (error) throw error;
    res.json({ id: results.insertId, title, description });
  });
});

app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, description } = req.body;
  connection.query('UPDATE notes SET title = ?, description = ? WHERE id = ?', [title, description, noteId], (error) => {
    if (error) throw error;
    res.json({ id: noteId, title, description });
  });
});


app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  connection.query('DELETE FROM notes WHERE id = ?', [noteId], (error) => {
    if (error) throw error;
    res.json({ id: noteId, message: 'Note deleted successfully' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
