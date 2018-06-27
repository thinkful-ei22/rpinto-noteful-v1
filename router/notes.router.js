

const express = require('express');
const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  res.json(Notes.get());
});

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

console.log('Hello Noteful!');

//Moved endpoints from server.js
router.get('/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

//Get notes by ID 
router.get('/notes/:id', (req, res) => {
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

// Post (insert) an item
router.post('/notes', (req, res, next) => {
 
  const { title, content } = req.body;
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

//PUT
router.put('/notes/:id', (req, res, next) => {
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
router.use(function (req, res) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

router.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = router;