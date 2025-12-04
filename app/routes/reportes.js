const express = require('express')
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const controller = require('../controllers/reportes')

const router = express.Router()

/**
 * Ruta: /user GET
 */

// mostrar reportes
router.get(
    `/`,
    controller.mainPage
)

router.get(
    `/maquina1y2`,
    controller.reportesM1y2
)

router.get(
    `/maquina3`,
    controller.reportesM3
)

router.get(
    `/rochelau`,
    controller.reportesMR
)

router.get(
    `/efecta`,
    controller.reportesME
)

router.get(
    `/tunel`,
    controller.reportesMT
)


// enviar reportes y aguardar info en base de datos


router.post(
    `/maquina1y2/sendReport`,
    controller.reportesM1y2Send
)

router.post(
    `/maquina3/sendReport`,
    controller.reportesM3Send
)

router.post(
    `/rochelau/sendReport`,
    controller.reportesMRSend
)

router.post(
    `/efecta/sendReport`,
    controller.reportesMESend
)

router.post(
    `/tunel/sendReport`,
    controller.reportesMTSend
)




module.exports = router