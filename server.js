'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

//Search filter logic
app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (!searchTerm) return res.json(data);
  const filteredData = data.filter(function(item) {
    if (item.title.includes(searchTerm)) {
      return true;
    } 
    else {
      return false;
    }
  })
  res.json(filteredData);
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(id)));
});


app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});