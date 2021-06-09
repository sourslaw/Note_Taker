const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const notesData = require('../db/db.json')

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('assets'));


// fs module used to read in data from the db.json file
// https://stackabuse.com/reading-and-writing-json-files-with-node-js
// const dbIn = fs.readFileSync('../db/db.json');
// const db = JSON.parse(dbIn);
// console.log(db);
// notesdb.push(db)


// routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

// displays all notes in the database
app.get('/api/notes', (req, res) => res.json(notesData));


app.post('/api/notes', (req, res) => {
	
	const note = req.body;

	note.id = note.title.replace(/\s+/g, '').toLowerCase();

	console.log(`this is the note: ${note}`);

	notesData.push(note);

	fs.writeFileSync('../db/db.json', JSON.stringify(notesData));

	res.json(note);

	// console.log(req.body.id);

});

app.get(`/api/notes/:note`, (req, res) => {
	const chosen = req.params.note;

	console.log(chosen)

	for (let i = 0; i < notesData.length; i++) {
		if (chosen === notesData[i].id) {
		  return res.json(notesData[i]);
		}
	  }
	
	return res.json(false);

});


app.delete('/api/notes/:id', (req, res) => {
	res.send("delete requested")


});


// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
