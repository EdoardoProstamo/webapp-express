const connection = require('../data/db');

function index(req, res) {

    const { ricerca } = req.query;

    // richiesta, con unione delle tabelle che ci servono (tramite JOIN), solo di determinati campi all'interno del DB
    let sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 0) AS media_voto_recensioni 
    FROM movies.movies 
    LEFT JOIN movies.reviews 
    ON movie_id = reviews.movie_id `;

    if (ricerca) {

        sql += `WHERE title LIKE "%${ricerca}%" OR director LIKE "%${ricerca}%" OR abstract LIKE "%${ricerca}%" OR release_year LIKE "%${ricerca}%" OR genre LIKE "%${ricerca}%"`
    }

    sql += 'GROUP BY movies.id'

    // connessione al DB per ricevere le informazioni dei film
    connection.query(sql, (err, results) => {


        if (err) {
            return res.status(500).json({
                errorMessage: "Errore di connessione al Database."
            })
        };

        res.json(results.map(result => ({
            ...result,
            imagePath: process.env.IMG + result.image
        })));

    });

};

function show(req, res) {
    // dettaglio single movie in show
    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 0) AS media_voto_recensioni 
    FROM movies.movies 
    LEFT JOIN movies.reviews 
    ON movie_id = reviews.movie_id 
    WHERE movies.id=?`;

    const { id } = req.params;

    connection.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                errorMessage: "Errore di connessione al Database."
            });
        };

        if (err) {
            return res.status(404).json({
                errorMessage: "Elemento non trovato. Error 404!"
            });
        };

        const moviesList = {
            ...results[0],
            imagePath: process.env.IMG + results[0].image
        };

        // recensioni in show
        const sql = "SELECT * FROM movies.reviews WHERE movie_id=?;";

        connection.query(sql, [id], (err, results) => {

            if (err) {
                return res.status(500).json({
                    errorMessage: "Errore di connessione al Database."
                });
            };
            if (err) {
                return res.status(404).json({
                    errorMessage: "Elemento non trovato. Error 404!"
                });
            };

            moviesList.reviews = results;
            res.json(moviesList);
        });
    });

};

function store(req, res) {

    // id del film del quale viene creata la nuova recensione
    const { id } = req.params;

    // valori della nuova recensione che voglio siano utilizzati
    const { name, vote, text } = req.body;

    // comando utilizzato nel database (richiesta inserimento nuovi elementi, in questo caso)
    const sql = `INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?);`

    // connessione: eventuali errori e risposta alla richiesta
    connection.query(sql, [id, name, vote, text], (err, results) => {
        if (err) {
            return res.status(500).json({
                errorMessage: "Errore di connessione al Database."
            });
        };

        if (err) {
            return res.status(404).json({
                errorMessage: "Elemento non trovato. Error 404!"
            });
        };


    });

    res.send(`Aggiunta nuova recensione per il film ${id}`)

};

module.exports = { index, show, store };