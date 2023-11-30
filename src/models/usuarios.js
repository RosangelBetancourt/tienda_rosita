const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UsuariosSchema = new Schema({
  id: ObjectId,
  usuario: {
    type: String,
  },
  password: {
    type: String
  },
  rol: {
    type: String
  }
});

const UsuariosModel = mongoose.model('usuarios', UsuariosSchema)
module.exports = UsuariosModel