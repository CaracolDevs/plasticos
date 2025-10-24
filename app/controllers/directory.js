const fs = require('fs')
const {promisify} = require('util')
const readdir = promisify(fs.readdir)
const multer = require('multer')
const path = require('node:path'); 
const admZip = require('adm-zip');

const { Sequelize, Op, where}    = require('sequelize');
const value = require('../models/value').usuarios;



exports.folders = async (folder) => {
    try {
        const files = await readdir(`./uploads${folder}`);
        return files;
    } catch (error) {
        throw error
    }
}


exports.routing = async (folders, router) => {
    let results = await folders('/')
    console.log("results", results)
    results.forEach(result => {
        return router.get(`/${result}`, async function(req, res) {
            let content = await folders(`/${result}`)
            console.log("psot results", content, result)

            console.log(req.signedCookies.signed)

            if(req.signedCookies.signed == 'true' && req.signedCookies.super == 'true') {
                res.render('folders', {result,content})
            } else {
                if(req.signedCookies.signed == 'true') {
                    res.render('foldersUsers', {result,content})
                } else {
                    res.redirect(req.get('referer'));
                }
                
            }
          })
    })
}

exports.create = (req, res) => {
    const name = req.body.name
    try {
        fs.mkdir(`uploads/${name}`, (err) => {
            console.log("ERROR:", err)
        })
    console.log('directory', name, 'created!')
    res.redirect(req.get('referer'));
    } catch (error) {
        res.redirect(req.get('referer'));
        throw alert("Nombre ya utilizado, intente uno nuevo")
    }
}

exports.delete = (req, res) => {
    const emptyDir = async ({empty}) => {
        const name = req.body.name
        try {
            fs.rm(`uploads/${name}`, {recursive: empty}, (err) => {
                if(err) throw Error(err)
            })
        console.log('deleted!')
        res.redirect(req.get('referer'));
        } catch (err) {
            throw err
        }
    }

    emptyDir({empty:true})
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

exports.storage = (req, res, next) => {
    let name = req.body.name
    console.log("name", req)
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads${name}`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
    next()
}

const upload = multer({ storage: storage })

exports.upload = upload.array('files')

exports.uploadNone = upload.none()

exports.uploadFile = (req, res, next) => {
    /*res.redirect(req.get('referer'));*/
    next()
}

exports.moveFile = (req, res) => {

    req.files.forEach(element => {
        let oldPath = `uploads/${element.filename}`
        let newPath = `uploads/${req.body.name}/${element.filename}`
        fs.rename(oldPath, newPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
    });
    res.redirect(req.get('referer'));
}

exports.downloadFilee = (req, res) => {
    let newPath = path.join(__dirname, '../../')
    console.log(newPath)
    const file = `${newPath}uploads\\test`;
    console.log(file)
    res.download(file); // Set disposition and send it.
}



exports.downloadCarpet = async (req, res) => {
    let zip = new admZip();
    let name = req.body.name
    // add local file
    console.log(req.body)
    const files = await readdir(`./uploads/${name}`);

    console.log("files:", files)
    files.forEach((element) => {
        zip.addLocalFile(`./uploads/${name}/${element}`);
        console.log("zip files:", files)
    })
    // get everything as a buffer
    const zipFileContents = zip.toBuffer();
    console.log("zipcontents",zipFileContents)
    const fileName = 'uploads.zip';
    const fileType = 'application/zip';
    res.setHeader('Content-Type', 'application/zip').send(zipFileContents)
      console.log("filename;",fileName)
};

exports.downloadFile = async (req, res) => {
    
    let zip = new admZip();
    let name = req.body.name
    // add local file

    zip.addLocalFile(`./uploads${name}`);

    // get everything as a buffer
    const zipFileContents = zip.toBuffer();
    console.log("zipcontents",zipFileContents)
    const fileName = 'uploads.zip';
    const fileType = 'application/zip';
    res.setHeader('Content-Type', 'application/zip').send(zipFileContents)
      console.log("filename;",fileName)
};

/*
exports.upload = (req, res) => {

    const name = req.body.name

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads`)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
    
    let upload = multer({ storage: storage })
    
    upload.array('files', 10)
    
    uploadFile = () => {
        res.end()
    }
    
    uploadFile()

}

*/


exports.check = (req, res) => {
    try {
        const checkFiles = async (directory = `./uploads`) => {
            const files = await readdir(directory);
            return files;
        }
        checkFiles().then((content) => {
            res.send({ message: content })
        })
    } catch (error) {
        res.send({ message: 'not Done!' })
        throw error
    }
}

