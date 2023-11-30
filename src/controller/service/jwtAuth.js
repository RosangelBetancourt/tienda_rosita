const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
    try{
        return jwt.verify(token, process.env.SECRET)
    }catch(e){
        return null
    }
}

const checkAutenticacion = async (req, res, next, roles) => {
    try {
        const tokenReq = req.headers.authorization
        if (tokenReq === undefined) {
            return res.status(400).json({"status": 400, mensaje: 'Debes ingresar un token para acceder a esta ruta'})
        }

        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)

        
        if (tokenData.data.id) {
            if (roles.includes(tokenData.data.rol)){
                next()
            }else{
                res.status(400).json({"status": 400, mensaje: 'No tienes permisos con ese rol'})
            }
        } else {
            res.status(400).json({"status": 400, mensaje: 'Token inválido'})
            
        }
    }catch (error){
        console.log(error);
        res.status(400).json({"status": 400, mensaje: 'Debes ingresar un token para acceder a esta ruta', error: error})
    }
}

module.exports = checkAutenticacion