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
    database: 'notes',
});

connection.connect((error) => {
    if (error) {
        console.error('Database connection failed: ' + error.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(bodyParser.json());
app.use(cors());

// Get all notes
app.get('/notes', (req, res) => {
    connection.query('SELECT * FROM notes', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json(results);
    });
});

// Get single note by ID
app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    connection.query('SELECT * FROM notes WHERE id = ?', [noteId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(results[0]);
    });
});

// Create a new note
app.post('/notes', (req, res) => {
    const { title, description } = req.body;
    connection.query('INSERT INTO notes (title, description) VALUES (?, ?)', [title, description], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.status(201).json({ id: results.insertId, title, description });
    });
});

// Update an existing note
app.put('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { title, description } = req.body;
    connection.query('UPDATE notes SET title = ?, description = ? WHERE id = ?', [title, description, noteId], (error) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json({ id: noteId, title, description });
    });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    connection.query('DELETE FROM notes WHERE id = ?', [noteId], (error) => {
        if (error) {
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json({ id: noteId, message: 'Note deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
