const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategoriasSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String
  },
  productos: {
    type: Array,
    default: []
  }
});

const CategoriasModel = mongoose.model('categorias', CategoriasSchema)
module.exports = CategoriasModel