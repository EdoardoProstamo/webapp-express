const express = require('express');
const app = express();
const port = process.env.PORT;
// middlewares
const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');
const cors = require('cors');
// router
const routerMovies = require('./routes/routerMovie');

app.use(cors({
    origin: process.env.FE
}));

// middleware per il parsing del body (serve a restituire il contenuto in formato json)
app.use(express.json());

// asset statici
app.use(express.static('public'));

// Homepage
app.get('/', (req, res) => {
    res.send('Ciao Edoardo');
});

// single movie page
app.use('/movies', routerMovies);

// ERRORS:
// 404
app.use(notFound);
// 500
app.use(handleErrors);

// Port
app.listen(port, () => {
    console.log(`Server acceso sulla porta ${port}`);
});