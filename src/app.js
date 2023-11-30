var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
require('./database/conexion')

let index = require('./routes/index');
let usuarios = require('./routes/usuarios.routes');
let productos = require('./routes/productos.routes');
let clientes = require('./routes/clientes.routes');
let categorias = require('./routes/categorias.routes');
let proveedores = require('./routes/proveedores.routes');
let sedes = require('./routes/sedes.routes');
let almacenes = require('./routes/almacenes.routes');
let empleados = require('./routes/empleados.routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/usuarios', usuarios);
app.use('/productos', productos);
app.use('/clientes', clientes);
app.use('/categorias', categorias);
app.use('/proveedores', proveedores);
app.use('/sedes', sedes);
app.use('/almacenes', almacenes);
app.use('/empleados', empleados);

// Middleware para manejar rutas no encontradas y devolver error 404
app.use((req, res, next) => {
  res.status(404).json({ status: 404, mensaje: "La ruta que buscas no existe" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
