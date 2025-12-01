const express = require('express')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const controller = require('../controllers/paros')

const router = express.Router()

/**
 * Ruta: /user GET
 */

// mostrar colaboradores
router.get(
    `/`,
    controller.mainPage
)



router.get(
    `/visor`,
    controller.visor
)

router.post (
    `/report/addRow`,
    controller.sendReport
)


router.post (
    `/maquina/agregar`,
    controller.agregarMaquina
)

router.post (
    `/visor/getRows`,
    controller.getRows
)


module.exports = router