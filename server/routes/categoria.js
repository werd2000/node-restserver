const express = require('express');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


// =========================================================
// Obtiene todas las categorías
// =========================================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        // puedo ordenar la lista por un campo específico
        .sort('descripcion')
        // busca un objectId y lo completa con los datos
        // puedo indicarle que campos del objeto quiero tener
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });

});

// =========================================================
// Obtiene una categoría
// =========================================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// =========================================================
// Crear nueva categoría
// =========================================================
app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =========================================================
// Actualizar una categoría
// =========================================================
app.put('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// =========================================================
// Eliminar una categoría
// Necesita el Token y ser Admin
// =========================================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            message: 'Categoría borrada'
        });
    });
});


module.exports = app;