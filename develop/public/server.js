const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('assets'));



// fs module used to read in data from the db.json file
// https://stackabuse.com/reading-and-writing-json-files-with-node-js
const dbIn = fs.readFileSync('../db/db.json');
const db = JSON.parse(dbIn);
console.log(db);

// routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

// displays all notes in the database
app.get('/api/notes', (req, res) => res.json(db));









// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
