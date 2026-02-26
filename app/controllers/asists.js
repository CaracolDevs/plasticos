const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const valueAsists = require('../models/value').asists;

// se manejara la tabla de colaboradores para agregar y retirar valores

/// MUESTRA LOS USUARIOS Y PERMITE MODIFICARLOS
exports.displayColabors = async (req, res) => {

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

    res.render('asists', {content})
}

/**
     * Insertar colaborador nuevo
     */

exports.createColabor = async (req, res) => {
    console.log(req.body)
    const colabor = await value.create({ Name: req.body.name, Role: req.body.role, 
        NoEmpleado: req.body.noE, NoImss: req.body.noI});

        if (colabor) {
                res.redirect(req.get('referer'));
            } else {
                console.log(err)
            }

}

exports.deleteColabor = async (req, res) => {
    let filters = {
        ColaborId: req.body.name,
    }
    let user = await value.findAll({
        where: filters
    })
    console.log(user)
    await user[0].destroy();
    res.redirect(req.get('referer'));
}

exports.displayReport = async (req, res) => { 
let result = await value.findAll({
       
    })

    console.log("result")
    console.log(result)

    let content = [],
    name = [],
    id = [],
    role = [],
    noE = [],
    noI = [],
    asists= []

   


    for(values of result) {
        id.push(values.dataValues['ColaborId'])
        name.push(values.dataValues['Name'])
        role.push(values.dataValues['Role'])
        noE.push(values.dataValues['NoEmpleado'])
        noI.push(values.dataValues['NoImss'])

        if(values.dataValues['Asist'] == 1) {
            asists.push(1) 

            console.log("HOLA :" ,asists)
        } else {
        
        }
    }

    content = [id,name,role,noE,noI]
    console.log("USERS", result, content)

    res.render('asistsReport', {content})
}


exports.sendReport = async (req, res) => { 
console.log(req.body)
let asists = []
for (let value of req.body.asist) {
    console.log(value)
    if(value === "on") {
        asists.push(true)
    } else {
        asists.push(false)
    }
}
console.log(asists)

let addAsist = async (ids, names, asists, reasons, date) => {
    for(const index of ids.keys()) {
        if( asists[index] == undefined) {
            asists[index] = false
        }
        console.log(ids[index], names[index], reasons[index], asists[index])
        let colabor = await valueAsists.create({ ColaborId: ids[index], Colabor: names[index], 
        Asist: asists[index], Reason: reasons[index], Date: date} );


    }

    res.redirect(req.get('referer'));
}
addAsist(req.body.id, req.body.name, asists, req.body.reason, req.body.date)

}
































exports.displayVisor = async (req, res) => { 
    let result = await valueAsists.findAll({
       
    })

    let ids = [],
    names = []
    

    for(values of result) {
        ids.push(values.dataValues['ColaborId'])
        names.push(values.dataValues['Colabor'])
    }

    ids = [... new Set(ids)]
    names = [... new Set(names)]

    let content = [ids,names]


    res.render('asistsVisor', {content})
}

exports.sendVisor = async (req,res) => {
    console.log("joto",req.body.name)
    let filters = {
        ColaborId: Number(req.body.name)
    }
   let result = await valueAsists.findAll({
       where: filters
    })









    

    const fecha1 = new Date(req.body.dateEnd)
    const fecha2 = new Date(req.body.dateStart)
    console.log(fecha1,fecha2)



    const fecha1UTC = Date.UTC(fecha1.getFullYear(), fecha1.getMonth(), fecha1.getDate())
    const fecha2UTC = Date.UTC(fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate())

    const diferenciaMs = fecha1UTC - fecha2UTC;

    console.log(diferenciaMs)

  // Convierte la diferencia a días y redondea
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const dif = Math.floor(diferenciaMs / milisegundosPorDia);
    

    

    let ids = [],
    names = [],
    asists = [],
    reasons = [],
    date,
    
        asistCount = 0,
        faltCount = 0

    

    for(values of result) {
        ids.push(values.dataValues['ColaborId'])
        names.push(values.dataValues['Colabor'])
    }

    ids = [... new Set(ids)]
    names = [... new Set(names)]

    console.log("IDS", ids)

    // saca las asistencias y las rasones  dependiendo dle id, en un principio habia varios ids, cosa que ya no
    // util pero tampoco afecta

    for(id of ids) {

        let bowlA = []
        let bowlR = []
        let filters = {
            ColaborId: id,
            Date: {
                [Op.between]: [req.body.dateStart, req.body.dateEnd], 
            }
        
        }

        let colaborA = await valueAsists.findAll({
            attributes: ['Asist'],
            where: {
                ColaborId: id,
                Date: {
                    [Op.between]: [req.body.dateStart, req.body.dateEnd], 
                },
                Asist: true
            }
        })

        let colaborF = await valueAsists.findAll({
            attributes: ['Asist'],
            where: {
                ColaborId: id,
                Date: {
                    [Op.between]: [req.body.dateStart, req.body.dateEnd], 
                },
                Asist: false
            }
        })

        console.log("AQUI MERO" ,colaborA)

        let colaborR = await valueAsists.findAll({
            attributes: ['Reason'],
            where: filters
        })

        for(values of colaborA) {
            if(values.dataValues['Asist'] == true) {
                
            asistCount++
            }
            
        }


         for(values of colaborF) {
            if(values.dataValues['Asist'] == false) {
                console.log("faltocount", faltCount)
            faltCount++
            }
            
        }

        for(values of colaborR) {
            
            bowlR.push(values.dataValues['Reason'])
        }


        asists.push(bowlA)
        reasons.push(bowlR)
    }
    
    console.log("ojoaldato")
    console.log(ids,names, asistCount, reasons, dif, faltCount), 


    content = [ids, names,asistCount, reasons, dif, faltCount]
   
    res.render('asistsVisorResult', {content})
}



