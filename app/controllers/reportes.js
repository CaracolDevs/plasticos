const mongoose = require('mongoose')
const model = require('../models/user')


const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').colaboradores;
const maquinas = require('../models/value').maquinas;
const paros = require('../models/value').paros;
const insumos = require('../models/value').insumos;
const producciones = require('../models/value').producciones;
const fs = require('fs')
const path = require('path');


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
    console.log(insumo)

   

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

    console.log("PRODUCCCION")
    console.log(produccion)

    let embolsador01 = 0, embolsador02 = 0

    if(produccion.embolsador01 != undefined ) {
      embolsador01 = produccion.embolsador01

    }

    if(produccion.embolsador02 != undefined ) {
      embolsador02 = produccion.embolsador02

    }

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
        HorometroFinal: Number(produccion.HF),
        InsumoUtilizado: Number(produccion.MPutilizada),
        MermaPzs: Number(produccion.mermaPzs),
        MermaBolsas: Number(produccion.mermaBolsas),
        MermaInsumoUtilizado:  Number(produccion.MPutilizadaMerma),
        Embolsador01: embolsador01,
        Embolsador02: embolsador02,



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
   guardarInsumo(req, req.body.I04, false, 'Pigmento '+req.body.I04.color, '05', 'Maquina Efecta')
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
        
      
      

      await workbook.xlsx.writeFile('Excel/reporte.xlsx');
      console.log('Archivo generado!');
    }


    generarExcel()

    
    
    res.redirect(req.get('referer'));
}



exports.reporteMensualSend = async (req, res) => {
  //genera la hoja del dia en el worksheet
    async function generarHojaDelDia() {
  const hoy = new Date(req.body.date)

  const year = hoy.getFullYear();
  const month = hoy.getMonth() + 1;
  const day = hoy.getUTCDate();

  const monthStr = String(month).padStart(2, '0');

  const carpetaExcel = path.join(__dirname, '../../Excel');
  if (!fs.existsSync(carpetaExcel)) {
    fs.mkdirSync(carpetaExcel);
  }

  const archivoPlantilla = path.join(__dirname, '../../Excel/Ejemplo.xlsx');
  const archivoMes = path.join(carpetaExcel, `${year}-${monthStr}.xlsx`);

  let filePath = '../../Excel'
  let sheetName = `${year}-${monthStr}.xlsx`

  const workbookMes = new ExcelJS.Workbook();

  // Abrir o crear archivo del mes
  if (fs.existsSync(archivoMes)) {
    await workbookMes.xlsx.readFile(archivoMes);
  } else {
    await workbookMes.xlsx.writeFile(archivoMes);
  }

  // Abrir plantilla
  const workbookPlantilla = new ExcelJS.Workbook();
  await workbookPlantilla.xlsx.readFile(archivoPlantilla);
  const hojaPlantilla = workbookPlantilla.worksheets[0];

  const nombreHojaDia = `Dia ${day}`;

  // Verificar si la hoja ya existe
  if (workbookMes.getWorksheet(nombreHojaDia)) {
    console.log(`La hoja "${nombreHojaDia}" ya existe`);
    return {workbookMes, archivoMes, nombreHojaDia, filePath};
  }

  // Crear hoja del día
  const nuevaHoja = workbookMes.addWorksheet(nombreHojaDia);

  // Copiar columnas
  nuevaHoja.columns = hojaPlantilla.columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width
  }));

  // Copiar filas y alturas
  hojaPlantilla.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const nuevaFila = nuevaHoja.getRow(rowNumber);
    nuevaFila.values = row.values;
    nuevaFila.height = row.height;
  });

  // Copiar estilos celda por celda
  hojaPlantilla.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      nuevaHoja.getCell(rowNumber, colNumber).style = { ...cell.style };
    });
  });

  // Guardar archivo del mes
  await workbookMes.xlsx.writeFile(archivoMes);

  console.log(`Hoja "${nombreHojaDia}" creada correctamente en ${archivoMes}`);

    return {workbookMes, archivoMes, nombreHojaDia, filePath}
    }
    
    const {workbookMes,archivoMes,nombreHojaDia, filePath} = await generarHojaDelDia()
    let date = new Date(req.body.date)

    let getInsumo =  async (maquina, turno) => {
      let result =  await insumos.findAll({
        where: {
            Maquina: maquina,
            Turno: turno,
            Date: date 
        }
        ,
        order: [
         ['Insumo', 'DESC']
  ]
      })
      return result
    }

    let getProducto =  async (maquina, turno) => {
      let result =  await producciones.findAll({
        where: {
            Maquina: maquina,
            Turno: turno,
            Date: date 
        }
      })
      return result
    }


    let getValuesMaquina = async (maquinaProducto, turno, maquinaInsumo) => {
      let insumo = await getInsumo(maquinaInsumo, turno)
      let producto = await getProducto(maquinaProducto, turno)
      return {insumo, producto}
      
    } 
