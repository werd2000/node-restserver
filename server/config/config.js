// =====================================
//  Puerto
// =====================================
process.env.PORT = process.env.PORT || 3000;

// =====================================
//  Entorno
// =====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================================
//  Base de datos
// =====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
    // urlDB = 'mongodb://cafe-user:werd2000@ds211083.mlab.com:11083/cafe';
} else {
    urlDB = 'mongodb://cafe-user:werd2000@ds211083.mlab.com:11083/cafe';
}
process.env.URLDB = urlDB;