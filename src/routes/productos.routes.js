var express = require('express');
var router = express.Router();
const Productos = require('../controller/productos.controller')
const checkAutenticacion = require('../controller/service/jwtAuth');

// Listar Productos
router.get('/listar', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Productos.listar()
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Listar Productos por Categoria
router.get('/listar/categoria/:categoria', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { categoria } = req.params

    Productos.listarCategoria(categoria)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Listar Productos por Almacen
router.get('/listar/almacen/:almacen', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { almacen } = req.params

    Productos.listarAlmacen(almacen)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

/* Crear Productos. */
router.post('/agregar', function(req, res, next){
    let roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Productos.agregar(req.body)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Editar Producto
router.put('/editar/:id', function(req, res, next){
    let roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { id } = req.params

    Productos.editar(req.body, id)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Eliminar Producto
router.delete('/eliminar/:id', function(req, res, next){
    let roles = ["admin"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { id } = req.params

    Productos.eliminar(id)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;