/*
    //conseguir worksheet
    async function obtenerWorksheet(filePath, sheetName) {
       const workbook = new ExcelJS.Workbook()
       // Si el archivo existe, lo abre
       if (fs.existsSync(filePath)) {
         await workbook.xlsx.readFile(filePath);
       }
     
       // Buscar la hoja
       let worksheet = workbook.getWorksheet(sheetName);
     
       // Si NO existe la hoja, se crea
       if (!worksheet) {
         worksheet = workbook.addWorksheet(sheetName);
       
       }
     
       return { workbook, worksheet };
    }

    let { workbook, worksheet } = await obtenerWorksheet(filePath, nombreHojaDia)*/






    
    //maquina 01

    let displayValuesMaquina1 = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina 1',1, 'Maquina 1 y 2')
      let valuesTurno02 = await getValuesMaquina('Maquina 1',2, 'Maquina 1 y 2')
      
 
      // verificar si encontro data TURNO 1
      console.log(valuesTurno01)
      if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('C5').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C6').value = insumos[0].dataValues['ContenedorInicial']
        worksheet.getCell('D7').value = insumos[1].dataValues['InsumoInicial']
        worksheet.getCell('E5').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('E7').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('B8').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B9').value = insumos[0].dataValues['LoteInsumo']


        worksheet.getCell('G5').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('G6').value = insumos[0].dataValues['ContenedorFinal']
        worksheet.getCell('H7').value = insumos[1].dataValues['InsumoFinal']

        
        worksheet.getCell('C11').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F11').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H11').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B12').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B13').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B14').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B15').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B16').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D16').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E16').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F16').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H13').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H14').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H15').value = productos[0].dataValues['MermaInsumoUtilziado']
        





       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('C97').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C98').value = insumos[0].dataValues['ContenedorInicial']
        worksheet.getCell('D99').value = insumos[1].dataValues['InsumoInicial']
        worksheet.getCell('E97').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('E99').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('G97').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('G98').value = insumos[0].dataValues['ContenedorFinal']
        worksheet.getCell('H99').value = insumos[1].dataValues['InsumoFinal']

        worksheet.getCell('B100').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B101').value = insumos[0].dataValues['LoteInsumo']

        
        worksheet.getCell('C103').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F103').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H103').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B104').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B105').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B106').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B107').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B108').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D108').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E108').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F108').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H105').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H106').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H107').value = productos[0].dataValues['MermaInsumoUtilziado']

        



       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


    }

    

   // displayValuesMaquina1()
    // maquina02
    let displayValuesMaquina2 = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina 2',1, 'Maquina 1 y 2')
      let valuesTurno02 = await getValuesMaquina('Maquina 2',2, 'Maquina 1 y 2')

     
     
     
      
      // verificar si encontro data TURNO 1
      console.log(valuesTurno01)
      if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
    
        
        worksheet.getCell('C18').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F18').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H18').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B19').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B20').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B21').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B22').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B23').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D23').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E23').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F23').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H20').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H21').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H22').value = productos[0].dataValues['MermaInsumoUtilziado']



       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS


        
        worksheet.getCell('C110').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F110').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H110').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B111').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B112').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B113').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B114').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B115').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D115').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E115').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F115').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H112').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H113').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H114').value = productos[0].dataValues['MermaInsumoUtilziado']



        await workbookMes.xlsx.writeFile(archivoMes);
      
      }


    }


    //maquina 3
    let displayValuesMaquina3 = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina 3',1, 'Maquina 3')
      let valuesTurno02 = await getValuesMaquina('Maquina 3',2, 'Maquina 3')
     
     
     
    
      // verificar si encontro data TURNO 1
      console.log(valuesTurno01)
      if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('C26').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C27').value = insumos[0].dataValues['ContenedorInicial']
        worksheet.getCell('D28').value = insumos[1].dataValues['InsumoInicial']
        worksheet.getCell('E26').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('E28').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('G26').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('G27').value = insumos[0].dataValues['ContenedorFinal']
        worksheet.getCell('H28').value = insumos[1].dataValues['InsumoFinal']

         worksheet.getCell('B30').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B29').value = insumos[0].dataValues['LoteInsumo']

        
        worksheet.getCell('C32').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F32').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H32').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B33').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B34').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B35').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B36').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B37').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D37').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E37').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F37').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H34').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H35').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H36').value = productos[0].dataValues['MermaInsumoUtilziado']



       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('C118').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C119').value = insumos[0].dataValues['ContenedorInicial']
        worksheet.getCell('D120').value = insumos[1].dataValues['InsumoInicial']
        worksheet.getCell('E118').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('E120').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('G118').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('G119').value = insumos[0].dataValues['ContenedorFinal']
        worksheet.getCell('H120').value = insumos[1].dataValues['InsumoFinal']

        worksheet.getCell('B121').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B122').value = insumos[0].dataValues['LoteInsumo']

        
        worksheet.getCell('C124').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('F124').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('H124').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        worksheet.getCell('B125').value = productos[0].dataValues['Presentacion']
        worksheet.getCell('B126').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B127').value = productos[0].dataValues['ProduccionPzs']
        worksheet.getCell('B128').value = productos[0].dataValues['InsumoUtilizado']
        worksheet.getCell('B129').value = productos[0].dataValues['LoteProduccion']
        worksheet.getCell('D129').value = productos[0].dataValues['Colabor']
        worksheet.getCell('E129').value = productos[0].dataValues['Embolsador01']
        worksheet.getCell('F129').value = productos[0].dataValues['Embolsador02']

        worksheet.getCell('H126').value = productos[0].dataValues['MermaBolsas']
        worksheet.getCell('H127').value = productos[0].dataValues['MermaPzs']
        worksheet.getCell('H128').value = productos[0].dataValues['MermaInsumoUtilziado']



        await workbookMes.xlsx.writeFile(archivoMes);
      
      }


    }

    //Maquina rOCHELAU

     let displayValuesMaquinaRochelau = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina Rochelau',1, 'Maquina Rochelau')
      let valuesTurno02 = await getValuesMaquina('Maquina Rochelau',2, 'Maquina Rochelau')
     
     
     
          if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('B68').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('B69').value = insumos[2].dataValues['InsumoInicial']
        worksheet.getCell('B70').value = insumos[1].dataValues['InsumoInicial']

        worksheet.getCell('C68').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('C69').value = insumos[2].dataValues['SolicitudInsumoQty']
        worksheet.getCell('C70').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('D68').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('D69').value = insumos[2].dataValues['InsumoFinal']
        worksheet.getCell('D70').value = insumos[1].dataValues['InsumoFinal']

        worksheet.getCell('E68').value = insumos[0].dataValues['InsumoMermado']
        worksheet.getCell('E69').value = insumos[2].dataValues['InsumoMermado']
        worksheet.getCell('E70').value = insumos[1].dataValues['InsumoMermado']

        worksheet.getCell('G68').value = insumos[0].dataValues['LoteInsumo']
        worksheet.getCell('G69').value = insumos[2].dataValues['LoteInsumo']
        worksheet.getCell('G70').value = insumos[1].dataValues['LoteInsumo']

        
        worksheet.getCell('A72').value = productos[0].dataValues['Presentacion'] 
        worksheet.getCell('B72').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('C72').value = productos[0].dataValues['ProduccionPzs']   

        worksheet.getCell('B73').value = insumos[0].dataValues['InsumoMarca']

        worksheet.getCell('B74').value = productos[0].dataValues['LoteProduccion']

        worksheet.getCell('B76').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C76').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D76').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        



       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOSworksheet.getCell('B68').value = insumos[0].dataValues['InsumoInicial']
        
        worksheet.getCell('B156').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('B157').value = insumos[2].dataValues['InsumoInicial']
        worksheet.getCell('B158').value = insumos[1].dataValues['InsumoInicial']

        worksheet.getCell('C156').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('C157').value = insumos[2].dataValues['SolicitudInsumoQty']
        worksheet.getCell('C158').value = insumos[1].dataValues['SolicitudInsumoQty']

        worksheet.getCell('D156').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('D157').value = insumos[2].dataValues['InsumoFinal']
        worksheet.getCell('D158').value = insumos[1].dataValues['InsumoFinal']

        worksheet.getCell('E156').value = insumos[0].dataValues['InsumoMermado']
        worksheet.getCell('E157').value = insumos[2].dataValues['InsumoMermado']
        worksheet.getCell('E158').value = insumos[1].dataValues['InsumoMermado']

        worksheet.getCell('G156').value = insumos[0].dataValues['LoteInsumo']
        worksheet.getCell('G157').value = insumos[2].dataValues['LoteInsumo']
        worksheet.getCell('G158').value = insumos[1].dataValues['LoteInsumo']

        
        worksheet.getCell('A160').value = productos[0].dataValues['Presentacion'] 
        worksheet.getCell('B160').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('C160').value = productos[0].dataValues['ProduccionPzs']   

        worksheet.getCell('B161').value = insumos[0].dataValues['InsumoMarca']

        worksheet.getCell('B163').value = productos[0].dataValues['LoteProduccion']

        worksheet.getCell('B166').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C166').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D166').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        


       await workbookMes.xlsx.writeFile(archivoMes);
      
      }

    }

    //Maquina Efecta
     let displayValuesMaquinaEfecta = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina Efecta',1, 'Maquina Efecta')
      let valuesTurno02 = await getValuesMaquina('Maquina Efecta',2, 'Maquina Efecta')
     
     
     
           if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('C52').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C53').value = insumos[3].dataValues['InsumoInicial']
        worksheet.getCell('C54').value = insumos[2].dataValues['InsumoInicial']

        worksheet.getCell('D52').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('D53').value = insumos[3].dataValues['SolicitudInsumoQty']
        worksheet.getCell('D54').value = insumos[2].dataValues['SolicitudInsumoQty']

        worksheet.getCell('E52').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('E53').value = insumos[3].dataValues['InsumoFinal']
        worksheet.getCell('E54').value = insumos[2].dataValues['InsumoFinal']

        worksheet.getCell('F52').value = insumos[0].dataValues['InsumoMermado']
        worksheet.getCell('F53').value = insumos[3].dataValues['InsumoMermado']
        worksheet.getCell('F54').value = insumos[2].dataValues['InsumoMermado']

        //insumo utilziado es por excel

        worksheet.getCell('H52').value = insumos[0].dataValues['LoteInsumo']
        worksheet.getCell('H53').value = insumos[3].dataValues['LoteInsumo']
        worksheet.getCell('H54').value = insumos[2].dataValues['LoteInsumo']

        
        worksheet.getCell('A56').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B56').value = insumos[1].dataValues['Insumo'] 
        worksheet.getCell('C56').value = insumos[1].dataValues['InsumoInicial'] 
        worksheet.getCell('D56').value = insumos[1].dataValues['SolicitudInsumoQty'] 
        worksheet.getCell('E56').value = insumos[1].dataValues['InsumoFinal'] 
        worksheet.getCell('F56').value = insumos[1].dataValues['InsumoMermado'] 
        
        worksheet.getCell('A59').value = productos[0].dataValues['Presentacion'] 
        worksheet.getCell('B62').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B60').value = productos[0].dataValues['ProduccionPzs']   

        worksheet.getCell('B63').value = productos[0].dataValues['LoteProduccion']

        worksheet.getCell('B65').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C65').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D65').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        



        await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOSworksheet.getCell('B68').value = insumos[0].dataValues['InsumoInicial']
        
        worksheet.getCell('C138').value = insumos[0].dataValues['InsumoInicial']
        worksheet.getCell('C139').value = insumos[3].dataValues['InsumoInicial']
        worksheet.getCell('C140').value = insumos[2].dataValues['InsumoInicial']

        worksheet.getCell('D138').value = insumos[0].dataValues['SolicitudInsumoQty']
        worksheet.getCell('D139').value = insumos[3].dataValues['SolicitudInsumoQty']
        worksheet.getCell('D140').value = insumos[2].dataValues['SolicitudInsumoQty']

        worksheet.getCell('E138').value = insumos[0].dataValues['InsumoFinal']
        worksheet.getCell('E139').value = insumos[3].dataValues['InsumoFinal']
        worksheet.getCell('E140').value = insumos[2].dataValues['InsumoFinal']

        worksheet.getCell('F138').value = insumos[0].dataValues['InsumoMermado']
        worksheet.getCell('F139').value = insumos[3].dataValues['InsumoMermado']
        worksheet.getCell('F140').value = insumos[2].dataValues['InsumoMermado']

        //insumo utilziado es por excel

        worksheet.getCell('H138').value = insumos[0].dataValues['LoteInsumo']
        worksheet.getCell('H139').value = insumos[3].dataValues['LoteInsumo']
        worksheet.getCell('H140').value = insumos[2].dataValues['LoteInsumo']

        
        worksheet.getCell('A143').value = insumos[1].dataValues['LoteInsumo']
        worksheet.getCell('B143').value = insumos[1].dataValues['Insumo'] 
        worksheet.getCell('C143').value = insumos[1].dataValues['InsumoInicial'] 
        worksheet.getCell('D143').value = insumos[1].dataValues['SolicitudInsumoQty'] 
        worksheet.getCell('E143').value = insumos[1].dataValues['InsumoFinal'] 
        worksheet.getCell('F143').value = insumos[1].dataValues['InsumoMermado'] 
        
        worksheet.getCell('A146').value = productos[0].dataValues['Presentacion'] 
        worksheet.getCell('B149').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B147').value = productos[0].dataValues['ProduccionPzs']   

        worksheet.getCell('B151').value = productos[0].dataValues['LoteProduccion']

        worksheet.getCell('B153').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C153').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D153').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        


       await workbookMes.xlsx.writeFile(archivoMes);
      
      }


    }

    //Maquina turnle de calor
     let displayValuesMaquinaTunel = async (worksheet) => {
      let valuesTurno01 = await getValuesMaquina('Maquina Tunel de Calor',1, 'Maquina Tunel de Calor')
      let valuesTurno02 = await  getValuesMaquina('Maquina Tunel de Calor',2, 'Maquina Tunel de Calor')
     
     
     
       
           if(valuesTurno01.insumo.length > 0 && valuesTurno01.producto.length > 0) {
        let insumos = valuesTurno01.insumo
        let productos = valuesTurno01.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        console.log(insumos[0].dataValues)
        console.log(insumos[1].dataValues)
        console.log(productos[0].dataValues)
        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOS
        worksheet.getCell('B80').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('D80').value = productos[0].dataValues['MermaInsumoUtilizado']

        worksheet.getCell('G80').value =(productos[0].dataValues['ProduccionContenedores']) * 400  + Number(productos[0].dataValues['MermaInsumoUtilizado'])
        worksheet.getCell('B83').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C83').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D83').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        



        await workbookMes.xlsx.writeFile(archivoMes);
      
      }


      // VERIFICAR DATOS TURNO 2
       if(valuesTurno02.insumo.length > 0 && valuesTurno02.producto.length > 0) {
        let insumos = valuesTurno02.insumo
        let productos = valuesTurno02.producto
        // si hay insumos siempre habra producto, por eso no se revisa por separado, 
        // cada maquina tiene una cantidad de insumos, en la maquina 1 se usan 2, por eso accedemos a 2 resultados de estos

        //con los datos ya fetcheados los tenemos que poner en el archivo
      //  if (fs.existsSync(filePath)) {
      //   await workbook.xlsx.readFile(filePath);
      // }
     
       // Buscar la hoja
       //let worksheet = workbookMes.getWorksheet(nombreHojaDia);
       //console.log(nombreHojaDia, filePath)
        // colocar valores en hoja
        // COLOCAL INSUMOSworksheet.getCell('B68').value = insumos[0].dataValues['InsumoInicial']
        
        worksheet.getCell('B170').value = productos[0].dataValues['ProduccionContenedores']
        worksheet.getCell('B170').value = productos[0].dataValues['MermaInsumoUtilizado']
        worksheet.getCell('G170').value =( productos[0].dataValues['ProduccionContenedores'] * 400 ) + productos[0].dataValues['MermaInsumoUtilizado']
        worksheet.getCell('B173').value = productos[0].dataValues['HorometroInicial']
        worksheet.getCell('C173').value = productos[0].dataValues['HorometroFinal']
        worksheet.getCell('D173').value = (productos[0].dataValues['HorometroFinal'] - productos[0].dataValues['HorometroInicial'])
        


        await workbookMes.xlsx.writeFile(archivoMes);
      
      }

    }

    let ws = workbookMes.getWorksheet(nombreHojaDia);
    await displayValuesMaquina1(ws)
    await displayValuesMaquina2(ws)
    await displayValuesMaquina3(ws)
    await displayValuesMaquinaRochelau(ws)
    await displayValuesMaquinaEfecta(ws)
    await displayValuesMaquinaTunel(ws)

      


   res.redirect(req.get('referer'));
    
    




}