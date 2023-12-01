const ClientesModel = require('../models/clientes');
const ProductosModel = require('../models/productos');
const { elminarDeUnArray } = require('./service/acciones');
const mongoose = require('mongoose');

class Cliente {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalClientes = await ClientesModel.find().select(
                    '_id nombre apellido cedula producto gasto'
                )
                return resolve({
                    ok: true,
                    totalClientes
                })
            } catch (error) {
                console.error('Error al listar los Clientes:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Clientes',
                })
            }
        })
    }

    agregar(cliente) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!cliente.nombre || !cliente.apellido || !cliente.cedula || !cliente.producto) {
                    return reject('Faltan propiedades escenciales: nombre, apellido, cedula y producto')
                } else {
                    //validamos que exista la sede
                    const existeProducto = await ProductosModel.findOne({
                        nombre: cliente.producto
                    })

                    if (!existeProducto) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe el Producto que has ingresado, elige un Producto correcto',
                        })
                    }

                    if(existeProducto.cantidad == 0){
                        return reject({
                            ok: false,
                            mensaje: 'No se puede agregar el cliente porque se agotaron la cantidad de ese producto',
                        })
                    }

                    const nuevoCliente = {
                        nombre: cliente.nombre,
                        apellido: cliente.apellido,
                        cedula: cliente.cedula,
                        producto: cliente.producto,
                        gasto: existeProducto.precio
                    }

                    const clienteCreado = await ClientesModel.create(
                        nuevoCliente
                    )

                    if (!clienteCreado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear el Cliente',
                        })
                    }

                    let nuevaCantidad = existeProducto.cantidad - 1
                    await ProductosModel.updateOne({ nombre: cliente.producto }, { $set: {cantidad: nuevaCantidad} })

                    resolve({
                        ok: true,
                        "Cliente": clienteCreado,
                    })
                }
            } catch (error) {
                console.error('Error al agregar el Cliente:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar el Cliente',
                })
            }
        })
    }

}

const clientesC = new Cliente();
module.exports = clientesC;