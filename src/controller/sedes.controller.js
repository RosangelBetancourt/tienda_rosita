const SedesModel = require('../models/sedes');
const mongoose = require('mongoose');


class Sede {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalSedes = await SedesModel.find().select(
                    '_id nombre almacenes empleados'
                )
                return resolve({
                    ok: true,
                    totalSedes
                })
            } catch (error) {
                console.error('Error al listar las Sedes:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar las Sedes',
                })
            }
        })
    }

    agregar(sede) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!sede.nombre) {
                    reject('Faltan propiedades escenciales: nombre')
                } else {
                    //validamos que el nombre no se repite
                    const existeSede = await SedesModel.findOne({
                        nombre: sede.nombre
                    })
    
                    if (existeSede) {
                        return reject({
                            ok: false,
                            mensaje: 'Ya existe una Sede con ese nombre',
                        })
                    }

                    const nuevaSede = {
                        nombre: sede.nombre,
                        almacenes: sede.almacenes,
                        empleados: sede.empleados
                    }

                    const sedeCreada = await SedesModel.create(
                        nuevaSede
                    )

                    if (!sedeCreada) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear la Sede',
                        })
                    }
                    resolve({
                        ok: true,
                        Sede: sedeCreada,
                    })
                }
            } catch (error) {
                console.error('Error al agregar la Sede:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar la Sede',
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

                // Verificamos si se puede eliminar la Sede
                const sede = await SedesModel.findOne({ _id: id })

                if (sede.almacenes.length > 0 || sede.empleados.length > 0) {
                    return reject({
                        ok: false,
                        mensaje: 'No se puede eliminar la Sede porque no debeb tener Empleados ni Almacenes Registrados',
                    })
                }

                // Eliminamos la Sede seleccionada
                const sedeEliminada = await SedesModel.findByIdAndDelete(id)
                if (!sedeEliminada) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar la Sede',
                    })
                }

                return resolve({
                    ok: true,
                    sedeEliminada,
                    mensaje: 'Sede eliminada',
                })
            } catch (error) {
                console.error('Error al eliminar la Sede:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar la Sede',
                })
            }
        })
    }

}

const sedesC = new Sede();
module.exports = sedesC;