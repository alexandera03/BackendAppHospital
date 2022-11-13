const { response } = require('express');
const Hospital = require('../models/hospital');



const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre')
    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {
    const uid = req._id;
    const hospital = new Hospital({ usuario: uid, ...req.body });

    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }


}

const actualizarHospital = async(req, res = response) => {

    const uid = req.params.id;
    const userid=req._id
    try {

        const hospital = await Hospital.findById(uid);
        if(!hospital){
            return res.status(404).json({
                ok:false,
                msg:`Hosital no encotrado por el id: ${uid}`,
            })
        }

       const cambiosHospital={
        ...req.body,
        usuario:userid
       }

       const hospitalActualizado = await Hospital.findByIdAndUpdate(uid,cambiosHospital,{new:true});


        res.json({
            ok: true,
            msg: 'Actualizando H',
            hospital: hospitalActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }

}
const borrarHospital = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const hospital = await Hospital.findById(uid);
        if(!hospital){
            return res.status(404).json({
                ok:false,
                msg:`Hosital no encotrado por el id: ${uid}`,
            })
        }

        await Hospital.findByIdAndDelete(uid)

        res.json({
            ok: true,
            msg: 'Hospital Eliminado',        
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con soporte'
        })
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}