exports.checkIndex = async (req, res) => {
    try {

        
        const checkFiles = async (directory = `./uploads`) => {
            const files = await readdir(directory);
            let stats = []

            files.forEach( (file) => {
                let stat = fs.statSync(`./uploads/${file}`)
                //stats.push(stat)
                //console.log("aaaa",stat)
                let date = new Date(stat.birthtimeMs).toString(); // create Date object
                stats.push(date.slice('0','15'))
                console.log("cum",date)
            })
            console.log(files,stats)


            let total = [files,stats]

            if(req.signedCookies.departament != '0') {
                total = [[files[req.signedCookies.departament -1]],[stats[req.signedCookies.departament - 1]]]
                console.log("TOTAL::",total)
            } 
            
 

            return total 
        }
        checkFiles().then(async (content) => {
            if(req.signedCookies.signed == 'true' && req.signedCookies.super == 'true') {
                res.render('admin', {content})
            } else {
                if(req.signedCookies.signed == 'true') {
                    res.render('user', {content})
                } else {
                    res.redirect(req.get('referer'));
                }
                
            }
            
            
        })
    } catch (error) {
        res.send({ message: 'not Done!' })
        throw error
    }
    
}

exports.login = async (req, res) => {
    try {

        console.log(req.body)

        let filters = {
            User: req.body.user,
            Password: req.body.pass
        }
        let result = await value.findAll({
            where: filters
        })


        if(result.length > 0) {
            console.log(result)
            if(result[0].dataValues['Super']) {
                res.cookie('signed', 'true', {signed: true})
                res.cookie('super', 'true', {signed: true})
                res.cookie('departament', result[0].dataValues.DepartamentId, {signed: true})
                res.redirect('/directory')
                
            } else {
                res.cookie('signed', 'true', {signed: true})
                res.cookie('super', 'false', {signed: true})
                res.cookie('departament', result[0].dataValues.DepartamentId, {signed: true})
                res.redirect('/directory')
            }
        } else {
            res.redirect(req.get('referer'))
        }
    } catch (Err) {
        console.log(Err)
    }
}

exports.logout = (req, res) => {
    res.clearCookie("signed")
    res.clearCookie("super")
    res.clearCookie("departament")
    res.redirect("/")
}

exports.displayUsers = async (req, res) => {

    let departamentos = await deps('/')

    let result = await value.findAll({
        where: {
            [Op.not]: [{
                Super: 1
            }]
        }
    })

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

// crear y borar usuarios
/*
let departamentos = [
    {
        name: 'Almacen',
        id: '01'
    },
    {
        name: 'Calidad',
        id: '02'
    },
    {
        name: 'Compras',
        id: '03'
    },
    {
        name: 'Gestion-de-Calidad',
        id: '04'
    },
    {
        name:'Mantenimiento',
        id: '05'
    },
    {
        name: 'Produccion',
        id: '06'
    },
    {
        name: 'Recursos-Humanos',
        id: '07'
    },
    {
        name: 'Seguridad-e-Higiene',
        id: '08'
    },
    {
        name: 'Ventas-y-Cobranza',
        id: '09'
    },
    
]*/


exports.createUser = async (req,res) => {
    let departamentos = await deps('/')

    if(req.body.pass != req.body.passc) {
        res.render('userFail')
    } else {
        const user = await value.create({ User: req.body.user, Password: req.body.pass, Departament: departamentos[req.body.dep - 1].name, DepartamentId: departamentos[req.body.dep - 1].id, Super: 0});
        res.redirect(req.get('referer'));
        console.log("usuario creado")
    }
    
}

exports.deleteUser = async (req,res) => {
    let filters = {
        UserId: req.body.name,
    }
    let user = await value.findAll({
        where: filters
    })
    console.log(user)
    await user[0].destroy();
    res.redirect(req.get('referer'));
}

exports.updateUser = async (req,res) => {
    let departamentos = await deps('/')
    console.log(req.body)
    let filters = {
        UserId: req.body.id,
    }
    let user = await value.findAll({
        where: filters
    })
    if(req.body.name) {
        console.log("user")
        user[0].User = req.body.name
    }

    if(req.body.pass) {
        console.log("pass")
        user[0].Password = req.body.pass
    }

    if(req.body.depa && req.body.depa != '00') {
        console.log("depa", departamentos )
        user[0].Departament = departamentos[req.body.depa - 1].name
        user[0].DepartamentId = departamentos[req.body.depa - 1].id
    }

    await user[0].save();

    res.redirect(req.get('referer'));
}

//// ocupo capturar todas las carpetas, sus archivos, guardarlos en arrays y despues rutearlos

deps = async (folder) => {
    try {
        const files = await readdir(`./uploads${folder}`);
        console.log(files)
        let indexedFiles = []
        files.forEach((item,index) => {
            indexedFiles.push({name: item, id: index + 1})
        })
        console.log(indexedFiles)
        return indexedFiles;
        
    } catch (error) {
        throw error
    }
}

exports.routingFiles = async (folders, router) => {
    let departamentos = await deps('/')
    

    departamentos.forEach (async ( item,index) => {
        let results = await folders(`/${item['name']}`)
        results.forEach(result => {
            return router.get(`/${item}/${result}`, async function(req, res) {
                let content = await folders(`${item}/${result}`)
                console.log("psot results", content, result)
                res.render('foldersIn',{result,content});
              })
        })
    })
    console.log("results", results)
    
}