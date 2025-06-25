const connection = require('../data/db');
const slugify = require('slugify');

// lista film
function index(req, res) {

    const { ricerca } = req.query;

    // richiesta, con unione delle tabelle che ci servono (tramite JOIN), solo di determinati campi all'interno del DB
    let sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS media_voto_recensioni 
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

// singolo film
function show(req, res) {
    // dettaglio single movie in show
    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS media_voto_recensioni 
    FROM movies.movies 
    LEFT JOIN movies.reviews 
    ON movie_id = reviews.movie_id 
    WHERE movies.slug=?`;

    const { slug } = req.params;

    connection.query(sql, [slug], (err, results) => {

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

        const risultatoCorrente = results[0];

        const moviesList = {
            ...results[0],
            imagePath: process.env.IMG + results[0].image
        };

        // recensioni in show
        const sql = "SELECT * FROM movies.reviews WHERE movie_id=?;";

        connection.query(sql, [risultatoCorrente.id], (err, results) => {

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

// recensioni
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

    res.json({
        id,
        name,
        vote,
        text
    });

};

// nuovo film
function storeMovie(req, res) {

    // valori del nuovo film che voglio siano utilizzati
    const { title, director, genre, release_year, abstract } = req.body;

    const imageName = req.file.filename;

    // comando utilizzato nel database (richiesta inserimento nuovi elementi, in questo caso)
    const sql = `INSERT INTO movies.movies (title, director, genre, release_year, abstract, image, slug) VALUES (?, ?, ?, ?, ?, ?, ?);`

    // slug
    const slug = slugify(title);

    // connessione: eventuali errori e risposta alla richiesta
    connection.query(sql, [title, director, genre, release_year, abstract, imageName, slug], (err, results) => {
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

        res.json({ message: 'Nuovo film aggiunto' });
    });

};

module.exports = { index, show, store, storeMovie };