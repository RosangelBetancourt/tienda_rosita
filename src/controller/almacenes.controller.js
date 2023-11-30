const SedesModel = require('../models/sedes');
const AlmacenesModel = require('../models/almacenes');
const { elminarDeUnArray } = require('./service/acciones');
const mongoose = require('mongoose');

class Almacen {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalAlmacenes = await AlmacenesModel.find().select(
                    '_id nombre productos sede'
                )
                return resolve({
                    ok: true,
                    totalAlmacenes
                })
            } catch (error) {
                console.error('Error al listar los Almacenes:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Almacenes',
                })
            }
        })
    }

    listarSede(sede) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalAlmacenes = await AlmacenesModel.find({"sede": sede}).select(
                    '_id nombre productos sede'
                )
                return resolve({
                    ok: true,
                    sede,
                    "Almacenes": totalAlmacenes
                })
            } catch (error) {
                console.error('Error al listar los Almacenes:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Almacenes',
                })
            }
        })
    }

    agregar(almacen) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!almacen.nombre || !almacen.sede) {
                    return reject('Faltan propiedades escenciales: nombre y sede')
                } else {
                    //validamos que el nombre no se repite
                    const existeAlmacen = await AlmacenesModel.findOne({
                        nombre: almacen.nombre
                    })
    
                    if (existeAlmacen) {
                        return reject({
                            ok: false,
                            mensaje: 'Ya existe un almacen con ese nombre',
                        })
                    }

                    //validamos que exista la sede
                    const existeSede = await SedesModel.findOne({
                        nombre: almacen.sede
                    })

                    if (!existeSede) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la sede que has ingresado, elige una sede correcta',
                        })
                    }

                    const nuevoAlmacen = {
                        nombre: almacen.nombre,
                        sede: almacen.sede
                    }

                    const almacenCreado = await AlmacenesModel.create(
                        nuevoAlmacen
                    )

                    if (!almacenCreado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear el Almacen',
                        })
                    }

                    existeSede.almacenes.push(almacen.nombre)
                    await SedesModel.updateOne({ nombre: almacen.sede }, { $set: {almacenes: existeSede.almacenes} })

                    resolve({
                        ok: true,
                        Sede: almacenCreado,
                    })
                }
            } catch (error) {
                console.error('Error al agregar el Almacen:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar el Almacen',
                })
            }
        })
    }

    eliminar(id) {
        return new Promise(async (resolve, reject) => {
            try {
                //validacion del ID para que sea como el ID de Mongoose
                if (!mongoose.isValidObjectId(id)) {
                    return reject({
                        ok: false,
                        mensaje: 'ID no válido',
                    })
                }

                // Verificamos si se puede eliminar el Almacen
                const almacen = await AlmacenesModel.findOne({ _id: id })

                if (almacen.productos.length > 0) {
                    return reject({
                        ok: false,
                        mensaje: 'No se puede eliminar el Almacen porque no debe tener Productos Registrados',
                    })
                }

                // Eliminamos la Categoria seleccionada
                const almacenEliminado = await AlmacenesModel.findByIdAndDelete(id)
                if (!almacenEliminado) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar el Almacen',
                    })
                }

                //Eliminamos el Almacen de la Sede
                const Sede = await SedesModel.findOne({
                    nombre: almacen.sede
                })

                const respuesta = elminarDeUnArray(Sede.almacenes, almacen.nombre)

                console.log(respuesta)

                if (respuesta != true) {
                    await SedesModel.updateOne({ nombre: almacen.sede }, { almacenes: respuesta })
                }

                return resolve({
                    ok: true,
                    almacenEliminado,
                    mensaje: 'Almacen eliminado',
                })
            } catch (error) {
                console.error('Error al eliminar el Almacen:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar el Almacen',
                })
            }
        })
    }

}

const almacenesC = new Almacen();
module.exports = almacenesC;