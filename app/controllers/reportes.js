const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const maquinas = require('../models/value').maquinas;
const paros = require('../models/value').paros;
const insumos = require('../models/value').insumos;
const producciones = require('../models/value').producciones;



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


let guardarInsumo = async (req, insumo, contenedor, name, idMaquina, nameMaquina) => {
  //insumo 01
    //console.log(req.body)


    console.log("MARCA:" , insumo.marca)

   

    let result = await value.findAll({
        where: {ColaborId: req.body.colaborador }
    })

    let date = new Date(req.body.date)


     // filtrar marca

    if(insumo.marca == undefined) {
        insumo.marca = 'Generic'
    }

    // filtrar la solicutd por si viene en 0
    let solicitud01 = insumo.solicitud
    let solicitud01Value
   
    
    
    if(solicitud01[0] == '') {
        solicitud01Value = [false,0,0,0]
    } else {
        solicitud01Value = [true,insumo.solicitud[0],
        insumo.solicitud[1],
        insumo.solicitud[2]
        ]
    }

    //filtrar contendor 
    let contenedorI, contenedorF

    if(contenedor == true) {
        contenedorI = insumo.valorContenedorI
        contenedorF = insumo.valorContenedorF
    } else {
        contenedorI = '0'
        contenedorF = '0'
        
    }


    //calcular ivnentairos

    let inventarioInicial = Number(insumo.valorI) + Number(contenedorI) + Number(solicitud01Value[1])
    let inventarioFinal = Number(insumo.valorF) + Number(contenedorF)
    let insumoUtilizado = inventarioInicial - inventarioFinal + Number(insumo.merma)
    let insumoValidado = Number(insumo.MPutilizada) + Number(insumo.merma)


   
   
    const insumoCreate = await insumos.create
    ({
        MaquinaId: idMaquina,
        Maquina: nameMaquina,
        ColaborId: req.body.colaborador,
        Colabor: result[0].dataValues['Name'],
        Date: date,
        Turno: req.body.turno,
        Insumo: name,
        LoteInsumo: insumo.lote,
        InsumoInicial: Number(insumo.valorI),
        InsumoFinal: Number(insumo.valorF),
        Contenedor: true,
        ContenedorInicial: Number(contenedorI),
        ContenedorFinal: Number(contenedorF),
        SolicitudInsumo: solicitud01Value[0],
        SolicitudInsumoQty: Number(solicitud01Value[1]),
        SolicitudInsumoFolio: solicitud01Value[2],
        SolicitudInsumoFolioSalida: solicitud01Value[3],
        InventarioInicial: inventarioInicial,
        InventarioFinal: inventarioFinal,
        InsumoMermado: Number(insumo.merma),
        InsumoUtilizado: insumoUtilizado,
        InsumoValidado: insumoValidado,
        InsumoMarca: insumo.marca



    });
}


let guardarProduccion = async (req, produccion, idMaquina, maquina) => {
    let result = await value.findAll({
        where: {ColaborId: req.body.colaborador }
    })

    let date = new Date(req.body.date)

  const produccionCreate = await producciones.create
    ({
        MaquinaId: Number(idMaquina),
        Maquina: maquina,
        ColaborId: Number(req.body.colaborador),
        Colabor: result[0].dataValues['Name'],
        Date: date,
        Turno: req.body.turno,
        Presentacion: produccion.presentacion,
        ProduccionPzs: Number(produccion.pzs),
        ProduccionContenedores: Number(produccion.bolsas),
        LoteProduccion: produccion.lote,
        FolioEntrada: produccion.folioEntrada,
        HorometroInicial: Number(produccion.HI),
        HorometroFinal: Number(produccion.HF)



    });
}

exports.reportesM1y2Send = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Polietileno AD', '01', 'Maquina 1 y 2')
   guardarInsumo(req, req.body.I02, false, 'Bolsa', '01', 'Maquina 1 y 2')
   guardarProduccion(req, req.body.M01,'01', 'Maquina 1')
   guardarProduccion(req, req.body.M02,'02', 'Maquina 2')
   res.redirect(req.get('referer'));


}


exports.reportesM3Send = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Polietileno AD', '03', 'Maquina 3')
   guardarInsumo(req, req.body.I02, false, 'Bolsa', '03', 'Maquina 3')
   guardarProduccion(req, req.body.M03,'03', 'Maquina 3')
   res.redirect(req.get('referer'));


}

exports.reportesMRSend = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Polietileno AD', '04', 'Maquina Rochelau')
   guardarInsumo(req, req.body.I02, false, 'Bolsa', '04', 'Maquina Rochelau')
   guardarInsumo(req, req.body.I03, false, 'Pigmento Blanco', '04', 'Maquina Rochelau')
   guardarProduccion(req, req.body.MR,'04', 'Maquina Rochelau')
   res.redirect(req.get('referer'));


}

exports.reportesMESend = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Polietileno BD', '05', 'Maquina Efecta')
   guardarInsumo(req, req.body.I02, false, 'Caja', '05', 'Maquina Efecta')
   guardarInsumo(req, req.body.I03, false, 'Bolsa', '05', 'Maquina Efecta')
   guardarProduccion(req, req.body.ME,'05', 'Maquina Efecta')
   res.redirect(req.get('referer'));


}

exports.reportesMTSend = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Etiqueta', '06', 'Maquina Tunel de Calor')
   guardarInsumo(req, req.body.I02, false, 'Bolsa', '06', 'Maquina Tunel de Calor')
   guardarProduccion(req, req.body.MT,'06', 'Maquina Tunel de Calor')


}




exports.reportesMTSend = async (req, res) => {


   guardarInsumo(req, req.body.I01, true, 'Etiqueta', '06', 'Maquina Tunel de Calor')
   guardarInsumo(req, req.body.I02, false, 'Bolsa', '06', 'Maquina Tunel de Calor')
   guardarProduccion(req, req.body.MT,'06', 'Maquina Tunel de Calor')
   res.redirect(req.get('referer'));


}


exports.reporteDiario = async (req, res) => {
    res.render('reporteDiario')
}

exports.reporteMensual = async (req, res) => {
    res.render('reporteMensual')
}


exports.reporteDiarioSend = async (req, res) => {
    res.render('reporteDiario', {content})
}

exports.reporteMensualSend = async (req, res) => {
    res.render('reporteMensual', {content})
}