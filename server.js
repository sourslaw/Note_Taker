const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const notesData = require('./develop/db/db.json');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('./develop/public/assets'));


// R O U T E S
// route to home
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './develop/public/index.html')));
// route to notetaking page (notes.html)
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './develop/public/notes.html')));

// route to all notes in the database
app.get('/api/notes', (req, res) => res.json(notesData));

// route to create note
app.post('/api/notes', (req, res) => {
	
	const note = req.body;

	note.id = note.title.replace(/\s+/g, '').toLowerCase();
	notesData.push(note);

	fs.writeFileSync('./develop/db/db.json', JSON.stringify(notesData));

	res.json(note);

});

app.put(`/api/notes/:note`, (req, res) => {

	const chosen = req.params.note;

	for (let i = 0; i < notesData.length; i++) {
		if (chosen === notesData[i].id) {
			return res.json(notesData[i]);
		};
	};

	return res.json(false);

});

// route for delete
app.delete('/api/notes/:id', (req, res) => {
	res.send("delete requested");

	const chosen = req.params.id;
	// retrives the index of the chosen note
	let deleteThis = notesData.findIndex(function (note) {
		return note.id === chosen;
	});
	// splices chosen out of notesData
	let newData = notesData.splice(`${deleteThis}`, 1);
	// writes updated notesData to the "database"
	fs.writeFileSync('./develop/db/db.json', JSON.stringify(notesData));

});

// if no matching route is found, default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './develop/public/index.html')));


// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
