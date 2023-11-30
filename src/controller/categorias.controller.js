const CategoriasModel = require('../models/categorias');
const mongoose = require('mongoose');

class Categoria {

    listar() {
        return new Promise(async (resolve, reject) => {
            try {
                const totalCategorias = await CategoriasModel.find().select(
                    '_id nombre productos'
                )
                return resolve({
                    ok: true,
                    totalCategorias
                })
            } catch (error) {
                console.error('Error al listar las Categorias:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al listar las Categorias',
                })
            }
        })
    }

    agregar(categoria) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!categoria.nombre) {
                    return reject('Faltan propiedades escenciales: nombre')
                } else {
                    //validamos que el nombre no se repite
                    const existeCategoria = await CategoriasModel.findOne({
                        nombre: categoria.nombre
                    })
    
                    if (existeCategoria) {
                        return reject({
                            ok: false,
                            mensaje: 'Ya existe una Categoria con ese nombre',
                        })
                    }

                    const nuevaCategoria = {
                        nombre: categoria.nombre,
                    }

                    const categoriaCreada = await CategoriasModel.create(
                        nuevaCategoria
                    )

                    if (!categoriaCreada) {
                        return reject({
                            ok: false,
                            mensaje: 'Hubo un error al crear la Categoria',
                        })
                    }
                    resolve({
                        ok: true,
                        Sede: categoriaCreada,
                    })
                }
            } catch (error) {
                console.error('Error al agregar la Categoria:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al agregar la Categoria',
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

                // Verificamos si se puede eliminar la Categoria
                const categoria = await CategoriasModel.findOne({ _id: id })

                if (categoria.productos.length > 0) {
                    return reject({
                        ok: false,
                        mensaje: 'No se puede eliminar la Categoria porque no debe tener Productos Registrados',
                    })
                }

                // Eliminamos la Categoria seleccionada
                const categoriaEliminada = await CategoriasModel.findByIdAndDelete(id)
                if (!categoriaEliminada) {
                    return reject({
                        ok: false,
                        mensaje: 'Hubo un error al eliminar la Categoria',
                    })
                }

                return resolve({
                    ok: true,
                    categoriaEliminada,
                    mensaje: 'Categoria eliminada',
                })
            } catch (error) {
                console.error('Error al eliminar la Categoria:', error)
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al eliminar la Categoria',
                })
            }
        })
    }

}

const categoriasC = new Categoria();
module.exports = categoriasC;