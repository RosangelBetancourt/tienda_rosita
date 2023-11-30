const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ClientesSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String,
    match: /[a-z]/
  },
  apellido: {
    type: String,
    match: /[a-z]/
  },
  cedula: {
    type: Number
  },
  producto: {
    type: String
  },
  gasto: {
    type: String
  }
});

const ClientesModel = mongoose.model('clientes', ClientesSchema)
module.exports = ClientesModel