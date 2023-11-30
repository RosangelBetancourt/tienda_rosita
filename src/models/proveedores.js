const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProveedoresSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String
  },
  rif: {
    Ntype: Number
  },
  sede: {
    type: String
  }
});

const ProveedoresModel = mongoose.model('proveedores', ProveedoresSchema)
module.exports = ProveedoresModel