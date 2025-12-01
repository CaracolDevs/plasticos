const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const maquinas = require('../models/value').maquinas;
const paros = require('../models/value').paros;

//pagina rpincipal de paros
exports.mainPage = async (req, res) => {
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

    res.render('paros',{content})
}
//visor de paros
exports.visor = async (req, res) => {
    res.render('parosVisor')

}


//agregar reprote de paro
exports.sendReport = async (req,res) => {
    console.log(req.body)
    let filters = {
            MaquinaID: req.body.maquina,
        }
    const maquina = await maquinas.findAll({
        attributes: ['Maquina'],
        where: filters
    })

    let filters02 = {
            ColaborId: req.body.colaborador,
        }
    const colabor = await value.findAll({
        attributes: ['Name','NoEmpleado'],
        where: filters02
    })





    const fecha1 = new Date(`12-12-25 ${req.body.horaF}`)
    const fecha2 = new Date(`12-12-25 ${req.body.horaI}`)
    
    const fecha1UTC = fecha1.getTime()
    const fecha2UTC = fecha2.getTime()

    const diferenciaMs = fecha1UTC - fecha2UTC;
    const diferenciaHoras = diferenciaMs / (1000 * 60 );



const paro = await paros.create({Maquina: maquina[0].dataValues.Maquina, MaquinaID: req.body.maquina, 
        Colabor: colabor[0].dataValues.Name, ColaborId: req.body.colaborador, TipoParo: req.body.tipoParo, 
        Paro: req.body.paro, HoraInicio: req.body.horaI, HoraFinal: req.body.horaF, Date: req.body.date, DifMinutos: diferenciaHoras
     });
        res.redirect(req.get('referer'));
        console.log("paro creado")
    
}


//agrgar amquina 

exports.agregarMaquina = async (req,res) => {



        const maq = await maquina.create({Maquina: req.body.name });
        res.redirect(req.get('referer'));
        console.log("usuario creado")
    
    

}

//llamar los rows de cierta maquina 
exports.getRows = async (req,res) => {
    console.log(req.body)

    let date = new Date (req.body.date)

    let filters = {
        Date: date,
        MaquinaID: req.body.maquina
    }
    const result = await paros.findAll({
        where: filters
    })

    let content,
    names = [],
    maquinas = [],
    horasI = [],
    horasF = [],
    difs = []

    for(values of result) {
        names.push(values.dataValues['Colabor'])
        maquinas.push(values.dataValues['Maquina'])
        horasI.push(values.dataValues['HoraInicio'])
        horasF.push(values.dataValues['HoraFinal'])
        difs.push(values.dataValues['DifMinutos'])
    }

    content = [names,maquinas,horasI,horasF,difs]
   
    res.render('parosVisorResult',{content})
        console.log(result)
        console.log("usuario creado")
}

