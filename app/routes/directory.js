const express = require('express')
const controller = require('../controllers/directory')
const router = express.Router()
const url = require('url')


// folder extrae las direcciones de la carpeta uploads pra tener un array, routing agarra los valores y crea un
// routeo en router de esta pagina, ejemplo: folder = ["test","test2"], routing toma esos valores y los agregaga
//para que sean direcciones url validas de manera dianmica
let folders = controller.folders

let routing = controller.routing

let updateRouting = (req, res, next) => {
    routing(folders, router)
    next()
}

let files = (req, res, next) => {
    controller.files("/")
    next()
}


router.post(
    `/create`,
    controller.create
)

router.post(
    `/delete`,
    controller.delete
)

router.post(
    `/upload`,
    controller.upload,
    controller.uploadFile,
    controller.moveFile
)

router.get(
    `/check`,
    controller.check
)

router.post(
    `/download`,
    controller.downloadCarpet
)

router.post(
    `/:carpet/download`,
    controller.downloadFile
)


router.post(
    '/login',
    controller.login,
   // setear las cookies o volver a la pagina de login
    
)

router.get(
    // hacer le routeo y checar las cookies para decidir si mandar a admin o a user
    '/',
    updateRouting,
    controller.checkIndex
)

router.get(
    '/logout',
    controller.logout
)

router.get(
    '/users',
    controller.displayUsers
)

router.post(
    '/users/create',
    controller.createUser
)

router.post(
    '/users/delete',
    controller.deleteUser
)

router.post(
    '/users/edit',
    controller.updateUser
)


router.get(
    '/test',
    files
)




module.exports = router