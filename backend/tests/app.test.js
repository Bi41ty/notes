const express = require('express');
const supertest = require('supertest');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const testConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notes',
});

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// API Endpoints

// Get all notes
app.get('/notes', (req, res) => {
    testConnection.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Create a new note
app.post('/notes', (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO notes (title, description) VALUES (?, ?)';
    testConnection.query(query, [title, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: result.insertId, title, description });
    });
});

// Get a specific note by id
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    testConnection.query('SELECT * FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Update an existing note
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const query = 'UPDATE notes SET title = ?, description = ? WHERE id = ?';
    testConnection.query(query, [title, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, title, description });
    });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    testConnection.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    });
});

// Supertest setup for testing the API
const request = supertest('http://localhost:4000');

beforeAll((done) => {
    testConnection.connect();
    done();
});

afterAll((done) => {
    testConnection.end(done);
    done();
});

describe('Notes API Endpoints', () => {
    let testNoteId;

    test('GET /notes should respond with an array of notes', async () => {
        const response = await request.get('/notes');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });

    test('POST /notes should create a new note', async () => {
        const response = await request.post('/notes').send({
            title: 'Test Note',
            description: 'This is a test note',
        });

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(expect.any(Number));
        testNoteId = response.body.id;
    });

    test('GET /notes/:id should respond with a single note', async () => {
        const response = await request.get(`/notes/${testNoteId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testNoteId);
    });

    test('PUT /notes/:id should update an existing note', async () => {
        const response = await request.put(`/notes/${testNoteId}`).send({
            title: 'Updated Test Note',
            description: 'This is an updated test note',
        });

        expect(response.status).toBe(200);
    });

    test('DELETE /notes/:id should delete an existing note', async () => {
        const response = await request.delete(`/notes/${testNoteId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Note deleted successfully');
    });
});
