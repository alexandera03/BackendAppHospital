const { response } = require('express');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleverify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña o Email incorrectos'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña o Email incorrectos'
            })
        }
        //generar el TOKEn -JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            true: false,
            msg: 'Hable con soporte'
        })
    }
}

const googleSignIn = async(req,res=response)=>{

    try {
        const {email,name,picture} = await googleverify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario= new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            usuario=usuarioDB;
            usuario.google=true;
        }
        //Guardar Usuario logueado por google
        await usuario.save();

        //generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            email,
            name,
            picture,
            token
})
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'Token de google no es correcto'
        })
    }


}


const renewToken = async(req,res=response)=>{

    const uid = req._id;
    //generar token
    const token = await generarJWT(uid);
   // Obtener el usuario por UID
   const usuario = await Usuario.findById( uid );
    res.json({
        ok:true,
        token,
        usuario
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}