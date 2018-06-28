

const express = require('express');
const router = express.Router();


// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  res.json(Notes.get());
});

const data = require('../db/notes');
const simDB = require('../db/simDB-promisified');
const notes = simDB.initialize(data);

console.log('Hello Noteful!');

//Moved endpoints from server.js
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then((list) => {
      return res.json(list);
    }).catch((err) => {
      return next(err);
    });
});


//Get notes by ID 
router.get('/notes/:id', (req, res) => {

  const id = req.params.id;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err)
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

  notes.create(newItem)
  .catch(err => {
    next(err)
  })
  .then(item => {
    if (res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item)){
  } else {
    next();
  };
  });
});
 
//PUT
router.put('/notes/:noteId', (req, res, next) => {
  const id = req.params.noteId;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  notes.update(id, updateObj)
  .catch(err => {
    next(err); //go to error handler 500
  })
  .then(item => {
    if (item) {
    res.json(item);
  } else {}
    next(); //go to 404
  });
  
});

router.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  
  notes.delete(id, (err) => {
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
});

module.exports = router;
