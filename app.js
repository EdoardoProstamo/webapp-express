const express = require('express');
const app = express();
const port = 3001;
// middlewares
const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');

app.get('/', (req, res) => {
    res.send('Ciao Edoardo');
});

// ERRORS:
// 404
app.use(notFound);
// 500
app.use(handleErrors);

// Port
app.listen(port, () => {
    console.log(`Server acceso sulla porta ${port}`);
});