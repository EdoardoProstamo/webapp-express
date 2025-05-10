const connection = require('../data/db');

function index(req, res) {

    res.send('Lista film');

};

function show(req, res) {

    res.send('Mostra film');

};

module.exports = { index, show };