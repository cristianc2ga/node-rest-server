require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const path = require('path');


app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


//Habilitar la carpeta public

app.use( express.static(path.resolve(__dirname,'../public')));
//console.log(path.resolve(__dirname,'../public'))

//configuración global de rutas
app.use(require('./routes/index'));





// conexion base de datos

mongoose.connect(process.env.urlDB,
    {useNewUlrParser: true, useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true},
    (err, res) =>{
    if (err) throw err;

    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ',process.env.PORT)
})

