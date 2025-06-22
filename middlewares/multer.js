// multer è un middleware che serve a gestire un invio di dati ad un server come multipart/form-data; viene utilizzato principalmente per l'upload di files.
const multer = require('multer');

// questa parte si può copiare ed incollare dalla pagina del pacchetto npm multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img') //questo è il percorso dove l'utente dovrà salvare i files(in questo caso, le immagini)
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)


        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage });

module.exports = upload;




// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// cb(null, file.fieldname + '-' + uniqueSuffix)

// questa parte del codice serve a non avere files(in questo caso, immagini) duplicati, cioè con lo stesso nome: se carico due volte l'immagine 1984.jpg, verrà inserito il nome ('file.fieldname') + uno spazio ('-') + un numero unico (uniqueSuffix), derivato dalla somma dei numeri scaturiti dalla funzione ('Date.now() + '-' + Math.round(Math.random() * 1E9)')