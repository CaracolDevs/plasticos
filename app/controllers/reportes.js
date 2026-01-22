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
   guardarInsumo(req, req.body.I03, false, 'Pigmento', '05', 'Maquina Efecta')
   guardarProduccion(req, req.body.ME,'05', 'Maquina Efecta')
   res.redirect(req.get('referer'));


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
          Number(req.body.PT01_cbs), Number(req.body.PT01_hrs), 
          ((turno01[0] + turno01[1] + turno01[2] + turno01[3]) * 54)/(Number(req.body.PT01_hrs) * Number(req.body.PT01_cbs))]

          let pit01 = [(turno01[4] + turno01[5] + turno01[6] + turno01[7]) * 54,
            Number(req.body.PIT01_cbs),Number(req.body.PIT01_hrs),
        ((turno01[4] + turno01[5] + turno01[6] + turno01[7]) * 54)/(Number(req.body.PIT01_hrs) * Number(req.body.PIT01_cbs))]

            let pt02 = [(turno02[0] + turno02[1] + turno02[2] + turno02[3]) * 54,
            Number(req.body.PT02_cbs), Number(req.body.PT02_hrs),
        ((turno02[0] + turno02[1] + turno02[2] + turno02[3]) * 54)/(Number(req.body.PT02_hrs) * Number(req.body.PT02_cbs)) ]

            let pit02 = [(turno02[4] + turno02[5] + turno02[6] + turno02[7]) * 54,
            Number(req.body.PIT02_cbs), Number(req.body.PIT02_hrs),
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
    const currentYear = new Date().getFullYear(); // Año actual
    const currentMonth = req.body.date; // Mes actual (0-11 + 1)



    


    let addSheets = async (workbook) => {
      //SOPLADO
      workbook.addWorksheet("LITRO")
      workbook.addWorksheet("MEDIO GALON")
      workbook.addWorksheet("GALON")
      //INYECCCION
      workbook.addWorksheet("MEDIO LITRO")
      workbook.addWorksheet("TAPAS")
      // ETIQUETAS
      workbook.addWorksheet("ETIQUETAS")
      // INDICADORES
      workbook.addWorksheet("INDICADORES")
      // PAROS
      workbook.addWorksheet("PAROS")
      
    }

    let addTitles = async (workbook) => {
      let worksheet = workbook.getWorksheet("LITRO")
      
      let row = worksheet.getRow(1)
      //polietileno
      row.getCell(1).value = "Fecha"
      row.getCell(2).value = "Maquina"
      row.getCell(3).value = "Calaborador"
      row.getCell(4).value = "Turno"
      row.getCell(5).value = "Insumo"
      row.getCell(6).value = "Lote Insumo"
      row.getCell(7).value = "Insumo Inicial"
      row.getCell(8).value = "Insumo Final"
      row.getCell(9).value = "Contenedor"
      row.getCell(10).value = "Contenedor Inicial"
      row.getCell(11).value = "Contenedor Final"
      row.getCell(12).value = "Solicitud de Insumo"
      row.getCell(13).value = "Solicitud de Insumo - Cantidad"
      row.getCell(14).value = "Solicitud de Insumo - Folio"
      row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(16).value = "Inventario Iniciar"
      row.getCell(17).value = "Inventario Final"
      row.getCell(18).value = "Insumo Utilizado"
      row.getCell(19).value = "Insumo Mermado"
      row.getCell(20).value = "Insumo Validado"
      row.getCell(21).value = "Insumo Marca"
      //bolsa
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
      //produccion
      row.getCell(43).value = "Presentacion"
      row.getCell(44).value = "Produccion Pzs"
      row.getCell(45).value = "Produccion Contenedores"
      row.getCell(46).value = "Lote de Produccion"
      row.getCell(47).value = "Folio Entrada"
      row.getCell(48).value = "Horometro Inicial"
      row.getCell(49).value = "Horometro Final"

    



      // GALON COMPARTE INSUMOS CON MEDIO GALON
      worksheet = workbook.getWorksheet("MEDIO GALON")
      row = worksheet.getRow(1)

      //POLIETILENO
    //polietileno
      row.getCell(1).value = "Fecha"
      row.getCell(2).value = "Maquina"
      row.getCell(3).value = "Calaborador"
      row.getCell(4).value = "Turno"
      row.getCell(5).value = "Insumo"
      row.getCell(6).value = "Lote Insumo"
      row.getCell(7).value = "Insumo Inicial"
      row.getCell(8).value = "Insumo Final"
      row.getCell(9).value = "Contenedor"
      row.getCell(10).value = "Contenedor Inicial"
      row.getCell(11).value = "Contenedor Final"
      row.getCell(12).value = "Solicitud de Insumo"
      row.getCell(13).value = "Solicitud de Insumo - Cantidad"
      row.getCell(14).value = "Solicitud de Insumo - Folio"
      row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(16).value = "Inventario Iniciar"
      row.getCell(17).value = "Inventario Final"
      row.getCell(18).value = "Insumo Utilizado"
      row.getCell(19).value = "Insumo Mermado"
      row.getCell(20).value = "Insumo Validado"
      row.getCell(21).value = "Insumo Marca"
      //bolsa
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
      //produccion
      row.getCell(43).value = "Presentacion"
      row.getCell(44).value = "Produccion Pzs"
      row.getCell(45).value = "Produccion Contenedores"
      row.getCell(46).value = "Lote de Produccion"
      row.getCell(47).value = "Folio Entrada"
      row.getCell(48).value = "Horometro Inicial"
      row.getCell(49).value = "Horometro Final"



       worksheet = workbook.getWorksheet("GALON")
       
      row = worksheet.getRow(1)


 //polietileno
      row.getCell(1).value = "Fecha"
      row.getCell(2).value = "Maquina"
      row.getCell(3).value = "Calaborador"
      row.getCell(4).value = "Turno"
      row.getCell(5).value = "Insumo"
      row.getCell(6).value = "Lote Insumo"
      row.getCell(7).value = "Insumo Inicial"
      row.getCell(8).value = "Insumo Final"
      row.getCell(9).value = "Contenedor"
      row.getCell(10).value = "Contenedor Inicial"
      row.getCell(11).value = "Contenedor Final"
      row.getCell(12).value = "Solicitud de Insumo"
      row.getCell(13).value = "Solicitud de Insumo - Cantidad"
      row.getCell(14).value = "Solicitud de Insumo - Folio"
      row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(16).value = "Inventario Iniciar"
      row.getCell(17).value = "Inventario Final"
      row.getCell(18).value = "Insumo Utilizado"
      row.getCell(19).value = "Insumo Mermado"
      row.getCell(20).value = "Insumo Validado"
      row.getCell(21).value = "Insumo Marca"
      //bolsa
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
      //produccion
      row.getCell(43).value = "Presentacion"
      row.getCell(44).value = "Produccion Pzs"
      row.getCell(45).value = "Produccion Contenedores"
      row.getCell(46).value = "Lote de Produccion"
      row.getCell(47).value = "Folio Entrada"
      row.getCell(48).value = "Horometro Inicial"
      row.getCell(49).value = "Horometro Final"




       worksheet = workbook.getWorksheet("MEDIO LITRO")
       row = worksheet.getRow(1)
       
      //polietileno
    row.getCell(1).value = "Fecha"
    row.getCell(2).value = "Maquina"
    row.getCell(3).value = "Calaborador"
    row.getCell(4).value = "Turno"
    row.getCell(5).value = "Insumo"
    row.getCell(6).value = "Lote Insumo"
    row.getCell(7).value = "Insumo Inicial"
    row.getCell(8).value = "Insumo Final"
    row.getCell(9).value = "Contenedor"
    row.getCell(10).value = "Contenedor Inicial"
    row.getCell(11).value = "Contenedor Final"
    row.getCell(12).value = "Solicitud de Insumo"
    row.getCell(13).value = "Solicitud de Insumo - Cantidad"
    row.getCell(14).value = "Solicitud de Insumo - Folio"
    row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
    row.getCell(16).value = "Inventario Iniciar"
    row.getCell(17).value = "Inventario Final"
    row.getCell(18).value = "Insumo Utilizado"
    row.getCell(19).value = "Insumo Mermado"
    row.getCell(20).value = "Insumo Validado"
    row.getCell(21).value = "Insumo Marca"
      //bolsa
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
    

       //pigmento blanco
      row.getCell(43).value = "Fecha"
      row.getCell(44).value = "Maquina"
      row.getCell(45).value = "Calaborador"
      row.getCell(46).value = "Turno"
      row.getCell(47).value = "Insumo"
      row.getCell(48).value = "Lote Insumo"
      row.getCell(49).value = "Insumo Inicial"
      row.getCell(50).value = "Insumo Final"
      row.getCell(51).value = "Contenedor"
      row.getCell(52).value = "Contenedor Inicial"
      row.getCell(53).value = "Contenedor Final"
      row.getCell(54).value = "Solicitud de Insumo"
      row.getCell(55).value = "Solicitud de Insumo - Cantidad"
      row.getCell(56).value = "Solicitud de Insumo - Folio"
      row.getCell(57).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(58).value = "Inventario Iniciar"
      row.getCell(59).value = "Inventario Final"
      row.getCell(60).value = "Insumo Utilizado"
      row.getCell(61).value = "Insumo Mermado"
      row.getCell(62).value = "Insumo Validado"
      row.getCell(63).value = "Insumo Marca"
      //produccion
      //produccion
        //produccion
      row.getCell(64).value = "Presentacion"
      row.getCell(65).value = "Produccion Pzs"
      row.getCell(66).value = "Produccion Contenedores"
      row.getCell(67).value = "Lote de Produccion"
      row.getCell(68).value = "Folio Entrada"
      row.getCell(69).value = "Horometro Inicial"
      row.getCell(70).value = "Horometro Final"


      

       worksheet = workbook.getWorksheet("TAPAS")
        row = worksheet.getRow(1)

     //polietileno
      row.getCell(1).value = "Fecha"
      row.getCell(2).value = "Maquina"
      row.getCell(3).value = "Calaborador"
      row.getCell(4).value = "Turno"
      row.getCell(5).value = "Insumo"
      row.getCell(6).value = "Lote Insumo"
      row.getCell(7).value = "Insumo Inicial"
      row.getCell(8).value = "Insumo Final"
      row.getCell(9).value = "Contenedor"
      row.getCell(10).value = "Contenedor Inicial"
      row.getCell(11).value = "Contenedor Final"
      row.getCell(12).value = "Solicitud de Insumo"
      row.getCell(13).value = "Solicitud de Insumo - Cantidad"
      row.getCell(14).value = "Solicitud de Insumo - Folio"
      row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(16).value = "Inventario Iniciar"
      row.getCell(17).value = "Inventario Final"
      row.getCell(18).value = "Insumo Utilizado"
      row.getCell(19).value = "Insumo Mermado"
      row.getCell(20).value = "Insumo Validado"
      row.getCell(21).value = "Insumo Marca"
      //caja
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
    

    
      row.getCell(43).value = "Fecha"
      row.getCell(44).value = "Maquina"
      row.getCell(45).value = "Calaborador"
      row.getCell(46).value = "Turno"
      row.getCell(47).value = "Insumo"
      row.getCell(48).value = "Lote Insumo"
      row.getCell(49).value = "Insumo Inicial"
      row.getCell(50).value = "Insumo Final"
      row.getCell(51).value = "Contenedor"
      row.getCell(52).value = "Contenedor Inicial"
      row.getCell(53).value = "Contenedor Final"
      row.getCell(54).value = "Solicitud de Insumo"
      row.getCell(55).value = "Solicitud de Insumo - Cantidad"
      row.getCell(56).value = "Solicitud de Insumo - Folio"
      row.getCell(57).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(58).value = "Inventario Iniciar"
      row.getCell(59).value = "Inventario Final"
      row.getCell(60).value = "Insumo Utilizado"
      row.getCell(61).value = "Insumo Mermado"
      row.getCell(62).value = "Insumo Validado"
      row.getCell(63).value = "Insumo Marca"

        //pigmento 
      row.getCell(64).value = "Fecha"
      row.getCell(65).value = "Maquina"
      row.getCell(66).value = "Calaborador"
      row.getCell(67).value = "Turno"
      row.getCell(68).value = "Insumo"
      row.getCell(69).value = "Lote Insumo"
      row.getCell(71).value = "Insumo Inicial"
      row.getCell(72).value = "Insumo Final"
      row.getCell(73).value = "Contenedor"
      row.getCell(74).value = "Contenedor Inicial"
      row.getCell(75).value = "Contenedor Final"
      row.getCell(76).value = "Solicitud de Insumo"
      row.getCell(77).value = "Solicitud de Insumo - Cantidad"
      row.getCell(78).value = "Solicitud de Insumo - Folio"
      row.getCell(79).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(80).value = "Inventario Iniciar"
      row.getCell(81).value = "Inventario Final"
      row.getCell(82).value = "Insumo Utilizado"
      row.getCell(83).value = "Insumo Mermado"
      row.getCell(84).value = "Insumo Validado"
      row.getCell(85).value = "Insumo Marca"
      //produccion
 
      row.getCell(86).value = "Presentacion"
      row.getCell(87).value = "Produccion Pzs"
      row.getCell(88).value = "Produccion Contenedores"
      row.getCell(89).value = "Lote de Produccion"
      row.getCell(90).value = "Folio Entrada"
      row.getCell(91).value = "Horometro Inicial"
      row.getCell(92).value = "Horometro Final"



         worksheet = workbook.getWorksheet("ETIQUETAS")
          row = worksheet.getRow(1)

       
      //etiqeuta
      row.getCell(1).value = "Fecha"
      row.getCell(2).value = "Maquina"
      row.getCell(3).value = "Calaborador"
      row.getCell(4).value = "Turno"
      row.getCell(5).value = "Insumo"
      row.getCell(6).value = "Lote Insumo"
      row.getCell(7).value = "Insumo Inicial"
      row.getCell(8).value = "Insumo Final"
      row.getCell(9).value = "Contenedor"
      row.getCell(10).value = "Contenedor Inicial"
      row.getCell(11).value = "Contenedor Final"
      row.getCell(12).value = "Solicitud de Insumo"
      row.getCell(13).value = "Solicitud de Insumo - Cantidad"
      row.getCell(14).value = "Solicitud de Insumo - Folio"
      row.getCell(15).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(16).value = "Inventario Iniciar"
      row.getCell(17).value = "Inventario Final"
      row.getCell(18).value = "Insumo Utilizado"
      row.getCell(19).value = "Insumo Mermado"
      row.getCell(20).value = "Insumo Validado"
      row.getCell(21).value = "Insumo Marca"
      //bolsa
      row.getCell(22).value = "Fecha"
      row.getCell(23).value = "Maquina"
      row.getCell(24).value = "Calaborador"
      row.getCell(25).value = "Turno"
      row.getCell(26).value = "Insumo"
      row.getCell(27).value = "Lote Insumo"
      row.getCell(28).value = "Insumo Inicial"
      row.getCell(29).value = "Insumo Final"
      row.getCell(30).value = "Contenedor"
      row.getCell(31).value = "Contenedor Inicial"
      row.getCell(32).value = "Contenedor Final"
      row.getCell(33).value = "Solicitud de Insumo"
      row.getCell(34).value = "Solicitud de Insumo - Cantidad"
      row.getCell(35).value = "Solicitud de Insumo - Folio"
      row.getCell(36).value = "Solicitud de Insumo - Folio Salida"
      row.getCell(37).value = "Inventario Iniciar"
      row.getCell(38).value = "Inventario Final"
      row.getCell(39).value = "Insumo Utilizado"
      row.getCell(40).value = "Insumo Mermado"
      row.getCell(41).value = "Insumo Validado"
      row.getCell(42).value = "Insumo Marca"
      //produccion
      row.getCell(43).value = "Presentacion"
      row.getCell(44).value = "Produccion Pzs"
      row.getCell(45).value = "Produccion Contenedores"
      row.getCell(46).value = "Lote de Produccion"
      row.getCell(47).value = "Folio Entrada"
      row.getCell(48).value = "Horometro Inicial"
      row.getCell(49).value = "Horometro Final"







      //paros

       worksheet = workbook.getWorksheet("PAROS")
        row = worksheet.getRow(1)

       row.getCell(1).value = "Fecha"
       row.getCell(2).value = "Colaborador"
       row.getCell(3).value = "Maquina"
       row.getCell(4).value = "Tipo Paro"
       row.getCell(5).value = "Paro"
       row.getCell(6).value = "Inicio"
       row.getCell(7).value = "Final"
       row.getCell(8).value = "Diferencia"

    }


    //se agregan valores a hojas con secuencia //poletileno - bolsa - produccion (litro)
    let addValuesLitro = async (workbook) => {

      let polietileno =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Polietileno AD' AND
          Maquina = 'Maquina 3'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina 3'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina 3'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });




      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio")
      }




  let worksheetLitro = workbook.getWorksheet("LITRO")
      //polietileno
      // Obtener fila 1

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
       let row = worksheetLitro.getRow(1 + 1);
                console.log(polietileno[i].Date)
            row.getCell(1).value =  polietileno[i].Date
            row.getCell(2).value =  polietileno[i].Maquina
            row.getCell(3).value =  polietileno[i].Colabor
            row.getCell(4).value =  polietileno[i].Turno
            row.getCell(5).value =  polietileno[i].Insumo
            row.getCell(6).value =  polietileno[i].LoteInsumo
            row.getCell(7).value =  polietileno[i].InsumoInicial
            row.getCell(8).value =  polietileno[i].InsumoFinal
            row.getCell(9).value =  polietileno[i].Contenedor
            row.getCell(10).value = polietileno[i].ContenedorInicial
            row.getCell(11).value = polietileno[i].ContenedorFinal
            row.getCell(12).value = polietileno[i].SolicitudInsumo
            row.getCell(13).value = polietileno[i].SolicitudInsumoQty
            row.getCell(14).value = polietileno[i].SolicitudInsumoFolio
            row.getCell(15).value = polietileno[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = polietileno[i].InventarioInicial
            row.getCell(17).value = polietileno[i].InventarioFinal
            row.getCell(18).value = polietileno[i].InsumoUtilizado  
            row.getCell(19).value = polietileno[i].InsumoMermado
            row.getCell(20).value = polietileno[i].InsumoValidado
            row.getCell(21).value = polietileno[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca


            row.getCell(43).value = producto[i].Presentacion
            row.getCell(44).value = producto[i].ProduccionPzs
            row.getCell(45).value = producto[i].ProduccionContenedores
            row.getCell(46).value = producto[i].LoteProduccion
            row.getCell(47).value = producto[i].FolioEntrada
            row.getCell(48).value = producto[i].HorometroInicial
            row.getCell(49).value = producto[i].HorometroFinal
              





          }
        



    }

    //se agregan valores a hojas con secuencia //poletileno - bolsa - produccion (medio galon)
    let addValuesMedioGalon = async (workbook) => {

      let polietileno =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Polietileno AD' AND
          Maquina = 'Maquina 1 y 2'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina 1 y 2'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina 1'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });




      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio")
      }




  let worksheetLitro = workbook.getWorksheet("MEDIO GALON")
      //polietileno
      // Obtener fila 1

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
      let row = worksheetLitro.getRow(i + 2);
                console.log(polietileno[i].Date)
            row.getCell(1).value =  polietileno[i].Date
            row.getCell(2).value =  polietileno[i].Maquina
            row.getCell(3).value =  polietileno[i].Colabor
            row.getCell(4).value =  polietileno[i].Turno
            row.getCell(5).value =  polietileno[i].Insumo
            row.getCell(6).value =  polietileno[i].LoteInsumo
            row.getCell(7).value =  polietileno[i].InsumoInicial
            row.getCell(8).value =  polietileno[i].InsumoFinal
            row.getCell(9).value =  polietileno[i].Contenedor
            row.getCell(10).value = polietileno[i].ContenedorInicial
            row.getCell(11).value = polietileno[i].ContenedorFinal
            row.getCell(12).value = polietileno[i].SolicitudInsumo
            row.getCell(13).value = polietileno[i].SolicitudInsumoQty
            row.getCell(14).value = polietileno[i].SolicitudInsumoFolio
            row.getCell(15).value = polietileno[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = polietileno[i].InventarioInicial
            row.getCell(17).value = polietileno[i].InventarioFinal
            row.getCell(18).value = polietileno[i].InsumoUtilizado  
            row.getCell(19).value = polietileno[i].InsumoMermado
            row.getCell(20).value = polietileno[i].InsumoValidado
            row.getCell(21).value = polietileno[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca


            row.getCell(43).value = producto[i].Presentacion
            row.getCell(44).value = producto[i].ProduccionPzs
            row.getCell(45).value = producto[i].ProduccionContenedores
            row.getCell(46).value = producto[i].LoteProduccion
            row.getCell(47).value = producto[i].FolioEntrada
            row.getCell(48).value = producto[i].HorometroInicial
            row.getCell(49).value = producto[i].HorometroFinal
              





          }
        



    }

    let addValuesGalon = async (workbook) => {

      let polietileno =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Polietileno AD' AND
          Maquina = 'Maquina 1 y 2'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina 1 y 2'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina 2'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });

      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio")
      }







  let worksheetLitro = workbook.getWorksheet("GALON")
      //polietileno
      // Obtener fila 1

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
      
      let row = worksheetLitro.getRow(i + 2);
                console.log(polietileno[i].Date)
            row.getCell(1).value =  polietileno[i].Date
            row.getCell(2).value =  polietileno[i].Maquina
            row.getCell(3).value =  polietileno[i].Colabor
            row.getCell(4).value =  polietileno[i].Turno
            row.getCell(5).value =  polietileno[i].Insumo
            row.getCell(6).value =  polietileno[i].LoteInsumo
            row.getCell(7).value =  polietileno[i].InsumoInicial
            row.getCell(8).value =  polietileno[i].InsumoFinal
            row.getCell(9).value =  polietileno[i].Contenedor
            row.getCell(10).value = polietileno[i].ContenedorInicial
            row.getCell(11).value = polietileno[i].ContenedorFinal
            row.getCell(12).value = polietileno[i].SolicitudInsumo
            row.getCell(13).value = polietileno[i].SolicitudInsumoQty
            row.getCell(14).value = polietileno[i].SolicitudInsumoFolio
            row.getCell(15).value = polietileno[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = polietileno[i].InventarioInicial
            row.getCell(17).value = polietileno[i].InventarioFinal
            row.getCell(18).value = polietileno[i].InsumoUtilizado  
            row.getCell(19).value = polietileno[i].InsumoMermado
            row.getCell(20).value = polietileno[i].InsumoValidado
            row.getCell(21).value = polietileno[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca


            row.getCell(43).value = producto[i].Presentacion
            row.getCell(44).value = producto[i].ProduccionPzs
            row.getCell(45).value = producto[i].ProduccionContenedores
            row.getCell(46).value = producto[i].LoteProduccion
            row.getCell(47).value = producto[i].FolioEntrada
            row.getCell(48).value = producto[i].HorometroInicial
            row.getCell(49).value = producto[i].HorometroFinal
              





          }
        



    }

    let addValuesMedioLitro = async (workbook) => {

      let polietileno =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Polietileno AD' AND
          Maquina = 'Maquina Rochelau'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina Rochelau'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });


      let pigmento =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Pigmento Blanco' AND
          Maquina = 'Maquina Rochelau'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina Rochelau'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });


      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio")
      }






  let worksheetLitro = workbook.getWorksheet("MEDIO LITRO")
      //polietileno
      // Obtener fila 1

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
      
      let row = worksheetLitro.getRow(i + 2);
                console.log(polietileno[i].Date)
            row.getCell(1).value =  polietileno[i].Date
            row.getCell(2).value =  polietileno[i].Maquina
            row.getCell(3).value =  polietileno[i].Colabor
            row.getCell(4).value =  polietileno[i].Turno
            row.getCell(5).value =  polietileno[i].Insumo
            row.getCell(6).value =  polietileno[i].LoteInsumo
            row.getCell(7).value =  polietileno[i].InsumoInicial
            row.getCell(8).value =  polietileno[i].InsumoFinal
            row.getCell(9).value =  polietileno[i].Contenedor
            row.getCell(10).value = polietileno[i].ContenedorInicial
            row.getCell(11).value = polietileno[i].ContenedorFinal
            row.getCell(12).value = polietileno[i].SolicitudInsumo
            row.getCell(13).value = polietileno[i].SolicitudInsumoQty
            row.getCell(14).value = polietileno[i].SolicitudInsumoFolio
            row.getCell(15).value = polietileno[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = polietileno[i].InventarioInicial
            row.getCell(17).value = polietileno[i].InventarioFinal
            row.getCell(18).value = polietileno[i].InsumoUtilizado  
            row.getCell(19).value = polietileno[i].InsumoMermado
            row.getCell(20).value = polietileno[i].InsumoValidado
            row.getCell(21).value = polietileno[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca


            row.getCell(43).value = pigmento[i].Date
            row.getCell(44).value = pigmento[i].Maquina
            row.getCell(45).value = pigmento[i].Colabor
            row.getCell(46).value = pigmento[i].Turno
            row.getCell(47).value = pigmento[i].Insumo
            row.getCell(48).value = pigmento[i].LoteInsumo
            row.getCell(49).value = pigmento[i].InsumoInicial
            row.getCell(50).value = pigmento[i].InsumoFinal
            row.getCell(51).value = pigmento[i].Contenedor
            row.getCell(52).value = pigmento[i].ContenedorInicial
            row.getCell(53).value = pigmento[i].ContenedorFinal
            row.getCell(54).value = pigmento[i].SolicitudInsumo
            row.getCell(55).value = pigmento[i].SolicitudInsumoQty
            row.getCell(56).value = pigmento[i].SolicitudInsumoFolio
            row.getCell(57).value = pigmento[i].SolicitudInsumoFolioSalida
            row.getCell(58).value = pigmento[i].InventarioInicial
            row.getCell(59).value = pigmento[i].InventarioFinal
            row.getCell(60).value = pigmento[i].InsumoUtilizado  
            row.getCell(61).value = pigmento[i].InsumoMermado
            row.getCell(62).value = pigmento[i].InsumoValidado
            row.getCell(63).value = pigmento[i].InsumoMarca


            row.getCell(64).value = producto[i].Presentacion
            row.getCell(65).value = producto[i].ProduccionPzs
            row.getCell(66).value = producto[i].ProduccionContenedores
            row.getCell(68).value = producto[i].LoteProduccion
            row.getCell(69).value = producto[i].FolioEntrada
            row.getCell(70).value = producto[i].HorometroInicial
            row.getCell(71).value = producto[i].HorometroFinal
              





          }
        



    }

    let addValuesTapas = async (workbook) => {

      let polietileno =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Polietileno BD' AND
          Maquina = 'Maquina Efecta'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina Efecta'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

       let caja =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Caja' AND
          Maquina = 'Maquina Efecta'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });


      let pigmento =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Pigmento' AND
          Maquina = 'Maquina Efecta'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina Efecta'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });

      console.log(producto[0])
      console.log(producto)


      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio")
      }


  let worksheetLitro = workbook.getWorksheet("TAPAS")
      //polietileno
      // Obtener fila 1

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
      
      let row = worksheetLitro.getRow(i + 2);
                console.log(polietileno[i].Date)
            row.getCell(1).value =  polietileno[i].Date
            row.getCell(2).value =  polietileno[i].Maquina
            row.getCell(3).value =  polietileno[i].Colabor
            row.getCell(4).value =  polietileno[i].Turno
            row.getCell(5).value =  polietileno[i].Insumo
            row.getCell(6).value =  polietileno[i].LoteInsumo
            row.getCell(7).value =  polietileno[i].InsumoInicial
            row.getCell(8).value =  polietileno[i].InsumoFinal
            row.getCell(9).value =  polietileno[i].Contenedor
            row.getCell(10).value = polietileno[i].ContenedorInicial
            row.getCell(11).value = polietileno[i].ContenedorFinal
            row.getCell(12).value = polietileno[i].SolicitudInsumo
            row.getCell(13).value = polietileno[i].SolicitudInsumoQty
            row.getCell(14).value = polietileno[i].SolicitudInsumoFolio
            row.getCell(15).value = polietileno[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = polietileno[i].InventarioInicial
            row.getCell(17).value = polietileno[i].InventarioFinal
            row.getCell(18).value = polietileno[i].InsumoUtilizado  
            row.getCell(19).value = polietileno[i].InsumoMermado
            row.getCell(20).value = polietileno[i].InsumoValidado
            row.getCell(21).value = polietileno[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca

            row.getCell(43).value = caja[i].Date
            row.getCell(44).value = caja[i].Maquina
            row.getCell(45).value = caja[i].Colabor
            row.getCell(46).value = caja[i].Turno
            row.getCell(47).value = caja[i].Insumo
            row.getCell(48).value = caja[i].LoteInsumo
            row.getCell(49).value = caja[i].InsumoInicial
            row.getCell(50).value = caja[i].InsumoFinal
            row.getCell(51).value = caja[i].Contenedor
            row.getCell(52).value = caja[i].ContenedorInicial
            row.getCell(53).value = caja[i].ContenedorFinal
            row.getCell(54).value = caja[i].SolicitudInsumo
            row.getCell(55).value = caja[i].SolicitudInsumoQty
            row.getCell(56).value = caja[i].SolicitudInsumoFolio
            row.getCell(57).value = caja[i].SolicitudInsumoFolioSalida
            row.getCell(58).value = caja[i].InventarioInicial
            row.getCell(59).value = caja[i].InventarioFinal
            row.getCell(60).value = caja[i].InsumoUtilizado  
            row.getCell(61).value = caja[i].InsumoMermado
            row.getCell(62).value = caja[i].InsumoValidado
            row.getCell(63).value = caja[i].InsumoMarca



            row.getCell(64).value = pigmento[i].Date
            row.getCell(65).value = pigmento[i].Maquina
            row.getCell(66).value = pigmento[i].Colabor
            row.getCell(67).value = pigmento[i].Turno
            row.getCell(68).value = pigmento[i].Insumo
            row.getCell(69).value = pigmento[i].LoteInsumo
            row.getCell(70).value = pigmento[i].InsumoInicial
            row.getCell(71).value = pigmento[i].InsumoFinal
            row.getCell(72).value = pigmento[i].Contenedor
            row.getCell(73).value = pigmento[i].ContenedorInicial
            row.getCell(74).value = pigmento[i].ContenedorFinal
            row.getCell(75).value = pigmento[i].SolicitudInsumo
            row.getCell(76).value = pigmento[i].SolicitudInsumoQty
            row.getCell(77).value = pigmento[i].SolicitudInsumoFolio
            row.getCell(78).value = pigmento[i].SolicitudInsumoFolioSalida
            row.getCell(79).value = pigmento[i].InventarioInicial
            row.getCell(80).value = pigmento[i].InventarioFinal
            row.getCell(81).value = pigmento[i].InsumoUtilizado  
            row.getCell(82).value = pigmento[i].InsumoMermado
            row.getCell(83).value = pigmento[i].InsumoValidado
            row.getCell(84).value = pigmento[i].InsumoMarca


            row.getCell(85).value = producto[i].Presentacion
            row.getCell(86).value = producto[i].ProduccionPzs
            row.getCell(87).value = producto[i].ProduccionContenedores
            row.getCell(88).value = producto[i].LoteProduccion
            row.getCell(89).value = producto[i].FolioEntrada
            row.getCell(90).value = producto[i].HorometroInicial
            row.getCell(91).value = producto[i].HorometroFinal
              





          }
        



    }

    let addValuesEtiquetas = async (workbook) => {

      let etiqueta =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Etiqueta' AND
          Maquina = 'Maquina Tunel de Calor'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno', 'Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      
      let bolsa =  await insumos.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Insumo = 'Bolsa' AND
          Maquina = 'Maquina Tunel de Calor'

        `),
        attributes: 
          ['Date','Maquina','Colabor', 'Turno','Insumo', 'LoteInsumo', 'InsumoInicial', 'InsumoFinal',
            'Contenedor', 'ContenedorInicial', 'ContenedorFinal', 'SolicitudInsumo', 'SolicitudInsumoQty',
            'SolicitudInsumoFolio', 'SolicitudInsumoFolioSalida', 'InventarioInicial', 'InventarioFinal', 'InsumoUtilizado',
            'InsumoMermado', 'InsumoValidado', 'InsumoMarca'
          ]
        
      });

      let producto =  await producciones.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} AND
          Maquina = 'Maquina Tunel de Calor'

        `),
         attributes: 
          ['Presentacion', 'ProduccionPzs', 'ProduccionContenedores', 'LoteProduccion', 'FolioEntrada', 'HorometroInicial', 'HorometroFinal'
          ]
        
      });




      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio 02")
      }




  let worksheetLitro = workbook.getWorksheet("ETIQUETAS")
      //polietileno
      // Obtener fila 1
         

         let cantidadRows = producto.length

         /*  let insumo01Cols = 21, insumo02Cols = 21, produccionCols = 7

          for (let i = 0; i < cantidadRows; i++) {
            for (let j = 0; j< insumo01Cols; j++) {
              row.getCell(j + 1).value = polietileno[i]
            }

            for (let j = 0; j< insumo02Cols; j++) {
              row.getCell(j + 1 + 21).value = bolsa[i]
            }*/


        
    for (let i = 0; i < cantidadRows; i++) {
      
      let row = worksheetLitro.getRow(i + 2);
            row.getCell(1).value =  etiqueta[i].Date
            row.getCell(2).value =  etiqueta[i].Maquina
            row.getCell(3).value =  etiqueta[i].Colabor
            row.getCell(4).value =  etiqueta[i].Turno
            row.getCell(5).value =  etiqueta[i].Insumo
            row.getCell(6).value =  etiqueta[i].LoteInsumo
            row.getCell(7).value =  etiqueta[i].InsumoInicial
            row.getCell(8).value =  etiqueta[i].InsumoFinal
            row.getCell(9).value =  etiqueta[i].Contenedor
            row.getCell(10).value = etiqueta[i].ContenedorInicial
            row.getCell(11).value = etiqueta[i].ContenedorFinal
            row.getCell(12).value = etiqueta[i].SolicitudInsumo
            row.getCell(13).value = etiqueta[i].SolicitudInsumoQty
            row.getCell(14).value = etiqueta[i].SolicitudInsumoFolio
            row.getCell(15).value = etiqueta[i].SolicitudInsumoFolioSalida
            row.getCell(16).value = etiqueta[i].InventarioInicial
            row.getCell(17).value = etiqueta[i].InventarioFinal
            row.getCell(18).value = etiqueta[i].InsumoUtilizado  
            row.getCell(19).value = etiqueta[i].InsumoMermado
            row.getCell(20).value = etiqueta[i].InsumoValidado
            row.getCell(21).value = etiqueta[i].InsumoMarca

            row.getCell(22).value = bolsa[i].Date
            row.getCell(23).value = bolsa[i].Maquina
            row.getCell(24).value = bolsa[i].Colabor
            row.getCell(25).value = bolsa[i].Turno
            row.getCell(26).value = bolsa[i].Insumo
            row.getCell(27).value = bolsa[i].LoteInsumo
            row.getCell(28).value = bolsa[i].InsumoInicial
            row.getCell(29).value = bolsa[i].InsumoFinal
            row.getCell(30).value = bolsa[i].Contenedor
            row.getCell(31).value = bolsa[i].ContenedorInicial
            row.getCell(32).value = bolsa[i].ContenedorFinal
            row.getCell(33).value = bolsa[i].SolicitudInsumo
            row.getCell(34).value = bolsa[i].SolicitudInsumoQty
            row.getCell(35).value = bolsa[i].SolicitudInsumoFolio
            row.getCell(36).value = bolsa[i].SolicitudInsumoFolioSalida
            row.getCell(37).value = bolsa[i].InventarioInicial
            row.getCell(38).value = bolsa[i].InventarioFinal
            row.getCell(39).value = bolsa[i].InsumoUtilizado  
            row.getCell(40).value = bolsa[i].InsumoMermado
            row.getCell(41).value = bolsa[i].InsumoValidado
            row.getCell(42).value = bolsa[i].InsumoMarca


            row.getCell(43).value = producto[i].Presentacion
            row.getCell(44).value = producto[i].ProduccionPzs
            row.getCell(45).value = producto[i].ProduccionContenedores
            row.getCell(46).value = producto[i].LoteProduccion
            row.getCell(47).value = producto[i].FolioEntrada
            row.getCell(48).value = producto[i].HorometroInicial
            row.getCell(49).value = producto[i].HorometroFinal
              





          }
        



    }


    let addValuesParos= async (workbook) => {


      let producto =  await paros.findAll({
        where: Sequelize.literal(`
          MONTH(Date) = ${currentMonth} AND
          YEAR(Date) = ${currentYear} 

        `),
         attributes: 
          ['Date', 'Colabor', 'Maquina', 'TipoParo', 'Paro', 'HoraInicio', 'HoraFinal', 'DifMinutos']
        
      });




      if(producto.length == 0)  {
        console.log("jto")
        return console.log("vacio 02")
      }




  let worksheetLitro = workbook.getWorksheet("Paros")
      //polietileno
      // Obtener fila 1
         

         let cantidadRows = producto.length



        
    for (let i = 0; i < cantidadRows; i++) {
   

      row.getCell(43).value = producto[i].Date
      row.getCell(43).value = producto[i].Colabor
      row.getCell(44).value = producto[i].Maquina
      row.getCell(45).value = producto[i].TipoParo
      row.getCell(46).value = producto[i].Paro
      row.getCell(47).value = producto[i].HoraInicio
      row.getCell(48).value = producto[i].HoraFinal
      row.getCell(49).value = producto[i].DifMinutos
              
    }
        



    }



    

    const filePath = 'reporteMensual.xlsx';

    async function obtenerWorkbook(filePath) {
      const workbook = new ExcelJS.Workbook()
      

        return { workbook };
    }

    const { workbook } = await obtenerWorkbook(filePath)

      await addSheets(workbook)
      await addTitles(workbook)
      await addValuesLitro(workbook)
      await addValuesMedioGalon(workbook)
      await addValuesGalon(workbook)
      await addValuesMedioLitro(workbook)
      await addValuesTapas(workbook)
      await addValuesEtiquetas(workbook)
      await addValuesParos(workbook)


    await workbook.xlsx.writeFile('Reporte Mensual.xlsx')


  

    
    res.render('reporteMensual')
}