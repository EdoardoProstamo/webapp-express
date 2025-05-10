function handleErrors(err, req, res, next) {

    res.status(500);

    res.json({
        errorStatus: 500,
        errorMessage: "Ops! Qualcosa è andato storto."
    });

};

module.exports = handleErrors;