const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'Jsbuuijlsj46772',
    database: 'movies'

});

connection.connect((err) => {

    if (err) throw err;
    console.log('Database connesso');

});

module.exports = connection;