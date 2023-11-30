const bcrypt = require('bcrypt');
const UsuariosModel = require('../models/usuarios');
const { crearToken } = require('./service/jwtCrear');

class Usuario {

    registrar(usuario) {
        return new Promise(async (resolve, reject) => {

            if (!usuario.usuario || !usuario.password || !usuario.rol) {
                return reject('Faltan propiedades escenciales: usuario, password y rol')
            }

            if (usuario.rol != 'admin' && usuario.rol != 'editor' && usuario.rol != 'user') {
                return reject('Debes ingresar un rol permitido: admin, editor o user')
            }

            //validamos que no exista otro usuario igual
            const existeUsuario = await UsuariosModel.findOne({
                usuario: usuario.usuario
            })

            if (existeUsuario) {
                return reject({
                    ok: false,
                    mensaje: 'Ya existe el Usuario registrado',
                })
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
            if (!passwordRegex.test(usuario.password)) {
                return reject({ mensaje: 'La contraseña debe ser de al menos 6 caracteres, incluir una mayúscula y un número.' });
            }

            const passwordCifrada = await bcrypt.hash(usuario.password, 10);

            const nuevoUsuario = {
                usuario: usuario.usuario,
                password: passwordCifrada,
                rol: usuario.rol
            }

            const usuarioCreado = await UsuariosModel.create(
                nuevoUsuario
            )

            if (!usuarioCreado) {
                return reject({
                    ok: false,
                    mensaje: 'Hubo un error al crear el nuevo Usuario',
                })
            }

            resolve({
                ok: true,
                Usuario: usuarioCreado,
            })
        })
    }

    login(usuario) {
        return new Promise(async (resolve, reject) => {

            if (!usuario.usuario || !usuario.password) {
                return reject('Faltan propiedades escenciales: usuario y password')
            }

            const usuarioLogear = await UsuariosModel.findOne({
                usuario: usuario.usuario
            })

            if (!usuarioLogear) {
                return reject({
                    ok: false,
                    mensaje: 'El usuario ingresado no existe',
                })
            }

            const passwordValida = await bcrypt.compare(usuario.password, usuarioLogear.password);
            if (!passwordValida) {
                return reject({ mensaje: 'La contraseña es incorrecta' });
            }

            let token = crearToken({ id: usuarioLogear._id, usuario: usuarioLogear.usuario, rol: usuarioLogear.rol });
            resolve({
                ok: true,
                mensaje: 'Has iniciado sesion con éxito',
                usuario: usuarioLogear.usuario,
                token: token
            })
        })
    }
}

const usuarioC = new Usuario();
module.exports = usuarioC;