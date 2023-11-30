var express = require('express');
var router = express.Router();
const Usuarios = require('../controller/usuarios.controller')

/* Crear Usuarios. */
router.post('/registrar', function(req, res, next) {
    Usuarios.registrar(req.body)
    .then((resultado) => {
        res.status(200).json({status: 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

// Hacer Login
router.post('/login', function(req, res, next) {
    Usuarios.login(req.body)
    .then((resultado) => {
        res.status(200).json({status: 200, mensaje: resultado})
    })
    .catch((error) => {
        res.status(400).json({"status": 400, mensaje: error})
    })
});

module.exports = router;
