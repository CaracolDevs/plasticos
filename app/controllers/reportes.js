const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const maquinas = require('../models/value').maquinas;
const paros = require('../models/value').paros;
const insumos = require('../models/value').insumos;
const producciones = require('../models/value').producciones;
const fs = require('fs')


const ExcelJS = require('exceljs');



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
    
    let date = new Date(req.body.date)

    async function generarExcel(data) {

//generar datos de databse
        getDatos = async (turno) => {
                 
      let galonLisoPz = 0, galonLisoCs = 0

      let galonLiso =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['GL-J', 'GL-P']
        }
      })


      let galonInsertoPz = 0, galonInsertoCs = 0

      let galonInserto =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['GI-J', 'GI-P']
        }
      })



       let medioGalonPz = 0, medioGalonCs = 0

      let medioGalon =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['MG-J', 'MG-P']
        }
      })



      let litroPz = 0, litroCs = 0

      let litro =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['L-J']
        }
      })


      let medioLitroPz = 0, medioLitroCs = 0

      let medioLitro =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['ML-J','ML-C','ML-B']
        }
      })


      let cuartoLitroPz = 0, cuartoLitroCs = 0

      let cuartoLitro =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['CL-J','CL-C','CL-B']
        }
      })



      let medioLitroEtiquetasPz = 0, medioLitroEtiquetasCs = 0


      let medioLitroEtiquetas =  await producciones.findAll({
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            
            Presentacion: ['ML-F','ML-PC']
        }
        
      })


    let cuartoLitroEtiquetasPz = 0, cuartoLitroEtiquetasCs = 0 

      let cuartoLitroEtiquetas =  await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['CL-F','CL-PC']
        }
      })

      let tapasPz = 0, tapasCs = 0

      let tapas = await producciones.findAll({
        
        attributes: ['ProduccionPzs','ProduccionContenedores'],
        where: {
            Turno: turno,
            Date: date ,
            Presentacion: ['T-N', 'T-A', 'T-AC', 'T-Rj', 'T-Rs', 'T-Am', 'T-V']
        }
      })


      for (let value of galonLiso) {
        galonLisoPz += value.dataValues['ProduccionPzs']
        galonLisoCs += value.dataValues['ProduccionContenedores']
        
      }

      for (let value of galonInserto) {
        galonInsertoPz += value.dataValues['ProduccionPzs']
        galonInsertoCs += value.dataValues['ProduccionContenedores']
        
      }

      for (let value of medioGalon) {
        medioGalonPz += value.dataValues['ProduccionPzs']
        medioGalonCs += value.dataValues['ProduccionContenedores']
        
      }

      for (let value of litro) {
        litroPz += value.dataValues['ProduccionPzs']
        litroCs += value.dataValues['ProduccionContenedores']
        
      }

      
      for (let value of medioLitro) {
        medioLitroPz += value.dataValues['ProduccionPzs']
        medioLitroCs += value.dataValues['ProduccionContenedores']
        
      }


       for (let value of cuartoLitro) {
        cuartoLitroPz += value.dataValues['ProduccionPzs']
        cuartoLitroCs += value.dataValues['ProduccionContenedores']
        
      }


      for (let value of medioLitroEtiquetas) {
        medioLitroEtiquetasPz += value.dataValues['ProduccionPzs']
        medioLitroEtiquetasCs += value.dataValues['ProduccionContenedores']
        
      }


       for (let value of cuartoLitroEtiquetas) {
        cuartoLitroEtiquetasPz += value.dataValues['ProduccionPzs']
        cuartoLitroEtiquetasCs += value.dataValues['ProduccionContenedores']
        
      }

       for (let value of tapas) {
        tapasPz += value.dataValues['ProduccionPzs']
        tapasCs += value.dataValues['ProduccionContenedores']
        
      }




            return [galonLisoCs, galonInsertoCs, medioGalonCs, litroCs, medioLitroCs, cuartoLitroCs, medioLitroEtiquetasCs, cuartoLitroEtiquetasCs, tapasCs ]

        }


        let turno01 = await getDatos('01')
        let turno02 = await getDatos('02')

        console.log( turno01)


        /// set upear worksheet

        addTitles = (worksheet) => {
            worksheet.mergeCells('A2:A10');
        worksheet.mergeCells('A11:A19');
        worksheet.mergeCells('A20:A28');
        
        worksheet.getCell('B2').value = "G. Liso"
        worksheet.getCell('B3').value = "G. Inserto"
        worksheet.getCell('B4').value = "1/2 Galon"
        worksheet.getCell('B5').value = "Litro"
        worksheet.getCell('B6').value = "473ml"
        worksheet.getCell('B7').value = "250ml"
        worksheet.getCell('B8').value = "Etiquetado 473ml"
        worksheet.getCell('B9').value = "Etiquetado 250ml"
        worksheet.getCell('B10').value = "Tapas"

        worksheet.getCell('B11').value = "G. Liso"
        worksheet.getCell('B12').value = "G. Inserto"
        worksheet.getCell('B13').value = "1/2 Galon"
        worksheet.getCell('B14').value = "Litro"
        worksheet.getCell('B15').value = "473ml"
        worksheet.getCell('B16').value = "250ml"
        worksheet.getCell('B17').value = "Etiquetado 473ml"
        worksheet.getCell('B18').value = "Etiquetado 250ml"
        worksheet.getCell('B19').value = "Tapas"

        worksheet.getCell('B20').value = "G. Liso"
        worksheet.getCell('B21').value = "G. Inserto"
        worksheet.getCell('B22').value = "1/2 Galon"
        worksheet.getCell('B23').value = "Litro"
        worksheet.getCell('B24').value = "473ml"
        worksheet.getCell('B25').value = "250ml"
        worksheet.getCell('B26').value = "Etiquetado 473ml"
        worksheet.getCell('B27').value = "Etiquetado 250ml"
        worksheet.getCell('B28').value = "Tapas"

        worksheet.getCell('A1').value = "****"
        worksheet.getCell('B1').value = "Fecha"
        worksheet.getCell('A2').value = "Turno 1";
        worksheet.getCell('A11').value = "Turno 2";
        worksheet.getCell('A20').value = "Total";





        // Envase Horas Hombre Directas




            worksheet.mergeCells('A29:A32');
            worksheet.mergeCells('A33:A36');
            worksheet.mergeCells('A37:A40');
            worksheet.mergeCells('A41:A44');

            worksheet.getCell('B29').value = 'Envases'
            worksheet.getCell('B30').value = 'Personas'
            worksheet.getCell('B31').value = 'Horas Pagadas'
            worksheet.getCell('B32').value = 'EHHD'

            worksheet.getCell('B33').value = 'Envases'
            worksheet.getCell('B34').value = 'Personas'
            worksheet.getCell('B35').value = 'Horas Pagadas'
            worksheet.getCell('B36').value = 'EHHD'

            worksheet.getCell('B37').value = 'Envases'
            worksheet.getCell('B38').value = 'Personas'
            worksheet.getCell('B39').value = 'Horas Pagadas'
            worksheet.getCell('B40').value = 'EHHD'

            worksheet.getCell('B41').value = 'Envases'
            worksheet.getCell('B42').value = 'Personas'
            worksheet.getCell('B43').value = 'Horas Pagadas'
            worksheet.getCell('B44').value = 'EHHD'

            worksheet.getCell('A29').value = 'PT01'
            worksheet.getCell('A33').value = 'PIT01'
            worksheet.getCell('A37').value = 'PT02'
            worksheet.getCell('A41').value = 'PIT02'
        }

        

        const filePath = 'reporte.xlsx';
        const sheetName = 'Reporte Diario';

        async function obtenerWorksheet(filePath, sheetName) {
  const workbook = new ExcelJS.Workbook();

  // Si el archivo existe, lo abre
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  }

  // Buscar la hoja
  let worksheet = workbook.getWorksheet(sheetName);

  // Si NO existe la hoja, se crea
  if (!worksheet) {
    worksheet = workbook.addWorksheet(sheetName);

    addTitles(worksheet)
  }

  return { workbook, worksheet };
        }

        const { workbook, worksheet } = await obtenerWorksheet(filePath, sheetName)

    // capturar valores de envase horas hombre directas

          console.log(req.body)
       
         let pt01 = [(turno01[0] + turno01[1] + turno01[2] + turno01[3]) * 54,
          Number(req.body.PT01_hrs), Number(req.body.PT01_cbs), 
          ((turno01[0] + turno01[1] + turno01[2] + turno01[3]) * 54)/(Number(req.body.PT01_hrs) * Number(req.body.PT01_cbs))]

          let pit01 = [(turno01[4] + turno01[5] + turno01[6] + turno01[7]) * 54,
            Number(req.body.PIT01_hrs),Number(req.body.PIT01_cbs),
        ((turno01[4] + turno01[5] + turno01[6] + turno01[7]) * 54)/(Number(req.body.PIT01_hrs) * Number(req.body.PIT01_cbs))]

            let pt02 = [(turno02[0] + turno02[1] + turno02[2] + turno02[3]) * 54,
            Number(req.body.PT02_hrs), Number(req.body.PT02_cbs),
        ((turno02[0] + turno02[1] + turno02[2] + turno02[3]) * 54)/(Number(req.body.PT02_hrs) * Number(req.body.PT02_cbs)) ]

            let pit02 = [(turno02[4] + turno02[5] + turno02[6] + turno02[7]) * 54,
            Number(req.body.PIT02_hrs), Number(req.body.PIT02_cbs),
        ((turno02[4] + turno02[5] + turno02[6] + turno02[7]) * 54)/ (Number(req.body.PIT02_hrs) * Number(req.body.PIT02_cbs))]

     

    

    
        

   
      // Agregar Datos)

        addColumn = (worksheet, title, values01, values02, pt01, pit01, pt02, pit02) => {

          

          // Obtener fila 1
          const row1 = worksheet.getRow(1);

          // Calcular la siguiente columna disponible
          const col = row1.cellCount + 1;

          // Escribir el título
          row1.getCell(col).value = title;



          // Escribir los valores debajo del título
          values01.forEach((val, i) => {
            worksheet.getRow(i + 2).getCell(col).value = val;
          });


          // Escribir los valores debajo del títulok
          values02.forEach((val, i) => {
            worksheet.getRow(i + 11).getCell(col).value = val;
          });

          // escribir totales debajo del titulo
          for ( let i = 0; i < 9; i++) {
            worksheet.getRow(20 + i).getCell(col).value = values01[i] + values02[i]
          }



          // escribir Envase Horas Hombre Directas

          for ( let i = 0; i < 4; i++) {
            worksheet.getRow(29 + i).getCell(col).value = pt01[i]
            worksheet.getRow(33 + i).getCell(col).value = pit01[i]
            worksheet.getRow(37 + i).getCell(col).value = pt02[i]
            worksheet.getRow(41 + i).getCell(col).value = pit02[i]
          }


          
        }   

        addColumn(worksheet, req.body.date, turno01, turno02, pt01, pit01, pt02, pit02)
        
      
      

      await workbook.xlsx.writeFile('reporte.xlsx');
      console.log('Archivo generado!');
    }


    generarExcel()

    
    
    res.redirect(req.get('referer'));
}

exports.reporteMensualSend = async (req, res) => {
    res.render('reporteMensual', {content})
}