module.exports=function(app){

    var Evento = require('./models/Eventos')
    /*
        e: String //Evento
        nj: Number //Numero de Jugador
    */
    nuevoEvento = function(req, res){
        console.log('Insertando ZoolUser con nombre '+req.query.n)
        Evento.find({
                          //date: {$gt: h }
                          //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                          //date: {$gte: h, $lte: hf }
                          e:req.query.n // Search Filters
                      },
                      ['n'], // Columns to Return
                      {
                          skip:0, // Starting Row
                          limit:1, // Ending Row
                          sort:{
                              n: 1 //Sort by Date Added DESC
                          }
                      },
                      function(err, resultados){
                          if(err) res.status(500).send({mensaje: `Error al buscar mensajes: ${err}`})
                          if(resultados.length===0){
                              console.log('Registrando el dato del ZoolUser '+req.query.nombre);
                              //res.redirect('/res-add-producto.html?res=no'+mensajes.length)

                              var evento = new Evento()
                              evento.e  = req.query.e
                              evento.nj = req.query.nj
                              console.log('Creando un nuevo evento: '+evento.e+'\nClave: '+zoolUser.c)
                              evento.save(function(err, eventoRegistered){
                                  if(err){
                                      res.status(500).send(`Error when user register: ${err}`)
                                      return
                                  }
                                  //res.redirect('/res-add-producto.html?res=El+producto+se+ha+agregado+correctamente&pid='+userRegistered._id)

                                  let jsonRes={evento: eventoRegistered, isRec: true}
                                  console.log('jsonRes: '+JSON.stringify(jsonRes))
                                  res.status(200).send(jsonRes)
                              })
                              return
                          }else{
                              console.log('Se intenta repetir el registro del evento '+req.query.e);
                              //var msg='No+se+ha+registrado+el+productoYa+existe+un+producto+con+el+nombre+'+(''+req.query.n).replace(/ /g, '%20')
                              //res.redirect('/res-add-producto.html?res='+msg)
                              let jsonRes={evento:{}, isRec: false, msg: 'En la base de datos de Truco ya existe un usuario con el evento '+req.query.e+'.'}
                              res.status(200).send(jsonRes)
                          }
                      })
    }
    app.get('/truco/nuevoEvento', nuevoEvento);
}

