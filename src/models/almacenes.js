const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AlmacenesSchema = new Schema({
  id: ObjectId,
  nombre: {
    type: String
  },
  productos: {
    type: Array,
    default: []
  },
  sede: {
    type: String
  }
});

const AlmacenesModel = mongoose.model('almacenes', AlmacenesSchema)
module.exports = AlmacenesModel