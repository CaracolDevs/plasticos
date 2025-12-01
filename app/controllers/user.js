const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').usuarios;


const options = {
    page: 1,
    limit: 3
};

const parseId = (id) => {
    return mongoose.Types.ObjectId(id)
}


/// MUESTRA LOS USUARIOS Y PERMITE MODIFICARLOS
exports.displayUsers = async (req, res) => {

    let departamentos = await deps('/')
    console.log("tilin")
    console.log(departamentos)

    let result = await value.findAll({
        where: {
            [Op.not]: [{
                Super: 1
            }]
        }
    })

    console.log("result")
    console.log(result)

    let content = [],
    name = [],
    id = [],
    depa = []

    for(values of result) {
        id.push(values.dataValues['UserId'])
        name.push(values.dataValues['User'])
        depa.push(values.dataValues['Departament'])
    }

    content = [id,name,depa]
    console.log("USERS", result, content)

    res.render('adminUsers', {content, departamentos})
}

exports.index =  async (req, res) => {
    

    try {
        
       
        res.render('usuarios')
        
    } catch (error) {
        res.send({ message: 'not Done!' })
        throw error
    }
}


/**
 * Obtener DATA de USUARIOS
 */

exports.getData = (req, res) => {
    model.paginate({}, options, (err, docs) => {
        res.send({
            items: docs
        })
    })
}

/**
 * Obtener DATA de USUARIOS
 */

exports.getSingle = (req, res) => {
    model.findOne({ _id: parseId(req.params.id) },
        (err, docs) => {
            res.send({
                items: docs
            })
        })
}

/**
 * Obtener DATA de USUARIOS
 */

exports.updateSingle = (req, res) => {
    const { id } = req.params
    const body = req.body
    model.updateOne(
        { _id: parseId(id) },
        body,
        (err, docs) => {
            res.send({
                items: docs
            })
        })
}


/**
 * Insertar DATA de USUARIOS
 */
exports.insertData = (req, res) => {
    const data = req.body
    model.create(data, (err, docs) => {
        if (err) {
            res.status(422.).send({ error: 'Error' })
        } else {
            res.send({ data: docs })
        }

    })
}

/**
 * Obtener DATA de USUARIOS
 */

exports.deleteSingle = (req, res) => {
    const { id } = req.params
    model.deleteOne(
        { _id: parseId(id) },
        (err, docs) => {
            res.send({
                items: docs
            })
        })
}