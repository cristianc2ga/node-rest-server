const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');


app.get('/usuario',function(req, res){
    

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({estado: true}, 'nombre email role estado ') //mostrar solo estos campos
           .skip(desde) //saltar primeros n registros
           .limit(limite)
           .exec((err, usuarios) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // conteo total usuario
            Usuario.count({estado: true}, (err, conteo) =>{
                res.json({
                    ok: true,
                    usuarios,
                    conteo: conteo
                });
            })
           
           })

});

app.post('/usuario',function(req, res){

    let body = req.body;

    // insertar con ppost
    // se cre objeto de tipo usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //ahora se graba en la base de datos
    
    usuario.save((err, usuarioDB) => {
          if (err) {
              return res.status(400).json({
                  ok: false,
                  err
              });
          }

        
          res.json({
              ok: true,
              usuario: usuarioDB
          });
    });

    

    

});

// actualizar información de usuario
app.put('/usuario/:id',function(req, res){

    let id = req.params.id;
    //se usa undersocore
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
 
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
    
});

//delete por id
app.delete('/usuario/:id',function(req, res){

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
   // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        // si no existe el usuario
        if (usuarioBorrado == null){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
    
});


module.exports = app;