const express = require('express');
const router = express.Router();
const controllerMovies = require('../controllers/controllerMovie');
const upload = require('../middlewares/multer');

// rotta index
router.get('/', controllerMovies.index);

// rotta show
router.get('/:slug', controllerMovies.show);

// rotta store (aggiunta nuovo film)
router.post('/', upload.single('image'), controllerMovies.storeMovie);

// rotta store (aggiunta nuova recensione)
router.post('/slug/:slug/reviews', controllerMovies.store);

module.exports = router;