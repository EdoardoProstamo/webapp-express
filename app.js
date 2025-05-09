const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Ciao Edoardo');
});

app.listen(port, () => {
    console.log(`Server acceso sulla porta ${port}`);
});