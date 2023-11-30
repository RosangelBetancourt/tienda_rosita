var express = require('express');
var router = express.Router();
const Proveedor = require('../controller/proveedores.controller')
const checkAutenticacion = require('../controller/service/jwtAuth');

// Listar Proveedores
router.get('/listar', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Proveedor.listar()
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Listar Proveedores por Sede
router.get('/listar/sede/:sede', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { sede } = req.params

    Proveedor.listarSede(sede)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

/* Crear Proveedores. */
router.post('/agregar', function(req, res, next){
    roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Proveedor.agregar(req.body)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Eliminar Proveedores
router.delete('/eliminar/:id', function(req, res, next){
    roles = ["admin"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { id } = req.params

    Proveedor.eliminar(id)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;