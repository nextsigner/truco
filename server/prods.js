module.exports=function(app){

    const Producto = require('./models/Productos')
    /*
                descripcion
                codigo
                precioinstalacion
                precioabono
                adicionalriesgo
                observaciones
    */
    nuevoProducto = function(req, res){
        console.log('Insertando producto con nombre '+req.query.nombre)
        Producto.find({
                          //date: {$gt: h }
                          //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                          //date: {$gte: h, $lte: hf }
                          nombre:req.query.nombre // Search Filters
                      },
                      ['nombre'], // Columns to Return
                      {
                          skip:0, // Starting Row
                          limit:1, // Ending Row
                          sort:{
                              nombre: 1 //Sort by Date Added DESC
                          }
                      },
                      function(err, resultados){
                          if(err) res.status(500).send({mensaje: `Error al buscar mensajes: ${err}`})
                          if(resultados.length===0){
                              console.log('Registrando el dato del producto '+req.query.nombre);
                              //res.redirect('/res-add-producto.html?res=no'+mensajes.length)
                              //Registra el producto porque no existe ninguno con ese nombre
                              var producto = new Producto()
                              producto.categoria = req.query.categoria
                              producto.nombre = req.query.nombre
                              producto.precio = req.query.precio
                              producto.fechaRegistro = new Date(Date.now())
                              console.log('Creando un nuevo producto nombre: '+producto.nombre+' precio: '+producto.precio)
                              producto.save(function(err, userRegistered){
                                  if(err){
                                      res.status(500).send(`Error when user register: ${err}`)
                                      return
                                  }
                                  res.redirect('/res-add-producto.html?res=El+producto+se+ha+agregado+correctamente&pid='+userRegistered._id)
                                  //res.status(200).send({producto: userRegistered})
                              })
                              return
                          }else{
                              console.log('Se intenta repetir el registro del producto '+req.query.nombre);
                              var msg='No+se+ha+registrado+el+productoYa+existe+un+producto+con+el+nombre+'+(''+req.query.nombre).replace(/ /g, '%20')
                              res.redirect('/res-add-producto.html?res='+msg)
                          }
                      })
    }
    searchProducto = function(req, res){
        console.log('Buscando producto con nombre '+req.query.consulta)
        var regExp= new RegExp(''+(''+req.query.consulta).toUpperCase()+'|'+(''+req.query.consulta).toLocaleLowerCase())
        /*Producto.find({
                          //date: {$gt: h }
                          //date: {$gte: "2019-06-12T00:00:00+01:00", $lte: "2019-12-12T23:00:00+01:00" }
                          //date: {$gte: h, $lte: hf }
                          codigo: regExp,
                          descripcion: regExp // Search Filters
                      },*/
        Producto.find({ $or: [ { codigo: regExp }, { descripcion: regExp } ] },
                      ['descripcion', 'codigo', 'precioinstalacion', 'precioabono', 'adicionalriesgo', 'observaciones'], // Columns to Return
                      {
                          skip:0, // Starting Row
                          //limit:1, // Ending Row
                          sort:{
                              codigo: 1 //Sort by Date Added DESC
                          }
                      },
                      function(err, resultados){
                          if(err) res.status(500).send({mensaje: `Error al buscar productos: ${err}`})
                          if(resultados.length===0){
                              console.log('No se encontró ningún producto '+req.query.consulta);
                              res.status(200).send({productos: false})
                          }else{
                              console.log('Se devolverán datos de productos a la consulta: '+req.query.consulta);
                              res.status(200).send({productos: resultados})
                          }
                      })
    }
    setChatUser = function(req, res){
        var userId = req.query.userId
        var update = req.body
        Producto.findByIdAndUpdate(userId, update, function(err, userUpdated){
            if(err) res.status(500).send(`Error when user register: ${err}`)
            console.log('setChatUser: '+userUpdated)
            res.status(200).send({'user':userUpdated})
        })
    }
    getChatUser = function(req, res){
        console.log('Receiving get '+req.query.userId)
        var userid= req.query.userId
        Producto.findById(userid, function(err, user){
            if(err){
                res.status(500).send({user: `Error al buscar usuario: ${err}`})
                return
            }
            if(!user){
                res.status(200).send({'user': false})
                return
            }
            res.status(200).send({'user': user})
        })
    }

    app.get('/ppres/nuevoproducto', nuevoProducto);
    app.get('/ppres/searchproducto', searchProducto);
    app.get('/chat/set/user', setChatUser);
    app.get('/chat/get/user', getChatUser);
}

