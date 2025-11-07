const connection = require('../data/db');
const slugify = require('slugify');

// LISTA FILM
function index(req, res) {
    const { ricerca } = req.query;

    let sql = `
    SELECT m.*, IFNULL(rv.media_voto, 0) AS media_voto_recensioni
    FROM movies.movies m
    LEFT JOIN (
        SELECT movie_id, ROUND(AVG(vote), 2) AS media_voto
        FROM movies.reviews
        GROUP BY movie_id
    ) rv ON m.id = rv.movie_id
    `;

    const params = [];
    if (ricerca) {
        sql += ` WHERE title LIKE ? OR director LIKE ? OR abstract LIKE ? OR release_year LIKE ? OR genre LIKE ?`;
        params.push(`%${ricerca}%`, `%${ricerca}%`, `%${ricerca}%`, `%${ricerca}%`, `%${ricerca}%`);
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ errorMessage: "Errore di connessione al Database." });
        }

        res.json(results.map(result => ({
            ...result,
            imagePath: process.env.IMG + result.image
        })));
    });
}

// SINGOLO FILM
function show(req, res) {
    const { slug } = req.params;

    const sql = `
    SELECT m.*, IFNULL(rv.media_voto, 0) AS media_voto_recensioni
    FROM movies.movies m
    LEFT JOIN (
        SELECT movie_id, ROUND(AVG(vote), 2) AS media_voto
        FROM movies.reviews
        GROUP BY movie_id
    ) rv ON m.id = rv.movie_id
    WHERE m.slug = ?
    `;

    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: "Errore di connessione al Database." });
        if (!results.length) return res.status(404).json({ errorMessage: "Film non trovato" });

        const movie = {
            ...results[0],
            imagePath: process.env.IMG + results[0].image
        };

        // Recupero recensioni
        const sqlReviews = "SELECT * FROM movies.reviews WHERE movie_id = ?";
        connection.query(sqlReviews, [movie.id], (err, reviews) => {
            if (err) return res.status(500).json({ errorMessage: "Errore di connessione al Database." });

            movie.reviews = reviews;
            res.json(movie);
        });
    });
}

// CREAZIONE RECENSIONE
function store(req, res) {
    const { slug } = req.params;
    const { name, vote, text } = req.body;

    const sqlMovie = "SELECT id FROM movies.movies WHERE slug = ?";
    connection.query(sqlMovie, [slug], (err, results) => {
        if (err) return res.status(500).json({ errorMessage: "Errore di connessione al Database." });
        if (!results.length) return res.status(404).json({ errorMessage: "Film non trovato" });

        const movieId = results[0].id;
        const sqlReview = "INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)";
        connection.query(sqlReview, [movieId, name, vote, text], (err) => {
            if (err) return res.status(500).json({ errorMessage: "Errore di connessione al Database." });

            res.json({
                message: "Recensione aggiunta",
                movieId,
                name,
                vote,
                text
            });
        });
    });
}

// CREAZIONE NUOVO FILM
function storeMovie(req, res) {
    const { title, director, genre, release_year, abstract } = req.body;
    const imageName = req.file.filename;
    const slug = slugify(title);

    const sql = `INSERT INTO movies.movies (title, director, genre, release_year, abstract, image, slug) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [title, director, genre, release_year, abstract, imageName, slug], (err) => {
        if (err) return res.status(500).json({ errorMessage: "Errore di connessione al Database." });

        res.json({ message: 'Nuovo film aggiunto' });
    });
}

module.exports = { index, show, store, storeMovie };