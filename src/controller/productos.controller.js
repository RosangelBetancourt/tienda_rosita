const ProductosModel = require('../models/productos');
const AlmacenesModel = require('../models/almacenes');
const CategoriasModel = require('../models/categorias');
const { elminarDeUnArray } = require('./service/acciones');
const mongoose = require('mongoose');
const ProveedoresModel = require('../models/proveedores');

class Producto {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalProductos = await ProductosModel.find().select(
                    '_id nombre precio categoria alamcen proveedor cantidad'
                )
                return resolve({
                    ok: true,
                    totalProductos
                })
            } catch (error) {
                console.error('Error al listar los Productos:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Productos',
                })
            }
        })
    }

    listarCategoria(categoria) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalProductos = await ProductosModel.find({"almacen": categoria}).select(
                    '_id nombre precio categoria alamcen proveedor cantidad'
                )
                return resolve({
                    ok: true,
                    categoria,
                    "Empleados": totalProductos
                })
            } catch (error) {
                console.error('Error al listar los Productos:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Productos',
                })
            }
        })
    }

    listarAlmacen(almacen) {
        return new Promise(async (resolve, reject) => {
            try {
                const totalProductos = await ProductosModel.find({"almacen": almacen}).select(
                    '_id nombre precio categoria alamcen proveedor cantidad'
                )
                return resolve({
                    ok: true,
                    almacen,
                    "Empleados": totalProductos
                })
            } catch (error) {
                console.error('Error al listar los Productos:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar los Productos',
                })
            }
        })
    }

    agregar(producto) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!producto.nombre || !producto.precio || !producto.categoria || !producto.almacen || !producto.proveedor || !producto.cantidad) {
                    return reject('Faltan propiedades escenciales: nombre, precio, categoria, almacen, proveedor y cantidad')
                } else {

                    //validamos que el nombre no se repite
                    const existeProducto = await ProductosModel.findOne({
                        nombre: producto.nombre
                    })
    
                    if (existeProducto) {
                        return reject({
                            ok: false,
                            mensaje: 'Ya existe un Producto con ese nombre',
                        })
                    }


                    //validamos que exista la Categoria
                    const existeCategoria = await CategoriasModel.findOne({
                        nombre: producto.categoria
                    })

                    if (!existeCategoria) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la Categoria que has ingresado, elige una Categoria correcta',
                        })
                    }

                    //validamos que exista el Almacen
                    const existeAlmacen = await AlmacenesModel.findOne({
                        nombre: producto.almacen
                    })

                    if (!existeAlmacen) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe la Almacen que has ingresado, elige una Almacen correcto',
                        })
                    }

                    //validamos que exista el Proveedor
                    const existeProveedor = await ProveedoresModel.findOne({
                        nombre: producto.proveedor
                    })

                    if (!existeProveedor) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe el Proveedor que has ingresado, elige una Proveedor correcto',
                        })
                    }

                    const nuevoProducto = {
                        nombre: producto.nombre,
                        precio: producto.precio,
                        categoria: producto.categoria,
                        almacen: producto.almacen,
                        proveedor: producto.proveedor,
                        cantidad: producto.cantidad
                    }

                    const productoCreado = await ProductosModel.create(
                        nuevoProducto
                    )

                    if (!productoCreado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear el Producto',
                        })
                    }

                    existeCategoria.productos.push(producto.nombre)
                    await CategoriasModel.updateOne({ nombre: producto.categoria }, { $set: {productos: existeCategoria.productos} })

                    existeAlmacen.productos.push(producto.nombre)
                    await AlmacenesModel.updateOne({ nombre: producto.almacen }, { $set: {productos: existeAlmacen.productos} })

                    resolve({
                        ok: true,
                        "Producto": productoCreado,
                    })
                }
            } catch (error) {
                console.error('Error al agregar el Producto:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar el Producto',
                })
            }
        })
    }

    editar(producto, id) {
        return new Promise(async (resolve, reject) => {
            try {
                //validacion del ID para que sea como el ID de Mongoose
                if (!mongoose.isValidObjectId(id)) {
                    return reject({
                        ok: false,
                        mensaje: 'ID no válido',
                    })
                }

                if (!producto.precio || !producto.almacen) {
                    return reject('Faltan propiedades escenciales: precio y almacen')
                } else {
                    const anteriorProducto = await ProductosModel.findOne({ _id: id });
                    const almacenAnterior = await AlmacenesModel.findOne({
                        nombre: anteriorProducto.almacen
                    })

                    //validamos que exista el Almacen
                    const existeAlmacen = await AlmacenesModel.findOne({
                        nombre: producto.almacen
                    })

                    if (!existeAlmacen) {
                        return reject({
                            ok: false,
                            mensaje: 'No existe el Almacen que has ingresado, elige un Almacen correcto',
                        })
                    }

                    const edicionProducto = {
                        precio: producto.precio,
                        almacen: producto.almacen
                    }

                    const productoEditado = await ProductosModel.updateOne({ _id: id }, { $set: edicionProducto })

                    if (!productoEditado) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al editar el Producto',
                        })
                    }

                    const respuesta = elminarDeUnArray(almacenAnterior.productos, anteriorProducto.nombre);
                    console.log(respuesta)
                    await AlmacenesModel.updateOne({ nombre: anteriorProducto.almacen }, { productos: respuesta })

                    const almacenNuevo = await AlmacenesModel.findOne({nombre: producto.almacen})
                    almacenNuevo.productos.push(anteriorProducto.nombre)
                    await AlmacenesModel.updateOne({ nombre: producto.almacen }, { $set: {productos: almacenNuevo.productos} })

                    resolve({
                        mensaje: 'Producto Editado',
                        ok: true,
                        "Producto": productoEditado,
                    })
                }
            } catch (error) {
                console.error('Error al editar el Producto:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al editar el Producto',
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

                const producto = await ProductosModel.findOne({ _id: id })

                // Eliminamos el Producto seleccionado
                const productoEliminado = await ProductosModel.findByIdAndDelete(id)
                if (!productoEliminado) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar el Producto',
                    })
                }

                //Eliminamos el Producto de la Categoria
                const Categoria = await CategoriasModel.findOne({
                    nombre: producto.categoria
                })

                const respuesta = elminarDeUnArray(Categoria.productos, producto.nombre)

                if (respuesta != true) {
                    await CategoriasModel.updateOne({ nombre: producto.categoria }, { productos: respuesta })
                }

                //Eliminamos el Producto del Almacen
                const Almacen = await AlmacenesModel.findOne({
                    nombre: producto.almacen
                })

                const respuesta2 = elminarDeUnArray(Almacen.productos, producto.nombre)

                if (respuesta2 != true) {
                    await AlmacenesModel.updateOne({ nombre: producto.almacen }, { productos: respuesta2 })
                }

                return resolve({
                    ok: true,
                    productoEliminado,
                    mensaje: 'Producto eliminado',
                })
            } catch (error) {
                console.error('Error al eliminar el Producto:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar el Producto',
                })
            }
        })
    }
}

const productosC = new Producto();
module.exports = productosC;