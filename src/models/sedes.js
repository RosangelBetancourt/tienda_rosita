const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SedesSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String
  },
  almacenes: {
    type: Array,
    default: []
  },
  empleados: {
    type: Array,
    default: []
  }
});

const SedesModel = mongoose.model('sedes', SedesSchema)
module.exports = SedesModel