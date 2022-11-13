const path = require('path')
const fs = require('fs');
const { response } = require("express");

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizarImagen");

const fileUpload = (req, res = response) => {
    const { tipo, id } = req.params;
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        })
    }

    //Procesar la imagen....
    const file = req.files.imagen;
    const nombreCortad = file.name.split('.'); //wolverine.1.2.jpg
    const extensionArchivo = nombreCortad[nombreCortad.length - 1];
    //Validar extension
    const extensionesValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    //generar el nombre archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar coleccion en mongo
        actualizarImagen(tipo, id, nombreArchivo);
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    });



}

const retornaImagen = (req, res = response) => {
    const { tipo, foto } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}


module.exports = {
    fileUpload,
    retornaImagen
}