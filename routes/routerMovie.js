const express = require('express');
const router = express.Router();
const controllerMovies = require('../controllers/controllerMovie');

// rotta index
router.get('/', controllerMovies.index);

// rotta show
router.get('/:id', controllerMovies.show);

module.exports = router;