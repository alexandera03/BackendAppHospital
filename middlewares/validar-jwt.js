const jwt = require('jsonwebtoken');
const validarJWT =(req,res,next)=>{
    //leer el token
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No hay token para ser un usuario autorizado'
        })
    }
    try {
        const {uid} = jwt.verify(token,process.env.JWT_SECRET);
        req._id=uid
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'token no valido'
        })
    }

    next();
}

module.exports={
    validarJWT
}