var express = require('express');
var router = express.Router();
const Almacen = require('../controller/almacenes.controller')
const checkAutenticacion = require('../controller/service/jwtAuth');

// Listar Almacenes
router.get('/listar', 

function(req, res, next){
    roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Almacen.listar()
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Listar Almacenes por Sede
router.get('/listar/sede/:sede', 

function(req, res, next){
    roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { sede } = req.params

    Almacen.listarSede(sede)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

/* Crear Almacenes. */
router.post('/agregar', 

function(req, res, next){
    roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Almacen.agregar(req.body)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Eliminar Almacenes
router.delete('/eliminar/:id', 

function(req, res, next){
    roles = ["admin"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { id } = req.params

    Almacen.eliminar(id)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;