const connection = require('../data/db');

function index(req, res) {

    const sql = `
    SELECT movies.*, AVG(reviews.vote) AS media_voto_recensioni 
    FROM movies.movies 
    LEFT JOIN movies.reviews 
    ON movie_id = reviews.movie_id 
    GROUP BY movies.id
    ;`;

    connection.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                errorMessage: "Errore di connessione al Database."
            })
        };

        res.json(results);

    });

};

function show(req, res) {

    const sql = `SELECT * FROM movies.movies WHERE id = ?;`;

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

        const moviesList = res.json(results[0]);

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

module.exports = { index, show };