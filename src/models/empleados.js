const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmpleadosSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String,
    match: /[a-z]/, 
  },
  apellido: {
    type: String,
    match: /[a-z]/
  },
  cedula: {
    type: Number
  },
  edad: {
    type: Number
  },
  sede: {
    type: String
  },
  sueldo: {
    type: String
  }
});

const EmpleadosModel = mongoose.model('empleados', EmpleadosSchema)
module.exports = EmpleadosModel