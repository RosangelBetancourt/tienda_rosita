var express = require('express');
var router = express.Router();
const Clientes = require('../controller/clientes.controller')
const checkAutenticacion = require('../controller/service/jwtAuth');


// Listar Clientes
router.get('/listar', function(req, res, next){
    let roles = ["admin", "editor", "user"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Clientes.listar()
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

/* Crear Clientes. */
router.post('/agregar', function(req, res, next){
    let roles = ["admin", "editor"];
    checkAutenticacion(req, res, next, roles);
},

function(req, res, next) {
    Clientes.agregar(req.body)
    .then((resultado) => {
        res.status(200).json({"status": 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;