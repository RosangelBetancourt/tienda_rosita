const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductosSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String
  },
  precio: {
    type: String
  },
  categoria: {
    type: String
  },
  almacen: {
    type: String
  },
  proveedor: {
    type: String
  },
  cantidad: {
    type: Number
  }
});

const ProductosModel = mongoose.model('productos', ProductosSchema)
module.exports = ProductosModel