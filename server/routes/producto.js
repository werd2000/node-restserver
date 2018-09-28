const express = require('express');

const Producto = require('../models/producto');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


// =========================================================
// Obtiene todos los productos paginados
// =========================================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        // puedo ordenar la lista por un campo específico
        .sort('nombre')
        // busca un objectId y lo completa con los datos
        // puedo indicarle que campos del objeto quiero tener
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos,
                total: productos.length
            });
        });

});

// =========================================================
// Obtiene un producto
// =========================================================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });
});

// =========================================================
// Buscar producto
// =========================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productos
            })
        });
});



// =========================================================
// Crear nuevo producto
// =========================================================
app.post('/producto', verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// =========================================================
// Actualizar un producto
// =========================================================
app.put('/producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let actProducto = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        disponible: body.disponible,
        precioUni: body.precioUni
    };

    Producto.findByIdAndUpdate(id, actProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });

    });
});

// =========================================================
// Eliminar un producto
// Necesita el Token y ser Admin
// =========================================================
app.delete('/producto/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoEliminado,
                message: 'Producto borrado'
            });
        });

    });
});


module.exports = app;