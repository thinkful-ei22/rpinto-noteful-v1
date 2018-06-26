'use strict';

const { PORT } = require('./config');
const logger = require("./middleware/logger");

// Load array of notes // local library
const data = require('./db/notes');
// Simple In-Memory Database
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE... // external library

const express = require('express');

const app = express(); 
app.use(logger);

// ADD STATIC SERVER HERE
app.use(express.static('public'));

//Error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// Temporary "boom" error for testing
// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });


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