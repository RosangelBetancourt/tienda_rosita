const ProveedoresModel = require('../models/proveedores');
const SedesModel = require('../models/sedes');
const mongoose = require('mongoose');
const { elminarDeUnArray } = require('./service/acciones');

class Proveedor {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalProveedores = await ProveedoresModel.find().select(
                    '_id nombre rif sede'
                )
                return resolve({
                    ok: true,
                    totalProveedores
                })
            } catch (error) {
                console.error('Error al listar los Proveedores:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Proveedores',
                })
            }
        })
    }

    listarSede(sede) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalProveedores = await ProveedoresModel.find({"sede": sede}).select(
                    '_id nombre rif sede'
                )
                return resolve({
                    ok: true,
                    sede,
                    "Proveedores": totalProveedores
                })
            } catch (error) {
                console.error('Error al listar los Proveedores:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Proveedores',
                })
            }
        })
    }

    agregar(proveedor) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!proveedor.nombre || !proveedor.rif || !proveedor.sede) {
                    return reject('Faltan propiedades escenciales: nombre, rif y sede')
                } else {

                    //validamos que exista la sede
                    const existeSede = await SedesModel.findOne({
                        nombre: proveedor.sede
                    })

                    if (!existeSede) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la sede que has ingresado, elige una sede correcta',
                        })
                    }

                    const nuevoProveedor = {
                        nombre: proveedor.nombre,
                        rif: proveedor.rif,
                        sede: proveedor.sede
                    }

                    const proveedorCreado = await ProveedoresModel.create(
                        nuevoProveedor
                    )

                    if (!proveedorCreado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear el Proveedor',
                        })
                    }

                    existeSede.proveedores.push(proveedor.nombre)
                    await SedesModel.updateOne({ nombre: proveedor.sede }, { $set: {proveedores: existeSede.proveedores} })

                    resolve({
                        ok: true,
                        "Proveedor": proveedorCreado,
                    })
                }
            } catch (error) {
                console.error('Error al agregar el Proveedor:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar el Proveedor',
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

                const proveedor = await ProveedoresModel.findOne({ _id: id })

                // Eliminamos el Proovedor seleccionada
                const proveedorEliminado = await ProveedoresModel.findByIdAndDelete(id)
                if (!proveedorEliminado) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar el Proveedor',
                    })
                }

                //Eliminamos el Proveedor de la Sede
                const Sede = await SedesModel.findOne({
                    nombre: proveedor.sede
                })

                const respuesta = elminarDeUnArray(Sede.proveedores, proveedor.nombre)

                if (respuesta != true) {
                    await SedesModel.updateOne({ nombre: proveedor.sede }, { proveedores: respuesta })
                }

                return resolve({
                    ok: true,
                    proveedorEliminado,
                    mensaje: 'Proveedor eliminado',
                })
            } catch (error) {
                console.error('Error al eliminar el Proveedor:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar el Proveedor',
                })
            }
        })
    }

}

const proveedoresC = new Proveedor();
module.exports = proveedoresC;