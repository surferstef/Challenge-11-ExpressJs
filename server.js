const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
  // parse incoming string or array data
  app.use(express.urlencoded({ extended: true }));
  // parse incoming JSON data
  app.use(express.json());
  app.use(express.static('public'));

const { dbNotes } = require('./db/db.json');

// get results from db json file
app.get('/api/notes', (req, res) => {
  let results = dbNotes;
  res.json(results);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// get notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Create route to get index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Validate notes function to make sure data from req.body exists and is the right type of data
function validateNotes(dbNotes) {
  if (!dbNotes || !Array.isArray(dbNotes)) {
    return false;
  }
}


function createNewNote(body, notesArray) {
  const addNote = body;
  
  if (!Array.isArray(notesArray))
  notesArray = [];

if (notesArray.length === 0)
  notesArray.push(0);

  notesArray.push(addNote);

  fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ dbNotes: notesArray }, null, 2)
  );
  return addNote;

} 
app.post('/api/notes', (req, res) => {
// set id based on what the next index of the array will be
req.body.id = dbNotes.length.toString();

// add note to json file and notes array in this function
if (validateNotes(req.body)) {
    res.status(400).send('The notes are not properly formatted.');
}
else {
  const addNote = createNewNote(req.body, dbNotes);
  res.json(addNote);
}
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});