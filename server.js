'use strict';

const { PORT } = require('./config')

// Load array of notes // local library
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE... // external library

const express = require('express');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

//Search filter logic 
app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (!searchTerm) return res.json(data);
  const filteredData = data.filter(function(item) {
    return (item.title.includes(searchTerm)); 
  })
  res.json(filteredData);
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});