const { response } = require('express');
const Medico = require('../models/medico');
const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
                                    .populate('usuario','nombre')
                                    .populate('hospital','nombre')
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {
    const uid =req._id;
    const medico = new Medico({ usuario: uid, ...req.body });

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            hospital:medicoDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }
}

const actualizarMedico = async(req, res = response) => {
    const uid = req.params.id;
    const userid=req._id
    try {

        const medico = await Medico.findById(uid);
        if(!medico){
            return res.status(404).json({
                ok:false,
                msg:`Medico no encotrado por el id: ${uid}`,
            })
        }

       const cambiosMedico={
        ...req.body,
        usuario:userid
       }

       const medicoActualizado = await Medico.findByIdAndUpdate(uid,cambiosMedico,{new:true});


        res.json({
            ok: true,
            msg: 'Se actualizo Medico',
            medico: medicoActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }
}
const borrarMedico = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const medico = await Medico.findById(uid);
        if(!medico){
            return res.status(404).json({
                ok:false,
                msg:`medico no encotrado por el id: ${uid}`,
            })
        }

        await Medico.findByIdAndDelete(uid)

        res.json({
            ok: true,
            msg: 'MEdico Eliminado',        
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}