'use strict';

const express = require('express');
const morgan = require('morgan');

const notesRouter = require('./router/notes.router')
const app = express();


const { PORT } = require('./config');
const logger = require("./middleware/logger");


//log all requests
app.use(logger);
// create a static web server
app.use(express.static('public'));
// parse request body
app.use(express.json());
app.use('/api', notesRouter);


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});