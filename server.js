const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')



const port = 3002

// for pasing cookies

app.use(cookieParser("mysecret"))

// for parsing json
app.use(
    bodyParser.json({
        limit: '20mb'
    })
)
// for parsing application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    })
)

app.use(require('./app/routes'))

app.use(express.static('uploads'))

app.use(express.static("public"));

app.listen(port, () => {
    console.log('La aplicacion esta en linea!');
})

// Set up view engine and path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views/pages'));



//initDB()