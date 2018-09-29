const jwt = require('jsonwebtoken');

// =====================================
//  Verificar token
// =====================================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


// =====================================
//  Verifica Admin Role
// =====================================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log(req.body);

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tiene permisos de Administrador'
            }
        });
    }

    next();
};

// =====================================
//  Verificar token por URL
// =====================================
let verificaTokenUrl = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenUrl
};