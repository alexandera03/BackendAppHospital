const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;


    //Manera de ejecutar dos funciones a la vez
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre role google email img')
            .skip(desde)
            .limit(5),

        Usuario.countDocuments()
    ])
    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuarios = async (req, res = response) => {

    const { email, password } = req.body;



    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: `el correo: ${email} ya esta registrado`
            })
        }
        const usuario = new Usuario(req.body);

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        //guardar Usuario
        await usuario.save();
        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }




}

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id
    //Todo validar token y comprobar si es el usuario correcto

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario por el id: ${uid}`
            })
        }


        //actualizacion del usuario
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: `Ya existe un usuario con el email: ${email}`
                })
            }
        }


        if(!usuarioDB.google){
            campos.email = email;
        }else if(usuarioDB.email!== email){
            return res.status(400).json({
                ok:false,
                msg:'Los usuarios de Google no pueden cambiar el email'
            })
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario por el id: ${uid}`
            })
        }

        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}