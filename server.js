'use strict';

const express = require('express');
const morgan = require('morgan');

const notesRouter = require('./router/notes.router')
const app = express();


const { PORT } = require('./config');


//log all requests
app.use(morgan('dev'));
// create a static web server
app.use(express.static('public'));
// parse request body
app.use(express.json());
app.use('/api', notesRouter);

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


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

