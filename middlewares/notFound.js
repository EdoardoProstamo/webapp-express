function notFound(req, res, next) {

    res.status(404);

    res.json({
        errorStatus: 404,
        errorMessage: "Not found"
    });

};

module.exports = notFound;