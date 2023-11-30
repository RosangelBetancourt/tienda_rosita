var express = require('express');
var router = express.Router();
const Sede = require('../controller/sedes.controller')
const checkAutenticacion = require('../controller/service/jwtAuth');

// Listar Sedes
router.get('/listar', 

function(req, res, next){
    roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Sede.listar()
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

/* Crear Sedes. */
router.post('/agregar', 

function(req, res, next){
    roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Sede.agregar(req.body)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Eliminar Sedes
router.delete('/eliminar/:id',

function(req, res, next){
    roles = ["admin"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    const { id } = req.params

    Sede.eliminar(id)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;