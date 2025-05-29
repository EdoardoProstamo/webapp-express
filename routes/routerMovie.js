const express = require('express');
const router = express.Router();
const controllerMovies = require('../controllers/controllerMovie');

// rotta index
router.get('/', controllerMovies.index);

// rotta show
router.get('/:id', controllerMovies.show);

// rotta store (aggiunta nuova recensione)
router.post('/:id/reviews', controllerMovies.store);

module.exports = router;