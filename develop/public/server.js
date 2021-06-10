const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const notesData = require('../db/db.json');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('assets'));



// R O U T E S
// route to home
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
// route to notetaking page (notes.html)
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

// route to all notes in the database
app.get('/api/notes', (req, res) => res.json(notesData));

// route to create note
app.post('/api/notes', (req, res) => {
	
	const note = req.body;

	note.id = note.title.replace(/\s+/g, '').toLowerCase();
	notesData.push(note);

	fs.writeFileSync('../db/db.json', JSON.stringify(notesData));

	res.json(note);

});

// route for individual notes
// app.get(`/api/notes/:note`, (req, res) => {

// 	const chosen = req.params.note;

// 	for (let i = 0; i < notesData.length; i++) {
// 		if (chosen === notesData[i].id) {
// 			return res.json(notesData[i]);
// 		};
// 	};

// 	return res.json(false);

// });

app.put(`/api/notes/:note`, (req, res) => {

	const chosen = req.params.note;

	for (let i = 0; i < notesData.length; i++) {
		if (chosen === notesData[i].id) {
			return res.json(notesData[i]);
		};
	};

	return res.json(false);

	console.log('from inside the PUT');

});

// route for delete
app.delete('/api/notes/:id', (req, res) => {
	res.send("delete requested");

	console.log('delete requested form inside the route');


	const chosen = req.params.id;

	console.log(chosen);
	console.log(notesData)

	// retrives the index of the chosen note
	let deleteThis = notesData.findIndex(function (note) {
		return note.id === chosen;
	});

	console.log(deleteThis);

	// splices chosen out of notesData
	let newData = notesData.splice(`${deleteThis}`, 1);

	console.log(newData)
	console.log(notesData)

	// writes updated notesData to the "database"
	fs.writeFileSync('../db/db.json', JSON.stringify(notesData));

});

// if no matching route is found, default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));



// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
