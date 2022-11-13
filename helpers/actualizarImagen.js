const fs = require('fs');
const Usuario = require('../models/usuarios');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }

            const pathViejoM = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejoM)

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }

            const pathViejoH = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejoH)

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            const pathViejoU = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejoU)

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;
    }





}

module.exports = {
    actualizarImagen
}