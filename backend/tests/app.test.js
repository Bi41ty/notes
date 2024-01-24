const express = require('express');
const supertest = require('supertest');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const testConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test', 
});

const request = supertest('http://localhost:4000');

beforeAll((done) => {
 
  testConnection.connect();
  done();
});

afterAll((done) => {

  testConnection.end();
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
