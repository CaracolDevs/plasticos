const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const maquinas = require('../models/value').maquinas;
const paros = require('../models/value').paros;
const insumos = require('../models/value').insumos;
const produccion = require('../models/value').produccion;



//conseguir colaboradores 

getColabors = async () => {
    let result = await value.findAll({
       
    })

    console.log("result")
    console.log(result)

    let content = [],
    name = [],
    id = [],
    role = [],
    noE = [],
    noI = []


    for(values of result) {
        id.push(values.dataValues['ColaborId'])
        name.push(values.dataValues['Name'])
        role.push(values.dataValues['Role'])
        noE.push(values.dataValues['NoEmpleado'])
        noI.push(values.dataValues['NoImss'])
    }

    content = [id,name,role,noE,noI]
    console.log("USERS", result, content)

    return content
}

//pagina rpincipal de paros
exports.mainPage = async (req, res) => {

    res.render('reportes')
}

exports.reportesM1y2 = async (req, res) => {
    let content = await getColabors()
    console.log("jotooooo")
    console.log(content)
    res.render('reportesM1y2', {content})

}

exports.reportesM3 = async (req, res) => {
    let content = await getColabors()
    res.render('reportesM3', {content})
}

exports.reportesMR = async (req, res) => {
    let content = await getColabors()
    res.render('reportesMR', {content})
}

exports.reportesME = async (req, res) => {
    let content = await getColabors()
    res.render('reportesME', {content})
}

exports.reportesMT = async (req, res) => {
    let content = await getColabors()
    res.render('reportesMT', {content})
}




// guardar reportes


let guardarInsumo = async (req, res) => {

}


exports.reportesM1y2Send = async (req, res) => {
    console.log(req.body)

    let result = await value.findAll({
        where: {ColaborId: req.body.colaborador }
    })

    let date = new Date(req.body.date)


    // filtrar la solicutd por si viene en 0
    let solicitud01 = req.body.I01_solicitud
    let solicitud01Value
   
    
    
    if(solicitud01[0] == '') {
        solicitud01Value = [false,0,0,0]
    } else {
        solicitud01Value = [true,req.body.I01_solicitud[0],
        req.body.I01_solicitud[1],
        req.body.I01_solicitud[2]
        ]
    }


    //calcular ivnentairos

    let inventarioInicial = Number(req.body.I01_valorI) + Number(req.body.I01_valorContenedorI) + Number(solicitud01Value[1])
    let inventarioFinal = Number(req.body.I01_valorF) + Number(req.body.I01_valorContenedorF)
    let insumoUtilizado = inventarioInicial - inventarioFinal + Number(req.body.I01_merma)
    let insumoValidado = Number(req.body.I01_MPutilizada) + Number(req.body.I01_merma)


   
   
    const insumo = await insumos.create
    ({
        MaquinaId: '01',
        Maquina: 'Maquina 1 y 2',
        ColaborId: req.body.colaborador,
        Colabor: result[0].dataValues['Name'],
        Date: date,
        Turno: req.body.turno,
        Insumo: 'Polietileno AD',
        LoteInsumo: req.body.I01_lote,
        InsumoInicial: Number(req.body.I01_valorI),
        InsumoFinal: Number(req.body.I01_valorF),
        Contenedor: true,
        ContenedorInicial: Number(req.body.I01_valorContenedorI),
        ContenedorFinal: Number(req.body.I01_valorContenedorF),
        SolicitudInsumo: solicitud01Value[0],
        SolicitudInsumoQty: Number(solicitud01Value[1]),
        SolicitudInsumoFolio: Number(solicitud01Value[2]),
        SolicitudInsumoFolioSalida: Number(solicitud01Value[3]),
        InventarioInicial: inventarioInicial,
        InventarioFinal: inventarioFinal,
        InsumoMermado: Number(req.body.I01_merma),
        InsumoUtilizado: insumoUtilizado,
        InsumoValidado: insumoValidado



    });

    console.log("ojitopapirrin")
     


}
