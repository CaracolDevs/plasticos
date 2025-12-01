const express = require('express')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const controller = require('../controllers/asists')

const router = express.Router()

/**
 * Ruta: /user GET
 */

// mostrar colaboradores
router.get(
    `/`,
    controller.displayColabors
)

// crear colaborador

router.post(
    `/colabor/create`,
    controller.createColabor
)

// borrar colaborador

router.post(
    '/colabor/delete',
    controller.deleteColabor
)

// mostrar reporte de asitencias
router.get(
    `/report`,
    controller.displayReport
)

router.post(
    `/report/send`,
    controller.sendReport
)

router.get(
    `/visor`,
    controller.displayVisor
)

router.post(
    `/visor/SendDate`,
    controller.sendVisor
)





module.exports = router