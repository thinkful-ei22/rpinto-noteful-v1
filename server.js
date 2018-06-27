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

//create an express application
const app = express(); 
//log all requests
app.use(logger);
// create a static web server
app.use(express.static('public'));
// parse request body
app.use(express.json());


//Search filter logic 

app.get('/api/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

//Get notes by ID 
app.get('/api/notes/:id', (req, res) => {
  //const {items} = req.query;
  const id = req.params.id;
  console.log(req);
  notes.find(id, (err, item, next) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

//Error handler
app.use(function (req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res) {
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

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});