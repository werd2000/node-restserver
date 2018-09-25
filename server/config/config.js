// =====================================
//  Puerto
// =====================================
process.env.PORT = process.env.PORT || 3000;

// =====================================
//  Entorno
// =====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =====================================
//  Vencimiento del token
// =====================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =====================================
//  SEED de autenticación
// =====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =====================================
//  Base de datos
// =====================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
    // urlDB = 'mongodb://cafe-user:werd2000@ds211083.mlab.com:11083/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// =====================================
//  Google CLiente Id
// =====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '135482901526-fs02vhfi5pl8dark0inbiuud620f3rc5.apps.googleusercontent.com';