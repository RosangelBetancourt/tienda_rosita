const EmpleadosModel = require('../models/empleados');
const SedesModel = require('../models/sedes');
const { elminarDeUnArray } = require('./service/acciones');
const mongoose = require('mongoose');

class Empleados {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalEmpleados = await EmpleadosModel.find().select(
                    '_id nombre apellido cedula edad sede sueldo'
                )
                return resolve({
                    ok: true,
                    totalEmpleados
                })
            } catch (error) {
                console.error('Error al listar los Empleados:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Empleados',
                })
            }
        })
    }

    listarSede(sede) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalEmpleados = await EmpleadosModel.find({"sede": sede}).select(
                    '_id nombre apellido cedula edad sede sueldo'
                )
                return resolve({
                    ok: true,
                    sede,
                    "Empleados": totalEmpleados
                })
            } catch (error) {
                console.error('Error al listar los Empleados:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Empleados',
                })
            }
        })
    }

    agregar(empleado) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!empleado.nombre || !empleado.apellido || !empleado.cedula || !empleado.edad || !empleado.sede || !empleado.sueldo) {
                    return reject('Faltan propiedades escenciales: nombre, apellido, cedula, edad, sede y sueldo')
                } else {
                    //validamos que el nombre y apellido no se repite
                    const existeEmpleado = await EmpleadosModel.findOne({
                        nombre: empleado.nombre,
                        apellido: empleado.apellido
                    })
    
                    if (existeEmpleado) {
                        return reject({
                            ok: false,
                            mensaje: 'Ya existe un Empleado con ese nombre y apellido',
                        })
                    }

                    //validamos que exista la sede
                    const existeSede = await SedesModel.findOne({
                        nombre: empleado.sede
                    })

                    if (!existeSede) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la sede que has ingresado, elige una sede correcta',
                        })
                    }

                    const nuevoEmpleado = {
                        nombre: empleado.nombre,
                        apellido: empleado.apellido,
                        cedula: empleado.cedula,
                        edad: empleado.edad,
                        sede: empleado.sede,
                        sueldo: empleado.sueldo
                    }

                    const empleadoCreado = await EmpleadosModel.create(
                        nuevoEmpleado
                    )

                    if (!empleadoCreado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear el Empleado',
                        })
                    }

                    existeSede.empleados.push(empleado.nombre)
                    await SedesModel.updateOne({ nombre: empleado.sede }, { $set: {empleados: existeSede.empleados} })

                    resolve({
                        ok: true,
                        Empleado: empleadoCreado,
                    })
                }
            } catch (error) {
                console.error('Error al agregar el Empleado:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar el Empleado',
                })
            }
        })
    }

    editar(empleado, id) {
        return new Promise(async (resolve, reject) => {
            try {
                //validacion del ID para que sea como el ID de Mongoose
                if (!mongoose.isValidObjectId(id)) {
                    return reject({
                        ok: false,
                        mensaje: 'ID no válido',
                    })
                }

                if (!empleado.edad || !empleado.sede || !empleado.sueldo) {
                    return reject('Faltan propiedades escenciales: edad, sede y sueldo')
                } else {
                    const anteriorEmpleado = await EmpleadosModel.findOne({ _id: id });
                    const sedeAnterior = await SedesModel.findOne({
                        nombre: anteriorEmpleado.sede
                    })

                    //validamos que exista la sede
                    const existeSede = await SedesModel.findOne({
                        nombre: empleado.sede
                    })

                    if (!existeSede) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la sede que has ingresado, elige una sede correcta',
                        })
                    }

                    const edicionEmpleado = {
                        edad: empleado.edad,
                        sede: empleado.sede,
                        sueldo: empleado.sueldo
                    }

                    const empleadoEditado = await EmpleadosModel.updateOne({ _id: id }, { $set: edicionEmpleado })

                    if (!empleadoEditado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al editar el Empleado',
                        })
                    }

                    const respuesta = elminarDeUnArray(sedeAnterior.empleados, anteriorEmpleado.nombre);
                    await SedesModel.updateOne({ nombre: anteriorEmpleado.sede }, { empleados: respuesta })

                    const sedeNueva = await SedesModel.findOne({nombre: empleado.sede})
                    sedeNueva.empleados.push(anteriorEmpleado.nombre)
                    await SedesModel.updateOne({ nombre: empleado.sede }, { $set: {empleados: sedeNueva.empleados} })

                    resolve({
                        mensaje: 'Empleado Editado',
                        ok: true,
                        Sede: empleadoEditado,
                    })
                }
            } catch (error) {
                console.error('Error al editar el Empleado:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al editar el Empleado',
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

                const empleado = await EmpleadosModel.findOne({ _id: id })

                // Eliminamos el Empleado seleccionado
                const empleadoEliminado = await EmpleadosModel.findByIdAndDelete(id)
                if (!empleadoEliminado) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar el Empleado',
                    })
                }

                //Eliminamos el Empelado de la Sede
                const Sede = await SedesModel.findOne({
                    nombre: empleado.sede
                })

                const respuesta = elminarDeUnArray(Sede.empleados, empleado.nombre)

                if (respuesta === true) {
                    console.log('No estaba registrado el empleado a ninguna Sede')
                }

                await SedesModel.updateOne({ nombre: empleado.sede }, { empleados: respuesta })

                return resolve({
                    ok: true,
                    empleadoEliminado,
                    mensaje: 'Empleado eliminado',
                })
            } catch (error) {
                console.error('Error al eliminar el Empleado:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar el Empleado',
                })
            }
        })
    }


}

const empleadosC = new Empleados();
module.exports = empleadosC;